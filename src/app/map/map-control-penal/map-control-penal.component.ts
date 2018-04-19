import { Component, OnInit, OnDestroy, ViewChild, ElementRef, Renderer2, EventEmitter, Output } from '@angular/core';
import { NgForm } from '@angular/forms';

import { Subscription } from 'rxjs/Subscription';

import { ParticipantService } from './../../participant-management/participant.service';
import { MapService } from '../map.service';
import { hiddenItemStateTrigger, companyFilterSlideStateTrigger } from './../map.animation';


@Component({
  selector: 'app-map-control-penal',
  templateUrl: './map-control-penal.component.html',
  styleUrls: ['./map-control-penal.component.css'],
  animations: [ hiddenItemStateTrigger, companyFilterSlideStateTrigger ]
})
export class MapControlPenalComponent implements OnInit, OnDestroy {
  private onStartSubscription: Subscription;
  private onStopSubscription: Subscription;
  private onInitiatedSubscription: Subscription;
  private onStoppingSubscription: Subscription;
  private onCompanySelectedSubscription: Subscription;
  private dropdownSubscription: Subscription;
  @ViewChild('penal') private penal: ElementRef;
  @ViewChild('f') termForm: NgForm;
  started: boolean;
  initiated: boolean;
  stopped: boolean;
  stopping: boolean;
  filterInputFocused = false;
  filterFolded = true;
  dropdownFolded = true;
  priorityStatusFilter: number;
  companyFilter: object;
  companyFilterNull = {
    'company_id': null,
    'company_name': 'All Company'
  };

  constructor(private mapService: MapService,
              private render: Renderer2,
              private pmService: ParticipantService) { }

  ngOnInit() {
    this.companyFilter = this.companyFilterNull;
    this.onStartSubscription = this.mapService.started.subscribe(started => this.started = started);
    this.onStopSubscription = this.mapService.stopped.subscribe(stopped => this.stopped = stopped);
    this.onInitiatedSubscription = this.mapService.intiated.subscribe(initiated => this.initiated = initiated);
    this.onStoppingSubscription = this.mapService.stopping.subscribe(stopping => this.stopping = stopping);
    this.onCompanySelectedSubscription = this.pmService.companySelected.subscribe(company => this.companyFilter = company);
    this.dropdownSubscription = this.mapService.dropdownFolded.subscribe(folded => this.dropdownFolded = folded);
  }

  ngOnDestroy() {
    this.onStartSubscription.unsubscribe();
    this.onStopSubscription.unsubscribe();
    this.onInitiatedSubscription.unsubscribe();
    this.onStoppingSubscription.unsubscribe();
    this.onCompanySelectedSubscription.unsubscribe();
    this.dropdownSubscription.unsubscribe();
  }

  onStart() {
    this.mapService.start();
  }

  onStop() {
    this.mapService.stop();
  }

  onFilterInputClick() {
    this.render.setStyle(this.penal.nativeElement, 'height', '115px');
    this.filterFolded = false;
  }

  onFilterFold() {
    this.render.setStyle(this.penal.nativeElement, 'height', '90px');
    this.filterFolded = true;
    this.onInputBlur();
  }

  onSerachByTerm() {
    const term = this.termForm.value.term;
    console.log(term);
    this.pmService.setTerm(term);
    this.pmService.getParticipantListByOptions();
  }

  onInputFocus() {
    this.filterInputFocused = true;
  }

  onInputBlur() {
    this.filterInputFocused = false;
  }

  onDropdownClick(event) {
    this.mapService.onCompanyDropdownFolded(!this.dropdownFolded);
    event.stopPropagation();
  }

  onDropdownRemove(event) {
    this.companyFilter = this.companyFilterNull;
    event.stopPropagation();
  }
}
