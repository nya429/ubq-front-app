import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import { ParticipantService } from './../../../participant.service';
import { CompanyService } from '../../../company.service';

import { Company } from '../../../../shared/company.model';

@Component({
  selector: 'app-company-list-item',
  templateUrl: './company-list-item.component.html',
  styleUrls: ['./company-list-item.component.css']
})
export class CompanyListItemComponent implements OnInit {
  @Input() company: Company;
  @Input() index: number;

  confFolded = true;

  constructor(private service: CompanyService,
              private pmService: ParticipantService,
              private router: Router) { }

  ngOnInit() { }

  onRemove() {
    if (this.company.participantCnt > 0) {
      // TODO: popup dialog
      alert(`The company still has ${this.company.participantCnt} participant${
        this.company.participantCnt > 1 ? 's' : ''} \n see next version`
    );
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

   // TODO add quray by ID
  goParticipantsByCompanyId() {
    this.pmService.setTerm(this.company.name);
    this.router.navigate(['/visitor/participant']);
  }

  unfoldConf() {
    this.confFolded = false;
  }

  foldConf() {
    this.confFolded = true;
  }
}


