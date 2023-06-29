import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThanksComponent } from './thanks.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: ThanksComponent,
  },
];

@NgModule({
  declarations: [ThanksComponent],
  imports: [RouterModule.forChild(routes), CommonModule],
})
export class ThanksModule {}
