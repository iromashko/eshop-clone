import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header.component';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { FormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';

@NgModule({
  declarations: [HeaderComponent],
  imports: [
    CommonModule,
    NzInputModule,
    NzIconModule,
    FormsModule,
    NzFormModule,
  ],
  exports: [HeaderComponent],
})
export class HeaderModule {}
