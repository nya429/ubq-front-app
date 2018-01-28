import { Component, OnInit } from '@angular/core';

import { MapService } from './map.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'] ,
  providers: [MapService]
})
export class MapComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
