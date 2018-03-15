import { Router, ActivatedRoute, Params, UrlSegment, RouterEvent, NavigationEnd, NavigationStart } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { ParticipantService } from './participant.service';

@Component({
  selector: 'app-participant-management',
  templateUrl: './participant-management.component.html',
  styleUrls: ['./participant-management.component.css']
})
export class ParticipantManagementComponent implements OnInit {
  onEdit: boolean;
  title: string;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private pmService: ParticipantService) { }

  ngOnInit() {
    this.router.events.subscribe(
      (e: RouterEvent) => {
        if (e instanceof NavigationStart) {
          const lastUrlSegment = e['url'].substr((e['url'].lastIndexOf('/') + 1));
          this.onEdit = lastUrlSegment === 'edit';
          this.title = this.onEdit ? 'Add a participant' : 'Participants';
        }
      });
      this.onEdit = this.router.url.substr((this.router.url.lastIndexOf('/') + 1)) === 'edit';
      this.title = this.onEdit ? 'Add a participant' : 'Participants';
  }

  refresh() {
    this.pmService.reset();
    this.pmService.getParticipantListByOpotions();
  }

  goAdd() {
    this.router.navigate(['edit'], { relativeTo: this.route });
  }

  goIndex() {
    this.router.navigate(['list'], { relativeTo: this.route });
  }
}
