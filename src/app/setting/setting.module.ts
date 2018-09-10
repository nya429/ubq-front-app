import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';

import { SharedModule } from './../shared/shared.module';
import { SettingRoutingModule } from './setting-routing.module';
import { SettingService } from './setting.service';
import { SettingComponent } from './setting.component';
import { UniversalSettingIndexComponent } from './universal-setting-index/universal-setting-index.component';
import { UniversalSettingItemComponent } from './universal-setting-index/universal-setting-item/universal-setting-item.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    HttpClientModule,
    SettingRoutingModule,
    SharedModule
  ],
  declarations: [
    UniversalSettingIndexComponent,
    SettingComponent,
    UniversalSettingItemComponent],
  providers: [
    SettingService
  ]
})
export class SettingModule { }
