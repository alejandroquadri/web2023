import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// import { SwiperModule } from 'swiper/angular';

import { SharedModule } from '../shared/modules';
import { LandingComponent } from './landing.component';

const routes: Routes = [
  {
    path: '',
    component: LandingComponent,
  },
];

@NgModule({
  declarations: [LandingComponent],
  imports: [RouterModule.forChild(routes), SharedModule],
})
export class LandingModule {}
