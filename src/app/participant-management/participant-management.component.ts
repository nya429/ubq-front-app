import { Router, ActivatedRoute, Params, UrlSegment, RouterEvent, NavigationEnd, NavigationStart } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';

import { ParticipantService } from './participant.service';

@Component({
  selector: 'app-participant-management',
  templateUrl: './participant-management.component.html',
  styleUrls: ['./participant-management.component.css']
})
export class ParticipantManagementComponent implements OnInit, OnDestroy {
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
          this.onEdit = lastUrlSegment === 'new' || lastUrlSegment === 'edit';
          this.title = this.onEdit ? (lastUrlSegment === 'new' ? 'Add a participant' : 'Edit') : 'Participants';
        }
      });
      const lastUrl = this.router.url.substr((this.router.url.lastIndexOf('/') + 1));
      this.onEdit = lastUrl === 'edit' || lastUrl === 'new';
      this.title = this.onEdit ? (lastUrl === 'new' ? 'Add a participant' : 'Edit')  : 'Participants';
  }

  ngOnDestroy() {
    this.pmService.reset();
  }

  refresh() {
    this.pmService.reset();
    this.pmService.getParticipantListByOpotions();
  }

  goAdd() {
    this.router.navigate(['new'], { relativeTo: this.route });
  }

  goIndex() {
    this.router.navigate(['list'], { relativeTo: this.route });
  }
}
