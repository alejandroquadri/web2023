import { Component, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { trigger, transition, animate, style } from '@angular/animations';

import { MatSidenav } from '@angular/material/sidenav';
import { Observable } from 'rxjs';

import { ServerDetectService, SidenavService } from 'src/app/shared/services';

@Component({
  selector: 'app-language',
  templateUrl: './language.component.html',
  styleUrls: ['./language.component.scss'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateX(100%)' }),
        animate('300ms ease-in-out', style({ transform: 'translateX(0)' })),
      ]),
      transition(':leave', [
        animate('300ms ease-in-out', style({ transform: 'translateX(100%)' })),
      ]),
    ]),
  ],
})
export class LanguageComponent implements AfterViewInit {
  @ViewChild('sidenav') public sidenav: MatSidenav;
  @ViewChild('shoppingCart') public shoppingCart: MatSidenav;
  @ViewChild('wrapper') wrapper: ElementRef;

  scrHeight: any;

  mobile$: Observable<boolean>;
  route$: Observable<boolean>;
  mobile: boolean;

  addNewsLetter = false;

  constructor(
    private sidenavSc: SidenavService,
    private serverDetSc: ServerDetectService
  ) {}

  ngAfterViewInit(): void {
    this.sidenavSc.setSidenav(this.sidenav);
    this.sidenavSc.setShoppingCart(this.shoppingCart);
    this.openNlDialog();
  }

  openNlDialog() {
    if (this.serverDetSc.isBrowserSide()) {
      setTimeout(() => {
        this.addNewsLetter = true;
      }, 30000);
    }
  }

  closeNlDialog() {
    this.addNewsLetter = false;
  }
}
