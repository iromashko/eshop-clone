import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductDomainModule } from '@esc/product/domain';
import { ShopProductsComponent } from './shop-products.component';
import { RouterModule } from '@angular/router';
import { ProductItemModule } from '@esc/product/ui-components';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    ProductItemModule,
    ProductDomainModule,
    NzCheckboxModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: ShopProductsComponent }]),
  ],
  declarations: [ShopProductsComponent],
  exports: [ShopProductsComponent],
})
export class ProductFeatureShopProductsModule {}
