import { Component, OnInit } from '@angular/core';
import { LanguageObj, LanguageService } from 'src/app/shared/services';
import { LegalService } from '../legal.service';
import { TermsServiceCopy } from './terms-service.copy';

@Component({
  selector: 'app-terms-service',
  templateUrl: './terms-service.component.html',
  styleUrls: ['./terms-service.component.scss'],
})
export class TermsServiceComponent {
  copy = TermsServiceCopy;
  lang: string;
  langObj: LanguageObj;

  constructor(private langSc: LanguageService, private legalSc: LegalService) {}

  ngOnInit() {
    this.lang = this.langSc.currentLang;
    this.langObj = this.langSc.currentLangObj;
  }

  removeWhitespace(str) {
    return this.legalSc.removeWhitespace(str);
  }
}
