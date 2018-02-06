import { MapService } from './../map.service';
import { Component, OnInit } from '@angular/core';

import { Tracker } from '../tracker.model';
import { Output } from '@angular/core/src/metadata/directives';

@Component({
  selector: 'app-map-control',
  templateUrl: './map-control.component.html',
  styleUrls: ['./map-control.component.css']
})
export class MapControlComponent implements OnInit {
  trackers: Tracker[];

  constructor(private mapService: MapService) { }

  ngOnInit() {
    this.trackers = this.mapService.getTrackers();
  }
}
