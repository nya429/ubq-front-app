
import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';

import { Subject } from 'rxjs/Subject';

import { Participant } from './../shared/participant.model';

@Injectable()
export class ParticipantService {
  participantsChanged = new Subject<Participant[]>();
  paginateChanged = new Subject<object>();
  private participants: Participant[];
  private paginageConf: object;
  private sortBy: string;
  private orderBy: string;
  private keyword: string;

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization': 'my-auth-token'
    }),
    url: 'http://localhost:3000/participant'
  };

  constructor(private httpClient: HttpClient) {}

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

  getParticipantList() {
    return this.httpClient.get(`${this.httpOptions.url}/list`, {
        observe: 'body',
        responseType: 'json'
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

  getParticipantListByOpotions(offset?: number, limit?: number) {
    let options = new HttpParams();
    if (offset) {
      options = options.append('offset', offset.toString());
    }
    if (limit) {
      options = options.append('ltd', limit.toString());
    }
    if (this.sortBy) {
      options = options.append('sortBy', this.sortBy.toString()).append('orderBy', this.orderBy);
    }

    return this.httpClient.get(`${this.httpOptions.url}/list`, {
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
