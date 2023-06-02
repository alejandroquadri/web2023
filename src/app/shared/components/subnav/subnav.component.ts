import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';

import { LayoutService, LanguageService } from 'src/app/shared/services';

@Component({
  selector: 'app-subnav',
  templateUrl: './subnav.component.html',
  styleUrls: ['./subnav.component.scss'],
})
export class SubnavComponent implements OnInit {
  @Input() subProds: Array<{ name: string; url: string; key: string }>;
  @Input() prodRoute: string;
  @Output() selected = new EventEmitter();
  isMobile$: Observable<boolean>;
  lang: string;

  constructor(
    private layoutSc: LayoutService,
    private langSc: LanguageService
  ) {}

  ngOnInit(): void {
    this.lang = this.langSc.currentLang;
    this.isMobile$ = this.layoutSc.detectMobile();
    console.log();
  }

  select(name) {
    this.selected.emit(name);
  }

  // buildRoute(key) {
  //   return `/${this.lang}/${this.prodRoute}/${key}`
  // }

  buildRoute(key) {
    return `/${this.lang}/${this.prodRoute}`;
  }
}
