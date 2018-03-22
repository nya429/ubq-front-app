import { ActivatedRoute, Router, Params } from '@angular/router';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { Subscription } from 'rxjs/Subscription';

import { ParticipantService } from './../participant.service';
import { Participant } from './../../shared/participant.model';

@Component({
  selector: 'app-participant-item',
  templateUrl: './participant-item.component.html',
  styleUrls: ['./participant-item.component.css']
})
export class ParticipantItemComponent implements OnInit, OnDestroy {
  participantId: number;
  participant: Participant;
  participantForm: FormGroup;
  editMode;
  subcription: Subscription;
  emailRegex = /^[_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;
  serchTimer;
  trackerTimer;
  tagFocused: boolean;
  trackers: object[];

  constructor(private route: ActivatedRoute,
              private router: Router,
              private pmService: ParticipantService) { }

 ngOnDestroy() {
   this.subcription.unsubscribe();
 }

  ngOnInit() {
    this.subcription = this.pmService.participantChanged.subscribe(
      (participant: Participant) => {
        this.participant = participant;
        this.participantForm = new FormGroup({
                'tagId': new FormControl(this.participant.tagId, Validators.required),
                'companyId': new FormControl(this.participant.companyId, Validators.required),
                'companyName': new FormControl(this.participant.companyName),
                'firstName': new FormControl(this.participant.firstName),
                'lastName': new FormControl(this.participant.lastName),
                'email': new FormControl(this.participant.email, [Validators.pattern(this.emailRegex)]),
                'phone': new FormControl(this.participant.phone),
                'jobTitle': new FormControl(this.participant.jobTitle),
                'avatarUri': new FormControl(this.participant.avatarUri),
                'priorityStatus': new FormControl(this.participant.priorityStatus, Validators.required),
              });
      });
      this.route.params.subscribe((params: Params) => {
      this.editMode = 'id' in params;
      this.participantId = this.editMode ? +params['id'] : null;
      this.initForm();
    });
  }

  private initForm() {
    const tagId = '';
    const companyId = 1;
    const companyName = 'UBQ';
    const firstName = '';
    const lastName = '';
    const email = '';
    const phone = '';
    const jobTitle = '';
    const avatarUri = '';
    const priorityStatus = '';
    console.log(this.editMode );
   if (this.editMode) {
    this.pmService.getParticipantById(this.participantId);
   } else {
    this.participantForm = new FormGroup({
      'tagId': new FormControl(tagId, Validators.required, this.trackerValidate.bind(this)),
      'companyId': new FormControl(companyId, Validators.required),
      'companyName': new FormControl(companyName),
      'firstName': new FormControl(firstName),
      'lastName': new FormControl(lastName),
      'email': new FormControl(email, [Validators.pattern(this.emailRegex)]),
      'phone': new FormControl(phone),
      'jobTitle': new FormControl(jobTitle),
      'avatarUri': new FormControl(avatarUri),
      'priorityStatus': new FormControl(priorityStatus, Validators.required),
    });
   }
  }

  onSubmit() {
    this.pmService.addParticipant(this.participantForm.value)
      .subscribe(
        (result) => {
          const code = result['code'];
          console.log(code);
        }, (err)  => {
          this.pmService.handleError(err);
        }
    );
  }

  onUpdate() {
    this.pmService.updateParticipantById(this.participantId, this.participantForm.value)
      .subscribe(
        (result) => {
          const code = result['code'];
          console.log(code);
        }, (err)  => {
          this.pmService.handleError(err);
        }
    );
  }

  onDelete() {

  }

  onCancel() {
    console.log(this.participantForm.get('tagId').errors);
  }

  getTracker() {
    clearTimeout(this.serchTimer);
    if (!this.participantForm.value.tagId) {
      this.trackers = null;
      return;
    }
     this.tagFocused = true;
     this.serchTimer = setTimeout(() => this.pmService.getTracker(this.participantForm.value.tagId).subscribe(
      result => {
        this.trackers = result['data'];
       }), 500);

  }

  onTagBlur() {
    this.tagFocused = false;
  }

  onTrackerSelected(tarcker_id) {
    this.participantForm.patchValue({
      tagId: tarcker_id
    });
    this.onTagBlur();
  }

  trackerValidate(control: FormControl): Observable<any> | Promise<any> {
    clearTimeout(this.trackerTimer);
    if (control.value.trim().length === 0) {
      return new Promise(resolve => resolve(null));
    }

    return Observable.create((observer: Observer<any>) => {
      this.trackerTimer = setTimeout(() => {
        this.pmService.isTrackerValid(control.value).subscribe(result => {
          console.log(result['data']['isValid']);
          switch (result['data']['isValid']) {
            case 0:
              observer.next({'InvalidTrackerId': true});
              break;
            case 1:
              observer.next(null);
              break;
            case 3:
              observer.next({'SignedTracker': true});
              break;
            default:
              observer.next(null);
              break;
          }
          observer.complete();
        });
      }, 1000);
    });
  }
}
