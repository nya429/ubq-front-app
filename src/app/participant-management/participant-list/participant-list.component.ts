import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { Participant } from './../../shared/participant.model';
import { ParticipantService } from './../participant.service';

@Component({
  selector: 'app-participant-list',
  templateUrl: './participant-list.component.html',
  styleUrls: ['./participant-list.component.css']
})
export class ParticipantListComponent implements OnInit, OnDestroy {
  private participants: Participant[];
  private orderBy: string;
  private sortBy: string;

  private subscription: Subscription;
  private resetSubscription: Subscription;

  constructor(private pmService: ParticipantService) { }

  ngOnInit() {
    this.subscription = this.pmService.participantsChanged.subscribe(
      (participants: Participant[]) => {
        this.participants = participants;
      });
    this.resetSubscription = this.pmService.orderChanged.subscribe(() => {
      this.orderBy = null;
      this.sortBy = null;
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.resetSubscription.unsubscribe();
  }

  sortByCloumn(columnName: string) {
    if (!this.sortBy || this.sortBy !== columnName) {
      this.sortBy = columnName;
      this.orderBy = 'ASC';
    } else if (this.orderBy === 'ASC') {
      this.orderBy = 'DESC';
    } else {
      this.sortBy = null;
      this.orderBy = null;
    }
    this.pmService.setOrderer(this.orderBy, this.sortBy);
    this.pmService.getParticipantListByOpotions();
  }

  goCompany() {
    this.pmService.setTerm('ubq');
    this.pmService.getParticipantListByOpotions();
  }
}
