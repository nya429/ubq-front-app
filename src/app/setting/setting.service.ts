import { Injectable, EventEmitter } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';

import { Subject } from 'rxjs/Subject';

import { API } from '../shared/host.model';
import { Setting } from '../shared/setting.model';

@Injectable()
export class SettingService {
    defaultSettings: Setting[] = [];
    private api;
    private subDomains;
    private httpOptions;

    settings: Setting[] = [
        new Setting({key: 'host', value: 'localhost', id: 1}),
        new Setting({key: 'key2', value: 2, id: 2}),
        new Setting({key: 'key3', value: 3, id: 3}),
        new Setting({key: 'key4', value: 4, id: 4}),
        new Setting({key: 'key4', value: 5, id: 5}) ];

    constructor() {
        this.api = new API('localhost');
        this.httpOptions = {
            headers: new HttpHeaders({
              'Content-Type':  'application/json',
              'Authorization': 'my-auth-token'
            }),
            settingUrl: () => this.getApis('setting'),
          };
    }

    getSettings() {
        return this.settings;
    }

    addSetting() {

    }

    removeSetting() {

    }

    updateSetting(form: Setting) {
        const setting = new Setting(form);
        switch (setting.settingId()) {
            case 1:
                this.setHost(setting.value());
                break;
            default:
                break;
        }
    }

    getMapSettings() {

    }

    setHost(option: string) {
        this.api.setHost(option);
    }

    getApis(subDomain?: string) {
        if (!subDomain) {
            return this.api.getSubdomains();
        }
        return this.api.getSubdomains()[subDomain];
    }
}
