import { Injectable, EventEmitter } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';

import { Subject } from 'rxjs/Subject';

import { Participant } from './../shared/participant.model';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';

@Injectable()
export class ParticipantService {
  participantsChanged = new Subject<Participant[]>();
  participantChanged  = new Subject<Participant>();
  paginateChanged = new Subject<object>();
  termChanged = new Subject<string>();
  orderChanged = new Subject();

  private participant: Participant;
  private participants: Participant[];
  private paginageConf: object;
  private sortBy: string;
  private orderBy: string;
  private limit: number;
  private term: string;
  private resultCode: number;

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization': 'my-auth-token'
    }),
    url: 'http://localhost:3000/participant',

    // url: 'http://192.168.0.108:3000/participant'
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

  getCode() {
    return this.resultCode;
  }

  setTerm(term: string) {
    this.term = term;
    this.termChanged.next(this.term);
  }

  setLimit(limit?: number) {
    this.limit = limit;
  }

  addParticipant(participant: Participant) {
    const urlSuffix = '/new';
    return this.httpClient.post(`${this.httpOptions.url}${urlSuffix}`, participant, {
      observe: 'body',
      responseType: 'json'
    });
  }

  getParticipantById(participantId: number) {
    if (this.participants && this.participants.filter(item => item.participantId === participantId)[0]) {
      this.participant = this.participants.filter(item => item.participantId === participantId)[0];
      this.participantChanged.next(this.participant);
    } else {
      return this.httpClient.get(`${this.httpOptions.url}/${participantId}`, {
        observe: 'body',
        responseType: 'json',
      }).subscribe(
        data => {
          this.participant = new Participant(data['data']);
          this.participantChanged.next(this.participant);
        },
        error => this.handleError(error));
    }
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

  handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {

      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error['code']}, ` +
        `body was: ${error.message}`);
    }
    // return an ErrorObservable with a user-facing error message
    return new ErrorObservable(
      'Something bad happened; please try again later.');
  }

  deleteParticipantById(participantId: number) {
    if (!participantId) {
      return;
    }

    return this.httpClient.delete(`${this.httpOptions.url}/${participantId}`, {
      observe: 'body',
      responseType: 'json'
    }).subscribe(
      (result) => {
        const code = result['code'];
        if (code === 0) {
          this.getParticipantListByOpotions();
        }
      }, (err: HttpErrorResponse)  => {
        console.error(err);
      }
  );
  }

  updateParticipantById(participantId: number, patch: Object) {
    if (!participantId) {
      return;
    }
    return this.httpClient.patch(`${this.httpOptions.url}/${participantId}`, patch, {
      observe: 'body',
      responseType: 'json'
    });
  }

  getTracker(term: string) {
    if (!term) {
      return;
    }
    let options = new HttpParams();
    options = options.append('key', term.trim());
    return this.httpClient.get(`http://localhost:3000/event/trackers/search`, {
      observe: 'body',
      responseType: 'json',
      params: options
    });
  }

  isTrackerValid(tracker_id: string) {
    let options = new HttpParams();
    options = options.append('id', tracker_id.trim());
    return this.httpClient.get(`http://localhost:3000/event/trackers/valid`, {
      observe: 'body',
      responseType: 'json',
      params: options
    });
  }
}
