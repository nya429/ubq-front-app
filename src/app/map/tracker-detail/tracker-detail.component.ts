import { Participant } from './../../shared/participant.model';
import { Tracker } from './../../shared/tracker.model';
import { Subscription } from 'rxjs/Subscription';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { MapService } from './../map.service';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';

@Component({
  selector: 'app-tracker-detail',
  templateUrl: './tracker-detail.component.html',
  styleUrls: ['./tracker-detail.component.css']
})
export class TrackerDetailComponent implements OnInit, OnDestroy {
  @ViewChild('f') trackerForm: NgForm;
  editMode = false;
  editedTrackerIndex: number;
  tracker: Tracker;
  tagId: string;
  fullName: string;
  time: number;
  status: number;
  note: string;
  participant: Participant;

  private selectedTrackerSubscription: Subscription;
  private hasSelectedTrackerSubscription: Subscription;
  private trackerLocChangeSubscription: Subscription;
  private trackerListChangeSubscription: Subscription;
  constructor(private mapService: MapService) { }

  ngOnInit() {
    // TODO get initial selected data
    // this.tracker = this.mapService
    this.selectedTrackerSubscription = this.mapService.selectedTrackerIndex.subscribe(
      (index: number) => {
        this.editMode = false;
        this.setTrackerDetail(index);
      }
    );
    this.hasSelectedTrackerSubscription = this.mapService.hasSelectedTracker.subscribe(
      (index: number) => {
        this.editMode = false;
        this.setTrackerDetail(index);
      });
    this.trackerListChangeSubscription = this.mapService.trackerListChanges.subscribe(() => {
      this.setTrackerDetail(null);
    });
    this.trackerLocChangeSubscription = this.mapService.trackerLocChanges.subscribe(data => {
        const time = this.editedTrackerIndex ? this.mapService.getTrackerTime(this.editedTrackerIndex) : 0;
        this.time = time;
    });
  }

  ngOnDestroy() {
    this.trackerListChangeSubscription.unsubscribe();
    this.trackerLocChangeSubscription.unsubscribe();
    this.selectedTrackerSubscription.unsubscribe();
    this.hasSelectedTrackerSubscription.unsubscribe();
  }

  onEdit() {
    this.editMode = true;

    console.log(this.trackerForm);
  }

  onUpdate(form: NgForm) {
    const value = form.value;
    this.mapService.updateTrackerInfo(this.editedTrackerIndex, value);
    // this.alia = value.alias;
    this.editMode = false;
  }

  onCancle() {
    this.editMode = false;
  }

  setTrackerDetail(index: number) {
    if  (index == null) {
      this.tracker = null;
      this.tagId = null;
      this.fullName = null;
      this.note = null;
      return;
    } else {
      this.editedTrackerIndex = index - 1;
      this.tracker = this.mapService.getTracker(this.editedTrackerIndex);
      this.tagId = this.tracker.tagId;
      this.participant = this.tracker.participant ? this.tracker.participant : null;
      this.fullName = this.tracker.participant ? `${this.participant.firstName} ${this.participant.lastName}` : this.tracker.alias;
      this.note = this.tracker.note ? this.tracker.note : 'N/A';
      this.time = this.tracker.time ? this.tracker.time : null;
    }
  }
}
