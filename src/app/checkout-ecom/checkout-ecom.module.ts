import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '../shared/modules';
import { CheckoutEcomComponent } from './checkout-ecom.component';

const routes: Routes = [
  {
    path: '',
    component: CheckoutEcomComponent,
  },
];

@NgModule({
  declarations: [CheckoutEcomComponent],
  imports: [RouterModule.forChild(routes), SharedModule],
})
export class CheckoutEcomModule {}
