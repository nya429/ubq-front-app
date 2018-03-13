import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';

import { Subscription } from 'rxjs/Subscription';

import { ParticipantService } from './../participant.service';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent implements OnInit, OnDestroy {
  @ViewChild('term') private term: ElementRef;
  private subscription: Subscription;

  constructor(private pmService: ParticipantService) { }

  ngOnInit() {
    this.subscription = this.pmService.termChanged.subscribe(
      term => {
        console.log('got it');
        this.term.nativeElement.value = term;
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  search(term: string) {
    term = term.trim();
    if (this.term.nativeElement.value  === this.pmService.getTerm() ) {
      return;
    }
    this.pmService.setTerm(term);
    this.pmService.getParticipantListByOpotions();

  }
}
