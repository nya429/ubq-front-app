import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  currentHref: string;

  constructor(private route: ActivatedRoute,
              private location: Location,
              private router: Router) { }

  ngOnInit() {
    this.route.url.subscribe((val) => {
      if (this.location.path() !== '') {
        console.log(this.route.snapshot);
      } else {
        this.currentHref = 'Home';
      }
    });
  }

}
