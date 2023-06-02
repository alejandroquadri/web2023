import { Component, Input, OnInit } from '@angular/core';
import { LanguageService } from '../../services';
import { Uses } from '../../copy';

@Component({
  selector: 'app-uses',
  templateUrl: './uses.component.html',
  styleUrls: ['./uses.component.scss'],
})
export class UsesComponent implements OnInit {
  @Input() uses: Array<any>;

  allUses = Uses;
  lang: string;

  constructor(private langSc: LanguageService) {}

  ngOnInit(): void {
    this.lang = this.langSc.currentLang;
  }

  detWidth(app): string {
    let klass;
    switch (app) {
      case 'revestimientos':
        klass = 'h-app-img';
        break;

      default:
        klass = 'w-app-img';
        break;
    }
    return klass;
  }
}
