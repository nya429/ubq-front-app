import { Subscription } from 'rxjs/Subscription';
import { Component, OnInit, OnDestroy, Input } from '@angular/core';

import { Tracker } from './../../../shared/tracker.model';
import { MapService } from '../../map.service';

@Component({
  selector: 'app-map-control-item',
  templateUrl: './map-control-item.component.html',
  styleUrls: ['./map-control-item.component.css']
})
export class MapControlItemComponent implements OnInit, OnDestroy {
  @Input() tracker: Tracker;
  @Input() index: number;
  private id;
  hidden = false;
  editMode = false;
  isSelected = false;
  selectSubscription: Subscription;

  constructor(private mapService: MapService) { }

  ngOnInit() {
    this.id = this.tracker.id;
    this.selectSubscription = this.mapService.hasSelectedTracker.subscribe(
      (id: number) => {
        this.isSelected = id === this.id ? true : false;
      }
    );
  }

  ngOnDestroy() {
    this.selectSubscription.unsubscribe();
  }

  onSelect() {
    this.mapService.onSelectedTracker(this.id);
  }

  onHide(event) {
    this.mapService.hideTracker(this.id);
    this.hidden = !this.hidden;
    event.stopPropagation();
  }

  onEdit(event) {
    this.editMode = !this.editMode;
    event.stopPropagation();
  }
}
