import { ActivatedRoute, Router } from '@angular/router';
import {
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';

import { Subject } from 'rxjs';
import { startWith, takeUntil, tap } from 'rxjs/operators';

import {
  LanguageService,
  SeoService,
  // LayoutService,
  LanguageObj,
} from 'src/app/shared/services';
import { BlogCopy } from 'src/app/shared/copy';
import { Blog } from 'src/app/shared/interfaces';
import { BlogService } from '../blog.service';

@Component({
  selector: 'app-blog-list',
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.scss'],
})
export class BlogListComponent implements OnInit, OnDestroy {
  @ViewChild('subNav') subNav: ElementRef;

  lang: string;
  langObj: LanguageObj;
  // isMobile$: Observable<boolean>;
  unsuscribe$ = new Subject();

  entries: Blog[];
  sticky = false;
  initScroll = false;
  offsetValue: number;
  copy = BlogCopy;
  tags = BlogCopy.filters;
  searchTerm = '';
  selectedTag = 'all';

  constructor(
    private router: Router,
    private langSc: LanguageService,
    private seoSc: SeoService,
    private blogSc: BlogService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.entries = this.route.snapshot.data['entries'];
    this.lang = this.langSc.currentLang;
    this.langObj = this.langSc.currentLangObj;
    // this.isMobile$ = this.layoutSc.detectMobile();
    this.getData();
    this.setSeo();
  }

  ngOnDestroy(): void {
    this.unsuscribe$.next(true);
    this.unsuscribe$.complete();
  }

  getData() {
    this.blogSc
      .getBlogEntries()
      .pipe(
        takeUntil(this.unsuscribe$),
        startWith(this.entries),
        tap(entries => {
          this.entries = entries;
        })
      )
      .subscribe();
  }

  setSeo() {
    const metaTags = {
      title: this.copy.seo[this.lang].title,
      description: this.copy.seo[this.lang].description,
      slug: '/blog',
    };

    this.seoSc.generateTags(metaTags);
    this.seoSc.createCanonicalURL(`/blog`);
  }

  filterEntries() {
    return this.entries.filter(entry => {
      if (this.selectedTag === 'all') {
        return this.wordFilter(entry);
      } else {
        return (
          entry.tags.indexOf(this.selectedTag) !== -1 && this.wordFilter(entry)
        );
      }
    });
  }

  wordFilter(entry: Blog) {
    if (this.searchTerm === '') {
      return true;
    } else {
      const title = entry.title.toLowerCase();
      const content = entry.content.toLowerCase();
      if (title.indexOf(this.searchTerm.toLowerCase()) > -1) {
        return true;
      } else if (content.indexOf(this.searchTerm.toLowerCase()) > -1) {
        return true;
      } else {
        return false;
      }
    }
  }

  openPost(post: Blog) {
    this.router.navigate([`${this.lang}/blog/${post.url}`]);
  }

  @HostListener('window:scroll', ['$event'])
  onScroll($event) {
    if (this.subNav) {
      if (!this.offsetValue) {
        this.offsetValue = this.subNav.nativeElement.offsetTop;
      }
      if (window.pageYOffset > this.offsetValue) {
        this.sticky = true;
      } else {
        this.sticky = false;
      }
    }
  }

  changeSelectedTag(selection) {
    this.selectedTag = selection;
  }
}
