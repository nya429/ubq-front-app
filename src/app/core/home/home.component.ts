import { Component, OnInit, ElementRef, ViewChild, Inject, HostListener, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DOCUMENT } from '@angular/platform-browser';

import { LandpageService } from './../landpage.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  headerTriggered = false;

  @ViewChild('scrollTrigger') private targetElement: ElementRef;

  private fragment: string;

  constructor(@Inject(DOCUMENT) private document: Document,
              private lpService: LandpageService) {}

  ngOnInit() {
    this.lpService.turnHeaderTransparent();
  }

  ngOnDestroy() {
    this.lpService.turnHeaderOpaque();
  }

  moveTo(el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'start' });
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const targetPos = this.targetElement.nativeElement.offsetTop;
    const windowScrollPos = this.document.documentElement.scrollTop;
    console.log(targetPos, windowScrollPos);
    if (windowScrollPos > (targetPos - 250)) {
      this.lpService.toggleHeaderOpacity(false);
    } else {
      this.lpService.toggleHeaderOpacity(true);
    }
  }

}
