import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';

import { ParticipantService } from './../participant.service';

@Component({
  selector: 'app-participant-item',
  templateUrl: './participant-item.component.html',
  styleUrls: ['./participant-item.component.css']
})
export class ParticipantItemComponent implements OnInit {
  participantForm: FormGroup;
  editMode = false;
  constructor(private pmService: ParticipantService) { }

  ngOnInit() {
    this.initForm();
  }

  private initForm() {
    let tagId = '';
    let companyId = '';
    let companyName = '';
    let firstName = '';
    let lastName = '';
    let email = '';
    let phone = '';
    let jobTitle = '';
    let avatarUri = '';
    let priorityStatus = '';

    this.participantForm = new FormGroup({
      'tagId': new FormControl(tagId, Validators.required),
      'companyId': new FormControl(companyId, Validators.required),
      'companyName': new FormControl(companyName),
      'firstName': new FormControl(firstName),
      'lastName': new FormControl(lastName),
      'email': new FormControl(email, [Validators.email]),
      'phone': new FormControl(phone),
      'jobTitle': new FormControl(jobTitle),
      'avatarUri': new FormControl(avatarUri),
      'priorityStatus': new FormControl(priorityStatus),
    });
  }

  onSubmit() {

  }

}
