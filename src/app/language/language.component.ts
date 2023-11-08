import {
  Component,
  ViewChild,
  AfterViewInit,
  ElementRef,
  NgZone,
} from '@angular/core';
import { trigger, transition, animate, style } from '@angular/animations';

import { MatSidenav } from '@angular/material/sidenav';
import { Observable } from 'rxjs';

import { ServerDetectService, SidenavService } from 'src/app/shared/services';
import { Router } from '@angular/router';

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
    private serverDetSc: ServerDetectService,
    private router: Router,
    private ngZone: NgZone
  ) {}

  ngAfterViewInit(): void {
    this.sidenavSc.setSidenav(this.sidenav);
    this.sidenavSc.setShoppingCart(this.shoppingCart);
    this.openNlDialog();
  }

  openNlDialog() {
    if (this.serverDetSc.isBrowserSide() && this.shouldShowNlDialog()) {
      // esto de incluir ngZone es para que este proceso corra por afuera y la aplicación se considere estable antes de que termine de correr el proceso. Caso contrario puede joder para el Hydration process
      this.ngZone.runOutsideAngular(() => {
        setTimeout(() => {
          this.addNewsLetter = true;
        }, 60000);
      });
    }
  }

  closeNlDialog() {
    this.addNewsLetter = false;
  }

  shouldShowNlDialog() {
    const url = this.router.url;
    const parsedUrl = url.replace(/\//g, '').substring(2);
    return !(
      parsedUrl === 'thanks' ||
      parsedUrl === 'checkout' ||
      parsedUrl === 'checkout-us' ||
      parsedUrl === 'return' ||
      parsedUrl === 'not-found'
    );
  }
}
