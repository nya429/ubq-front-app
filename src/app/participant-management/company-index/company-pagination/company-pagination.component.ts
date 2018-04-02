import { Component, OnInit, Input, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs/Subscription';

import { CompanyService } from './../../company.service';

@Component({
  selector: 'app-company-pagination',
  templateUrl: './company-pagination.component.html',
  styleUrls: ['./company-pagination.component.css']
})
export class CompanyPaginationComponent implements OnInit, OnDestroy {
  @Input() lessDetailed: boolean;
  subscription: Subscription;
  count: number;
  limit: number;
  currentOffset: number;
  pageLen = 9;

  pageCount: number;
  currentPage: number;
  prevOffset: number;
  nextOffset: number;

  constructor(private service: CompanyService) { }

  ngOnInit() {
    this.subscription = this.service.paginateChanged.subscribe(
      paginateConf => {
        this.count = paginateConf['count'];
        this.limit = paginateConf['limit'];
        this.currentOffset = paginateConf['offset'];
        this.pageCount = Math.ceil(this.count / this.limit);
        this.currentPage = Math.floor(this.currentOffset / this.limit) + 1;
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getPages() {
    const pages: number[] = [];
    const begin = ( this.currentPage < (Math.floor(this.pageLen / 2) + 1) || this.pageCount < this.pageLen + 1) ? 1 :
     (( this.pageCount > this.pageLen && this.pageCount - this.currentPage < Math.floor(this.pageLen / 2) + 1 )
     ? this.pageCount - (this.pageLen - 1)
     : this.currentPage - Math.floor(this.pageLen / 2));
    const end = begin > this.pageCount - (this.pageLen - 1) ? this.pageCount : begin + (this.pageLen - 1);
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
    this.limit = limit ? +limit : this.limit;
    this.service.setLimit(this.limit);
    const offset = page ? (page - 1) * this.limit : 0;
    this.service.getCompanyListByOptions(offset, this.limit);
  }

  getTerm() {
    return this.service.getTerm();
  }
}

