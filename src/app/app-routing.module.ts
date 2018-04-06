import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './core/home/home.component';
import { AboutComponent } from './core/about/about.component';
import { PageNotFoundComponent } from './core/page-not-found/page-not-found.component';

const appRoutes: Routes = [
    {path: '', redirectTo: '/home', pathMatch: 'full'},
    {path: 'home', component: HomeComponent},
    {path: 'about', component: AboutComponent},
    {path: 'auth', loadChildren: './auth/auth.module#AuthModule'},
    {path: 'dashboard', loadChildren: './dashboard/dashboard.module#DashboardModule'},
    {path: 'map', loadChildren: './map/map.module#MapModule'},
    {path: 'visitor', loadChildren: './participant-management/participant-management.module#ParticipantManagementModule'},
    { path: 'not-found',
        component: PageNotFoundComponent,
        data: {message: 'Page not Found'} },
     { path: '**', redirectTo: 'not-found' },
];

@NgModule({
    imports: [
        RouterModule.forRoot(appRoutes)
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {}
