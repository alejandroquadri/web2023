import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { LanguageService } from 'src/app/shared/services';
import { QueryComponent } from 'src/app/shared/components';

@Component({
  selector: 'app-cta-btn',
  templateUrl: './cta-btn.component.html',
  styleUrls: ['./cta-btn.component.scss'],
})
export class CtaBtnComponent {
  @Input() text: string;
  @Input() lang: string;
  @Input() origin: string;
  @Input() small: boolean;
  @Input() header: boolean;
  @Input() fab: boolean;
  @Input() listItem: boolean;
  @Input() fullWidth: boolean;

  @Output() ret = new EventEmitter();

  // lang: string;

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private langSc: LanguageService,
    private snackBar: MatSnackBar
  ) {
    // this.lang = this.langSc.currentLang;
  }

  // toQuote() {
  //   if (this.langSc.currentLangObj?.countrycode === 'AR') {
  //     this.router.navigate(['/' + this.langSc.currentLang + '/quote']);
  //   } else {
  //     this.toQuoteForm();
  //   }
  // }

  toQuote() {
    const col = this.lang === 'es' ? 'colecciones' : 'collections';
    const all = this.lang === 'es' ? 'todos' : 'all';
    this.router.navigate(['/' + this.langSc.currentLang + '/quote']);
    this.router.navigate([`/${this.lang}/${col}/${all}`]);
  }

  toQuoteForm() {
    const dialogRef = this.dialog.open(QueryComponent, {
      width: '800px',
      height: '600px',
      data: { origin: this.origin },
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      this.ret.emit(result);
      if (result === true) {
        this.openSnackBar();
      }
    });
  }

  openSnackBar(message?: string, action?: string) {
    this.snackBar.open(
      'Recibimos tu consulta! En breve te estaremos contestando',
      undefined,
      {
        duration: 5000,
      }
    );
  }
}
