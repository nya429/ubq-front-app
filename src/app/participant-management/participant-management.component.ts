import { ParticipantService } from './participant.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-participant-management',
  templateUrl: './participant-management.component.html',
  styleUrls: ['./participant-management.component.css']
})
export class ParticipantManagementComponent implements OnInit {

  constructor(private pmService: ParticipantService) { }

  ngOnInit() {
    this.pmService.getParticipantList();
  }

}
