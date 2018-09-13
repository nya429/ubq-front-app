import { Component, OnInit } from '@angular/core';

import { Subscription } from 'rxjs/Subscription';

import { listItemSlideStateTrigger } from '../setting.animation';
import { SettingService } from './../setting.service';
import { Setting } from '../../shared/setting.model';

@Component({
  selector: 'app-universal-setting-index',
  templateUrl: './universal-setting-index.component.html',
  styleUrls: ['./universal-setting-index.component.css'],
  animations: [ listItemSlideStateTrigger ]
})
export class UniversalSettingIndexComponent implements OnInit {
  private settingSubscription: Subscription;
  
  settings: Setting[];
  subDomain: object;

  constructor(private settingService: SettingService) { }

  ngOnInit() {
    this.getSettings();

    this.settingSubscription = this.settingService.settingsChanged.subscribe(
      () => {
        this.getSettings();
    })
  }

  getSettings() {
     this.settings = this.settingService.getSettings();
  }

  getHost() {
    // this.subDomain = SubDomains;
  }

}
