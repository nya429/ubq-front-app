// import { Address } from './address.model';
import { FormControl, FormGroup } from '@angular/forms';
export class Company {
    public companyId: number;
    public name: string;
    public info: String;
    public address: string;
    public addressStreet1: string;
    public addressStreet2: string;
    public addressCity: string;
    public addressState: string;
    public addressZip: string;
    public addressCountry: string;
    public contactName: string;
    public contactTitle: string;
    public contactFirstName: string;
    public contactLastName: string;
    public contactPhone: string;
    public contactEmail: string;
    public avatarUri: string;
    public createTime: number;
    public updateTime: number;
    public participantCnt: number;

    constructor(company: any) {
        // if (company.hasOwnProperty('value')) {
        //     this.name = company.value['name'];
        //     this.info = company.value['info'];
        //     this.address = JSON.stringify(new Address(company.value['addressStreet1'],
        //     company.value['addressStreet2'], company.value['addressCity'], company.value['addressState']
        //       , company.value['addressZip'], company.value['addressCountry'] ));
        //     this.contactName = JSON.stringify(new Contact(company.value['contactFirstName'],
        //     company.value['contactLastName'], company.value['contactTitle']));
        //     this.contactPhone = JSON.stringify(new ContactPhone(company.value['contactPhone'], company.value['contactEmail'])) ;
        //     this.avatarUri = company.value['avatarUri'];

        // } else {
            this.companyId = company.company_id;
            this.name = company.name;
            this.info = company.info;
            this.address = company.address;
            this.addressStreet1 = company.address_street_1;
            this.addressStreet2 = company.address_street_2;
            this.addressCity = company.address_city;
            this.addressState = company.address_state;
            this.addressZip = company.address_zip;
            this.addressCountry = company.address_country;

            this.contactTitle = company.contact_title;
            this.contactFirstName = company.contact_first_name;
            this.contactLastName = company.contact_last_name;

            this.contactPhone = company.contact_phone;
            this.contactEmail  = company.contact_email;

            this.contactName = company.contact_name;
            this.avatarUri = company.avatar_uri;
            this.createTime = company.create_time;
            this.updateTime = company.update_time;
            this.participantCnt = company.p_cnt;
        // }
    }
}

// export class Contact {
//     constructor(
//         public firstName: string,
//         public lastName: string,
//         public title: string
//     ) { }
// }

// export class ContactPhone {
//     constructor(
//         public phone: string,
//         public email: string,
//     ) { }
// }
