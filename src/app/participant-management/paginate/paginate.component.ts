import { ParticipantService } from './../participant.service';
import { Component, OnInit } from '@angular/core';

import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-paginate',
  templateUrl: './paginate.component.html',
  styleUrls: ['./paginate.component.css']
})
export class PaginateComponent implements OnInit {
  subscription: Subscription;
  count: number;
  limit: number;
  currentOffset: number;
  prevOffset: number;
  nextOffset: number;

  constructor(private pmService: ParticipantService) { }

  ngOnInit() {
    this.subscription = this.pmService.paginateChanged.subscribe(
      paginateConf => {
        this.count = paginateConf['count'];
        this.limit = 2;
        this.currentOffset = 1;
      });
  }

  getPages() {
    const pageCount = Math.ceil(this.count / this.limit);
    const pages: number[] = [];
    for (let i = 0; i < pageCount; i++) {
      const offset = 0 + i * this.limit;
      pages.push(offset);
    }
    return pages;
  }

  getPrevOffset() {
    this.prevOffset = this.currentOffset - this.limit > 0 ? this.currentOffset - this.limit : 0;
    return this.prevOffset;
  }

  getNextOffset() {
    console.log(this.count);
    this.nextOffset = this.currentOffset + this.limit < this.count ? this.currentOffset + this.limit : 0;
    return this.nextOffset;
  }

  goPage(offset) {
    
  }
}
