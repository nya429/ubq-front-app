import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs/Subscription';

import { MapService } from './map.service';
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'] ,
})
export class MapComponent implements OnInit, OnDestroy {
  dropdownFolded: boolean;
  dropdownSubscription: Subscription;
  constructor(private mapService: MapService) { }

  ngOnInit() {
    this.dropdownFolded = true;
    this.dropdownSubscription = this.mapService.dropdownFolded.subscribe(folded =>
      this.dropdownFolded = folded);
  }

  ngOnDestroy() {
    this.dropdownSubscription.unsubscribe();
  }

  onCompanyDropdownFold() {
    if (this.dropdownFolded) {
      return;
    }
    this.mapService.onCompanyDropdownFolded(true);
  }
}
