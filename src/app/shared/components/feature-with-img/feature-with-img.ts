import { Component, Input, OnInit } from '@angular/core';

import { LanguageService } from 'src/app/shared/services';

@Component({
  selector: 'app-feature-with-img',
  templateUrl: './feature-with-img.html',
  styleUrls: ['./feature-with-img.scss'],
})
export class FeatureWithImg implements OnInit {
  @Input() copy;
  lang: string;

  constructor(private langSc: LanguageService) {}

  ngOnInit(): void {
    this.lang = this.langSc.currentLang;
  }
}
