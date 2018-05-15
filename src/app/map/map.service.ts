import { EventEmitter, Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';

import { Subject } from 'rxjs/Subject';

import { Tracker } from '../shared/tracker.model';
import { Http } from '@angular/http';

@Injectable()
export class MapService {
    constructor(private httpClient: HttpClient) {}
    // TODO: change name to trackersCrdChanges
    trackerChanges = new Subject<Tracker[]>();
    serviceInterval: any;

    mapInitiated = false;
    mapStarted = false;
    mapStopping = false;
    mapStopped = true;

    started = new EventEmitter<boolean>();
    stopped = new EventEmitter<boolean>();
    stopping = new EventEmitter<boolean>();
    intiated = new EventEmitter<boolean>();
    onStarted = new EventEmitter<boolean>();
    onStopped = new EventEmitter<boolean>();
    dropdownFolded = new EventEmitter<boolean>();

    // TODO restructure the selected Tracker
    selectedTrackerId: number;
    selectedTrackerIndex = new EventEmitter<number>();
    hasSelectedTracker = new Subject<number>();
    hideTrackerIndex = new EventEmitter<number>();

    // TODO those are participants
    private trackers: Tracker[] = [
        new Tracker(1, 1, 1),
        new Tracker(2, 1, 49),
        new Tracker(3, 99, 1),
        new Tracker(4, 99, 49),
        new Tracker(5, 10, 10),
        new Tracker(6, 50, 20),
        new Tracker(7, 30, 30),
        new Tracker(8, 80, 40),
        new Tracker(9, 10, 10),
        new Tracker(10, 42, 34),
        new Tracker(11, 20, 37),
        new Tracker(12, 40, 45),
    ];

    // dummy move
    private step = [
        [-1, -1], [0, -1], [1, -1],
        [-1, -0], [0, 0], [1, 0],
        [-1, 1], [0, 1], [1, 1]
    ];

    start() {
        this.onStarted.emit(this.mapStarted);
    }

    stop() {
        this.onStopped.emit(this.mapStopped);
    }

    resetServiceState() {
        this.mapStopping = true;
        this.stopping.emit(true);
        this.mapStarted = false;
        this.started.emit(false);
        this.mapStopped = true;
        this.stopped.emit(true);
        this.mapInitiated = false;
        this.intiated.emit(false);
    }

    stopService() {
        this.resetServiceState();
        clearInterval(this.serviceInterval);
    }

    getTrackers() {
        return this.trackers.slice();
    }

    getTracker(index: number) {
        return this.trackers.slice()[index];
    }

    move() {
        this.serviceInterval = setInterval(() => {
            this.trackers.map(tracker => {
                this.dummyMove(tracker);
            });
            this.trackerChanges.next(this.trackers.slice());
        }, 800);
    }

    dummyMove(tracker: Tracker) {
        const dirc = this.step[Math.floor(Math.random() * 9)];
        tracker.xCrd = tracker.xCrd + dirc[0];
        tracker.yCrd = tracker.yCrd + dirc[1];

        if (tracker.xCrd === 0) {
            tracker.xCrd  = 5;
        }
        if (tracker.xCrd === 100) {
            tracker.xCrd = 95;
        }
        if (tracker.yCrd === 0) {
            tracker.yCrd = 5 ;
        }
        if (tracker.yCrd === 50 ) {
            tracker.yCrd = 45;
        }
        return tracker;
    }

　　onSelectedTracker(id: number) {
        this.selectedTrackerIndex.emit(id);
    }

    onTrackerHasSelected(id: number) {
        this.hasSelectedTracker.next(id);
    }

    hideTracker(id: number) {
        const newTrackers = this.trackers.map(
            tracker => {
                if (tracker.id === id) {
                    tracker.activated = !tracker.isActivated();
                    console.log('this point activated?' , tracker.isActivated());
                    console.log('this point selected?' , tracker.selected);
                }
                return tracker;
            }
        );
        this.trackers = newTrackers;
        this.trackerChanges.next(this.trackers.slice());
        this.hideTrackerIndex.emit(id);
    }

    updateTrackerInfo(index: number, form: any) {

        // TODO replace this after having backend
        this.trackers[index].alias = form.alias;
        this.trackerChanges.next(this.trackers.slice());
    }

    onCompanyDropdownFolded(folded: boolean) {
        this.dropdownFolded.emit(folded);
    }


    getParticipantListByFilters(filters: object, offset?: number, limit?: number) {
        const participanUrl = 'http://localhost:3000/participant/list/filter';
        const urlSuffix = 'list/filter';
        let options = new HttpParams();
        if (offset) {
          options = options.append('offset', offset.toString());
        }
        // Check participant service if need more condition filter

        return this.httpClient.post(`${participanUrl}`, filters, {
            observe: 'body',
            responseType: 'json',
            params: options
          })
          .subscribe(
              (result) => {
                const data = result['data'];
                this.stop();
                this.changeTrackers(data);
              }, (err: HttpErrorResponse)  => {
                console.error(err);
              }
          );
    }

    changeTrackers(data) {
        // this.stop();
    }
}
