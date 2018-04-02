import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-company-result-list',
  templateUrl: './company-result-list.component.html',
  styleUrls: ['./company-result-list.component.css']
})
export class CompanyResultListComponent implements OnInit {
  @Input() companys;
  @Input() companysLookingUp;
  @Input() signedTagId;
  @Output() companySelected = new EventEmitter<number> ();
  @Output() companysResultClosed = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  onSelect(event, company_id: number) {
    this.companySelected.emit(company_id);
    event.stopPropagation();
  }

  onClose(event) {
    this.companysResultClosed.emit();
    event.stopPropagation();
  }
}
