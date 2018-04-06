import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CoreModule } from './core/core.module';
import { AuthModule } from './auth/auth.module';
import { MapModule } from './map/map.module';
import { AppComponent } from './app.component';
import { DashboardModule } from './dashboard/dashboard.module';
import { ParticipantManagementModule } from './participant-management/participant-management.module';
import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    HttpModule,
    AppRoutingModule,
    CoreModule,
    AuthModule,
    SharedModule,
    MapModule,
    DashboardModule,
    ParticipantManagementModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
