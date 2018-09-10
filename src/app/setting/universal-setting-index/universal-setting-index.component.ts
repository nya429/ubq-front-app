import { Component, OnInit } from '@angular/core';

import { SettingService } from './../setting.service';
import { Setting } from '../../shared/setting.model';

@Component({
  selector: 'app-universal-setting-index',
  templateUrl: './universal-setting-index.component.html',
  styleUrls: ['./universal-setting-index.component.css']
})
export class UniversalSettingIndexComponent implements OnInit {
  settings: Setting[];

  constructor(private settingService: SettingService) { }

  ngOnInit() {
    this.settings = this.settingService.getSettings();
  }

  getSettings() {
    this.settingService.getSettings();
  }

}
