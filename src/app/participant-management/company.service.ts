import { FormGroup } from '@angular/forms';
import { Injectable, EventEmitter } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';

import { Subject } from 'rxjs/Subject';

import { Company } from './../shared/company.model';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { SettingService } from './../setting/setting.service';

@Injectable()
export class CompanyService {
    companysChanged = new Subject<Company[]>();
    companyChanged = new Subject<Company>();
    paginateChanged = new Subject<object>();
    termChanged = new Subject<string>();
    orderChanged = new Subject();

    private company: Company;
    private companys: Company[];
    private paginageConf: object;
    private sortBy: string;
    private orderBy: string;
    private limit: number;
    private term: string;
    private resultCode: number;
    private httpOptions;

    constructor(private httpClient: HttpClient,
      private settingService: SettingService) {
        this.httpOptions = {
           headers: new HttpHeaders({
             'Content-Type':  'application/json',
             'Authorization': 'my-auth-token'
           }),
           companyUrl: () => this.settingService.getApis('company'),
           // url: 'http://192.168.0.108:3000/participant'
         };
       }

    getCompanyListByOptions(offset?: number, limit?: number) {
    const urlSuffix = this.term ? '/search' : '/list';
    let options = new HttpParams();
    if (offset) {
        options = options.append('offset', offset.toString());
    }
    if (this.limit) {
        options = options.append('ltd', this.limit.toString());
    }
    if (this.sortBy) {
        options = options.append('sortBy', this.sortBy.toString()).append('orderBy', this.orderBy);
    }
    if (this.term) {
        options = options.append('term', this.term);
    }

    return this.httpClient.get(`${this.httpOptions.companyUrl()}${urlSuffix}`, {
        observe: 'body',
        responseType: 'json',
        params: options
        })
        .subscribe(
            (result) => {
            const data = result['data'];
            this.setCompanies(data);
            }, (err: HttpErrorResponse)  => {
            console.error(err);
            }
        );
    }

    setCompanies(data) {
        const companys = data['companies'].map(
          companysRaw => new Company(companysRaw)
        );
        this.companys = companys;
        this.paginageConf = {
          count: data.count,
          offset: data.offset,
          limit: data.limit,
        };
        this.companysChanged.next(this.companys.slice());
        this.paginateChanged.next(this.paginageConf);
      }

      setLimit(limit?: number) {
        this.limit = limit;
      }

      getTerm() {
        return this.term;
      }

      getCompanyById(companyId: number) {
        if (this.companys && this.companys.filter(item => item.companyId === companyId)[0]) {
          this.company = this.companys.filter(item => item.companyId === companyId)[0];
          this.companyChanged.next(this.company);
        } else {
          return this.httpClient.get(`${this.httpOptions.companyUrl()}/${companyId}`, {
            observe: 'body',
            responseType: 'json',
          }).subscribe(
            data => {
              this.company = new Company(data['data']);
              this.companyChanged.next(this.company);
            },
            error => this.handleError(error));
        }
      }

      handleError(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
          console.error('An error occurred:', error.error.message);
        } else {
          // The backend returned an unsuccessful response code.
          // The response body may contain clues as to what went wrong,
          console.error(
            `Backend returned code ${error['code']}, ` +
            `body was: ${error.message}`);
        }
        // return an ErrorObservable with a user-facing error message
        return new ErrorObservable(
          'Something bad happened; please try again later.');
      }

      addCompany(companyForm: FormGroup) {
        const urlSuffix = '/new';
        return this.httpClient.post(`${this.httpOptions.companyUrl()}${urlSuffix}`, companyForm, {
          observe: 'body',
          responseType: 'json'
        });
      }

    updateCompanyById(companyId: number, patch: Object) {
        if (!companyId) {
          return;
        }
        return this.httpClient.patch(`${this.httpOptions.companyUrl()}/${companyId}`, patch, {
          observe: 'body',
          responseType: 'json'
        });
      }

      deleteCompanyById(companyId: number) {
        return this.httpClient.delete(`${this.httpOptions.companyUrl()}/${companyId}`, {
          observe: 'body',
          responseType: 'json'
        });
      }

      getCompanys(term: string) {
        if (!term) {
          return;
        }
        let options = new HttpParams();
        options = options.append('name', term.trim());
        return this.httpClient.get(`${this.httpOptions.companyUrl()}/lookup`, {
          observe: 'body',
          responseType: 'json',
          params: options
        });
     }
}
