export class Setting {
    private _settingId: number;
    private _key: string;
    private _value: string;

    constructor(setting) {
        this._key = setting.key;
        this._value = setting.value;
        this._settingId = setting.id;
    }

    setValue(value: string) {
        this._value = value;
    }

    setKey(key: string) {
        this._key = key;
    }

    setId(id:number) {
        this._settingId = id;
    }

    key() {
        return this._key;
    }

    value() {
        return this._value;
    }

    settingId() {
        return this._settingId;
    }
}
