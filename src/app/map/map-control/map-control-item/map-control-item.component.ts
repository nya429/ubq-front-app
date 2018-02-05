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
  editMode: boolean = false;
  selected: boolean = false;

  constructor(private mapService: MapService) { }

  ngOnInit() {
    this.id = this.tracker.id
  }

  onSelect() {
    this.mapService.onSelectedTracker(this.id);
  }
  
  onRemove(event) {
    this.mapService.hideTracker(this.id);
    event.stopPropagation();
  }

  onEdit(event) {
    this.editMode = !this.editMode;
    
    event.stopPropagation();
  }
}
