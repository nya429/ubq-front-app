import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ParticipantManagementComponent } from './participant-management.component';
import { ParticipantIndexComponent } from './participant-index/participant-index.component';
import { ParticipantItemComponent } from './participant-item/participant-item.component';
import { CompanyIndexComponent } from './company-index/company-index.component';
import { CompanyItemComponent } from './company-item/company-item.component';

const participantManagementRoutes: Routes = [
    {path: '', component: ParticipantManagementComponent,
    children: [
        {path: '', redirectTo: 'participant', pathMatch: 'full'},
        {path: 'participant', component: ParticipantIndexComponent},
        {path: 'participant/new', component: ParticipantItemComponent},
        {path: 'participant/:id/edit', component: ParticipantItemComponent},
        {path: 'company', component: CompanyIndexComponent},
        {path: 'company/new', component: CompanyItemComponent},
        {path: 'company/:id/edit', component: CompanyItemComponent},
    ]
    },
];

@NgModule({
    imports: [
        RouterModule.forChild(participantManagementRoutes)
    ],
    exports: [RouterModule]
})
export class ParticipantManagementRoutingModule {}
