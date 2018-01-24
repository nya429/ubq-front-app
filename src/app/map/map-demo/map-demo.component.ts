import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-map-demo',
  templateUrl: './map-demo.component.html',
  styleUrls: ['./map-demo.component.css']
})
export class MapDemoComponent implements OnInit {
  @ViewChild('chart') private chartContainer: ElementRef;
  @Input() private data: Array<any>;	
  private margin: any = { top: 20, bottom: 20, left: 20, right: 20};		  
  private chart: any;		  
  private width: number;		  
  private height: number;		  
  private xScale: any;		  
  private yScale: any;		  
  private colors: any;		  
  private xAxis: any;		  
  private yAxis: any;
  constructor() { }

  ngOnInit() {
    this.createMap();
  }

  createMap() {
    const element = this.chartContainer.nativeElement;
    this.width = element.offsetWidth - this.margin.left - this.margin.right;		    
    this.height = element.offsetHeight - this.margin.top - this.margin.bottom;
    const svg = d3.select(element).append('svg')		      
              .attr('width', element.offsetWidth)		      
              .attr('height', element.offsetHeight);

    this.chart = svg.append('g')		      
              .attr('class', 'bars')		      
              .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);         
    
   const xDomain = this.data.map(d => d[0]);       
    const yDomain = [0, d3.max(this.data, d => d[1])];         
  }
}
