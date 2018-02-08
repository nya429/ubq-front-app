import { MapService } from './../map.service';
import { Component, OnInit } from '@angular/core';

import { Tracker } from './../../shared/tracker.model';
import { Output } from '@angular/core/src/metadata/directives';

@Component({
  selector: 'app-tracker-list',
  templateUrl: './tracker-list.component.html',
  styleUrls: ['./tracker-list.component.css']
})
export class TrackerListComponent implements OnInit {
  trackers: Tracker[];

  constructor(private mapService: MapService) { }

  ngOnInit() {
    this.trackers = this.mapService.getTrackers();
  }
}
