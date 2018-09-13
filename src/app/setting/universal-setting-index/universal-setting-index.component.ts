import { Component, OnInit } from '@angular/core';

import { SettingService } from './../setting.service';
import { Setting } from '../../shared/setting.model';
import { listItemSlideStateTrigger } from '../setting.animation';

@Component({
  selector: 'app-universal-setting-index',
  templateUrl: './universal-setting-index.component.html',
  styleUrls: ['./universal-setting-index.component.css'],
  animations: [ listItemSlideStateTrigger ]
})
export class UniversalSettingIndexComponent implements OnInit {
  settings: Setting[];
  subDomain: object;

  constructor(private settingService: SettingService) { }

  ngOnInit() {
    this.getSettings();
  }

  getSettings() {
    setTimeout(() => this.settings = this.settingService.getSettings(), 1000);
  }

  getHost() {
    // this.subDomain = SubDomains;
  }

}
