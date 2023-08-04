import { Component } from '@angular/core';
import { LanguageObj, LanguageService } from 'src/app/shared/services';
import { LegalService } from '../legal.service';
import { ReturnsCopy } from './returns.copy';

@Component({
  selector: 'app-returns',
  templateUrl: './returns.component.html',
  styleUrls: ['./returns.component.scss'],
})
export class ReturnsComponent {
  copy = ReturnsCopy;
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
