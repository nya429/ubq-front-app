import { CompanyService } from './../company.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
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
  participantChangedSubscription: Subscription;
  submitSubscription: Subscription;
  resultMessage: string;
  emailRegex = /^[_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;
  USPhoneRegex = /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;

  serchTimer;
  trackersLookingUp: boolean;
  trackerTimer;
  tagFocused: boolean;
  trackers: object[];

  companysLookingUp: boolean;
  companyTimer;
  companyFocused: boolean;
  companys: object[];

  constructor(private route: ActivatedRoute,
              private router: Router,
              private pmService: ParticipantService,
              private compnyService: CompanyService) { }

 ngOnDestroy() {
   this.participantChangedSubscription.unsubscribe();
 }

  ngOnInit() {
    this.participantChangedSubscription = this.pmService.participantChanged.subscribe(
      (participant: Participant) => {
        this.participant = participant;
        this.participantForm = new FormGroup({
                'tagId': new FormControl(this.participant.tagId, Validators.required, this.trackerValidate.bind(this)),
                'companyId': new FormControl(this.participant.companyId),
                'companyName': new FormControl(this.participant.companyName, Validators.max(50)),
                'firstName': new FormControl(this.participant.firstName, Validators.max(50)),
                'lastName': new FormControl(this.participant.lastName, Validators.max(50)),
                'email': new FormControl(this.participant.email, [Validators.pattern(this.emailRegex)]),
                'phone': new FormControl(this.participant.phone, Validators.pattern(this.USPhoneRegex)),
                'jobTitle': new FormControl(this.participant.jobTitle, Validators.max(50)),
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
    const companyId = '';
    const companyName = '';
    const firstName = '';
    const lastName = '';
    const email = '';
    const phone = '';
    const jobTitle = '';
    const avatarUri = '';
    const priorityStatus = '';
   if (this.editMode) {
    this.pmService.getParticipantById(this.participantId);
   } else {
    this.participantForm = new FormGroup({
      'tagId': new FormControl(tagId, Validators.required, this.trackerValidate.bind(this)),
      'companyId': new FormControl(companyId),
      'companyName': new FormControl(companyName),
      'firstName': new FormControl(firstName),
      'lastName': new FormControl(lastName),
      'email': new FormControl(email, [Validators.pattern(this.emailRegex)]),
      'phone': new FormControl(phone, Validators.pattern(this.USPhoneRegex)),
      'jobTitle': new FormControl(jobTitle),
      'avatarUri': new FormControl(avatarUri),
      'priorityStatus': new FormControl(priorityStatus, Validators.required),
    });
   }
  }

  onSubmit() {
    this.participantForm.patchValue({phone: this.participantForm.value.phone.replace(/[\s.-]/g, '')});
    const submit = this.editMode ?
                    this.pmService.updateParticipantById(this.participantId, this.participantForm.value) :
                    this.pmService.addParticipant(this.participantForm.value);
    this.submitSubscription = submit.subscribe(
      (result) => {
        const code = result['code'];
        this.resultMessage = this.editMode ? 'Update Success' : 'Participant has been singed';
        setTimeout(() => {
          this.router.navigate(['/visitor/participant']);
        }, 1500);
      }, (err)  => {
        this.pmService.handleError(err);
      });
  }

  onDelete() {
  }

  onCancel() {
  }

  getTrackers() {
    clearTimeout(this.serchTimer);
    if (!this.participantForm.value.tagId || this.participantForm.value.tagId.length === 0) {
      this.trackers = null;
      this.trackersLookingUp = false;
      return;
    }
     this.tagFocused = true;
     this.trackersLookingUp = true;
     this.serchTimer = setTimeout(() => this.pmService.getTrackers(this.participantForm.value.tagId).subscribe(
      result => {
        this.trackersLookingUp = false;
        this.trackers = result['data'];
       }), 400);

  }

  onTagBlur() {
    this.tagFocused = false;
  }

  onTrackerSelected(tarcker_id: string) {
    this.participantForm.patchValue({
      tagId: tarcker_id
    });
    this.onTagBlur();
  }

  getCompanys() {
    clearTimeout(this.serchTimer);
    if (!this.participantForm.value.companyName || this.participantForm.value.companyName.length === 0) {
      this.companys = null;
      this.companysLookingUp = false;
      return;
    }
     this.companyFocused = true;
     this.companysLookingUp = true;
     this.serchTimer = setTimeout(() => this.compnyService.getCompanys(this.participantForm.value.companyName).subscribe(
      result => {
        this.companysLookingUp = false;
        this.companys = result['data'];
       }), 400);

  }

  onCompanyBlur() {
    this.companyFocused = false;
  }

  onCompanySelected(company_id: number) {
    this.participantForm.patchValue({
      companyId: company_id,
      companyName: this.companys.filter(company => company['company_id'] === company_id)[0]['company_name']
    });
    this.onCompanyBlur();
  }

  trackerValidate(control: FormControl): Observable<any> | Promise<any> {
    clearTimeout(this.trackerTimer);
    if (this.editMode && control.value.trim() === this.participant.tagId) {
      return new Promise(resolve => resolve(null));
    }
    if (control.value.trim().length === 0) {
      return new Promise(resolve => resolve(null));
    }
    if (this.trackers &&
      this.trackers.filter(tracker => tracker['tracker_id'] === control.value.trim() && tracker['p_cnt'] === 0).length > 0) {
      return new Promise(resolve => resolve(null));
    }

    return Observable.create((observer: Observer<any>) => {
      this.trackerTimer = setTimeout(() => {
        this.pmService.isTrackerValid(control.value).subscribe(result => {
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
