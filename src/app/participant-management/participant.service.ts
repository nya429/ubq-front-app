import { Injectable, EventEmitter } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';

import { Subject } from 'rxjs/Subject';

import { Participant } from './../shared/participant.model';

@Injectable()
export class ParticipantService {
  participantsChanged = new Subject<Participant[]>();
  paginateChanged = new Subject<object>();
  termChanged = new Subject<string>();
  orderChanged = new Subject();

  private participants: Participant[];
  private paginageConf: object;
  private sortBy: string;
  private orderBy: string;
  private limit: number;
  private term: string;

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization': 'my-auth-token'
    }),
    url: 'http://localhost:3000/participant'
  };

  constructor(private httpClient: HttpClient) {}

  reset() {
    this.limit = null;
    this.sortBy = null;
    this.orderBy = null;
    this.term = null;
    this.paginageConf = null;
    this.termChanged.next(this.term);
    this.orderChanged.next();
  }

  setParticipants(data) {
    const participants = data['participants'].map(
      participantsRaw => new Participant(participantsRaw)
    );
    this.participants = participants;
    this.paginageConf = {
      count: data.count,
      offset: data.offset,
      limit: data.limit,
    };
    this.participantsChanged.next(this.participants.slice());
    this.paginateChanged.next(this.paginageConf);
  }

  setOrderer(orderBy: string, sortBy: string) {
    this.orderBy = orderBy;
    this.sortBy = sortBy;
  }

  getTerm() {
    return this.term;
  }

  setTerm(term: string) {
    this.term = term;
    this.termChanged.next(this.term);
  }

  setLimit(limit?: number) {
    this.limit = limit;
  }

  getParticipantListByOpotions(offset?: number, limit?: number) {
    const urlSuffix = this.term ? '/search' : '/list';
    let options = new HttpParams();
    if (offset) {
      options = options.append('offset', offset.toString());
    }
    if (this.limit) {
      options = options.append('ltd', this.limit.toString());
    }
    if (this.sortBy) {
      options = options.append('sortBy', this.sortBy.toString()).append('orderBy', this.orderBy);
    }
    if (this.term) {
      options = options.append('term', this.term);
    }

    return this.httpClient.get(`${this.httpOptions.url}${urlSuffix}`, {
        observe: 'body',
        responseType: 'json',
        params: options
      })
      .subscribe(
          (result) => {
            const data = result['data'];
            this.setParticipants(data);
          }, (err: HttpErrorResponse)  => {
            console.error(err);
          }
      );
  }
}
