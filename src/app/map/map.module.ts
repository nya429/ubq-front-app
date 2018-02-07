import { MapRoutingModule } from './map-routing.module';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { CommonModule } from '@angular/common';

import { MapService } from './map.service';
import { MapComponent } from './map.component';
import { MapMenuComponent } from './map-menu/map-menu.component';
import { MapDemoComponent } from './map-demo/map-demo.component';
import { TrackingMapComponent } from './tracking-map/tracking-map.component';
import { MapControlComponent } from './map-control/map-control.component';
import { MapControlItemComponent } from './map-control/map-control-item/map-control-item.component';
import { MapControlPenalComponent } from './map-control-penal/map-control-penal.component';



@NgModule({
  declarations: [
    MapComponent,
    MapMenuComponent,
    MapDemoComponent,
    TrackingMapComponent,
    MapControlComponent,
    MapControlItemComponent,
    MapControlPenalComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpModule,
    MapRoutingModule
  ],
  providers: [MapService],
})
export class MapModule { }
