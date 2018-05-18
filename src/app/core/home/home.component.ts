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
  serviceTriggered = false;
  currentPos: number;

  @ViewChild('intro') private introEl: ElementRef;
  @ViewChild('services') private servicesEl: ElementRef;
  @ViewChild('solutions') private solutionsEl: ElementRef;
  @ViewChild('start') private startEl: ElementRef;
  @ViewChild('team') private teamEl: ElementRef;
  @ViewChild('contact') private contactEl: ElementRef;

  @ViewChild('introTrigger') private introTrigger: ElementRef;
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
    const targetPos = el.offsetTop;
    setTimeout(() => {
      console.log(targetPos);
      window.scroll({top: (targetPos - 70),
      left: 0,
      behavior: 'smooth'});
    }, 250);
    // el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'start' });
  }



  @HostListener('window:scroll', [])
  onWindowScroll() {
    const windowScrollPos = this.document.documentElement.scrollTop;

    const introPos = this.introTrigger.nativeElement.offsetTop;
    const servicePos = this.servicesEl.nativeElement.offsetTop;
    const solutionsPos = this.solutionsEl.nativeElement.offsetTop;
    const startPos = this.startEl.nativeElement.offsetTop;
    const teamPos = this.teamEl.nativeElement.offsetTop;
    const contactPos = this.contactEl.nativeElement.offsetTop;

    const introHeight = this.introEl.nativeElement.clientHeight;
    const serviceHeight = this.servicesEl.nativeElement.clientHeight;

    // console.log(introPos, introHeight);
    if (windowScrollPos > (introPos - introHeight / 4)) {
      this.lpService.toggleHeaderOpacity(false);
      this.headerTriggered = true;
    } else {
      this.lpService.toggleHeaderOpacity(true);
      this.headerTriggered = false;
    }
    // console.log(windowScrollPos, servicePos, serviceHeight);
    if (!this.serviceTriggered && windowScrollPos > (serviceHeight / 2)) {
      this.serviceTriggered = true;
    }

    if (windowScrollPos < servicePos - 70) {
      this.currentPos = 0;
    } else if (windowScrollPos >= servicePos - 70 && windowScrollPos < solutionsPos - 70) {
      this.currentPos = 1;
    } else if (windowScrollPos >= solutionsPos - 70 && windowScrollPos < startPos - 70) {
      this.currentPos = 2;
    } else if (windowScrollPos >= startPos - 70 && windowScrollPos < teamPos - 70) {
      this.currentPos = 3;
    } else if (windowScrollPos >= teamPos - 70 && windowScrollPos < contactPos - 130) {
      this.currentPos = 4;
    } else {
      this.currentPos = 5;
    }
    // console.log(this.currentPos);
  }

  fakeSend() {
    window.confirm('Thank you for your message, we\'ve heard you :)');
  }
}
