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

  pageCount: number;
  currentPage: number;
  prevOffset: number;
  nextOffset: number;

  constructor(private pmService: ParticipantService) { }

  ngOnInit() {
    this.subscription = this.pmService.paginateChanged.subscribe(
      paginateConf => {
        this.count = paginateConf['count'];
        this.limit = paginateConf['limit'];
        this.currentOffset = paginateConf['offset'];
        this.pageCount = Math.ceil(this.count / this.limit);
        this.currentPage = Math.floor(this.currentOffset / this.limit) + 1;
      });
  }

  getPages() {
    const pages: number[] = [];
    const begin = ( this.currentPage < 5 || this.pageCount < 10) ? 1 :
     (( this.pageCount > 9 && this.pageCount - this.currentPage < 5 ) ? this.pageCount - 8 : this.currentPage - 4);
    const end = begin > this.pageCount - 8 ? this.pageCount : begin + 8;
    for (let i = begin; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }

  getPrevOffset() {
    this.prevOffset = this.currentOffset - this.limit > 0 ? this.currentOffset - this.limit : 0;
    return this.prevOffset;
  }

  getNextOffset() {
    this.nextOffset = this.currentOffset + this.limit < this.count ? this.currentOffset + this.limit : 0;
    return this.nextOffset;
  }

  goPage(page, limit) {
    limit = limit ? limit : this.limit;
    const offset = page ? (page - 1) * this.limit : 0;
    this.pmService.getParticipantListByOpotions(offset, limit);
  }

}
