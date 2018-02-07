import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './dashboard.component';


const dashboardRoutes: Routes = [
    {path: '', component: DashboardComponent,
        children: [
        ]
    },
];

@NgModule({
    imports: [
        RouterModule.forChild(dashboardRoutes)
    ],
    exports: [RouterModule]
})
export class DashboardRoutingModule { }
