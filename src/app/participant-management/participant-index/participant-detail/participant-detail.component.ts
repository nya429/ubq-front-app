import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';

import { Participant } from './../../../shared/participant.model';

@Component({
  selector: 'app-participant-detail',
  templateUrl: './participant-detail.component.html',
  styleUrls: ['./participant-detail.component.css']
})
export class ParticipantDetailComponent implements OnInit {
  @Input() participant: Participant;
  @Output() removed = new EventEmitter<number> ();

  constructor() { }

  ngOnInit() { }

  onRemove(event, participantId: number) {
    event.stopPropagation();
    this.removed.emit(participantId);
  }
}
