import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SwiperModule } from 'swiper/angular';

import { SharedModule } from '../shared/modules';
import { ProductComponent } from './product.component';
// import {
//   ColorsComponent,
//   ColorZoomComponent,
//   CustomAccItemComponent,
//   PricesComponent,
//   SizesComponent,
//   SpecialPiecesComponent,
//   SpecsComponent,
//   UsesComponent,
// } from '../shared/components';

const routes: Routes = [
  {
    path: '',
    component: ProductComponent,
  },
];

@NgModule({
  declarations: [
    ProductComponent,
    // PricesComponent,
    // SizesComponent,
    // UsesComponent,
    // SpecsComponent,
    // SpecialPiecesComponent,
    // CustomAccItemComponent,
    // ColorsComponent,
    // ColorZoomComponent,
  ],
  imports: [RouterModule.forChild(routes), SwiperModule, SharedModule],
})
export class ProductModule {}
