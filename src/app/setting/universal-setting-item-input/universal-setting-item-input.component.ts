import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SettingService } from '../setting.service';

@Component({
  selector: 'app-universal-setting-item-input',
  templateUrl: './universal-setting-item-input.component.html',
  styleUrls: ['./universal-setting-item-input.component.css']
})
export class UniversalSettingItemInputComponent implements OnInit {
  settingForm: FormGroup;
  key: string;
  value: number;
  settingId: number;
  editMode = false;


  constructor(private settingService: SettingService) { }

  ngOnInit() {
    this.key = '';
    this.value = null;
    this.settingId = null;
    this.initForm();
  }

  initForm() {
    this.settingForm = new FormGroup({
      'settingId': new FormControl( this.key ),
      'key': new FormControl(this.value, [Validators.required, Validators.max(50)]),
      'value': new FormControl(this.settingId , [Validators.required, Validators.max(50)]),
    });
  }

  onAdd() {
    this.settingService.addSetting();
  }

  onCancle() {
    this.initForm();
  }

}
