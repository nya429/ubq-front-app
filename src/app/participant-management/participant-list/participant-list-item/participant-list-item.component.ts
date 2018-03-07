import { Participant } from './../../../shared/participant.model';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-participant-list-item',
  templateUrl: './participant-list-item.component.html',
  styleUrls: ['./participant-list-item.component.css']
})
export class ParticipantListItemComponent implements OnInit {
  @Input() participant: Participant;
  @Input() index: number;

  constructor() { }

  ngOnInit() {
  }

}
