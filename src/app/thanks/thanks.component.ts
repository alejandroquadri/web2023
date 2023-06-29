import { Component, OnInit } from '@angular/core';
import { ThanksCopy } from 'src/app/shared/copy';
import { LanguageService } from '../shared/services';

@Component({
  selector: 'app-thanks',
  templateUrl: './thanks.component.html',
  styleUrls: ['./thanks.component.scss'],
})
export class ThanksComponent implements OnInit {
  copy = ThanksCopy;
  lang;

  constructor(private langSc: LanguageService) {}

  ngOnInit(): void {
    this.lang = this.langSc.currentLang;
  }
}
