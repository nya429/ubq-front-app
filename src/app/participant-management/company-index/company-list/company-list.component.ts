import { Subscription } from 'rxjs/Subscription';
import { Component, OnInit } from '@angular/core';

import { Company } from '../../../shared/company.model';
import { CompanyService } from './../../company.service';
import { listItemSlideStateTrigger } from '../../participant-list.animation';

@Component({
  selector: 'app-company-list',
  templateUrl: './company-list.component.html',
  styleUrls: ['./company-list.component.css'],
  animations: [ listItemSlideStateTrigger ]
})
export class CompanyListComponent implements OnInit {
  companys: Company[];
  private orderBy: string;
  private sortBy: string;

  private subscription: Subscription;
  constructor(private companyService: CompanyService) { }

  ngOnInit() {
    this.subscription = this.companyService.companysChanged.subscribe(
      (companys: Company[]) => {
        this.companys = companys;
      });
      this.companyService.getCompanyListByOptions();
  }

}
