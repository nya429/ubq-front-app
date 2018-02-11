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
  id:number;
  name:string;
  status:number;
  note:string;
  private selectedTrackerSubscription: Subscription;
  private hasSelectedTrackerSubscription: Subscription;
  constructor(private mapService: MapService) { }

  ngOnInit() {
    // TODO get initial selected data
    // this.tracker = this.mapService
    this.selectedTrackerSubscription = this.mapService.selectedTrackerIndex.subscribe(
      (index: number) => {
        this.editMode = false;
        this.editedTrackerIndex = index - 1;
        this.tracker = this.mapService.getTracker(index - 1);
        this.id = this.tracker.id;
        this.name = this.tracker.alias ? this.tracker.alias : 'tracker';
        this.note = this.tracker.note ? this.tracker.note : 'N/A';
      }
    )
    this.hasSelectedTrackerSubscription = this.mapService.hasSelectedTracker.subscribe(
      (index: number) => {
        this.editMode = false;
        if  (index == null) {
          this.tracker = null;
          this.id = null;
          this.name = null;
          this.note = null;
          return;
        }
        this.editedTrackerIndex = index - 1;
        this.tracker = this.mapService.getTracker(index - 1);
        this.id = this.tracker.id;
        this.name = this.tracker.alias ? this.tracker.alias : 'tracker';
        this.note = this.tracker.note ? this.tracker.note : 'N/A';
      }
    )
  }

  ngOnDestroy() {
    this.selectedTrackerSubscription.unsubscribe();
    this.hasSelectedTrackerSubscription.unsubscribe();
  }

  onEdit() {
    this.editMode = true;

    console.log(this.trackerForm);
  }

  onUpdate(form: NgForm) {
    console.log(form.value)
    const value = form.value;
    this.mapService.updateTrackerInfo(this.editedTrackerIndex, value);
    this.name = value.alias;
    this.editMode = false;
  }

  onCancle() {
    this.editMode = false;
  }

}
