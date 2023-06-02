import { Router } from '@angular/router';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import {
  trigger,
  transition,
  animate,
  style,
  state,
} from '@angular/animations';

import { MatMenuTrigger } from '@angular/material/menu';

import { MENU } from 'src/app/shared/constants';
import { Collections } from 'src/app/shared/copy';
import {
  LanguageService,
  LanguageObj,
  SidenavService,
} from 'src/app/shared/services';
import { MatAnchor } from '@angular/material/button';

@Component({
  selector: 'app-menu-list',
  templateUrl: './menu-list.component.html',
  styleUrls: ['./menu-list.component.scss'],
  animations: [
    trigger('contentExpansion', [
      state(
        'expanded',
        style({ height: '*', opacity: 1, visibility: 'visible' })
      ),
      state(
        'collapsed',
        style({ height: '0px', opacity: 0, visibility: 'hidden' })
      ),
      transition(
        'expanded <=> collapsed',
        animate('300ms cubic-bezier(.37,1.04,.68,.98)')
      ),
    ]),
  ],
})
export class MenuListComponent implements OnInit {
  @Input() type: string;
  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;
  @ViewChild('colItem') colItem: ElementRef<MatAnchor>;

  menu;
  // lang: string;
  langObj: LanguageObj;
  timedOutCloser;
  collections = Collections;
  hover = false;

  mackApplicationsArray = [
    'Interiores',
    'Revestimientos',
    'Exteriores',
    'Piletas',
  ];

  constructor(
    public langSc: LanguageService,
    private router: Router,
    private sidenavSc: SidenavService
  ) {}

  ngOnInit(): void {
    this.langObj = this.langSc.currentLangObj;
    if (this.isLocal()) {
      this.menu = MENU.local;
    } else {
      this.menu = MENU.ext;
    }
  }

  isLocal() {
    return this.langObj.countrycode === 'AR';
  }

  closeDrawer() {
    this.sidenavSc.close();
  }

  buildColArray() {
    return Object.keys(this.collections).map(key => this.collections[key]);
  }

  mouseEnter() {
    if (this.timedOutCloser) {
      clearTimeout(this.timedOutCloser);
    }
    this.hover = true;
    this.trigger.openMenu();
  }

  mouseLeave() {
    this.timedOutCloser = setTimeout(() => {
      this.trigger.closeMenu();
      this.hover = false;
    }, 50);
  }

  toCol(col) {
    const colLang =
      this.langSc.currentLang === 'es' ? 'colecciones' : 'collections';
    this.router.navigate([
      `${this.langSc.currentLang}/${colLang}/${
        col.key[this.langSc.currentLang]
      }`,
    ]);
  }
}
