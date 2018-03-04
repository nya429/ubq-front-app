import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ParticipantManagementComponent } from './participant-management.component';

const participantManagementRoutes: Routes = [
    {path: '', component: ParticipantManagementComponent
    },
];

@NgModule({
    imports: [
        RouterModule.forChild(participantManagementRoutes)
    ],
    exports: [RouterModule]
})
export class ParticipantManagementRoutingModule {}
