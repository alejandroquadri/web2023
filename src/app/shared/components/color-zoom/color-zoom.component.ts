import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { LanguageService } from '../../services';
import { ColorsComponent } from './../colors/colors.component';

@Component({
  selector: 'app-color-zoom',
  templateUrl: './color-zoom.component.html',
  styleUrls: ['./color-zoom.component.scss'],
})
export class ColorZoomComponent {
  color: any;
  colorKey: string;
  lang: string;
  hideQuoteBtn: boolean;

  constructor(
    private langSc: LanguageService,
    private dialogRef: MatDialogRef<ColorsComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      colorObj: any;
      colorKey: string;
      hideQuoteBtn: boolean;
    }
  ) {
    this.lang = this.langSc.currentLang;
    this.color = data.colorObj;
    this.colorKey = data.colorKey;
    this.hideQuoteBtn = data.hideQuoteBtn;
  }

  closeDialog(event?) {
    this.dialogRef.close(event ? true : false);
  }
}
