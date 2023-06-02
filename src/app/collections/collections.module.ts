import { SharedModule } from 'src/app/shared/modules';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// import { SwiperModule } from 'swiper/angular';

import { CollectionsMenuComponent } from './collections-menu/collections-menu.component';
import {
  CollectionComponent,
  OnboardingComponent,
} from './collection/collection.component';
import { NotFoundGuard } from 'src/app/shared/guards';
import { ColProductComponent } from './col-product/col-product.component';

const routes: Routes = [
  {
    path: '',
    component: CollectionsMenuComponent,
  },
  {
    path: ':collection',
    canActivate: [NotFoundGuard],
    component: CollectionComponent,
  },
  {
    path: ':collection/:product',
    // canActivate: [NotFoundGuard],
    component: ColProductComponent,
  },
];

@NgModule({
  declarations: [
    CollectionsMenuComponent,
    CollectionComponent,
    ColProductComponent,
    OnboardingComponent,
  ],
  imports: [RouterModule.forChild(routes), SharedModule],
})
export class CollectionsModule {}
