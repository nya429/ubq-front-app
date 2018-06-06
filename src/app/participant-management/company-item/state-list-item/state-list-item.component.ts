import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { StateList } from '../../../shared/address.model';

@Component({
  selector: 'app-state-list-item',
  templateUrl: './state-list-item.component.html',
  styleUrls: ['./state-list-item.component.css']
})
export class StateListItemComponent implements OnInit {
  @Input() states;
  @Output() stateSelected = new EventEmitter<number> ();
  @Output() statesResultClosed = new EventEmitter();
  stateList = StateList;
  constructor() { }

  ngOnInit() { }

  onSelect(event, id: number) {
    this.stateSelected.emit(id);
    event.stopPropagation();
  }

  onClose(event) {
    this.statesResultClosed.emit();
    event.stopPropagation();
  }
}
