import { ActivatedRoute, Params, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { AuthService } from './../auth.service';
import { trigger, state, style, transition, animate, keyframes } from '@angular/animations';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css'],
  animations: [
    trigger('bigger', [
            state('bigger',  style({ })),
             state('default',  style({ })),
            transition('bigger => default', animate('500ms', keyframes([
              style({transform: 'scale(1.0)'}),
              style({transform: 'scale(1.1)'}),
              style({transform: 'scale(1.0)'}),
              style({transform: 'scale(1.1)'}),
              style({transform: 'scale(1.0)'}),
            ]) )),
    ])]
})

export class SigninComponent implements OnInit {
  required: boolean;
  biggerState: string;

  constructor(private authService: AuthService,
  private route: ActivatedRoute,
  private router: Router) { }

  ngOnInit() {
    this.biggerState = 'default';
    this.authService.signInScaleChanged.subscribe((bigger: boolean) => {
      if (bigger) {
        this.biggerState = 'bigger';
        setTimeout(() => {
          this.biggerState = 'default';
        }, 100);
      }
    });
  }

  onSignIn() {
    this.authService.setToken();
    this.router.navigate(['/dashboard']);
  }

  isRequired() {

  }
}
