import { Component, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';

import { Observable } from 'rxjs';

import { SidenavService } from 'src/app/shared/services';

@Component({
  selector: 'app-language',
  templateUrl: './language.component.html',
  styleUrls: ['./language.component.scss'],
})
export class LanguageComponent implements AfterViewInit {
  @ViewChild('sidenav') public sidenav: MatSidenav;
  @ViewChild('shoppingCart') public shoppingCart: MatSidenav;
  @ViewChild('wrapper') wrapper: ElementRef;

  scrHeight: any;

  mobile$: Observable<boolean>;
  route$: Observable<boolean>;
  mobile: boolean;

  constructor(private sidenavSc: SidenavService) {}

  ngAfterViewInit(): void {
    this.sidenavSc.setSidenav(this.sidenav);
    this.sidenavSc.setShoppingCart(this.shoppingCart);
  }
}
