import { Subject } from 'rxjs/Subject';
import { EventEmitter, Injectable } from '@angular/core';

import { Tracker } from './tracker.model';
// import { setInterval } from 'timers';
// import { clearInterval } from 'timers';

export class MapService {
    trackerChanges = new Subject<Tracker[]>();
    interval: any;


    private trackers: Tracker[] = [
        new Tracker(1, 10, 10),
        new Tracker(1, 50, 20),
        new Tracker(1, 30, 30),
        new Tracker(1, 30, 40),
        new Tracker(1, 10, 10),
        new Tracker(1, 50, 20),
        new Tracker(1, 30, 30),
        new Tracker(1, 80, 40),
        new Tracker(1, 10, 10),
        new Tracker(1, 40, 60),
        new Tracker(1, 20, 37),
        new Tracker(1, 40, 45),

    ]
    
    private step = [
        [-1, -1], [0, -1],[1, -1],
        [-1, -0],[0, 0], [1, 0],
        [-1, 1], [0, 1], [1, 1]
    ];

    getTrackers() {
        return this.trackers.slice();
    }
    
    getRecipe(id:number) {
        return this.trackers.slice()[id];
    }

    stop() {
        clearInterval(this.interval);
    }

    move() {
        this.interval = setInterval(() => {
            this.trackers.map(tracker => {
                this.dummyMove(tracker);
            });
            console.log('interval0')
            this.trackerChanges.next(this.trackers.slice());
        } ,800)
    }

    dummyMove(tracker: Tracker) {
        let dirc = this.step[Math.floor(Math.random() * 9)];
        tracker.xCrd = tracker.xCrd + dirc[0];
        tracker.yCrd = tracker.yCrd + dirc[1];
        if(tracker.xCrd == 0) 
            tracker.xCrd  = 5;
        if(tracker.xCrd == 97) 
            tracker.xCrd = 92;
        if(tracker.yCrd == 0)  
            tracker.yCrd = 5 ;
        if(tracker.yCrd == 47 )  
            tracker.yCrd = 42;
        return tracker;
    } 

}