import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AppRoutingModule } from '../app-routing.module';

@NgModule({
    declarations: [
        HeaderComponent,
        FooterComponent,
        HomeComponent,
        AboutComponent,
        PageNotFoundComponent
    ],
    imports: [
        AppRoutingModule
    ],
    exports: [
        AppRoutingModule,
        HeaderComponent,
        HomeComponent,
        FooterComponent
    ],
    providers: []
})
export class CoreModule {}
