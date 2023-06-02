import { Injectable } from '@angular/core';
import { MatDrawerToggleResult, MatSidenav } from '@angular/material/sidenav';

@Injectable({
  providedIn: 'root',
})
export class SidenavService {
  sidenav: MatSidenav;
  shoppingCart: MatSidenav;

  constructor() {}

  // menu

  public setSidenav(sidenav: MatSidenav): void {
    this.sidenav = sidenav;
  }

  public open(): Promise<MatDrawerToggleResult> {
    return this.sidenav.open();
  }

  public close(): Promise<MatDrawerToggleResult> {
    return this.sidenav.close();
  }

  public toggle(): void {
    this.sidenav.toggle();
  }

  // shopping cart

  public setShoppingCart(shoppingCart: MatSidenav): void {
    this.shoppingCart = shoppingCart;
  }

  public openS(): Promise<MatDrawerToggleResult> {
    return this.shoppingCart.open();
  }

  public closeS(): Promise<MatDrawerToggleResult> {
    return this.shoppingCart.close();
  }

  public toggleS(): void {
    this.shoppingCart.toggle();
  }
}
