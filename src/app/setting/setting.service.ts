import { Injectable, EventEmitter } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';

import { Subject } from 'rxjs/Subject';

import { API } from '../shared/host.model';
import { Setting } from '../shared/setting.model';
import { SettingState } from '../shared/setting-state.model';
import { FormGroup } from '@angular/forms';

@Injectable()
export class SettingService {
    defaultSettings: Setting[] = [
        new Setting({key: 'host', value: 'localhost', id: 0}),
        new Setting({key: 'key2', value: 2, id: 1}) ];

    settings: Setting[] = [
        new Setting({key: 'host', value: 'localhost', id: 0}),
        new Setting({key: 'key2', value: 2, id: 1}),
        new Setting({key: 'key3', value: 3, id: 2}),
        new Setting({key: 'key4', value: 4, id: 3}),
        new Setting({key: 'key4', value: 5, id: 4}) ];

    private api;
    private subDomains;
    private httpOptions;

    settingsChanged = new Subject<Setting[]>();
    settingUpdated = new Subject<SettingState>();


    constructor(private httpClient: HttpClient) {
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
        return this.settings.slice();
    }

    addSetting(form: object) {
        const urlSuffix = '/new';
        return this.httpClient.post(`${this.httpOptions.settingUrl()}${urlSuffix}`, form, {
          observe: 'body',
          responseType: 'json'
        }).subscribe((result) => {        
            console.log(result);            
            // TODO: tmp method for settingId
            // change it to this
            // form['settingId' = result['data']; 
            form['settingId'] = this.settings.length;
            let setting = new Setting(form);
            this.settings.push(setting);
            this.settingsChanged.next(this.settings.slice());
        }, (err: HttpErrorResponse)  => {
            console.error(err);
        });
    }

    getSettingListByOptions(offset?: number, limit?: number) {
        const urlSuffix = '/list';
        let options = new HttpParams();
        if (offset) {
          options = options.append('offset', offset.toString());
        }
        if (limit) {
          options = options.append('ltd', limit.toString());
        }

        return this.httpClient.get(`${this.httpOptions.settingUrl()}${urlSuffix}`, {
            observe: 'body',
            responseType: 'json',
            params: options
          })
          .subscribe(
              (result) => {
                const data = result['data'];
                this.setSettings(data);
              }, (err: HttpErrorResponse)  => {
                console.error(err);
              }
          );
    }

    removeSetting(settingId: number) {
        if(!this.isRemovable(settingId)) {
            this.settingUpdated.next(new SettingState(
                settingId, 0, false));
            return;
        }
        const removal = this.settings.find(setting => 
            setting.settingId() === settingId);
        const index = this.settings.indexOf(removal);
        this.settings.splice(index, 1);
        this.settingsChanged.next(this.settings.slice());
    }

    updateSetting(form: object) {
        let setting = new Setting(form);
        const settingId = setting.settingId();

        if(settingId === 0) {
            return this.updateLocalSetting(setting);
        }

        if(!settingId) {
            return false;
            // this.settingUpdated.next(new SettingState(settingId, 1, false)); 
        }

 

        return this.httpClient.patch(`${this.httpOptions.settingUrl}/${settingId}`, patch, {
            observe: 'body',
            responseType: 'json'
        }).subscribe(
            (result) => {
                const data = result['data'];
                this.setSettings(data);
              }, (err: HttpErrorResponse)  => {
                console.error(err);
              }
        );
    }

    updateLocalSetting(setting: Setting) {
        let update = false;
        let fail = false;
        console.log(setting.key());
        switch (setting.key()) {
            case 'host': // host setting
                let hostOption = this.setHost(setting.value());
                setting.setValue(hostOption);
                update = true;
                fail = hostOption === setting.value() ? true : false;
                break;
            default:
                break;
        }

        if(update) {
            this.onSettingUpdated(setting);
        }
    }
    
    onSettingUpdated(newSetting: Setting) {
        this.settings.map(setting => {
            if(setting.settingId() === newSetting.settingId() 
            && (setting.value() !== newSetting.value() || setting.key()) !== newSetting.key()) {
                setting.setKey(newSetting.key());
                setting.setValue(newSetting.value());
            }   
        })
 
        this.settingsChanged.next(this.settings.slice());
        this.settingUpdated.next(new SettingState(newSetting.settingId(), 1, true));   
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

    isKeyChangeable() {

    }

    setSettings(data) {
        const settings = data['settings'].map(
          seetingRaw => new Setting(seetingRaw)
        );
        this.settings = settings.unshift(this.settings[0]);
        this.settingsChanged.next(this.settings);
    }
}
