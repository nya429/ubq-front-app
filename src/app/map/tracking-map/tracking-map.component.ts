import { Component, Input, ViewChild, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import * as d3 from 'd3';

import { MapService } from './../map.service';
import { Tracker } from './../tracker.model';

@Component({
  selector: 'app-tracking-map',
  templateUrl: './tracking-map.component.html',
  styleUrls: ['./tracking-map.component.css']
})
export class TrackingMapComponent implements OnInit, OnDestroy {
  @ViewChild('chart') private chartContainer: ElementRef;
  private trackers: Tracker[];
  private trackersSubscription: Subscription;


  private base = {width: 100, height: 50};
  private margin: any = { top: 20, bottom: 20, left: 20, right: 20};
  private padding = {left: 30, right: 30, top: 20, bottom: 20};

  private chart: any;
  private svg: any;
  private trackerPoints: any;

  private width: number;
  private height: number;
  private xScale: any;
  private yScale: any;
  private colors: any;
  private xAxis: any;
  private yAxis: any;
  private trackerInfoWidth = 100;
  private trackerInfoHeight = 30;


  private initiated = false;
  stoped = true;
  started = false;
  private selectedPoint;

  constructor(private mapService: MapService) { }

  ngOnInit() {
    this.createBase();
  }

  ngOnDestroy() {
    this.onStop();
  }

  onStop() {
    this.started = false;
    this.initiated = false;
    if (this.trackersSubscription) {
      this.trackersSubscription.unsubscribe();
    }
    this.removeTrackerInfo();
    this.mapService.stop();
    this.removePoint();
  }

  onStart() {
    this.stoped = false;
    if (!this.initiated) {
      this.initiated = true;
      this.trackers = this.mapService.getTrackers();
      this.initiateTrackPoint(this.trackers);
      this.mapService.move();
      setInterval(() => {
        console.log('this]', this.trackers[7]);
      }, 800);
    }

    if (this.started) {
      this.started = false;
      this.trackersSubscription.unsubscribe();
    } else {
      this.started = true;
      this.trackersSubscription = this.mapService.trackerChanges.subscribe(
        (trackers: Tracker[]) => {
          this.trackers = trackers;       // FIXME;
          this.movePoint(this.trackers);
        }
      );
    }
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
        if (that.stoped) {
          return false;
        }
       const thisPoint = d3.select(this);
       that.onMouseOver(thisPoint);
    })
    .on('mouseout', function(d, i) {
      if (that.stoped) {
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
      if (that.stoped) {
        return false;
      }
      that.selectedPoint = d3.select(this);
      that.onMouseClick();
    });

    this.trackerPoints.attr('class', 'trackerPoint')
      .attr('cx', d => this.xScale(d.xCrd))
      .attr('cy', d => this.yScale(d.yCrd))
      .attr('r', 1)
      .style('cursor', 'pointer')
      .transition()
      .style('fill-opacity', 0.7)
      .attr('fill', 'cyan')
      .attr('stroke', 'white')
      .style('stroke-opacity', 0.5)
      .style('stroke-width', 2)
      .duration(700)
      .ease(d3.easeQuadOut)
      .attr('r', 7);
  }

  movePoint(trackers: Tracker[]) {
    // console.log(trackers[1].xCrd, trackers[1].yCrd);
    this.trackerPoints.data(trackers)
    .transition()
    .duration(1000)
    .ease(d3.easeLinear)
    .attr("cx", d => this.xScale(d.xCrd))
    .attr("cy", d => this.yScale(d.yCrd));

    if (!this.svg.select('.trackerInfo').empty() && this.selectedPoint) {
      const x = this.selectedPoint.datum().xCrd;
      const y = this.selectedPoint.datum().yCrd;
      this.svg.select('.trackerInfoText').text(d => `ID: ${d.id} (${x}, ${y})`);
      this.svg.select('.trackerInfo')
      // .datum(this.selectedPoint.datum())
       .transition()
         .duration(1000)
         .attr('transform', d => `translate(${this.xScale(x - d.xCrd)}, ${this.yScale(y - d.yCrd)} )`);
    }
  }

  removePoint() {
    let trackerPoints = d3.selectAll('.trackerPoint');

    trackerPoints.transition(700)
    .ease(d3.easeLinear)
    .attr('r', 0)
    .remove();
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
    //  console.log(d3.event.pageX, d3.event.pageY);
     this.selectedPoint.datum().selected = true;
     this.onMouseOver(this.selectedPoint);
     this.removeTrackerInfo();
     this.diselectOtherPoints();
     this.attachRect();
     d3.event.stopPropagation();
   }

   diselecPoint() {
      if (this.selectedPoint) {
        this.removeTrackerInfo();
        this.onMouseout(this.selectedPoint);
        this.selectedPoint.datum().selected = false;
        this.selectedPoint = null;
      }
   }

   diselectOtherPoints() {
    
    let otherSelectedElements = d3.selectAll('svg circle')
    .filter(d => this.selectedPoint.datum() !== d && d.selected === true);
    if (otherSelectedElements.data().length) {
       otherSelectedElements.data().map(point => point.selected = false);
       this.onMouseout(otherSelectedElements);
    }
   }
   
   // TODO: 1 prevent attach on same point

   attachRect() {
    const that = this;
 console.log(this.selectedPoint.datum());
    const rectGroup = this.svg.insert('g')
        .attr('class', 'trackerInfo')
        .datum(JSON.parse(JSON.stringify(this.selectedPoint.datum())));

    rectGroup.insert('rect')
        .attr('class', 'trackerInfoRect')
        .style('fill', 'dodgerblue')
        .style('stroke', 'white')
        .style('fill-opacity', 0.4)
        .attr('width', this.trackerInfoWidth)
        .attr('height', this.trackerInfoHeight)
        .attr('x', d => this.xScale(d.xCrd) - this.trackerInfoWidth / 2)
        .attr('y', d => this.yScale(d.yCrd) - this.trackerInfoHeight * 2 + 10)
        .attr('rx', 5)
        .attr('ry', 5);
    rectGroup.insert('text')
        .attr('class', 'trackerInfoText')
        .text(d => `ID: ${d.id} (${d.xCrd}, ${d.yCrd})`)
        .style("text-anchor", "middle")
        .attr('fill', 'white')
        .attr('x', d => this.xScale(d.xCrd))
        .attr('y', d => this.yScale(d.yCrd) - this.trackerInfoHeight);
   }

   removeTrackerInfo() {
      this.svg.select('.trackerInfo').remove();
   }
}
