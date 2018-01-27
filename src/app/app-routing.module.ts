import { NgModule } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from "./app.component";
import { MapComponent } from "./map/map.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { HomeComponent } from "./home/home.component";
import { AboutComponent } from "./about/about.component";
import { PageNotFoundComponent } from "./page-not-found/page-not-found.component";
import { MapDemoComponent } from './map/map-demo/map-demo.component';

const appRoutes: Routes = [
    {path: '', redirectTo: 'map', pathMatch: 'full'},
    {path: 'home', component: HomeComponent},
    {path: 'dashboard', component: DashboardComponent},
    {path: 'map', component: MapComponent,
    children: [
         {path: 'barchart', component: MapDemoComponent}
        ]},
    {path: 'about', component: AboutComponent},
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
