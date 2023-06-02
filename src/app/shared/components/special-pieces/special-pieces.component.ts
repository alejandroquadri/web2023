import { SpecialPieces } from 'src/app/shared/copy';
import { Component, OnInit, Input } from '@angular/core';
import { Observable, map } from 'rxjs';

import { LanguageService } from '../../services';

@Component({
  selector: 'app-special-pieces',
  templateUrl: './special-pieces.component.html',
  styleUrls: ['./special-pieces.component.scss'],
})
export class SpecialPiecesComponent implements OnInit {
  @Input() pieces: Array<any>;

  allPieces$: Observable<any>;
  allPieces = SpecialPieces;
  lang: string;

  constructor(private langSc: LanguageService) {}

  ngOnInit(): void {
    // this.getPieces();
    this.lang = this.langSc.currentLang;
  }

  // getPieces() {
  //   this.allPieces$ = this.specialSc.getPieces();
  // }
}
