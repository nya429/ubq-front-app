import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { MapService } from '../map.service';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';

@Component({
  selector: 'app-map-control-penal',
  templateUrl: './map-control-penal.component.html',
  styleUrls: ['./map-control-penal.component.css']
})
export class MapControlPenalComponent implements OnInit, OnDestroy {
  private onStartSubscription: Subscription;
  private onStopSubscription: Subscription;
  private onInitiatedSubscription: Subscription;
  private onStoppingSubscription: Subscription;

  started: boolean;
  initiated: boolean;
  stopped: boolean;
  stopping: boolean;

  constructor(private mapService: MapService) { }

  ngOnInit() {
    this.onStartSubscription = this.mapService.started.subscribe(started => this.started = started);
    this.onStopSubscription = this.mapService.stopped.subscribe(stopped => this.stopped = stopped);
    this.onInitiatedSubscription = this.mapService.intiated.subscribe(initiated => this.initiated = initiated);
    this.onStoppingSubscription = this.mapService.stopping.subscribe(stopping => this.stopping = stopping);
  }

  ngOnDestroy() {
    this.onStartSubscription.unsubscribe();
    this.onStopSubscription.unsubscribe();
    this.onInitiatedSubscription.unsubscribe();
    this.onStoppingSubscription.unsubscribe();
  }

  onStart() {
    this.mapService.start();
  }

  onStop() {
    this.mapService.stop();
  }
}
