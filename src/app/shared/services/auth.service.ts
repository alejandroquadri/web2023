import { Injectable, inject } from '@angular/core';
import { filter, first, tap } from 'rxjs/operators';
import {
  authState,
  Auth,
  user,
  User,
  signInAnonymously,
} from '@angular/fire/auth';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth: Auth = inject(Auth);
  authState$ = authState(this.auth);
  user$ = user(this.auth);
  authStateSubs$: Subscription;
  userSubs$: Subscription;
  currentUser: User;

  constructor() {}

  getState() {
    this.authStateSubs$ = this.authState$
      .pipe(
        tap((aUser: User | null) => {
          if (aUser === null) {
            this.signInAnonymously().catch(err =>
              console.log('error logueando usario anonimo', err)
            );
          } else {
            this.currentUser = aUser;
          }
        })
      )
      .subscribe();
  }

  getUser() {
    this.userSubs$ = this.user$.subscribe((aUser: User | null) => {
      //handle user state changes here. Note, that user will be null if there is no currently logged in user.
      console.log(aUser);
    });
  }

  signInAnonymously() {
    return signInAnonymously(this.auth);
  }
}
