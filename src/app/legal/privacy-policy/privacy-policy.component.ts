import { Component, OnInit } from '@angular/core';
import { PrivacyPolicyCopy } from './privacy-policy.copy';
import { LanguageObj, LanguageService } from 'src/app/shared/services';
import { LegalService } from '../legal.service';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss'],
})
export class PrivacyPolicyComponent implements OnInit {
  copy = PrivacyPolicyCopy;
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
