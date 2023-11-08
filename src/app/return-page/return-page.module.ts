import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/modules';
import { RouterModule, Routes } from '@angular/router';
import { ReturnPageComponent } from './return-page.component';

const routes: Routes = [
  {
    path: '',
    component: ReturnPageComponent,
  },
];

@NgModule({
  declarations: [ReturnPageComponent],
  imports: [SharedModule, RouterModule.forChild(routes)],
})
export class ReturnPageModule {}
