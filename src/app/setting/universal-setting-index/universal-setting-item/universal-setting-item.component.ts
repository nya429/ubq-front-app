import { SettingService } from './../../setting.service';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { Setting } from '../../../shared/setting.model';

@Component({
  selector: 'app-universal-setting-item',
  templateUrl: './universal-setting-item.component.html',
  styleUrls: ['./universal-setting-item.component.css']
})
export class UniversalSettingItemComponent implements OnInit, OnDestroy {
  @Input() setting: Setting;
  @Input() index: number;
  settingForm: FormGroup;
  key: string;
  value: number;
  settingId: number;
  editMode = false;


  constructor(private settingSerivce: SettingService) { }

  ngOnInit() {
    this.key = this.setting.key();
    this.value = this.setting.value();
    this.settingId = this.setting.settingId();
    this.initForm();
  }

  ngOnDestroy() {

  }

  onEdit() {
    this.editMode = true;
  }

  initForm() {
    console.log('here');
    this.settingForm = new FormGroup({
      'settingId': new FormControl(this.settingId),
      'key': new FormControl(this.key, [Validators.required, Validators.max(50)]),
      'value': new FormControl(this.value, [Validators.required, Validators.max(50)]),
    });
  }

  onUpdate() {
    this.editMode = false;
    this.settingSerivce.updateSetting();
  }

  onRemove() {
    this.settingSerivce.removeSetting();
  }

  onCancle() {
    this.editMode = false;
  }
}
