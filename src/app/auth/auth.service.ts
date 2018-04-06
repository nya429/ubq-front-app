import { Subject } from 'rxjs/Subject';
import { Router } from '@angular/router';
import { Injectable, EventEmitter, Output } from '@angular/core';

@Injectable()
export class AuthService {
  errorEmiiter = new EventEmitter<string> ();
  token: string = null;
  errorMessage: string = null;
  signInScaled: boolean;
  signInScaleChanged = new Subject<boolean> ();

  constructor(private router: Router) { }

  isAuthenticated() {
      return this.token !== null;
  }

  setToken() {
    this.token = 'true';
    this.router.navigate(['/dashboard']);
  }

  logOut() {
    this.token = null;
    this.router.navigate(['/auth/signin']);
  }

  changeSigninScale() {
    this.signInScaleChanged.next(true);
  }
}
