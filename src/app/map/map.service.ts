import { Subject } from 'rxjs/Subject';
import { EventEmitter, Injectable } from '@angular/core';

import { Tracker } from '../shared/tracker.model';
// import { setInterval } from 'timers';
// import { clearInterval } from 'timers';

export class MapService {
    constructor() {
        // setInterval(
        //     () => {
        //         console.log('this.mapInitiated', this.mapInitiated);
        //         console.log('this.mapStarted', this.mapStarted);
        //         console.log('this.mapStopping', this.mapStopping);
        //         console.log('this.mapStopped', this.mapStopped);
        //         console.log(this.trackers[0].xCrd);
        //     }, 2000
        // );
    }
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

    selectedTrackerIndex = new EventEmitter<number>();
    hasSelectedTracker = new Subject<number>();
    hideTrackerIndex = new EventEmitter<number>();

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

    getTracker(id: number) {
        return this.trackers.slice()[id];
    }

    move() {
        this.serviceInterval = setInterval(() => {
            this.trackers.map(tracker => {
                this.dummyMove(tracker);
            });
            // console.log(this.trackers[7]);
            // console.log('DEBUG: interval0');
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
        // console.log(this.trackers)
    }
}
