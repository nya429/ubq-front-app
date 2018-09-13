import { Injectable, EventEmitter } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';

import { Subject } from 'rxjs/Subject';

import { API } from '../shared/host.model';
import { Setting } from '../shared/setting.model';

@Injectable()
export class SettingService {
    defaultSettings: Setting[] = [
        new Setting({key: 'host', value: 'localhost', id: 1}),
        new Setting({key: 'key2', value: 2, id: 2}),
    ];
    private api;
    private subDomains;
    private httpOptions;

    settingsChanged = new Subject<Setting[]>();
    settingUpdated = new Subject<number>();

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
        let setting = new Setting(form);
        let update = false;

        switch (setting.settingId()) {
            case 1:
                let hostOption = this.setHost(setting.value());
                setting.setValue(hostOption);
                update = true;
                break;
            default:
                break;
        }
       
        if(update) {
            this.onSettingUpdated(setting);
            this.settingUpdated.next(setting.settingId());
        }
    }
    
    onSettingUpdated(newSetting: Setting) {
        let updated = false;
        this.settings.map(setting => {
            if(setting.settingId() === newSetting.settingId() 
            && (setting.value() !== newSetting.value() || setting.key()) !== newSetting.key()) {
                setting.setKey(newSetting.key());
                setting.setValue(newSetting.value());
                updated = true;
            }   
        })

        if(updated) {
            this.settingsChanged.next(this.settings);
        }
    }

    getMapSettings() {

    }

    setHost(option: string) {
        return this.api.setHost(option);
    }

    getApis(subDomain?: string) {
        if (!subDomain) {
            return this.api.getSubdomains();
        }
        return this.api.getSubdomains()[subDomain];
    }

    isRemovable(pendingRemovalId: number) {
        let removals = this.defaultSettings.filter(setting => 
            setting.settingId() === pendingRemovalId
        )

        if ( removals && removals.length > 0  ) {
            return false;
        }
        return true;
    }
}
