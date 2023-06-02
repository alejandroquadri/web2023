import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '../shared/modules';
import { CheckoutComponent, SentNoticeComponent } from './checkout.component';
import { PdfService } from '../shared/services';

const routes: Routes = [
  {
    path: '',
    component: CheckoutComponent,
  },
];

@NgModule({
  declarations: [CheckoutComponent, SentNoticeComponent],
  imports: [RouterModule.forChild(routes), SharedModule],
  providers: [PdfService],
})
export class CheckoutModule {}
