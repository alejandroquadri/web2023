import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LanguageService } from '../../services';

import { CtaBtnComponent } from './../cta-btn/cta-btn.component';

@Component({
  selector: 'app-query',
  templateUrl: './query.component.html',
  styleUrls: ['./query.component.scss'],
})
export class QueryComponent implements OnInit {
  lang: string;

  constructor(
    public langSc: LanguageService,
    private dialogRef: MatDialogRef<CtaBtnComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { origin: string }
  ) {}

  ngOnInit(): void {
    this.lang = this.langSc.currentLang;
  }

  closeDialog(event?) {
    this.dialogRef.close(event ? true : false);
  }

  showOrigin(origin) {
    return origin !== 'landing' && origin !== 'header' && origin !== 'side-nav';
  }
}
