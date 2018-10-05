import { Participant } from './../shared/participant.model';
import { EventEmitter, Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';

import { Subject } from 'rxjs/Subject';

import { Tracker } from '../shared/tracker.model';
import { SettingService } from './../setting/setting.service';
import { Subscription } from 'rxjs/Subscription';

@Injectable()
export class MapService {
    private httpOptions;

    constructor(private httpClient: HttpClient,
        private settingService: SettingService) {
            this.httpOptions = {
               headers: new HttpHeaders({
                 'Content-Type':  'application/json',
                 'Authorization': 'my-auth-token'
               }),
               participantUrl: () =>  this.settingService.getApis('participant'),
               eventUrl: () => this.settingService.getApis('event'),
             };
     }


    trackerLocChanges = new Subject<Tracker[]>();
    trackerListChanges = new Subject<Tracker[]>();
    serviceInterval: any;

    mapInitiated = false;
    mapStarted = false;
    mapStopping = false;
    mapStopped = true;

    started = new Subject<boolean>();
    stopped = new Subject<boolean>();
    stopping = new Subject<boolean>();
    intiated = new Subject<boolean>();
    onStarted = new Subject<boolean>();
    onStopped = new Subject<boolean>();
    onLoading = new Subject<boolean>();
    onLoaded = new Subject<boolean>();
    dropdownFolded = new Subject<boolean>();

    pageBlur = new Subject<boolean>();
    pageBlurHinted = false;
    windowResized = new Subject<void> ();

    // TODO restructure the selected Tracker
    selectedTrackerId: number;
    selectedTrackerIndex = new Subject<number>();
    hasSelectedTracker = new Subject<number>();
    hideTrackerIndex = new Subject<number>();

    // tracker history local
    trackerLocsReady = new Subject<any> ();
    trackerLocsListener: Subscription;
    trackerLocsSet = [];
    onTest = new EventEmitter<boolean>();

    // TODO those are participants
    private trackers: Tracker[] = [
        new Tracker(1, '', 1, 1, null),
        new Tracker(2, '', 1, 49, null),
        new Tracker(3, '', 99, 1, null),
        new Tracker(4, '', 99, 49, null),
        new Tracker(5, '', 10, 10, null),
        new Tracker(6, '', 50, 20, null),
        new Tracker(7, '', 30, 30, null),
        new Tracker(8, '', 80, 40, null),
        new Tracker(9, '', 10, 10, null),
        new Tracker(10, '', 42, 34, null),
        new Tracker(11, '', 20, 37, null),
        new Tracker(12, '', 40, 45, null),
    ];

    // dummy move
    private step = [
        [-1, -1], [0, -1], [1, -1],
        [-1, -0], [0, 0], [1, 0],
        [-1, 1], [0, 1], [1, 1]
    ];

    start() {
        this.onStarted.next(this.mapStarted);
    }

    stop() {
        if (this.trackerLocsListener) {
            this.trackerLocsListener.unsubscribe();
        }

        this.onStopped.next(this.mapStopped);
    }

    resetServiceState() {
        this.mapStopping = true;
        this.stopping.next(this.mapStopping);
        this.mapStarted = false;
        this.started.next(this.mapStarted);
        this.mapStopped = true;
        this.stopped.next(this.mapStopped);
        this.mapInitiated = false;
        this.intiated.next(this.mapInitiated);
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

    getTrackerTime(index: number) {
        if (this.trackers.slice()[index].time) {
            return this.trackers.slice()[index].time;
        }
        return null;
    }

    move() {
        this.serviceInterval = setInterval(() => {
            this.trackers.map(tracker => {
                this.dummyMove(tracker);
            });
            this.trackerLocChanges.next(this.trackers.slice());
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
        this.selectedTrackerIndex.next(id);
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
        this.trackerLocChanges.next(this.trackers.slice());
        this.hideTrackerIndex.next(id);
    }

    updateTrackerInfo(index: number, form: any) {

        // TODO replace this after having backend
        this.trackers[index].alias = form.alias;
        this.trackerLocChanges.next(this.trackers.slice());
    }

    onCompanyDropdownFolded(folded: boolean) {
        this.dropdownFolded.next(folded);
    }


    getParticipantListByFilters(filters: object, offset?: number, limit?: number) {
        const urlSuffix = 'list/filter';
        let options = new HttpParams();
        if (offset) {
          options = options.append('offset', offset.toString());
        }
        // Check participant service if need more condition filter

        return this.httpClient.post(`${this.httpOptions.participantUrl()}/${urlSuffix}`, filters, {
            observe: 'body',
            responseType: 'json',
            params: options
          })
          .subscribe(
              (result) => {
                // should be some where else
                this.stop();
                const participants = result['data']['participants'];
                // console.log(participants);
                if (participants && participants.length > 0) {
                    this.changeTrackers(participants);
                } else {
                    return false;
                }
              }, (err: HttpErrorResponse)  => {
                console.error(err);
              }
          );
    }

    changeTrackers(participants) {
        const trackers = [];
        participants.forEach((participant, i) => {
          const tracker = new Tracker(i + 1, participant['tag_id'], null, null, new Participant(participant));
          trackers.push(tracker);
          if (i === participants.length - 1) {
            this.trackers = trackers.slice();
            // console.log(this.trackers);
            this.trackerListChanges.next();
          }
        });
    }

    getParticipantLocalsByTime(id: string, begin?: number, end?: number) {
        const urlSuffix = 'tracker/locs';
        // const trackerLocsUrl = 'http://localhost:3000/event/tracker/locs';
        const con = {'begin': begin, 'end': end, 'id': id};
        return this.httpClient.post(`${this.httpOptions.eventUrl()}/${urlSuffix}`, con, {
            observe: 'body',
            responseType: 'json',
          })
          .subscribe(
              (result) => {
                const data = result['data'];
                this.trackerLocsReady.next(data);
              }, (err: HttpErrorResponse)  => {
                console.error(err);
              }
          );
    }

    getLastActiveTrackers() {
        const urlSuffix = 'tracker/lastActive';
        // const trackerUrl = 'http://localhost:3000/event/tracker/lastActive';
        const limit = 15;
        return this.httpClient.get(`${this.httpOptions.eventUrl()}/${urlSuffix}`, {
            observe: 'body',
            responseType: 'json',
          })
          .subscribe(
              (result) => {
                const participants = result['data']['trackers'];
                if (participants && participants.length > 0) {
                    this.stop();
                    this.changeTrackers(participants);
                } else {
                    this.onLoaded.next(false);
                }
              }, (err: HttpErrorResponse)  => {
                console.error(err);
              }
          );
    }

    testLocal() {
        // map particiapnt id, pass the id
        this.getLastActiveTrackers();
        this.onLoading.next(true);
        const listChangeSub = this.trackerListChanges.subscribe(() => {
            listChangeSub.unsubscribe();
            const customer_ids =  this.trackers.map(tracker => tracker.tagId);
            customer_ids.map(id => {
                this.getParticipantLocalsByTime(id);
            });
            let customer_ids_index = 1;
            this.trackerLocsListener = this.trackerLocsReady.subscribe(data => {
                this.trackers.forEach(trac => {
                    if (trac.tagId === data[0].customer_id) {
                        trac.setCrd(data[0].loc_x/20*95, data[0].loc_y/17*45);
                        trac.setLocs(data, 0);
                        if (customer_ids_index === customer_ids.length) {
                            this.trackerLocsListener.unsubscribe();
                            this.trackerListChanges.next();
                            this.onLoaded.next(true);
                            this.onTest.next(this.mapStarted);
                         } else {
                           customer_ids_index++;
                         }
                    }
                });
                // const tracker = new Tracker(customer_ids_index, data[0].customer_id, data[0].loc_x/20*95, data[0].loc_y/17*45)
                // tracker.setLocs(data, 0);
                // tracker.setCrd(tracker.locs[0].loc_x / 20 * 95, tracker.locs[0].loc_y / 17 * 45);
                // this.trackers.push(tracker);
                // if (customer_ids_index === customer_ids.length) {
                //    this.trackerListChanges.next();
                //    this.onTest.next(this.mapStarted);
                // } else {
                //   customer_ids_index++;
                // }
            });
        });
    }

    testMove() {
        clearInterval(this.serviceInterval);
        this.serviceInterval = setInterval(() => {
            this.trackers.map(tracker => {
                this.testMoveHis(tracker);
            });
            this.trackerLocChanges.next(this.trackers.slice());
        }, 800);
    }

    testMoveHis(tracker: Tracker) {
        const nextLocIndex = tracker.currentLoc < tracker.locs.length ? tracker.currentLoc + 1 : 0;
        const nextLoc = tracker.locs[nextLocIndex];
        tracker.currentLoc = nextLocIndex;
        tracker.setCrd(nextLoc.loc_x / 20 * 95, nextLoc.loc_y / 17 * 45);
        tracker.setTime(nextLoc.time * 1000);
        // this.trackerLocChanges.next(this.trackers.slice());
    }

    onChangeTrackerColor(id: number, color: string) {
        this.trackers[id - 1].setColor(color);
        this.trackerLocChanges.next(this.trackers.slice());
    }

    onLeavePage() {
        if (!this.pageBlurHinted) {
            this.pageBlur.next();
            this.pageBlurHinted = true;
        }
    }

    onWindowResize() {
        this.windowResized.next();
    }
}
