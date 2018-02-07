import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';

import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';

@NgModule({
    declarations: [
        DashboardComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        HttpModule,
        DashboardRoutingModule
    ],
    exports: [

    ],
    providers: []
})
export class DashboardModule {}

