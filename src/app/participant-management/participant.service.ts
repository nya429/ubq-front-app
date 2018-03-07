
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
      page: data.page,
      limit: data.limit,
    };
    this.participantsChanged.next(this.participants.slice());
    this.paginateChanged.next(this.paginageConf);
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
}
