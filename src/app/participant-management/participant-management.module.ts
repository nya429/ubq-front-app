import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';

import { ParticipantManagementComponent } from './participant-management.component';
import { ParticipantManagementRoutingModule } from './participant-management-routing.module';

@NgModule({
    declarations: [
    ParticipantManagementComponent],
    imports: [
        CommonModule,
        FormsModule,
        HttpModule,
        ParticipantManagementRoutingModule
    ],
    exports: [

    ],
    providers: []
})
export class ParticipantManagementModule {}
