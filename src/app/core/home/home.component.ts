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
  @ViewChild('intro') private introElement: ElementRef;
  @ViewChild('scrollTrigger') private introTrigger: ElementRef;
  @ViewChild('services') private servicesElement: ElementRef;
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
    }, 300);
    // el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'start' });
  }



  @HostListener('window:scroll', [])
  onWindowScroll() {
    const windowScrollPos = this.document.documentElement.scrollTop;

    const introPos = this.introTrigger.nativeElement.offsetTop;
    const introHeight = this.introElement.nativeElement.clientHeight;
    const servicePos = this.servicesElement.nativeElement.offsetTop;
    const serviceHeight = this.servicesElement.nativeElement.clientHeight;
    // console.log(introPos, introHeight);
    if (windowScrollPos > (introPos - introHeight / 4)) {
      this.lpService.toggleHeaderOpacity(false);
    } else {
      this.lpService.toggleHeaderOpacity(true);
    }
    console.log(windowScrollPos, servicePos, serviceHeight);
    if (!this.serviceTriggered && windowScrollPos > (serviceHeight / 2)) {
      this.serviceTriggered = true;
      console.log(this.serviceTriggered);
    }
  }

  fakeSend() {
    window.confirm('Thank you for your message, we\'ve heard you :)');
  }
}
