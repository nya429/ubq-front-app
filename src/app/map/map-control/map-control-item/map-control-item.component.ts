import { Component, OnInit, Input } from '@angular/core';

import { Tracker } from '../../tracker.model';
import { MapService } from '../../map.service';

@Component({
  selector: 'app-map-control-item',
  templateUrl: './map-control-item.component.html',
  styleUrls: ['./map-control-item.component.css']
})
export class MapControlItemComponent implements OnInit {
  @Input() tracker: Tracker;
  @Input() index: number;
  private id;
  hidden = false;
  editMode = false;
  isSelected = false;

  constructor(private mapService: MapService) { }

  ngOnInit() {
    this.id = this.tracker.id;
    this.mapService.hasSelectedTracker.subscribe(
      (id: number) => {
        this.isSelected = id === this.id ? true : false;
      }
    );
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
