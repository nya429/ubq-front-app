import { Component, OnInit, Input, Output, OnChanges, SimpleChange, SimpleChanges, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-tracker-result-list',
  templateUrl: './tracker-result-list.component.html',
  styleUrls: ['./tracker-result-list.component.css']
})
export class TrackerResultListComponent implements OnInit, OnChanges {
  @Input() trackers;
  @Input() trackersLookingUp;
  @Input() signedTagId;
  @Output() trackerSelected = new EventEmitter<string> ();
  @Output() trackerResultClosed = new EventEmitter ();
  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['trackers'] && changes['trackers'].currentValue) {
      this.trackers = changes['trackers'].currentValue;
    }
  }

  onSelect(event, tracker_id: string) {
    event.stopPropagation();
    this.trackerSelected.emit(tracker_id);
  }

  onClose(event) {
    this.trackerResultClosed.emit();
    event.stopPropagation();
  }
}
