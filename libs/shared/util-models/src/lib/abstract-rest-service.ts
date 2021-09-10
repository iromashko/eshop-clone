import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  CategoryEntity,
  CreateCategoryDto,
  DeleteCategoryResponse,
} from '@esc/product/models';
import {
  concatMap,
  merge,
  Observable,
  pluck,
  scan,
  Subject,
  switchMap,
} from 'rxjs';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  constructor(private http: HttpClient) {}

  private categoriesUrl = `${environment.baseUrlApi}/categories`;

  private createCategorySubject = new Subject<CreateCategoryDto>();
  createCategoryAction$ = this.createCategorySubject.asObservable();

  private deleteCategorySubject = new Subject<string>();
  deleteCategoryAction$ = this.deleteCategorySubject.asObservable();

  private getCategorySubject = new Subject<string>();
  getCategoryAction$ = this.getCategorySubject.asObservable();

  private updateCategorySubject = new Subject<{
    id: string;
    category: CategoryEntity;
  }>();
  updateCategoryAction$ = this.updateCategorySubject.asObservable();

  allCategories$ = this.http.get<CategoryEntity[]>(this.categoriesUrl);

  categoryById$ = this.getCategoryAction$.pipe(
    switchMap((id) => this.getCategoryFromServer(id))
  );

  createdCategory$ = this.createCategoryAction$.pipe(
    concatMap((category) => {
      return this.createCategoryOnServer(category);
    })
  );

  deletedCategory$ = this.deleteCategoryAction$.pipe(
    concatMap((id) => this.deleteCategoryOnServer(id))
  );

  updatedCategory$ = this.updateCategoryAction$.pipe(
    concatMap(({ id, category }) => this.updateCategoryOnServer(id, category))
  );

  categories$ = merge(
    this.allCategories$,
    this.createdCategory$,
    this.deletedCategory$,
    this.updatedCategory$
  ).pipe(
    scan(
      (categories, category) =>
        this.modifyCategoriesArray(categories, category),
      [] as CategoryEntity[]
    )
  );

  createCategory(category: CreateCategoryDto): void {
    this.createCategorySubject.next(category);
  }

  deleteCategory(id: string): void {
    this.deleteCategorySubject.next(id);
  }

  getCategoryById(id: string): void {
    this.getCategorySubject.next(id);
  }

  updateCategory(id: string, category: CategoryEntity): void {
    this.updateCategorySubject.next({ id, category });
  }

  private createCategoryOnServer(
    category: CreateCategoryDto
  ): Observable<CategoryEntity> {
    return this.http.post<CategoryEntity>(this.categoriesUrl, category);
  }

  private deleteCategoryOnServer(id: string): Observable<string> {
    return this.http
      .delete<DeleteCategoryResponse>(`${this.categoriesUrl}/${id}`)
      .pipe(pluck('categoryDeleted'));
  }

  private updateCategoryOnServer(
    id: string,
    category: CategoryEntity
  ): Observable<CategoryEntity> {
    return this.http.put<CategoryEntity>(
      `${this.categoriesUrl}/${id}`,
      category
    );
  }

  private getCategoryFromServer(id: string): Observable<CategoryEntity> {
    return this.http.get<CategoryEntity>(`${this.categoriesUrl}/${id}`);
  }

  private modifyCategoriesArray(
    categories: CategoryEntity[],
    value: unknown
  ): CategoryEntity[] {
    if (Array.isArray(value)) {
      return this.mergeCategories(categories, value);
    }

    if (typeof value === 'string') {
      return categories.filter((c) => c.id !== value);
    }

    if (value instanceof CategoryEntity) {
      const exsitedCategory = categories.find((item) => item.id === value.id);

      exsitedCategory
        ? this.replaceCategoryInList(categories, exsitedCategory)
        : [...categories, value];
    }

    return categories;
  }

  private mergeCategories(
    categories: CategoryEntity[],
    addCategories: CategoryEntity[]
  ): CategoryEntity[] {
    return [...categories, ...addCategories];
  }

  private replaceCategoryInList(
    categories: CategoryEntity[],
    categoryForReplace: CategoryEntity
  ): CategoryEntity[] {
    return categories.map((category) => {
      if (category.id === categoryForReplace.id) {
        return {
          ...category,
          ...categoryForReplace,
        };
      }
      return category;
    });
  }
}