import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CompanyListingComponent } from './company-listing/company-listing.component';
import { ParticipantManagementComponent } from './participant-management.component';
import { ParticipantIndexComponent } from './participant-index/participant-index.component';
import { ParticipantItemComponent } from './participant-item/participant-item.component';

const participantManagementRoutes: Routes = [
    {path: '', component: ParticipantManagementComponent,
    children: [
        {path: '', redirectTo: 'list', pathMatch: 'full'},
        {path: 'list', component: ParticipantIndexComponent},
        {path: 'new', component: ParticipantItemComponent},
        {path: ':id/edit', component: ParticipantItemComponent},
        {path: 'company', component: CompanyListingComponent}]
    },
];

@NgModule({
    imports: [
        RouterModule.forChild(participantManagementRoutes)
    ],
    exports: [RouterModule]
})
export class ParticipantManagementRoutingModule {}
