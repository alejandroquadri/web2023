import { switchMap, takeUntil, startWith, tap } from 'rxjs/operators';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';

import {
  LanguageService,
  SeoService,
  // LayoutService,
  LanguageObj,
} from 'src/app/shared/services';

import { Subject } from 'rxjs';

import { Blog } from 'src/app/shared/interfaces';
import { BlogService } from '../blog.service';

@Component({
  selector: 'app-blog-detail',
  templateUrl: './blog-detail.component.html',
  styleUrls: ['./blog-detail.component.scss'],
})
export class BlogDetailComponent implements OnInit, OnDestroy {
  lang: string;
  langObj: LanguageObj;
  // isMobile$: Observable<boolean>;

  unsuscribe$ = new Subject();
  data: Blog;
  id: string | null;

  constructor(
    private route: ActivatedRoute,
    private langSc: LanguageService,
    private seoSc: SeoService,
    // private layoutSc: LayoutService,
    private blogSc: BlogService
  ) {}

  ngOnInit(): void {
    this.data = this.route.snapshot.data['blog'];
    this.setSeo(this.data);
    this.lang = this.langSc.currentLang;
    this.langObj = this.langSc.currentLangObj;
    // this.isMobile$ = this.layoutSc.detectMobile();
    this.getBlog();
  }

  ngOnDestroy(): void {
    this.unsuscribe$.next(true);
    this.unsuscribe$.complete();
  }

  getBlog() {
    this.route.paramMap
      .pipe(
        switchMap((params: ParamMap) => {
          this.id = params.get('id');
          return this.blogSc.getBlogEntry(this.id);
        }),
        takeUntil(this.unsuscribe$),
        startWith(this.data),
        tap(blog => {
          this.data = blog;
          this.setSeo(this.data);
        })
      )
      .subscribe();
  }

  setSeo(blog) {
    if (blog) {
      const metaTags: any = {
        title: blog.title,
        description: blog.description,
        slug: `/${blog.url}`,
      };

      if (blog.featureImg) {
        metaTags.image = blog.featureImg;
      }

      this.seoSc.generateTags(metaTags);
      this.seoSc.createCanonicalURL(`/${blog.url}`);
    }
  }
}
