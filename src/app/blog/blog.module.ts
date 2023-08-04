import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'src/app/shared/modules';
// import { MarkdownPipe } from 'src/app/shared/pipes';
import { BlogDetailComponent } from './blog-detail/blog-detail.component';
import { BlogListComponent } from './blog-list/blog-list.component';
import { BlogResolver } from './blog.resolver';

const routes: Routes = [
  {
    path: '',
    component: BlogListComponent,
    resolve: { entries: BlogResolver },
  },
  {
    path: ':id',
    component: BlogDetailComponent,
    resolve: { blog: BlogResolver },
  },
];

@NgModule({
  declarations: [BlogListComponent, BlogDetailComponent],
  imports: [RouterModule.forChild(routes), SharedModule],
})
export class BlogModule {}
