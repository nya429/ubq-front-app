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
    // Array.from(document.getElementsByClassName('home-nav-item'))
    // .map( element => {
    //     if (element.children[0].innerHTML !== el.innerText) {
    //       element.classList.remove('nav-item-selected');
    //     } else {
    //       element.classList.add('nav-item-selected');
    //     }
    //   }
    // );
    el.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'start' });
  }
}
