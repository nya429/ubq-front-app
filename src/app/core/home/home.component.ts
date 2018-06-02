import { Component, OnInit, ElementRef, ViewChild, Inject, HostListener, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DOCUMENT } from '@angular/platform-browser';

import { LandpageService } from './../landpage.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  headerTriggered = false;
  serviceTriggered = false;
  startTriggered = false;
  currentPos: number;
  navClickedSubscription: Subscription;
  solutionExtended = false;

  @ViewChild('intro') private introEl: ElementRef;
  @ViewChild('services') private servicesEl: ElementRef;
  @ViewChild('solutions') private solutionsEl: ElementRef;
  @ViewChild('start') private startEl: ElementRef;
  @ViewChild('team') private teamEl: ElementRef;
  @ViewChild('contact') private contactEl: ElementRef;

  @ViewChild('introTrigger') private introTrigger: ElementRef;

  constructor(@Inject(DOCUMENT) private document: Document,
              private lpService: LandpageService) {}

  ngOnInit() {
    this.lpService.turnHeaderTransparent();

    this.navClickedSubscription = this.lpService.navClicked.subscribe(section => {
        this.onNavClicked(section);
    });
  }

  ngOnDestroy() {
    this.lpService.turnHeaderOpaque();
    this.lpService.onSectionChange(null);
    this.navClickedSubscription.unsubscribe();
  }

  onNavClicked(section: number) {
    console.log(section);
    switch (section) {
      case 0:
        this.moveTo(this.introEl.nativeElement);
        break;
      case 1:
        this.moveTo(this.servicesEl.nativeElement);
        break;
      case 2:
        this.moveTo(this.solutionsEl.nativeElement);
        break;
      case 3:
        this.moveTo(this.startEl.nativeElement);
        break;
      case 4:
        this.moveTo(this.teamEl.nativeElement);
        break;
      case 5:
        this.moveTo(this.contactEl.nativeElement);
        break;
      default:
        break;
    }
  }

  moveTo(el) {
    const targetPos = el.offsetTop;
    setTimeout(() => this.moveToIns(targetPos), 150);
    // el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'start' });
  }

  moveToIns(targetPos: number) {
    window.scroll({top: (targetPos - 70),
      left: 0,
      behavior: 'smooth'});
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const windowScrollPos = this.document.documentElement.scrollTop;
    const windowInnerHeight = window.innerHeight;

    const introPos = this.introTrigger.nativeElement.offsetTop;
    const servicePos = this.servicesEl.nativeElement.offsetTop;
    const solutionsPos = this.solutionsEl.nativeElement.offsetTop;
    const startPos = this.startEl.nativeElement.offsetTop;
    const teamPos = this.teamEl.nativeElement.offsetTop;
    const contactPos = this.contactEl.nativeElement.offsetTop;

    const introHeight = this.introEl.nativeElement.clientHeight;
    const serviceHeight = this.servicesEl.nativeElement.clientHeight;
    const teamHeight = this.teamEl.nativeElement.clientHeight;
    const contactHeight = this.contactEl.nativeElement.clientHeight;
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

    if (!this.startTriggered && windowScrollPos > solutionsPos + 90) {
      this.startTriggered = true;
    }

    if (windowScrollPos < servicePos - 70) {
      this.currentPos = 0;
      this.lpService.onSectionChange(0);
    } else if (windowScrollPos >= servicePos - 70 && windowScrollPos < solutionsPos - 70) {
      this.currentPos = 1;
      this.lpService.onSectionChange(1);
    } else if (windowScrollPos >= solutionsPos - 70 && windowScrollPos < startPos - 70) {
      this.currentPos = 2;
      this.lpService.onSectionChange(2);
    } else if (windowScrollPos >= startPos - 70 && windowScrollPos < teamPos - 70) {
      this.currentPos = 3;
      this.lpService.onSectionChange(3);
    } else if (windowScrollPos >= teamPos - 70 && windowScrollPos < (teamPos + teamHeight + contactHeight - windowInnerHeight)) {
      this.currentPos = 4;
      this.lpService.onSectionChange(4);
    } else {
      this.currentPos = 5;
      this.lpService.onSectionChange(5);
    }
    // console.log(this.currentPos);
  }

  fakeSend() {
    window.confirm('Thank you for your message, we\'ve heard you :)');
  }

  toggleSolution(el) {
    // TODO: refresh when destory?
    this.solutionExtended = !this.solutionExtended;
    if (this.solutionExtended) {
     this.moveToIns(el.offsetTop);
    }
    console.log(this.solutionExtended);
  }
}
