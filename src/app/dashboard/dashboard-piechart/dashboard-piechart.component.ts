import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-dashboard-piechart',
  templateUrl: './dashboard-piechart.component.html',
  styleUrls: ['./dashboard-piechart.component.css']
})
export class DashboardPiechartComponent implements OnInit {
  @ViewChild('pieChart') private chartContainer: ElementRef;
  private dataset = [30, 10, 43, 55, 13];

  element;
  svg:any;
  piedata: any;
  pie = d3.pie();
  arc = d3.arc();


  private width: number;
  private height: number;
  private margin: any = { top: 20, bottom: 20, left: 20, right: 20};
  private innerRadius = 100;
  private outerRadius = 150;
  private xScale: any;
  private yScale: any;
  private colors: any;
  private xAxis: any;
  private yAxis: any;

  constructor() { }

  ngOnInit() {
    this.element = this.chartContainer.nativeElement;
    this.scaleSize();
    this.createChart() 
  }
  
  createChart() {
    /* ----------create svg------------*/

    this.width = this.element.offsetWidth;
    this.height = this.element.offsetHeight;
    this.svg = d3.select(this.element).append('svg')
              .attr('class', 'chartBase')
              .attr('width', this.element.offsetWidth)
              .attr('height', this.element.offsetHeight);
     console.log(this.svg.select('g'),this.element.offsetHeight,this.height);   
              
    /* ----------------------*/

    this.piedata = this.pie(this.dataset);
    this.arc.innerRadius(this.innerRadius)
            .outerRadius(this.outerRadius)
            .startAngle(0)
            .endAngle(Math.PI / 2)
            .padAngle(.03)
            .cornerRadius(5);

		let color = d3.scaleOrdinal(d3.schemeCategory10);
  
  const ss = this.svg.append('g').
            attr("transform","translate("+ (this.width/2) +","+ (this.element.offsetHeight/2) +")");


            ss.data(this.piedata).enter().append("g")

            ss.append("path")
      .attr("d", this.arc)
      .style("fill", d => color(d.data));

    // straightPath.data(arcs).attr("d", this.arc.cornerRadius(5));
  
    // arcs.append("text")
		// 	.attr("transform",function(d){
		// 		return "translate(" + this.arc.centroid(d) + ")";
		// 	})
		// 	.attr("text-anchor","middle")
		// 	.text(function(d){
		// 		return d.data;
		// 	});

  }

  scaleSize() {
    this.outerRadius = d3.min([this.element.offsetHeight/2,this.element.offsetHeight/2])
    console.log(this.outerRadius);
  }
}
