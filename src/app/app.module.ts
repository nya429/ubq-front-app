import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MapComponent } from './map/map.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
import { MapMenuComponent } from './map/map-menu/map-menu.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AboutComponent } from './about/about.component';
import { MapDemoComponent } from './map/map-demo/map-demo.component';
import { TrackingMapComponent } from './map/tracking-map/tracking-map.component';
import { MapControlComponent } from './map/map-control/map-control.component';
import { MapControlItemComponent } from './map/map-control/map-control-item/map-control-item.component';
import { MapControlPenalComponent } from './map/map-control-penal/map-control-penal.component';



@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    DashboardComponent,
    MapComponent,
    FooterComponent,
    HomeComponent,
    MapMenuComponent,
    PageNotFoundComponent,
    AboutComponent,
    MapDemoComponent,
    TrackingMapComponent,
    MapControlComponent,
    MapControlItemComponent,
    MapControlPenalComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    FormsModule,
    HttpModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
