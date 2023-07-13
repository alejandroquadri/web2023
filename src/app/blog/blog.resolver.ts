import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

import { firstValueFrom } from 'rxjs';
import { take } from 'rxjs/operators';

import { Blog } from 'src/app/shared/interfaces';
import { DataStateService, ServerDetectService } from 'src/app/shared/services';
import { BlogService } from './blog.service';

@Injectable({ providedIn: 'root' })
export class BlogResolver implements Resolve<any> {
  constructor(
    private blogSc: BlogService,
    private stateSc: DataStateService,
    private serverDetectSc: ServerDetectService
  ) {}

  resolve(route: ActivatedRouteSnapshot): Promise<Blog[]> | any {
    if (this.serverDetectSc.isBrowserSide()) {
      console.log('browser side en blog');
      return Promise.resolve(null);
    } else {
      const id = route.paramMap.get('id');
      if (id) {
        return this.getBlogDetail(id);
      } else {
        return this.getBlogList();
      }
    }
  }

  getBlogList() {
    return firstValueFrom(this.blogSc.getBlogEntries().pipe(take(1)));
  }

  getBlogDetail(id) {
    return firstValueFrom(this.blogSc.getBlogEntry(id).pipe(take(1)));
  }
}

// getBlogList() {
//   return firstValueFrom(
//     this.stateSc
//       .checkAndGetData('blog-list', this.blogSc.getBlogEntries())
//       .pipe(take(1))
//   );
// }

// getBlogDetail(id) {
//   return firstValueFrom(
//     this.stateSc
//       .checkAndGetData('id', this.blogSc.getBlogEntry(id))
//       .pipe(take(1))
//   );
// }
