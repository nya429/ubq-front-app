import { Injectable, EventEmitter } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';

import { Subject } from 'rxjs/Subject';

import { API } from '../shared/host.model';
import { Setting } from '../shared/setting.model';
import { SettingState } from '../shared/setting-state.model';
import { FormGroup } from '@angular/forms';

@Injectable()
export class SettingService {
    // TODO: will eliminate id
    defaultSettings: Setting[] = [
        new Setting({key: 'host', value: 'localhost', id: 0}),
        new Setting({key: 'key2', value: 2, id: 1}),
        new Setting({key: 'key3', value: 3, id: 2}),
        new Setting({key: 'key4', value: 4, id: 3}),
        new Setting({key: 'key4', value: 5, id: 4}) ];

    settings: Setting[];

    private api;
    private subDomains;
    private httpOptions;
    private connected: boolean;

    settingsChanged = new Subject<Setting[]>();
    settingUpdated = new Subject<SettingState>();
    poped = new Subject<object>();

    constructor(private httpClient: HttpClient) {
        this.api = new API('localhost');

        this.httpOptions = {
            headers: new HttpHeaders({
              'Content-Type':  'application/json',
              'Authorization': 'my-auth-token'
            }),
            settingUrl: () => this.getApis('setting'),
          };

        // TODO: fetch then excute this if failed;
        this.settings = this.defaultSettings;
        this.getSettingListByOptions();
    }

    getSettings() {
        return this.settings.slice();
    }

    // TODO add trim() in backend
    addSetting(form: object) {
        const urlSuffix = '/new';
        return this.httpClient.post(`${this.httpOptions.settingUrl()}${urlSuffix}`, form, {
          observe: 'body',
          responseType: 'json'
        }).subscribe((result) => {
            this.connected = true;
            this.addLocalsetting(form, result['data']['setting_id']);
        }, (err: HttpErrorResponse)  => {
            console.error(err);
            // TODO check 404 then
            this.connected = false;
            this.popup('opeartion', 'add');
            this.addLocalsetting(form, 40400 + this.settings.length);
        });
    }

    addLocalsetting(form: object, settingId: number) {
        form['id'] = settingId;
        const setting = new Setting(form);
        this.settings.push(setting);
        console.log(setting);
        this.settingsChanged.next(this.settings.slice());
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
                this.connected = true;
                const data = result['data'];
                this.setSettings(data);
              }, (err: HttpErrorResponse)  => {
                 // TODO check 404 then
                this.connected = false;
                console.error(err);
                this.popup('opeartion', 'get');
              }
          );
    }

    // FIXME, this should be fixed, index -1 isssues

    removeSetting(settingId: number, key: string) {
        if (!this.isRemovable(key)) {
            this.settingUpdated.next(new SettingState(
                settingId, 0, false));
            return;
        }

        this.removeLocalSetting(settingId);

        return this.httpClient.delete(`${this.httpOptions.settingUrl()}/${settingId}`, {
            observe: 'body',
            responseType: 'json'
          }).subscribe(
            (result) => {
                this.connected = true;
            }, (err: HttpErrorResponse)  => {
              console.error(err);
                        // TODO check 404 then
            this.connected = false;
            this.popup('opeartion', 'remove');
            }
        );
    }

    removeLocalSetting(settingId: number) {
        const removal = this.settings.find(setting =>
            setting.settingId() === settingId);
        const index = this.settings.indexOf(removal);
        this.settings.splice(index, 1);
        this.settingsChanged.next(this.settings.slice());
    }

    // TODO fix update on backend
    updateSetting(form: object, index: number) {
        const setting = new Setting(form);
        const settingId = setting.settingId();

        // TODO use key for conditioning later
        if (settingId === 0) {
            return this.updateLocalSetting(setting, index);
        }

        if (!settingId) {
            return false;
            // this.settingUpdated.next(new SettingState(settingId, 1, false));
        }
        console.log(form);
        return this.httpClient.patch(`${this.httpOptions.settingUrl()}/${settingId}`, form, {
            observe: 'body',
            responseType: 'json'
        }).subscribe(
            (result) => {
                this.connected = true;
                const data = result['data'];
                console.log(result);
                this.updateLocalSetting(setting, index);
              }, (err: HttpErrorResponse)  => {
                console.error(err);
                          // TODO check 404 then
            this.connected = false;
                this.updateLocalSetting(setting, index);
                this.popup('opeartion', 'update');
              }
        );
    }

    updateLocalSetting(setting: Setting, index: number) {
        let update = true;
        let fail = false;
        console.log(setting.key());
        switch (setting.key()) {
            case 'host': // host setting
                update = this.onUpdateHost(setting, update, fail);
                break;
            default:
                fail = true;
                break;
        }

        if (update) {
            this.onLocalSettingUpdated(setting, index);
        }
    }

    onUpdateHost(setting: Setting, update: boolean, fail: boolean) {
         // assigned option should different from old one
        const oldValue = this.settings[0].value();
        const assignedValue = this.setHost(setting.value());
        setting.setValue(assignedValue);
        fail = assignedValue === oldValue ? true : false;
        if (fail) {
            update = false;
            this.settingUpdated.next(new SettingState(setting.settingId(), 1, false));
        } else {
            // TODO fetch host here first
            update = true;
            this.getSettingListByOptions(); // temp solution
            this.popup('host', assignedValue);
        }
        return update;
    }

    onLocalSettingUpdated(newSetting: Setting,  index: number) {
        // this.settings.map(setting => {
        //     if (setting.settingId() === newSetting.settingId()
        //     && (setting.value() !== newSetting.value() || setting.key()) !== newSetting.key()) {
        //         setting.setKey(newSetting.key());
        //         setting.setValue(newSetting.value());
        //     }
        // });

        this.settings[index] = newSetting;

        this.settingsChanged.next(this.settings.slice());
        // TODO change it to id
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

    isRemovable(pendingRemovalKey: string) {
        const removals = this.defaultSettings.filter(setting =>
            setting.key() === pendingRemovalKey
        );

        if ( removals && removals.length > 0  ) {
            return false;
        }
        return true;
    }

    isKeyTaken() {

    }

    setSettings(data) {
        const settings = data['settings'].map(
          seetingRaw => new Setting(seetingRaw)
        );
        // unshift host setting into the array
        settings.unshift(this.settings[0]);
        this.settings = settings;
        console.log(this.settings);
        this.settingsChanged.next(this.settings);
    }

    // given default setting
    // if exist
    // grab
    // not exist
    // use default
    // and populate?
    defaultSettingsLookup() {
// select count(*) from universal is key in []
    }

    populateSettings () {

    }

    popup(key: string, value: string) {
        const popObject = {'poped': true};
        popObject[key] = value;

        setTimeout(() => {
            this.poped.next(popObject);
        }, 100);
    }

    // TODO this will be replaced by fecth
    isConnected() {
        return this.connected;
    }
}
