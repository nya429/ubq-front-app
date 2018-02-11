import { Subscription } from 'rxjs/Subscription';
import { Component, OnInit, OnDestroy, Input } from '@angular/core';

import { Tracker } from './../../../shared/tracker.model';
import { MapService } from '../../map.service';

@Component({
  selector: 'app-tracker-list-item',
  templateUrl: './tracker-list-item.component.html',
  styleUrls: ['./tracker-list-item.component.css']
})
export class TrackerListItemComponent implements OnInit, OnDestroy {
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
        this.isSelected = this.id === id ? true : false;
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
