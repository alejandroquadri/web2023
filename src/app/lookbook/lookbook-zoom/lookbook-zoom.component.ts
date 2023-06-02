import { Router } from '@angular/router';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Observable } from 'rxjs';

import { Color } from 'src/app/shared/interfaces';
import { LayoutService, LanguageService } from 'src/app/shared/services';
import { LookbookComponent } from './../lookbook.component';

@Component({
  selector: 'app-lookbook-zoom',
  templateUrl: './lookbook-zoom.component.html',
  styleUrls: ['./lookbook-zoom.component.scss'],
})
export class LookbookZoomComponent implements OnInit {
  card: any;
  colors: Record<string, Color>;
  showSpinner = true;
  isMobile$: Observable<boolean>;

  constructor(
    private layOutSc: LayoutService,
    private langSc: LanguageService,
    private dialogRef: MatDialogRef<LookbookComponent>,
    private router: Router,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      card: any;
      colors;
    }
  ) {
    this.card = data.card;
    this.colors = data.colors;
  }

  ngOnInit(): void {
    this.isMobile$ = this.layOutSc.detectMobile();
  }

  closeDialog(event?): void {
    this.dialogRef.close(event ? true : false);
  }

  onImageLoad(): void {
    this.showSpinner = false;
  }

  toProd(prod): void {
    const colName =
      this.langSc.currentLang === 'es' ? 'colecciones' : 'collections';
    this.router.navigate([
      `${this.langSc.currentLang}/${colName}/${prod.series}`,
    ]);
    // this.router.navigate([`${this.langSc.currentLang}/${prod.url}`], {
    //   fragment: this.langSc.camelize(prod.series),
    // });
    this.closeDialog();
  }
}
