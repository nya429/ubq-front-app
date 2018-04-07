import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  private fragment: string;

  constructor() {}

  ngOnInit() {
  }

  moveTo(el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'start' });
  }
}
