import { Component, Input, ViewChild, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import * as d3 from 'd3';

import { MapService } from './../map.service';
import { Tracker } from './../../shared/tracker.model';

@Component({
  selector: 'app-tracking-map',
  templateUrl: './tracking-map.component.html',
  styleUrls: ['./tracking-map.component.css']
})
export class TrackingMapComponent implements OnInit, OnDestroy {
  @ViewChild('trackingMap') private chartContainer: ElementRef;
  private trackers: Tracker[];
  private trackersSubscription: Subscription;
  private onSelectedSubscription: Subscription;
  private onHidedSubscription: Subscription;
  private onStartSubscription: Subscription;
  private onStopSubscription: Subscription;

  private base = {width: 100, height: 50};
  private margin: any = { top: 20, bottom: 20, left: 20, right: 20};
  private padding = {left: 30, right: 30, top: 20, bottom: 20};

  private chart: any;
  private svg: any;
  private trackerPoints: any;
  private trackerInfoG: any;
  private width: number;
  private height: number;
  private xScale: any;
  private yScale: any;
  private colors: any;
  private xAxis: any;
  private yAxis: any;
  private trackerInfoWidth = 100;
  private trackerInfoHeight = 30;

  private selectedPoint;

  constructor(private mapService: MapService) { }

  ngOnInit() {
    this.createBase();
    this.onStartSubscription = this.mapService.onStarted.subscribe(() => this.onStart());
    this.onStopSubscription = this.mapService.onStopped.subscribe(() => this.onStop());
  }

  ngOnDestroy() {
    this.onStop();
    this.onStartSubscription.unsubscribe();
    this.onStopSubscription.unsubscribe();
  }

  onStop() {
    this.mapService.stopService();
    if (this.trackersSubscription) {
      this.trackersSubscription.unsubscribe();
    }
    if (this.onSelectedSubscription) {
      this.onSelectedSubscription.unsubscribe();
    }
    if (this.onHidedSubscription) {
      this.onHidedSubscription.unsubscribe();
    }

    this.removeTrackerInfo();
    this.removePoint();
  }

  onStart() {
    this.mapService.mapStopped = false;
    this.mapService.stopped.emit(false);
    if (!this.mapService.mapInitiated) {
      this.mapService.mapInitiated = true;
      this.mapService.intiated.emit(true);
      this.trackers = this.mapService.getTrackers();
      this.initiateTrackPoint(this.trackers);
      this.mapService.move();
      // setInterval(() => {
      //   //console.log('DEBUG this', this.trackers[7]);
      // }, 800);
    }

    if (this.mapService.mapStarted) {
      this.mapService.mapStarted = false;
      this.mapService.started.emit(false);
      this.trackersSubscription.unsubscribe();
    } else {
      this.mapService.mapStarted = true;
      this.mapService.started.emit(true);
      this.trackersSubscription = this.mapService.trackerChanges.subscribe(
        (trackers: Tracker[]) => {
          this.trackers = trackers;
          this.refreshTrackers();       // FIXME;
          this.movePoint(this.trackers);
        }
      );
    }
    this.onSelectedSubscription = this.mapService.selectedTrackerIndex.subscribe(
      id => this.onPointSelected(id)
    );
    this.onHidedSubscription = this.mapService.hideTrackerIndex.subscribe(
    id => this.onPointHided(id)
  );
  }

  createBase() {
    const element = this.chartContainer.nativeElement;
    this.width = element.offsetWidth - this.margin.left - this.margin.right;
    this.height = element.offsetHeight - this.margin.top - this.margin.bottom;
    this.xScale = d3.scaleLinear()
              .domain([0, this.base.width])
              .range([0, element.offsetWidth - this.padding.left - this.padding.right]);
    this.yScale = d3.scaleLinear()
              .domain([0, this.base.height])
              .range([0, element.offsetHeight - this.padding.top - this.padding.bottom]);
    d3.select(element).append('svg');
    this.svg = d3.select('svg');
    this.svg.attr('width', element.offsetWidth)
              .attr('height', element.offsetHeight)
              .append('rect')
              .attr('class', 'trackerMapBase')
              .attr('width', element.offsetWidth)
              .attr('height', element.offsetHeight)
              // .style('stroke', 'cadetblue')
              // .style('stroke-width', 5)
              .attr('fill', 'white')
              .transition()
              .duration(1000)
              .delay(500)
              .attr('fill', 'darkslategray');

    this.svg.on('click', () => this.diselecPoint());
  }

  initiateTrackPoint(trackers: Tracker[]) {
    const that = this;

    this.trackerPoints = this.svg.selectAll('g')
      .data(trackers)
      .enter().append('circle');

    this.trackerPoints.on('mouseover', function(d, i) {
        if (that.mapService.mapStopped) {
          return false;
        }
       const thisPoint = d3.select(this);
       that.onMouseOver(thisPoint);
    })
    .on('mouseout', function(d, i) {
      if (that.mapService.mapStopped) {
        return false;
      }

      const thisPoint = d3.select(this);
      if (thisPoint.datum().selected) {
        return false;
      } else {
        that.onMouseout(thisPoint);
      }
    })
    .on('click', function() {
      if (that.mapService.mapStopped) {
        return false;
      }

      if (!d3.select(this).datum().isActivated()) {
        return false;
      }

      that.selectedPoint = d3.select(this);
      that.onMouseClick();
    });

    this.trackerPoints.attr('class', 'trackerPoint')
      .attr('cx', d => this.xScale(d.xCrd) + this.padding.left)
      .attr('cy', d => this.yScale(d.yCrd)  + this.padding.top)
      .style('cursor', 'pointer')
      .transition()
      .duration(700)
      .ease(d3.easeQuadOut)
      .attr('r', d => d.isActivated() ? 7 : 0)
      .style('fill-opacity', 0.7)
      .style('fill', 'deepskyblue')
      .style('stroke', 'white')
      .style('stroke-opacity', 0.5)
      .style('stroke-width', 2);
  }

  movePoint(trackers: Tracker[]) {
    // console.log(trackers[1].xCrd, trackers[1].yCrd);
    this.trackerPoints.data(trackers)
    .transition()
    .duration(1000)
    .ease(d3.easeLinear)
    .attr('cx', d => this.xScale(d.xCrd)  + this.padding.left)
    .attr('cy', d => this.yScale(d.yCrd) + this.padding.top);

    if (this.trackerInfoG && this.selectedPoint) {
      const x = this.selectedPoint.datum().xCrd;
      const y = this.selectedPoint.datum().yCrd;
      this.trackerInfoG.select('.trackerInfoText').text(d => `ID: ${d.id} (${x}, ${y})`);
      this.trackerInfoG
      // .datum(this.selectedPoint.datum())
       .transition()
         .duration(1000)
         .attr('transform', d => `translate(${this.xScale(x - d.xCrd)}, ${this.yScale(y - d.yCrd)} )`);
    }
  }

  removePoint() {
    const trackerPoints = d3.selectAll('.trackerPoint');
    trackerPoints.transition(700)
    .ease(d3.easeLinear)
    .attr('r', 0);

    // TODO: replace this with Async state condition
    setTimeout(() => {
      trackerPoints.remove();
      this.mapService.mapStopping = false;
      this.mapService.stopping.emit(false);
    }, 800);
  }

   onMouseOver(trackerPoint) {
    trackerPoint
    .transition(500)
    .ease(d3.easeQuadIn)
    .style('fill-opacity', 1)
    .attr('r', 12)
    .style('stroke-opacity', 1)
    .style('stroke-width', 5);
   }

   onMouseout(trackerPoint) {
    trackerPoint
    .style('fill-opacity', 0.7)
    .transition(1000)
    .ease(d3.easeQuadIn)
    .attr('r', 7)
    .style('stroke-opacity', 0.5)
    .style('stroke-width', 2);
   }

   onMouseClick() {
    console.log(this.selectedPoint.datum());
     this.selectedPoint.datum().selected = true;
     this.mapService.onTrackerHasSelected(this.selectedPoint.datum().id);
     this.onMouseOver(this.selectedPoint);
      // TODO: delete this condition, when deep copy complete
     if (this.trackerInfoG && this.selectedPoint && this.trackerInfoG.datum().id !== this.selectedPoint.datum().id) {
        this.removeTrackerInfo();
     }

     this.diselectOtherPoints();
     this.attachRect();
     if (d3.event) {
      d3.event.stopPropagation();
     }
   }

   diselecPoint() {
      if (this.selectedPoint) {
        this.removeTrackerInfo();
        if (this.selectedPoint.datum().isActivated()) {
          this.onMouseout(this.selectedPoint);
        }
        this.selectedPoint.datum().selected = false;
        this.selectedPoint = null;
        this.mapService.onTrackerHasSelected(null);
      }
   }

   diselectOtherPoints() {
      const otherSelectedElements = d3.selectAll('svg circle')
        .filter(d => this.selectedPoint.datum() !== d && d.selected === true && d.isActivated());
      if (otherSelectedElements.data().length) {
          otherSelectedElements.data().map(point => point.selected = false);
          this.onMouseout(otherSelectedElements);
      }
   }

   hidePoint(selectPoint) {
    selectPoint.transition(1000)
       .ease(d3.easeLinear)
       .attr('r', 0)
       .style('fill-opacity', 0.7)
       .style('stroke-width', 2);
   }

   attachRect() {
    // TODO: delete this condition, when deep copy complete
    if (this.trackerInfoG) {
      return false;
    }

    const that = this;
    this.trackerInfoG = this.svg.insert('g')
        .attr('class', 'trackerInfo')
        .datum(JSON.parse(JSON.stringify(this.selectedPoint.datum())));

    this.trackerInfoG.insert('rect')
        .attr('class', 'trackerInfoRect')
        .style('fill', 'dodgerblue')
        .style('fill-opacity', 0.4)
        .attr('width', this.trackerInfoWidth)
        .attr('height', this.trackerInfoHeight)
        .attr('x', d => this.xScale(d.xCrd) - this.trackerInfoWidth / 2 + this.padding.left)
        .attr('y', d => this.yScale(d.yCrd) - this.trackerInfoHeight * 2 + 10 + this.padding.top)
        .attr('rx', 5)
        .attr('ry', 5);
    this.trackerInfoG.insert('text')
        .attr('class', 'trackerInfoText')
        .text(d => `ID: ${d.id} (${d.xCrd}, ${d.yCrd})`)
        .style('text-anchor', 'middle')
        .attr('fill', 'white')
        .attr('font-weight', 'bolder')
        .attr('x', d => this.xScale(d.xCrd) + this.padding.left)
        .attr('y', d => this.yScale(d.yCrd) - this.trackerInfoHeight + this.padding.top);
      }

   removeTrackerInfo() {
      this.svg.select('.trackerInfo').remove();
      this.trackerInfoG = null;
   }

   onPointSelected(id: number) {
      if (!this.mapService.mapInitiated) {
          return false;
      }

      const point = this.trackerPoints.filter(
         d => d.id === id && d.isActivated()
      );

      if (point.empty()) {
          return false;
      } else {
        this.selectedPoint = point;
        this.onMouseClick();
      }
   }

   onPointHided(id: number) {
      if (!this.mapService.mapInitiated) {
          return false;
      }

      const point = this.trackerPoints.filter(
          d => d.id === id
      );

      if (this.trackerInfoG && this.trackerInfoG.datum().id === id) {
          // this.selectedPoint = null;
          this.removeTrackerInfo();
      }
      // console.log('isActivated', this.selectedPoint.datum().isActivated());
      // console.log('isSelected', this.selectedPoint.datum().selected);
      if (!point.datum().isActivated()) {
         this.hidePoint(point);
      } else if (this.selectedPoint && point.datum().id === this.selectedPoint.datum().id) {
         this.onMouseClick();
      } else {
        this.onMouseout(point);
      }
      // point.datum().isActivated() ? this.onMouseout(point) : this.hidePoint(point);
 }

  refreshTrackers() {
     this.trackerPoints.data(this.trackers);
    //  const point = this.trackerPoints
    // .filter(d => !d.activated)

    //  if(point.empty()) {
    //    return;
    //  }
    //  console.log(this.trackerInfoG );

    // if (this.trackerInfoG && this.trackerInfoG.datum().id === point.data()[0].id) {

    //   this.selectedPoint = null;
    //   this.removeTrackerInfo();
    // }

    //  point.transition(700)
    //    .ease(d3.easeLinear)
    //    .attr('r', 0);

  }
}
