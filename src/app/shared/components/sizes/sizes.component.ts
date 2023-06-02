import { Component, OnInit, Input } from '@angular/core';

import { LanguageService } from '../../services';
import { Sizes } from '../../copy';

@Component({
  selector: 'app-sizes',
  templateUrl: './sizes.component.html',
  styleUrls: ['./sizes.component.scss'],
})
export class SizesComponent implements OnInit {
  @Input() sizes: Array<any>;
  @Input() thickness: String;

  allSizes = Sizes;
  lang: string;

  constructor(private langSc: LanguageService) {}

  ngOnInit(): void {
    this.lang = this.langSc.currentLang;
  }
}
