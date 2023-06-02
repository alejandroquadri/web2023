import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'src/app/shared/modules';
import { LookbookComponent } from './lookbook.component';
import { MasonryPipe } from './masonry.pipe';
import { LookbookZoomComponent } from './lookbook-zoom/lookbook-zoom.component';
import { LookbookResolver } from './lookbook.resolver';

const routes: Routes = [
  {
    path: '',
    component: LookbookComponent,
    resolve: { lookbook: LookbookResolver },
  },
];

@NgModule({
  declarations: [
    MasonryPipe,
    LookbookComponent,
    LookbookZoomComponent,
    LookbookZoomComponent,
  ],
  imports: [RouterModule.forChild(routes), SharedModule],
})
export class LookbookModule {}
