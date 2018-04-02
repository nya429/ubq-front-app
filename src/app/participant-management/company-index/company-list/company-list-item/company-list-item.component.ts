import { Component, OnInit, Input } from '@angular/core';

import { Company } from '../../../../shared/company.model';
import { CompanyService } from '../../../company.service';

@Component({
  selector: 'app-company-list-item',
  templateUrl: './company-list-item.component.html',
  styleUrls: ['./company-list-item.component.css']
})
export class CompanyListItemComponent implements OnInit {
  @Input() company: Company;
  @Input() index: number;

  constructor(private service: CompanyService) { }

  ngOnInit() { }

  onRemove() {
    if (this.company.participantCnt > 0) {
      // TODO: popup dialog
      return;
    }
    if (confirm('Are you sure you want to delete this Company?')) {
      this.service.deleteCompanyById(this.company.companyId).subscribe(
        data => {
          this.service.getCompanyListByOptions();
        },
        error => this.service.handleError(error));
    }
  }
}


