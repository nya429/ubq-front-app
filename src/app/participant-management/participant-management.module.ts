import { SharedModule } from './../shared/shared.module';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { DataStorageService } from './../shared/data-storage.service';
import { ParticipantService } from './participant.service';
import { ParticipantManagementComponent } from './participant-management.component';
import { ParticipantManagementRoutingModule } from './participant-management-routing.module';
import { CompanyListingComponent } from './company-listing/company-listing.component';
import { ParticipantListComponent } from './participant-index/participant-list/participant-list.component';
import { SearchBarComponent } from './participant-index/search-bar/search-bar.component';
import { PaginateComponent } from './participant-index/paginate/paginate.component';
import { ParticipantIndexComponent } from './participant-index/participant-index.component';
import { ParticipantNavComponent } from './participant-nav/participant-nav.component';
import { ParticipantItemComponent } from './participant-item/participant-item.component';
import { ParticipantDetailComponent } from './participant-index/participant-detail/participant-detail.component';
import { ShowDetailDirective } from './show-detail.directive';
import { TableStripedDirective } from './table-striped.directive';
import { TrackerResultListComponent } from './tracker-result-list/tracker-result-list.component';
import { ClickOutsideDirective } from './click-outside.directive';

@NgModule({
    declarations: [
    ParticipantManagementComponent,
    CompanyListingComponent,
    ParticipantListComponent,
    SearchBarComponent,
    PaginateComponent,
    ParticipantNavComponent,
    ParticipantIndexComponent,
    ParticipantItemComponent,
    ParticipantDetailComponent,
    ShowDetailDirective,
    TableStripedDirective,
    TrackerResultListComponent,
    ClickOutsideDirective],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        HttpClientModule,
        ParticipantManagementRoutingModule,
        SharedModule
    ],
    exports: [

    ],
    providers: [ParticipantService,
                DataStorageService]
})
export class ParticipantManagementModule {}
