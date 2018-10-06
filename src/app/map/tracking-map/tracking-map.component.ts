import { SettingService } from './../../setting/setting.service';
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
  private trackersChangeSubscription: Subscription;
  private onSelectedSubscription: Subscription;
  private onHidedSubscription: Subscription;
  private onStartSubscription: Subscription;
  private onStopSubscription: Subscription;
  private onTestSubscription: Subscription;
  private popupSubscription: Subscription;
  private loadingStatusSubscription: Subscription;
  private windowResizeSubscription: Subscription;

  private base = {width: 100, height: 50};
  private margin: any = { top: 0, bottom: 0, left: 0, right: 0};
  private padding = {left: 30, right: 30, top: 20, bottom: 20};

  private chart: any;
  private svg: any;
  private rect: any;

  /** Container Dimision*/
  private divWidth: number;
  private divHeight: number;
  /** SVG dimension */
  private width: number;
  private height: number;
  /** MapScale */
  private xScale: any;
  private yScale: any;
  /** trackerPoint */
  private trackerPoints: any;
  private trackerInfoG: any;
  private trackerInfoWidth = 150;
  private trackerInfoHeight = 30;
  private selectedPoint;
   /** Popup */
  private mapPopup: any;
  private popupWidth = 250;
  private popupHeight = 150;
  /** not used */
  private colors: any;
  private xAxis: any;
  private yAxis: any;

  constructor(private mapService: MapService,
    private settingService: SettingService) { }

  ngOnInit() {
    this.getMapSettings();
    this.createBase();
    this.onStartSubscription = this.mapService.onStarted.subscribe(() => this.onStart());
    this.onStopSubscription = this.mapService.onStopped.subscribe(() => this.onStop());
    this.onTestSubscription = this.mapService.onTest.subscribe(() => this.onTest());
    this.popupSubscription = this.mapService.onLoading.subscribe(() => {
      this.onPopup('Loading...');
    });
    // TODO Check rxjs
    this.loadingStatusSubscription = this.mapService.onLoaded.subscribe(status => {
      if (status) {
        this.onPopupFade(false);
      } else {
        this.onPopup('Loading Failed');
        this.onPopupFade(true);
      }
    });
    this.windowResizeSubscription = this.mapService.windowResized.subscribe(() => this.mapResize());
  }

  ngOnDestroy() {
    this.onStop();
    this.onStartSubscription.unsubscribe();
    this.onStopSubscription.unsubscribe();
    this.onTestSubscription.unsubscribe();
    this.popupSubscription.unsubscribe();
    this.loadingStatusSubscription.unsubscribe();
    this.windowResizeSubscription.unsubscribe();
  }

  onStop() {
    if (this.mapService.mapStarted) {
      this.onPopup('Map Stopped');
      this.onPopupFade(true);
    }
    this.mapService.stopService();
    if (this.trackersChangeSubscription) {
      this.trackersChangeSubscription.unsubscribe();
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
    this.mapService.stopped.next(false);
    if (!this.mapService.mapInitiated) {
      this.mapService.mapInitiated = true;
      this.mapService.intiated.next(true);
      this.trackers = this.mapService.getTrackers();
      this.initiateTrackPoint(this.trackers);
      this.mapService.move();
    }

    if (this.mapService.mapStarted) {
      this.mapService.mapStarted = false;
      this.mapService.started.next(false);
      this.trackersChangeSubscription.unsubscribe();
    } else {
      this.mapService.mapStarted = true;
      this.mapService.started.next(true);
      this.trackersChangeSubscription = this.mapService.trackerLocChanges.subscribe(
        (trackers: Tracker[]) => {
          // console.log(this.trackers[0].xCrd);
          this.trackers = trackers;
          this.refreshTrackers();       // FIXME solove muttable copy issue;
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

  onTest() {
    this.mapService.mapStopped = false;
    this.mapService.stopped.next(false);
    if (!this.mapService.mapInitiated) {
      this.mapService.mapInitiated = true;
      this.mapService.intiated.next(true);
      this.trackers = this.mapService.getTrackers();
      this.initiateTrackPoint(this.trackers);
      this.mapService.testMove();
    }
    if (this.mapService.mapStarted) {
      this.mapService.mapStarted = false;
      this.mapService.started.next(false);
      this.trackersChangeSubscription.unsubscribe();
    } else {
      this.mapService.mapStarted = true;
      this.mapService.started.next(true);
      this.trackersChangeSubscription = this.mapService.trackerLocChanges.subscribe(
        (trackers: Tracker[]) => {
          this.trackers = trackers;
          this.refreshTrackers();       // FIXME solove muttable copy issue;
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

  getMapSettings() {
    this.base = this.settingService.getMapSettingBase();
  }
  
  createBase() {
    const element = this.chartContainer.nativeElement;
    this.getContainerDimension(element)
    this.getSVGDimension();
    this.initMapScale();
    this.appendSVG(element);
    this.sizeSVG();
    this.appendRect();
    this.appendMapBackgroundImg();
    this.attachPopup();

    this.svg.on('click', () => this.diselecPoint());     //  Add trackerPoint Info ouside click dismiss
  }

  getContainerDimension(element) {
    this.divWidth = element.offsetWidth;
    this.divHeight = element.offsetHeight
  }

  getSVGDimension() {
    this.width = this.divWidth - this.margin.left - this.margin.right;
    this.height = this.divHeight - this.margin.top - this.margin.bottom;
  }

  initMapScale() {
    this.xScale = d3.scaleLinear()
      .domain([0, this.base.width])
      .range([0, this.width - 280 - this.padding.left - this.padding.right]);
    this.yScale = d3.scaleLinear()
      .domain([0, this.base.height])
      .range([0, this.height - this.padding.top - this.padding.bottom]);
  }

  appendSVG(element) {
    d3.select(element).append('svg');
    this.svg = d3.select('svg');
  }

  /**   SVG  dimension  */
  sizeSVG() {
    this.svg
      .attr('width', this.width)
      .attr('height', this.height)
  }

  /**   RECT  dimension  */
  appendRect() {
    this.svg.append('rect')
    this.rect = d3.select('rect');

    this.rect
      .attr('class', 'trackerMapBase')
      /** this is the place probably I want to use this.width -margin.top and this height  */
      .attr('width', this.width)
      .attr('height', this.height)
      /* -------------------------------------*/
      // .style('stroke', 'cadetblue')
      // .style('stroke-width', 5)
      .attr('fill', 'white')
      .transition()
      .duration(1000)
      .attr('fill', 'darkslategray');
  }

  sizeRect() {
    this.rect
    .attr('width', this.width)
    .attr('height', this.height);
  }



  appendMapBackgroundImg() {
    const imgs = this.svg.selectAll('svg').data([0]);
    imgs.enter()
      .append('svg:image')
      .attr('xlink:href', '../../../assets/store_floorplan.svg')
      .attr('x', -1270)
      .attr('y', -310)
      .attr('width', this.width * 4)
      .attr('height', this.height * 2)
      .attr('opacity', 0)
      .transition()
      .duration(1000)
      .delay(500)
      .attr('opacity', .6);
  
  }

  initiateTrackPoint(trackers: Tracker[]) {
    const that = this;

    this.trackerPoints = this.svg.insert('g')
      .selectAll('g')
      .data(() => that.trackers)
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
      .attr('r', d => d.isActivated() ? 5 : 0)
      .style('fill-opacity', 0.7)
      .style('fill', d => d.color)
      .style('stroke', 'white')
      .style('stroke-opacity', 0.5)
      .style('stroke-width', 2);
  }

  movePoint(trackers: Tracker[]) {
    this.trackerPoints.data(trackers)
    .transition()
    .duration(1000)
    .ease(d3.easeLinear)
    .style('fill', d => d.color)
    /** point steps */
    .attr('cx', d => this.xScale(d.xCrd)  + this.padding.left)
    .attr('cy', d => this.yScale(d.yCrd) + this.padding.top);

    if (this.mapService.mapStarted && this.trackerInfoG && this.selectedPoint ) {
      const x = this.selectedPoint.datum().xCrd;
      const y = this.selectedPoint.datum().yCrd;
      this.trackerInfoG.select('.trackerInfoText').text(d => `${d.alias} (${Math.floor(x)}, ${Math.floor(y)})`);
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
      this.mapService.stopping.next(false);
    }, 800);
  }

   onMouseOver(trackerPoint) {
    trackerPoint
    .transition(500)
    .ease(d3.easeQuadIn)
    .style('fill-opacity', 1)
    .attr('r', 10)
    .style('stroke-opacity', 1)
    .style('stroke-width', 5);
   }

   onMouseout(trackerPoint) {
    trackerPoint
    .style('fill-opacity', 0.7)
    .transition(1000)
    .ease(d3.easeQuadIn)
    .attr('r', 5)
    .style('stroke-opacity', 0.5)
    .style('stroke-width', 2);
   }

   onMouseClick() {
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
    console.log(this.selectedPoint.datum());
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
        .text(d => `ID: ${d.alias} (${Math.floor(d.xCrd)}, ${Math.floor(d.yCrd)})`)
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
      if (!point.datum().isActivated()) {
         this.hidePoint(point);
      } else if (this.selectedPoint && point.datum().id === this.selectedPoint.datum().id) {
         this.onMouseClick();
      } else {
        this.onMouseout(point);
      }
 }

  refreshTrackers() {
     this.trackerPoints.data(this.trackers);
  }

  attachPopup() {
    if (this.mapPopup) {
      return false;
    }

    const that = this;
    this.mapPopup = this.svg.insert('g')
      .attr('class', 'mapPopup')
      .style('opacity', 0);

    this.mapPopup.insert('rect')
      .attr('class', 'popupBackground')
      .style('fill', 'black')
      .style('fill-opacity', .4)
      .attr('width', this.popupWidth)
      .attr('height', this.popupHeight)
      .attr('x', this.width / 2 - this.popupWidth / 2)
      .attr('y', this.height / 2 - this.popupHeight / 2 )
      .attr('rx', 5)
      .attr('ry', 5);
    this.mapPopup.insert('text')
      .attr('class', 'popupText')
      .style('opacity', .8)
      .style('text-anchor', 'middle')
      .attr('fill', 'white')
      .attr('font-weight', 'bolder')
      .attr('font-size', '24px')
      .attr('x', this.width / 2 )
      .attr('y', this.height / 2 + 10 );
  }

  onPopup(text: string) {
    if (!this.mapPopup) {
      return false;
    }
      this.onPopupChange(text);

      this.mapPopup
      .transition(100)
      .ease(d3.easeLinear)
      .style('opacity', 1);
  }

  onPopupChange(text: string) {
    if (!this.mapPopup) {
      return false;
      }
    this.mapPopup.select('.popupText')
    .text(text);
  }

  onPopupFade(delay: boolean) {
    if (!this.mapPopup) {
      return false;
      }
    this.mapPopup
    .transition(500)
    .ease(d3.easeLinear)
    .delay(d => delay ? 800 : 0)
    .style('opacity', 0);
  }
  
  mapResize() {
    const element = this.chartContainer.nativeElement;
    if (element.offsetWidth === this.divWidth && element.offsetHeight === this.divHeight) {
      return;
    }
    console.log('DEBUG => map resize ');
    console.log('Width=>', element.offsetWidth, "Height=>", element.offsetHeight);
    // this.onStop();
    this.getContainerDimension(element);
    this.getSVGDimension();
    this.initMapScale();
    this.sizeSVG();
    this.sizeRect();
  }
}
