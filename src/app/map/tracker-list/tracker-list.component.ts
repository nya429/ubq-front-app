import { Component, OnInit } from '@angular/core';

import { MapService } from './../map.service';

import { Tracker } from './../../shared/tracker.model';
import { listItemSlideStateTrigger } from '../../participant-management/participant-list.animation';
import { listItemFadeSlideStateTrigger } from '../map.animation';

@Component({
  selector: 'app-tracker-list',
  templateUrl: './tracker-list.component.html',
  styleUrls: ['./tracker-list.component.css'],
  animations: [ listItemSlideStateTrigger, listItemFadeSlideStateTrigger ]
})
export class TrackerListComponent implements OnInit {
  trackers: Tracker[];

  constructor(private mapService: MapService) { }

  ngOnInit() {
    this.trackers = this.mapService.getTrackers();
  }
}
