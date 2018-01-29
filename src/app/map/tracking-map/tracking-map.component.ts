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
 

  private base = {width:100, height:50};
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
 
  private initiated = false;
  started = false;

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
    this.mapService.stop();
    this.trackersSubscription.unsubscribe();
    this.removePoint(); 
  }

  onStart() {
    
    if(!this.initiated) {
      this.initiated = true;
      this.trackers = this.mapService.getTrackers();
      this.initiateTrackPoint(this.trackers);
      this.mapService.move();
    }

    if(this.started) {
      this.started = false;
      this.trackersSubscription.unsubscribe();
    }
    else{
      this.started = true;
      this.trackersSubscription = this.mapService.trackerChanges.subscribe(
        (trackers: Tracker[]) => {
          this.trackers = trackers;
          this.movePoint(trackers);
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
    this.svg = d3.select(element).append('svg');
    this.svg.attr('width', element.offsetWidth)
              .attr('height', element.offsetHeight)
              .append('rect')
              .attr('width', element.offsetWidth)
              .attr('height', element.offsetHeight)
              .attr('fill','white')
              .transition()
              .duration(1000)
              .delay(500)
              .attr('fill','darkslategray');
  } 

  initiateTrackPoint(trackers: Tracker[]) {
    let that = this;

    this.trackerPoints = this.svg.selectAll('circle')
      .data(trackers)
      .enter().append('circle')

      this.trackerPoints.attr("class","trackerPoint")
      .attr("cx",function(d) {return that.xScale(d.xCrd)})
      .attr("cy",function(d) {return that.yScale(d.yCrd)})
      .attr('r', 1)
      .on('mouseover',function(d,i){
         let thisPoint= d3.select(this);
         that.onMouseOver(thisPoint);
      })
      .on("mouseout",function(d,i){
        let thisPoint= d3.select(this);
        that.onMouseout(thisPoint);
      })
      .transition()
      .style('fill-opacity',0.7)
      .attr("fill","cyan")
      .duration(700)
      .ease(d3.easeQuadOut)
      .attr('r', 7)
  }

  movePoint(trackers: Tracker[]) {
    console.log(trackers[1].xCrd,trackers[1].yCrd)
    let that = this;
    this.trackerPoints.data(trackers)
    .transition()
    //FIXME
    .duration(1000)
    .ease(d3.easeLinear)
    .attr("cx",function(d) {return that.xScale(d.xCrd)})
    .attr("cy",function(d) {return that.yScale(d.yCrd)})
  }

  removePoint() {
    let trackerPoints = d3.selectAll('.trackerPoint')
    
    trackerPoints.transition()
    .duration(1000)
    .ease(d3.easeLinear)
    .attr('r', 0)
    .remove();
  }
  
   onMouseOver(trackerPoint) {
    let that = this;
    //append text
    // trackerPoint.append('text')
    // .attr('class','crdText')
    // .style('fill', 'white')
    // .attr("x", function(d){
    //   return that.xScale(d.xCrd) - 10
    //    } )
    // .attr("y",function(d){
    //   return that.yScale(d.yCrd) - 10
    // })
    // .text(function(d){
    //   return `(${d.xCrd}, ${d.yCrd})`;
    // })

    trackerPoint.style('fill-opacity',1)
    .transition(500)
    .ease(d3.easeBounceIn)
    .attr('r', 15);
   }

   onMouseout(trackerPoint) {
    trackerPoint
    .style('fill-opacity',0.7)
    .transition(1000)
    .ease(d3.easeQuadIn)
    .attr('r', 7);
   }
  
}
