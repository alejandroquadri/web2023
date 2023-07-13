import { SharedModule } from 'src/app/shared/modules';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SamplesComponent } from './samples.component';

const routes: Routes = [
  {
    path: '',
    component: SamplesComponent,
  },
];

@NgModule({
  declarations: [SamplesComponent],
  imports: [RouterModule.forChild(routes), SharedModule],
})
export class SamplesModule {}
