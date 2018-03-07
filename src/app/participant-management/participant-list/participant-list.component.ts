import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { Participant } from './../../shared/participant.model';
import { ParticipantService } from './../participant.service';

@Component({
  selector: 'app-participant-list',
  templateUrl: './participant-list.component.html',
  styleUrls: ['./participant-list.component.css']
})
export class ParticipantListComponent implements OnInit {
  participants: Participant[];
  subscription: Subscription;

  constructor(private pmService: ParticipantService) { }

  ngOnInit() {
    this.subscription = this.pmService.participantsChanged.subscribe(
      (participants: Participant[]) => {
        this.participants = participants;
        console.log('after listing', this.participants);
      });
  }
}
