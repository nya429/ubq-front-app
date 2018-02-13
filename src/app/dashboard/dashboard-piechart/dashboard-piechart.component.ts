import { Component, OnInit, AfterViewInit, Input, ViewChild, ElementRef } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-dashboard-piechart',
  templateUrl: './dashboard-piechart.component.html',
  styleUrls: ['./dashboard-piechart.component.css']
})
export class DashboardPiechartComponent implements OnInit, AfterViewInit {
  @ViewChild('pieChart') private chartContainer: ElementRef;
  private dataset = [45, 66, 29, 40];

  element;
  svg: any;
  piedata: any;
  pie: any;
  arc = d3.arc();


  private width: number;
  private height: number;
  private margin: any = { top: 20, bottom: 20, left: 20, right: 20};
  private circleWidth = 30;
  private innerRadius;
  private outerRadius;
  private xScale: any;
  private yScale: any;
  private colors: any;
  private xAxis: any;
  private yAxis: any;
  private tau = 2 * Math.PI;

  constructor() { }

  ngOnInit() {
    this.element = this.chartContainer.nativeElement;

    this.createBase();
    this.scaleSize();
    this.createChart();
  }

  ngAfterViewInit() {
  }

  createBase() {
    if (this.element.parentNode.parentNode.getBoundingClientRect().height === 300) {
      console.log('here');
      this.height = 300;
      this.circleWidth = 50;
    }
     /* ----------create svg------------*/
    this.svg = d3.select(this.element).append('svg');
    this.svg.attr('class', 'chartBase')
              .attr('width', this.element.offsetWidth)
              .attr('height', this.height);
  }

  createChart() {
     /* ----------create piedata------------*/
    this.pie = d3.pie().sort(null);
    this.piedata = this.pie(this.dataset);
     /* ----------create arc generator------------*/
    this.arc.innerRadius(this.innerRadius)
            .outerRadius(this.outerRadius)
            .padAngle(.03)
            .cornerRadius(5);

    const color = d3.scaleOrdinal().range(['#1E90FF', '#00CED1', '#4682B4', '#87CEEB', '#4169E1', '#7B68EE']);

    const g = this.svg.append('g');
    g.attr('transform', 'translate(' + (this.width / 2) + ',' + (this.height / 2) + ')');

    g.selectAll('g').data(this.piedata).enter().append('g').attr('class', 'arc-g');

    this.svg.selectAll('.arc-g').data(this.piedata).append('path')
      .attr('d', this.arc)
      .style('fill', d => color(d.data))
      // .transition()
      // .ease(d3.easeQuadOut)
      // .delay((d, i) =>  1000 + i * 50)
      // .duration(2000)
      // .attrTween('d', this.arcTween);

    /* ----------append text------------*/
    g.selectAll('.arc-g')
      .append('text')
      .attr('transform', d => 'translate(' + this.arc.centroid(d) + ')')
      .attr('text-anchor', 'middle')
      .attr('fill', 'white')
      .text(d => d.data);

    /* ----------append  middle text------------*/
    g.append('text')
      .attr('text-anchor', 'middle').attr('fill', '#31708f').text(d => '100% ..');
  }

  scaleSize() {
    this.width = this.element.offsetWidth;
    this.height = this.element.offsetHeight;

    this.svg.attr('height', this.element.offsetHeight);
    // the differ between element.offsetHeight and svg.height
    this.outerRadius = d3.min([this.element.offsetWidth, this.element.offsetHeight]) / 2 - 5;

    this.width = this.element.offsetWidth;
    this.innerRadius = this.outerRadius - this.circleWidth;
  }

  arcTween(b) {
    return function(d) {
      const i = d3.interpolate({startAngle: 0, endAngle: 0}, b);
      return function(t) {
        return this.arc(i(t));
      };
    };
  }
}
