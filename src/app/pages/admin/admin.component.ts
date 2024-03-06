import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { UntypedFormBuilder, FormGroup, FormArray } from '@angular/forms';
import { NbToastrService } from '@nebular/theme';
import {ApiService} from "../../../services/api.service";
import {FormService} from "../../../services/form.service";
import {Router} from "@angular/router";
import { CompanyAdmin } from 'models/companyAdmin';
import moment from 'moment';
import { Company } from '../../../models/company';

@Component({
  selector: 'ngx-categories-add',
  templateUrl: './admin.component.html',
  styleUrls: [ './admin.component.scss', '../styles/item-table.scss']
})

export class AdminComponent implements OnInit {

  public companyList: CompanyAdmin[] = [];
  public isAdmin: boolean = false;
  public fromDate: Date;
  public toDate: Date;
  public isLoaded: boolean = false;
  public totaalPrijs: number = 0;
  maandSelector: any;
  selux: Company;
  accountDeletionRequestString: string = '';
  constructor(
    private formBuilder: UntypedFormBuilder,
    private apiService: ApiService,
    private toastrService: NbToastrService,
    private formService: FormService,
    private router: Router
  ) {
    this.isAdmin = this.apiService.isAdmin;
    let start = moment().startOf('month').toDate().toString();
    let end = moment().endOf('month').toDate().toString();
    this.fromDate = new Date(start);
    this.toDate = new Date(end);
    this.maandSelector = this.fromDate.getMonth().toString();
    this.apiService.getAanluitingCount().subscribe(x => {

      this.companyList = x as CompanyAdmin[];
      for(let companyAdmin of this.companyList){
        companyAdmin.company.projectsPaid = companyAdmin.projectsPaid;
        companyAdmin.company.projectsUnPaid = companyAdmin.projectsUnPaid;
        companyAdmin.company.projectsDeleted = companyAdmin.projectsDeleted;
        companyAdmin.company.slokkerProjectsPaid = companyAdmin.slokkerProjectsPaid;
        companyAdmin.company.slokkerProjectsUnPaid = companyAdmin.slokkerProjectsUnPaid;
        companyAdmin.company.slokkerProjectsDeleted = companyAdmin.slokkerProjectsDeleted;
        companyAdmin.company.totaalPrijs = companyAdmin.totaalPrijs;
        this.totaalPrijs += companyAdmin.totaalPrijs;
      }
      this.accountDeletionRequestString = this.companyList.find(x => x.company._id === '113707516865cd044e87ef10').company.accountDeletionRequests.join(' , ');
      this.companyList.sort((a, b) => a.company._id.localeCompare(b.company._id));
      this.isLoaded = true;
    });
  }

  async ngOnInit() {
  }

  async sendInvoice(company: CompanyAdmin) {
    if(this.maandSelector.value !== this.fromDate.getMonth().toString()){
      this.fromDate.setMonth(+this.maandSelector);
      let start = moment(this.fromDate.toDateString()).startOf('month').toDate().toString();
      let end = moment(this.fromDate.toDateString()).endOf('month').toDate().toString();
      this.fromDate = new Date(start);
      this.toDate = new Date(end);
    }
    if(company.company.email != null){
        await this.apiService.sendInvoice(company.company, this.fromDate.toString(), this.toDate.toString()).subscribe(x => {

        });
    }
  }
}
