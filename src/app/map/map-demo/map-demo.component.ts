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

    const rectHeight = 25;
    const padding = {left: 30, right: 30, top: 20, bottom: 20};
    const rectPadding = 20;
    const dataset = [ 10, 20, 30, 40, 50, 30, 20, 40, 50, 33, 24, 12, 5];

    const linear = d3.scaleLinear()
                      .domain([0, d3.max(dataset)])
                      .range([0, 250]);

    const xScale = d3.scaleBand()
                      .domain(d3.range(dataset.length))
                      .range([0, element.offsetWidth - padding.left - padding.right]);
    const yScale = d3.scaleLinear()
                      .domain([0, d3.max(dataset)])
                      .range([element.offsetHeight - padding.top - padding.bottom, 0]);

    const xAxis = d3.axisBottom(xScale).tickArguments([10, 's']);
    const yAxis = d3.axisLeft(yScale).tickArguments([5, 's']);

    const axis = d3.axisBottom(linear).tickArguments([5, 's']);

    // svg.append('g').call(axis)
    //       .attr('transform', 'translate(20,200)');
    svg.append("g")
    .attr("class","axis")
    .attr("transform","translate(" + padding.left + "," + (element.offsetHeight - padding.bottom) + ")")
    .call(xAxis); 
          

  svg.append("g")
    .attr("class","axis")
    .attr("transform","translate(" + padding.left + "," + padding.top + ")")
    .call(yAxis);

    let rectBar = svg.selectAll('rect')
          .data(dataset)
          .enter().append('rect');

        rectBar.attr('x',  (d, i) =>  {
            return  padding.left + xScale(i) + rectPadding / 2;
          })
          .attr('y', d =>  {
                return yScale(0) + padding.top;
          })
          .attr('width', xScale.bandwidth() - rectPadding)
          .attr('height', d => {
            return 0;
          })
          .attr('fill', 'skyblue')
          .transition()
          .delay(function(d,i){
            return i * 50;
          })
          .duration(2000)
          .ease(d3.easeBounceIn)
          .attr("y",function(d){
            return yScale(d) + padding.top;
          })
          .attr("height", function(d){
            return element.offsetHeight - padding.top - padding.bottom - yScale(d);
          });
      

    
    let texts = svg.selectAll(".BarText")
        .data(dataset)
        .enter()
        .append("text")
        .attr("class","BarText")
        .attr("transform","translate(" + padding.left + "," + padding.top + ")")
        .attr("x", function(d,i){
            return xScale(i) + rectPadding/2;
        } )
        .attr("y",function(d){
            return yScale(0) + padding.top;
        })
        .attr("dx",function(){
            return (xScale.bandwidth() - rectPadding)/2;
        })
        .attr("dy",function(d){
            return 0;
        })
        .text(function(d){
            return d;
        })
        .attr('fill', 'skyblue')
        .transition()
        .attr('fill', 'white')
        .delay(function(d,i){
          return i * 50;
        })
        .duration(2000)
        .ease(d3.easeBounceIn)
        .attr("y",function(d){
          return yScale(d) + padding.top;
        })
        .attr("height", function(d){
          return element.offsetHeight - padding.top - padding.bottom - yScale(d);
        });

   let circle1 = svg.append("circle")
        .attr("cx", 100)
        .attr("cy", 100)
        .attr("r", 45)
        .style("fill","cornflowerblue");

    circle1.transition().ease(d3.easePolyInOut).duration(1000).delay(800).attr('cx',400).attr("r", 25).style("fill","deepskyblue");

    circle1.on('click', function() {
      console.log(this);
      d3.select(this)
      .transition(500)
      .style("fill","cyan")
      .ease(d3.easeBounceIn);
    });

    rectBar.on('mouseover', function() {
      let self = this;

      var otherCircles = d3.selectAll('svg rect');
      // All other elements resize randomly.
      otherCircles.filter(function() 
          { return self !== this; }
        ).transition().style("fill-opacity", 0.6);
    });

    rectBar.on('mouseout', function() {
      d3.selectAll('svg rect').transition(100).style("fill-opacity", 1);
    });

    rectBar.on('click', function() {
      console.log(d3.event);
      // d3.select(rectBar)
      // .transition(500)
      // .style("fill","red")
      // .ease(d3.easeBounceIn);
      d3.select(this)
      .transition(500)
      .style("fill","cyan")
      .ease(d3.easeBounceIn);
      let self = this;

      let otherCircles = d3.selectAll('svg rect');
      // All other elements resize randomly.
      otherCircles.filter(function()
          { return self !== this; }
        ).transition().style("fill",'aliceblue');

    });
  }


}
