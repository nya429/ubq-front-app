import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params, RouterEvent, NavigationStart } from '@angular/router';
import { Location } from '@angular/common';

import { Subscription } from 'rxjs/Subscription';

import { AuthService } from './../../auth/auth.service';
import { LandpageService } from './../landpage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  animations: [  ]
})
export class HeaderComponent implements OnInit, OnDestroy {
  logoExpanded: boolean;
  headerTransparent: boolean;
  homepageSubscription: Subscription;

  constructor(private route: ActivatedRoute,
              private location: Location,
              private router: Router,
              private authService: AuthService,
              private lpService: LandpageService) { }

  ngOnInit() {
    this.router.events.subscribe((e: RouterEvent) => {
      if (e instanceof NavigationStart) {
       console.log(e['url']);
       this.logoExpanded = ( e['url'] === '/home' || e['url'] === '/') ? true : false;
      }
    });
    if ( this.router.url === '/home' || this.router.url === '/') {
      this.logoExpanded = true;
    }
    this.headerTransparent = this.lpService.isHeaderTranrsparent();
    this.homepageSubscription = this.lpService.scrollTriggered.subscribe((headerTransparented: boolean) => {
      this.headerTransparent = headerTransparented;
    });
  }

  ngOnDestroy() {
    this.homepageSubscription.unsubscribe();
  }

  isAuth() {
    return this.authService.isAuthenticated();
  }

  logOut() {
    if (confirm('Do you want to Log out?')) {
      this.authService.logOut();
    }
  }
}
