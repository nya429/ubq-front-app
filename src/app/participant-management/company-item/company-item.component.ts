import { ActivatedRoute, Router, Params } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { Subscription } from 'rxjs/Subscription';

import { Company } from './../../shared/company.model';
import { CompanyService } from './../company.service';
import { StateList, CountryList } from '../../shared/address.model';

@Component({
  selector: 'app-company-item',
  templateUrl: './company-item.component.html',
  styleUrls: ['./company-item.component.css']
})
export class CompanyItemComponent implements OnInit {
  companyId: number;
  company: Company;
  companyForm: FormGroup;
  editMode;
  companyChangedSubscription: Subscription;
  submitSubscription: Subscription;
  resultMessage: string;

  states = [];
  countryList = CountryList;
  stateResultLength = 5;
  emailRegex = /^[_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;
  USPhoneRegex = /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
  USPostalRegex = /^\d{5}(?:[-\s]\d{4})?$/;

  titleList = [ 'Mr', 'Mrs', 'Miss', 'Ms', 'Sir', 'Dr', 'Lady', 'Lord'];

  constructor(private route: ActivatedRoute,
    private router: Router,
    private service: CompanyService) { }

  ngOnInit() {
    this.companyChangedSubscription = this.service.companyChanged.subscribe(
      (company: Company) => {
        this.company = company;
        console.log(this.company.addressStreet1);
        this.companyForm = new FormGroup({
            'name': new FormControl(this.company.name, Validators.required),
            'info': new FormControl(this.company.info),
            'addressStreet1': new FormControl(this.company.addressStreet1, Validators.required),
            'addressStreet2': new FormControl(this.company.addressStreet2, Validators.required),
            'addressCity': new FormControl(this.company.addressCity, Validators.required),
            'addressState': new FormControl(this.company.addressState, Validators.required),
            'addressZip': new FormControl(this.company.addressZip, Validators.required),
            'addressCountry': new FormControl(this.company.addressCountry, Validators.required),
            'contactTitle': new FormControl(this.company.contactTitle),
            'contactFirstName': new FormControl(this.company.contactFirstName, Validators.required),
            'contactLastName': new FormControl(this.company.contactLastName, Validators.required),
            'contactPhone': new FormControl(this.company.contactPhone, Validators.required),
            'contactEmail': new FormControl(this.company.contactEmail, Validators.required),
            'avatarUri': new FormControl(this.company.avatarUri),
        });
      });
      this.route.params.subscribe((params: Params) => {
      this.editMode = 'id' in params;
      this.companyId = this.editMode ? +params['id'] : null;
      this.initForm();
    });
  }

  private initForm() {
    const name = '';
    const info = '';
    const addressStreet1 = '';
    const addressStreet2 = '';
    const addressCity = '';
    const addressState = '';
    const addressZip = '';
    const addressCountry = '';
    const contactTitle = '';
    const contactFirstName = '';
    const contactLastName = '';
    const contactPhone = '';
    const contactEmail = '';
    const avatarUri = '';
   if (this.editMode) {
    this.service.getCompanyById(this.companyId);
   } else {
    this.companyForm = new FormGroup({
      'name': new FormControl(name, Validators.required),
      'info': new FormControl(info),
      'addressStreet1': new FormControl(addressStreet1, Validators.required),
      'addressStreet2': new FormControl(addressStreet2),
      'addressCity': new FormControl(addressCity, Validators.required),
      'addressState': new FormControl(addressState, [Validators.required, this.stateValidate.bind(this)]),
      'addressZip': new FormControl(addressZip, [Validators.required, Validators.pattern(this.USPostalRegex)]),
      'addressCountry': new FormControl(addressCountry),
      'contactFirstName': new FormControl(contactFirstName, Validators.required),
      'contactLastName': new FormControl(contactLastName, Validators.required),
      'contactTitle': new FormControl(contactTitle),
      'contactPhone': new FormControl(contactPhone, [Validators.required, Validators.pattern(this.USPhoneRegex)]),
      'contactEmail': new FormControl(contactEmail, [Validators.required, Validators.pattern(this.emailRegex)]),
      'avatarUri': new FormControl(avatarUri),
    });
   }
  }

  onSubmit() {
    this.companyForm.patchValue(
      {contactPhone: this.companyForm.value.contactPhone.replace(/[\s.-]/g, ''),
    });

    const submit = this.service.addCompany(this.companyForm.value);

    this.submitSubscription = submit.subscribe(result => {
      const code = result['code'];
      this.resultMessage = this.editMode ? 'Update Success' : 'Company added';
      setTimeout(() => {
        this.router.navigate(['/visitor/company']);
      }, 1500);
    }, (err)  => {
      this.service.handleError(err);
    });
  }

  lookUpState() {
    this.states = [];
    const addressState = this.companyForm.value.addressState;
    const regSt = new RegExp('^' + addressState, 'i');
    const regEl = new RegExp('^' + addressState + '[a-zA-Z]*', 'i');
    for (const state in StateList) {
      if ((state.match(regEl) || StateList[state].match(regEl)) && this.states.length < this.stateResultLength) {
        if (state.match(regSt)) {
          this.states.unshift(state);
          continue;
        }
        this.states.push(state);
      }
    }
  }

  onStateBlur() {
    this.states = [];
  }

  onStateSelected(index: number) {
    this.companyForm.patchValue({
      'addressState': this.states[index]
  });
  this.states = [];
  }

  stateValidate(control: FormControl): {[key: string]: boolean} {
    return ((StateList.hasOwnProperty(control.value)) ||
                     Object.values(StateList).indexOf(control.value) > -1)
                     ? null : {stateCodeInvalid: true};
  }
}
