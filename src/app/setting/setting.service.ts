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
        new Setting({key: 'map_background_url', value: 'http://www.ubqsys.com/assets/img/solution/store_floorplan.jpg', id: 1}),
        new Setting({key: 'map_domain_x', value: '100', id: 2}),
        new Setting({key: 'map_domain_y', value: '50', id: 3}) ];

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

        this.settings = this.defaultSettings;
        this.populateSettings();
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
            this.addLocalSetting(form, result['data']['setting_id']);
        }, (err: HttpErrorResponse)  => {
            console.error(err);
            // TODO check 404 then
            this.connected = false;
            this.popup('opeartion', 'add');
            this.addLocalSetting(form, 40400 + this.settings.length);
        });
    }

    addLocalSetting(form: object, settingId: number) {
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
        console.log(`${this.httpOptions.settingUrl()}${urlSuffix}`);
        return this.httpClient.get(`${this.httpOptions.settingUrl()}${urlSuffix}`, {
            observe: 'body',
            responseType: 'json',
            params: options
          })
          .subscribe(
              (result) => {
                this.connected = true;
                const data = result['data'];
                console.log(data);
                const settings = data['settings'].map(
                    seetingRaw => new Setting(seetingRaw)
                  );
                this.setSettings(settings);
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
            update = true;
            // FIXME => populate later?
            this.defaultSettingsLookup();
            this.popup('host', assignedValue);
        }
        return update;
    }

    onLocalSettingUpdated(newSetting: Setting,  index: number) {
        this.settings[index] = newSetting;

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

    isRemovable(pendingRemovalKey: string) {
        const removals = this.defaultSettings.filter(setting =>
            setting.key() === pendingRemovalKey
        );

        if ( removals && removals.length > 0  ) {
            return false;
        }
        return true;
    }

    isKeyTaken(data) {
        return this.settings.filter(setting => setting.key() === data).length > 0;
    }

    setSettings(newSettings: Setting[]) {
        // unshift host setting into the array
        // settings.unshift(this.settings[0]);
        this.settings = this.settings.slice(0, 1).concat(newSettings);
        console.log(this.settings);
        this.settingsChanged.next(this.settings);
    }

    // check if defualt exist in host db, popualte the defualt setting unleess exist
    defaultSettingsLookup() {
        const urlSuffix = '/default';
        const defaultSetting = this.defaultSettings.slice();
        defaultSetting.shift();
        return this.httpClient.post(`${this.httpOptions.settingUrl()}${urlSuffix}`, defaultSetting, {
            observe: 'body',
            responseType: 'json'
        }).subscribe((result) => {
            this.connected = true;
            console.log('DEBUG', 'defualt');
            this.getSettingListByOptions();
        }, (err: HttpErrorResponse)  => {
            this.popup('opeartion', 'post');
            console.error(err);
        });
    }

    restoreDefaultSettings() {
        const urlSuffix = '/restore';
        const defaultSetting = this.defaultSettings.slice();
        defaultSetting.shift();
        return this.httpClient.post(`${this.httpOptions.settingUrl()}${urlSuffix}`, defaultSetting, {
            observe: 'body',
            responseType: 'json'
        }).subscribe((result) => {
            this.connected = true;
            console.log('DEBUG', 'defualt');
            this.getSettingListByOptions();
        }, (err: HttpErrorResponse)  => {
            this.restoreLocalSettingsToDefault();
            this.popup('opeartion', 'post');
            console.error(err);
        });
    }

    restoreLocalSettingsToDefault() {
        const newtSettings = this.defaultSettings;
        this.setSettings(newtSettings);
    }


    populateSettings() {
        const urlSuffix = '/populate';
        const defaultSetting = this.defaultSettings.slice();
        defaultSetting.shift();
        return this.httpClient.post(`${this.httpOptions.settingUrl()}${urlSuffix}`, defaultSetting, {
            observe: 'body',
            responseType: 'json'
        }).subscribe((result) => {
            this.connected = true;
            this.getSettingListByOptions();
        }, (err: HttpErrorResponse)  => {
            this.popup('opeartion', 'get');
            console.error(err);
            // TODO check 404 then
        });
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

    getDefaultSettingValues ()  {
        let changedSettingCount = 0;

        this.defaultSettings.forEach(defaultSetting => {
            if (defaultSetting.key() === 'host') {
                return;
            }
            this.settings.forEach(setting => {
                if (setting.key() === defaultSetting.key()) {
                    setting.setValue(defaultSetting.value());
                    changedSettingCount ++;
                }
            });
        });

        if (changedSettingCount === this.defaultSettings.length - 1) {
          // TODO matched
        } else {
            // TODO not matched populate
        }
    }

    getMapSettingBase() {
        let doamin_x = this.settings.find(setting => setting.key() === 'map_domain_x');
        let domain_y = this.settings.find(setting => setting.key() === 'map_domain_y');

        if (!doamin_x || !domain_y) {
            doamin_x = this.defaultSettings.find(setting => setting.key() === 'map_domain_x');
            domain_y = this.defaultSettings.find(setting => setting.key() === 'map_domain_y');
        }

        return {width: +doamin_x.value(), height: +domain_y.value()};
    }
}
