import { Component, Input, OnInit } from '@angular/core';

import { LanguageService } from 'src/app/shared/services';

@Component({
  selector: 'app-three-features',
  templateUrl: './three-features.component.html',
  styleUrls: ['./three-features.component.scss'],
})
export class ThreeFeaturesComponent implements OnInit {
  @Input() copy;
  lang: string;

  constructor(private langSc: LanguageService) {}

  ngOnInit(): void {
    this.lang = this.langSc.currentLang;
  }
}
