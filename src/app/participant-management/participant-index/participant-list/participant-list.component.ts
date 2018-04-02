import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { Participant } from './../../../shared/participant.model';
import { ParticipantService } from './../../participant.service';

@Component({
  selector: 'app-participant-list',
  templateUrl: './participant-list.component.html',
  styleUrls: ['./participant-list.component.css']
})
export class ParticipantListComponent implements OnInit, OnDestroy {
  participants: Participant[];
  detailedIndex: number;
  private orderBy: string;
  private sortBy: string;

  private subscription: Subscription;
  private resetSubscription: Subscription;

  constructor(private pmService: ParticipantService) { }

  ngOnInit() {
    this.subscription = this.pmService.participantsChanged.subscribe(
      (participants: Participant[]) => {
        this.participants = participants;
        this.detailedIndex = null;
      });
    this.resetSubscription = this.pmService.orderChanged.subscribe(() => {
      this.orderBy = null;
      this.sortBy = null;
      this.detailedIndex = null;
    });
    this.pmService.getParticipantListByOptions();
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
    this.pmService.getParticipantListByOptions();
  }

  goCompany(companyName: string) {
    this.pmService.setTerm(companyName);
    this.pmService.getParticipantListByOptions();
  }

  showDetail(index: number) {
    this.detailedIndex = index === this.detailedIndex ? null : index;
  }

  onRemove(participantId: number) {
    if (confirm('Are you sure you want to delete this?')) {
      this.pmService.deleteParticipantById(participantId);
    }
  }

  getPriorityStatus(priorityStatus: number) {
    switch (priorityStatus) {
      case 0:
        return 'Supereme';
      case 1:
        return 'VIP';
      case 2:
        return 'Vistor';
      default:
        return 'not assigned yet';
    }
  }
}
