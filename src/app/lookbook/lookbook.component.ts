import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { firstValueFrom, Observable, Subject } from 'rxjs';
import { tap, takeUntil, startWith } from 'rxjs/operators';

import {
  LanguageService,
  LayoutService,
  SeoService,
} from 'src/app/shared/services';
import { Colors, Lookbook } from 'src/app/shared/copy';
import { Color } from 'src/app/shared/interfaces';
import { LookbookZoomComponent } from './lookbook-zoom/lookbook-zoom.component';
import { LookbookService } from './lookbook.service';

@Component({
  selector: 'app-lookbook',
  templateUrl: './lookbook.component.html',
  styleUrls: ['./lookbook.component.scss'],
})
export class LookbookComponent implements OnInit, OnDestroy {
  isMobile$: Observable<boolean>;
  unsuscribe$ = new Subject();
  lookbook: any;
  allColors: Record<string, Color>;
  lang: string;
  copy = Lookbook;

  // variables para el masonry
  numCol: number;
  colsAsIterable: Array<number>;
  filters = Lookbook.filters;
  selFilter: string = 'all';

  constructor(
    private layOutSc: LayoutService,
    private langSc: LanguageService,
    private router: Router,
    private seoSc: SeoService,
    public dialog: MatDialog,
    private lookbookSc: LookbookService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.lookbook = this.route.snapshot.data['lookbook'];
    this.isMobile$ = this.layOutSc.detectMobile();
    this.langSc.setLanguage(this.router.url);
    this.lang = this.langSc.currentLang;
    this.allColors = Colors;
    this.getLookbook();
    this.setColNum();
    this.setSeo();
  }

  ngOnDestroy(): void {
    this.unsuscribe$.next(true);
    this.unsuscribe$.complete();
  }

  setSeo() {
    const slug = this.lang === 'es' ? 'inspiracion' : 'lookbook';
    const metaTags = {
      title: this.lang === 'es' ? 'Inspiracion' : 'Lookbook',
      // tslint:disable-next-line:max-line-length
      description:
        this.lang === 'es'
          ? 'Encuentra inspiración para tu próximo proyecto. Quadri es la referencia última para diseñadores y clientes buscando terrazo.'
          : 'Get Inspiration for your next tile project, quadri is the go-to resource for homeowners and designers seeking for terrazzo tiles.',
      // image: this.slidesData[0].img,
      slug: `/${slug}`,
    };

    this.seoSc.generateTags(metaTags);
    this.seoSc.createCanonicalURL(`/${this.lang}/${slug}`);
  }

  getLookbook() {
    this.lookbookSc
      .getLookbook()
      .pipe(
        takeUntil(this.unsuscribe$),
        startWith(this.lookbook),
        tap(lookbook => (this.lookbook = lookbook))
      )
      .subscribe();
  }

  setColNum() {
    this.isMobile$
      .pipe(
        tap(isMobile => {
          this.numCol = isMobile ? 3 : 4;
          this.colsAsIterable = [];
          for (let i = 0; i < this.numCol; i++) {
            this.colsAsIterable.push(1);
          }
        })
      )
      .subscribe();
  }

  setFilter(value) {
    this.selFilter = value;
  }

  filterCards() {
    if (this.selFilter === 'all') {
      return this.lookbook;
    } else {
      const filtered = this.lookbook.filter(card => {
        return card.tags.indexOf(this.selFilter) !== -1;
      });
      if (filtered.length < this.numCol) {
        const dif = this.numCol - filtered.length;
        for (let i = 0; i < dif; i++) {
          filtered.push({ text: '', url: '', tags: [] });
        }
      }
      console.log(filtered);
      return filtered;
    }
  }

  async zoom(card) {
    const isMobile = await firstValueFrom(this.isMobile$);
    this.dialog.open(LookbookZoomComponent, {
      width: isMobile ? '100%' : '800px',
      height: isMobile ? '100%' : '90%',
      maxWidth: '100vw',
      maxHeight: '100vh',
      panelClass: isMobile ? 'full-screen-modal' : '',
      data: { card, colors: this.allColors },
    });
  }
}
