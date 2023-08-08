import { Component, OnDestroy } from '@angular/core';
import { Platform } from '@angular/cdk/platform';
import {
  MatSnackBar,
  MatSnackBarRef,
  TextOnlySnackBar,
} from '@angular/material/snack-bar';

import { Observable, Subscription } from 'rxjs';
import { User } from '@angular/fire/auth';

import {
  AuthService,
  ServerDetectService,
  ServiceWorkerService,
} from 'src/app/shared/services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnDestroy {
  update$: any;
  scrHeight: any;
  snackBarRef: MatSnackBarRef<TextOnlySnackBar>;

  constructor(
    public platform: Platform,
    private serverDetSc: ServerDetectService,
    private serviceWSc: ServiceWorkerService,
    private authSc: AuthService // private snackBar: MatSnackBar
  ) {
    this.serviceWSc.checkForUpdates();
    this.update();
    // this.initAuth();
  }

  ngOnDestroy(): void {
    if (this.serverDetSc.isBrowserSide() === true) {
      this.authSc.authStateSubs$.unsubscribe();
      this.authSc.userSubs$.unsubscribe();
    }
  }

  initAuth() {
    if (this.serverDetSc.isBrowserSide() === true) {
      this.authSc.getState();
    }
    // this.authSc.getUser();
  }

  update() {
    this.update$ = this.serviceWSc.update$;
    this.update$.subscribe(ret => {
      console.log('actualizando nueva version');
      // if (ret) {
      //   this.openSnackBar('¡Actualizando a nueva version! 🍾   🎉   🥳 ');
      // }
    });
  }

  // openSnackBar(message?: string) {
  //   this.snackBarRef = this.snackBar.open(message, null, {
  //     duration: 5000,
  //   });
  //   this.snackBarRef
  //     .afterDismissed()
  //     .subscribe(() => this.serviceWSc.updateVersion());
  // }

  // @HostListener('window:resize', ['$event'])
  // getScreenSize(event?) {
  //   this.scrHeight = window.innerHeight;
  //   this.scrWidth = window.innerWidth;
  //   console.log(this.scrHeight, this.scrWidth);
  // }
}
