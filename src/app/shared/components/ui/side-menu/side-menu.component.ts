import { Component, Input, OnInit } from '@angular/core';
import { LanguageService } from 'src/app/shared/services';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
})
export class SideMenuComponent implements OnInit {
  lang: string;

  constructor(public langSc: LanguageService) {}

  ngOnInit(): void {
    this.lang = this.langSc.currentLang;
  }

  shouldShow(item) {
    if (!item.countries) {
      return true;
    } else {
      return item.countries.includes(this.langSc.currentLangObj.countrycode);
    }
  }
}
