import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';
import { CollectionMenu, Collections } from 'src/app/shared/copy';

import {
  LanguageService,
  LayoutService,
  SeoService,
} from 'src/app/shared/services';

@Component({
  selector: 'app-collections-menu',
  templateUrl: './collections-menu.component.html',
  styleUrls: ['./collections-menu.component.scss'],
})
export class CollectionsMenuComponent implements OnInit {
  isMobile$: Observable<boolean>;
  lang: string;
  colMenu = CollectionMenu;
  collections = Collections;
  isL$: Observable<boolean>;

  filters = CollectionMenu.filters;
  selFilter: string = 'all';

  constructor(
    private layOutSc: LayoutService,
    private langSc: LanguageService,
    private router: Router,
    private seoSc: SeoService
  ) {}

  ngOnInit(): void {
    // this.isMobile$ = this.layOutSc.detectMobile();
    this.isL$ = this.layOutSc.detectL();
    this.langSc.setLanguage(this.router.url);
    this.lang = this.langSc.currentLang;
    this.setSeo();
  }

  setSeo() {
    const slug = `/${this.lang}/${this.colMenu.seo[this.lang].slug}`;
    const metaTags = {
      title: this.colMenu.seo[this.lang].title,
      description: this.colMenu.seo[this.lang].description,
      slug,
    };

    this.seoSc.generateTags(metaTags);
    this.seoSc.createCanonicalURL(slug);
  }

  setFilter(value) {
    this.selFilter = value;
  }

  filterCollections() {
    const colArr = Object.keys(this.collections).map(
      key => this.collections[key]
    );
    if (this.selFilter === 'all') {
      return colArr;
    } else {
      // todo filter;
      const filtered = colArr.filter(col => {
        return col.filterTags.indexOf(this.selFilter) !== -1;
      });
      return filtered;
    }
  }

  toCollection(col) {
    // todo
    const colLang = this.lang === 'es' ? 'colecciones' : 'collections';
    this.router.navigate([`${this.lang}/${colLang}/${col.key[this.lang]}`]);
  }
}
