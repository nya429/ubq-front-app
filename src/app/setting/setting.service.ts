import { Injectable, EventEmitter } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';

import { Subject } from 'rxjs/Subject';

import { SubDomains, setHost } from '../shared/httpCfg';
import { Setting } from '../shared/setting.model';

@Injectable()
export class SettingService {
    defaultSettings: Setting[] = [];

    settings: Setting[] = [
        new Setting({key: 'host', value: 'localhost', id: 1}),
        new Setting({key: 'key2', value: 2, id: 2}),
        new Setting({key: 'key3', value: 3, id: 3}),
        new Setting({key: 'key4', value: 4, id: 4}),
        new Setting({key: 'key4', value: 5, id: 5}) ];

    private subDomains = SubDomains;
    private httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          'Authorization': 'my-auth-token'
        }),
        participantUrl: this.subDomains['participant'],
        eventUrl: this.subDomains['event'],
        // url: 'http://192.168.0.108:3000/participant'
      };

    getSettings() {
        return this.settings;
    }

    addSetting() {

    }

    removeSetting() {

    }

    updateSetting(form: Setting) {
        const setting = new Setting(form);
        if (setting.settingId() === 1) {
            console.log('AWS')
            setHost(setting.value());
        }
    }

    getMapSettings() {

    }
}
