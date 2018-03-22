import { Component, OnInit, Input, Output, OnChanges, SimpleChange, SimpleChanges, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-tracker-result-list',
  templateUrl: './tracker-result-list.component.html',
  styleUrls: ['./tracker-result-list.component.css']
})
export class TrackerResultListComponent implements OnInit, OnChanges {
  @Input() trackers;
  @Output() trackerSelected = new EventEmitter<string> ();

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['trackers'].currentValue) {
      this.trackers = changes['trackers'].currentValue;
    }
  }

  onSelect(event, tracker_id: string) {
    event.stopPropagation();
    this.trackerSelected.emit(tracker_id);
  }

}
