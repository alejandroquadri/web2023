import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { LanguageService, LanguageObj } from 'src/app/shared/services';

@Component({
  selector: 'app-lang-change',
  templateUrl: './lang-change.component.html',
  styleUrls: ['./lang-change.component.scss'],
})
export class LangChangeComponent implements OnInit {
  lang: string;
  langObj: LanguageObj;
  selectedLang: string;

  constructor(public langSc: LanguageService, private router: Router) {}

  ngOnInit(): void {}

  changeLanguage() {
    const arrayUrl = this.langSc.splitRoute(this.router.url);
    let newUrl = `${this.langSc.currentLang}`;
    for (let i = 2; i < arrayUrl.length; i++) {
      newUrl += `/${arrayUrl[i]}`;
    }
    this.router.navigate([newUrl]);
  }
}
