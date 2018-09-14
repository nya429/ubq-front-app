import { Component, OnInit, Input, OnDestroy, AfterContentChecked } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { Subscription } from 'rxjs/Subscription';

import { SettingService } from './../../setting.service';
import { Setting } from '../../../shared/setting.model';
import { failScaleTrigger } from '../../setting.animation';

@Component({
  selector: 'app-universal-setting-item',
  templateUrl: './universal-setting-item.component.html',
  styleUrls: ['./universal-setting-item.component.css'],
  animations: [ failScaleTrigger ]
})
export class UniversalSettingItemComponent implements OnInit, OnDestroy, AfterContentChecked {
  @Input() setting: Setting;
  @Input() index: number;
  settingForm: FormGroup;
  key: string;
  value: string;
  settingId: number;
  editMode = false;
  removable: boolean;
  scaleState: string;
  updateSubscription: Subscription;

  constructor(private settingSerivce: SettingService) { }

  ngOnInit() {
    this.setValue();
    this.initForm();
    this.removable = this.settingSerivce.isRemovable(this.settingId);
    this.scaleState = 'default';
    this.updateSubscription = this.settingSerivce.settingUpdated.subscribe(
      (id: number) => {
        if(this.settingId === id) {
          this.pathForm();
        }
      }
    )
  }

  ngOnDestroy() {
    this.updateSubscription.unsubscribe();
  }

  ngAfterContentChecked() {
    this.setValue();
  }

  setValue() {
    this.key = this.setting.key();
    this.value = this.setting.value();
    this.settingId = this.setting.settingId();
  }

  onEdit() {
    console.log('DEBUTedit', this.settingForm.value)
    this.editMode = true;
  }

  initForm() {
    this.settingForm = new FormGroup({
      'id': new FormControl(this.settingId),
      'key': new FormControl(this.key, [Validators.required, Validators.max(50)]),
      'value': new FormControl(this.value, [Validators.required, Validators.max(50)]),
    });
  }

  pathForm() {
    this.settingForm.patchValue({
      'value':this.value,
      'key': this.key,
    })
  }

  onUpdate() {
    console.log('update', this.settingForm.value)
    this.editMode = false;
    this.settingSerivce.updateSetting(this.settingForm.value);
  }

  onRemove() {
    this.settingSerivce.removeSetting();
    this.scaleState = 'fail';
    setTimeout(() => {
      this.scaleState = 'default';
    }, 100);
  }

  onCancle() {
    this.editMode = false;
  }
}
