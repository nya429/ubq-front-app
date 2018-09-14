import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SettingService } from '../setting.service';
import { slideInTrigger, failScaleTrigger } from '../setting.animation';

@Component({
  selector: 'app-universal-setting-item-input',
  templateUrl: './universal-setting-item-input.component.html',
  styleUrls: ['./universal-setting-item-input.component.css'],
  animations: [ slideInTrigger, failScaleTrigger ]
})
export class UniversalSettingItemInputComponent implements OnInit {
  settingForm: FormGroup;
  key: string;
  value: string;
  settingId: number;
  editMode = false;

  constructor(private settingService: SettingService) { }

  ngOnInit() {
    this.key = '';
    this.value = '';
    this.settingId = null;
    this.initForm();
  }

  initForm() {
    this.settingForm = new FormGroup({
      'id': new FormControl(this.settingId),
      'value': new FormControl(this.value, [Validators.required, Validators.max(50)]),
      'key': new FormControl(this.key , [Validators.required, Validators.max(50)]),
    });
  }

  onNew() {
    this.initForm();
    this.editMode = true;
  }

  onAdd() {
    this.editMode = false;
    this.settingService.addSetting(this.settingForm.value);
  }

  onCancle() {
    this.editMode = false;
    // this.initForm();
  }

}
