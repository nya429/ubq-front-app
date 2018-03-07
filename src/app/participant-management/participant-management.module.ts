import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { DataStorageService } from './../shared/data-storage.service';
import { ParticipantService } from './participant.service';
import { ParticipantManagementComponent } from './participant-management.component';
import { ParticipantManagementRoutingModule } from './participant-management-routing.module';
import { CompanyListingComponent } from './company-listing/company-listing.component';
import { ParticipantListComponent } from './participant-list/participant-list.component';
import { ParticipantListItemComponent } from './participant-list/participant-list-item/participant-list-item.component';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { PaginateComponent } from './paginate/paginate.component';
import { ParticipantNavComponent } from './participant-nav/participant-nav.component';

@NgModule({
    declarations: [
    ParticipantManagementComponent,
    CompanyListingComponent,
    ParticipantListComponent,
    ParticipantListItemComponent,
    SearchBarComponent,
    PaginateComponent,
    ParticipantNavComponent],
    imports: [
        CommonModule,
        FormsModule,
        HttpModule,
        HttpClientModule,
        ParticipantManagementRoutingModule
    ],
    exports: [

    ],
    providers: [ParticipantService,
                DataStorageService]
})
export class ParticipantManagementModule {}
