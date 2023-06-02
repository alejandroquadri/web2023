import { Router } from '@angular/router';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Observable, firstValueFrom } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

import { ColorZoomComponent } from './../color-zoom/color-zoom.component';
import { LayoutService, LanguageService } from 'src/app/shared/services';
import { Colors } from 'src/app/shared/copy/colors';
import { Color } from 'src/app/shared/interfaces';

@Component({
  selector: 'app-colors',
  templateUrl: './colors.component.html',
  styleUrls: ['./colors.component.scss'],
})
export class ColorsComponent implements OnInit {
  @Input() colors: any;
  @Input() hideTitle: boolean;
  @Input() allowSelect: boolean;
  @Input() hideQuoteBtn: boolean;
  @Output() selected = new EventEmitter();
  isL$: Observable<boolean>;
  allColors: Record<string, Color>;
  selectedColor: string | null;

  constructor(
    public dialog: MatDialog,
    private layoutSc: LayoutService,
    private router: Router,
    private langSc: LanguageService
  ) {}

  ngOnInit(): void {
    this.allColors = Colors;
    this.isL$ = this.layoutSc.detectL();
  }

  async zoom(colorKey, colorObj) {
    const isMobile = await firstValueFrom(this.layoutSc.detectMobile());
    this.dialog.open(ColorZoomComponent, {
      width: isMobile ? '100%' : '700px',
      height: isMobile ? '100%' : '700px',
      maxWidth: '100vw',
      maxHeight: isMobile ? '100vh' : '90%',
      panelClass: isMobile ? 'full-screen-modal' : '',
      data: { colorObj, colorKey, hideQuoteBtn: !!this.hideQuoteBtn },
    });
  }

  async context(colorKey, colorObj) {
    const isMobile = await firstValueFrom(this.layoutSc.detectMobile());
    if (!isMobile) {
      this.secAction(colorKey, colorObj);
    }
  }

  secAction(colorKey, colorObj) {
    if (this.allowSelect) {
      this.zoom(colorKey, colorObj);
    }
  }

  stdClick(colorKey, colorObj, collection) {
    if (this.allowSelect) {
      this.selectedColor = `${collection.name}${colorKey}`;
      this.selected.emit({ colorKey, collection, ...colorObj });
    } else {
      this.zoom(colorKey, colorObj);
    }
  }

  isMobile() {
    return this.layoutSc.detectMobile();
  }

  scrollTo() {
    this.router.navigate([], { fragment: 'Vitro' });
  }

  camelize(col) {
    return this.langSc.camelize(col);
  }

  reset() {
    this.selectedColor = null;
  }

  isSelected(color, collection) {
    return this.selectedColor === `${collection.name}${color}`;
  }
}
