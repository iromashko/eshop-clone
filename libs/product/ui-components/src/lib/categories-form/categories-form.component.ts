import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ListCategoriesFacade } from '@esc/product/domain';
import { CategoryEntity, CreateCategoryDto } from '@esc/product/models';
import { isFormEdited } from '@esc/shared/util-helpers';
import {
  combineLatest,
  filter,
  map,
  merge,
  pluck,
  shareReplay,
  startWith,
  take,
  tap,
} from 'rxjs';

@Component({
  selector: 'ui-categories-form',
  templateUrl: './categories-form.component.html',
  styleUrls: ['./categories-form.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoriesFormComponent {
  constructor(
    private fb: FormBuilder,
    private listCategoriesFacade: ListCategoriesFacade,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  updateCategoryId: string | undefined = undefined;

  categoryForEdit$ = combineLatest([
    this.listCategoriesFacade.categoryById$.pipe(
      tap(({ name, icon, image, color }) => {
        this.form.setValue({
          name,
          icon,
          image,
          color,
        });
      })
    ),
    this.route.params.pipe(
      pluck('id'),
      filter(Boolean),
      tap((id) => {
        this.updateCategoryId = id;
        this.listCategoriesFacade.getCategoryById(id);
      })
    ),
  ]).pipe(take(1), shareReplay(1));

  categorySaved$ = merge(
    this.listCategoriesFacade.createdCategory$,
    this.listCategoriesFacade.updatedCategory$
  ).pipe(
    tap(() => {
      this.form.reset();
    })
  );

  form = this.fb.group({
    name: ['', Validators.required],
    icon: ['', Validators.required],
    color: ['#7a7a7a', Validators.required],
    image: ['', Validators.required],
  });

  formEdited$ = combineLatest([this.categoryForEdit$, this.form.valueChanges])
    .pipe(
      map(([[category], changes]) =>
        isFormEdited<CategoryEntity, CreateCategoryDto>(category, changes)
      )
    )
    .pipe(startWith(false));

  updateCategory(): void {
    this.form.valid &&
      this.updateCategoryId &&
      this.listCategoriesFacade.updateCategory(
        this.updateCategoryId,
        this.form.getRawValue()
      );
  }
  createCategory(): void {
    this.form.valid &&
      this.listCategoriesFacade.createCategory(this.form.getRawValue());
  }

  goBack(): void {
    this.router.navigate(['categories']);
  }
}
