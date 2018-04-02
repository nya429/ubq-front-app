import { CompanyService } from './company.service';
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
import { ParticipantListComponent } from './participant-index/participant-list/participant-list.component';
import { SearchBarComponent } from './participant-index/search-bar/search-bar.component';
import { PaginateComponent } from './participant-index/paginate/paginate.component';
import { ParticipantIndexComponent } from './participant-index/participant-index.component';
import { ParticipantNavComponent } from './participant-nav/participant-nav.component';
import { ParticipantItemComponent } from './participant-item/participant-item.component';
import { ParticipantDetailComponent } from './participant-index/participant-detail/participant-detail.component';
import { ShowDetailDirective } from './show-detail.directive';
import { TableStripedDirective } from './table-striped.directive';
import { TrackerResultListComponent } from './participant-item/tracker-result-list/tracker-result-list.component';
import { ClickOutsideDirective } from './click-outside.directive';
import { CompanyResultListComponent } from './participant-item//company-result-list/company-result-list.component';
import { CompanyIndexComponent } from './company-index/company-index.component';
import { CompanyListComponent } from './company-index/company-list/company-list.component';
import { CompanyPaginationComponent } from './company-index/company-pagination/company-pagination.component';
import { CompanyItemComponent } from './company-item/company-item.component';
import { StateListItemComponent } from './company-item/state-list-item/state-list-item.component';
import { CompanyListItemComponent } from './company-index/company-list/company-list-item/company-list-item.component';

@NgModule({
    declarations: [
    ParticipantManagementComponent,
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
    ClickOutsideDirective,
    CompanyResultListComponent,
    CompanyIndexComponent,
    CompanyListComponent,
    CompanyPaginationComponent,
    CompanyItemComponent,
    StateListItemComponent,
    CompanyListItemComponent],
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
    providers: [
                CompanyService,
                ParticipantService,
                DataStorageService]
})
export class ParticipantManagementModule {}
