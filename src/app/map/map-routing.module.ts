import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MapComponent } from './map.component';
import { MapDemoComponent } from './map-demo/map-demo.component';
import { TrackingMapComponent } from './tracking-map/tracking-map.component';

const mapRoutes: Routes = [
    {path: '',
        component: MapComponent,
        children: [
            {path: 'barchart', component: MapDemoComponent},
            {path: 'tracker', component: TrackingMapComponent}
        ]
    },
];

@NgModule({
    imports: [
        RouterModule.forChild(mapRoutes)
    ],
    exports: [RouterModule]
})
export class MapRoutingModule { }
