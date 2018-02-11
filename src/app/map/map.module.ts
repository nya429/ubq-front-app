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
import { TrackerListComponent } from './tracker-list/tracker-list.component';
import { TrackerListItemComponent } from './tracker-list/tracker-list-item/tracker-list-item.component';
import { MapControlPenalComponent } from './map-control-penal/map-control-penal.component';
import { TrackerDetailComponent } from './tracker-detail/tracker-detail.component';
import { TrackerDetailEditComponent } from './tracker-detail/tracker-detail-edit/tracker-detail-edit.component';



@NgModule({
  declarations: [
    MapComponent,
    MapMenuComponent,
    MapDemoComponent,
    TrackingMapComponent,
    TrackerListComponent,
    TrackerListItemComponent,
    MapControlPenalComponent,
    TrackerDetailComponent,
    TrackerDetailEditComponent,
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
