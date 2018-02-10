import { Tracker } from './../../shared/tracker.model';
import { Subscription } from 'rxjs/Subscription';
import { Component, OnInit } from '@angular/core';

import { MapService } from './../map.service';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';

@Component({
  selector: 'app-tracker-detail',
  templateUrl: './tracker-detail.component.html',
  styleUrls: ['./tracker-detail.component.css']
})
export class TrackerDetailComponent implements OnInit, OnDestroy {
  tracker: Tracker;
  private selectedTrackerSubscription: Subscription;
  constructor(private mapService: MapService) { }

  ngOnInit() {
    this.selectedTrackerSubscription = this.mapService.selectedTrackerIndex.subscribe(
      (id: number) => {
        this.tracker = this.mapService.getTracker(id);
        console.log(this.tracker);
      }
    )
  }

  ngOnDestroy() {
    this.selectedTrackerSubscription.unsubscribe();
  }

}
