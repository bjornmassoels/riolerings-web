import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { environment } from 'environments/environment';
import { Group } from '../models/groups';
import { tap } from 'rxjs/operators';
import { Project } from 'models/project';
import { SlokkerProjects } from '../models/slokker-projects';
import {User} from "../models/user";
import {Company} from "../models/company";
import { FormService } from './form.service';
import {LambertObject} from "../models/lambertObject";
import {Meerwerk} from "../models/meerwerk";
import {Router} from "@angular/router";
import { SendPdfID } from '../models/sendPdfID';
import { saveAs } from 'file-saver';
import { firstValueFrom } from 'rxjs';
import { Schademelding } from '../models/schademelding';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private _token = '';
  public userId = '';
  public isAdmin: boolean = false;
  public isCompanyAdmin: boolean = false;
  public isMobileUser: boolean = false;
  public companyid = '';
  public thisCompany: Company;
  public role = '';
  private requestHeader: HttpHeaders;
  private apiURL = environment.apiURL;

  constructor(private authService: NbAuthService,
    private http: HttpClient,
    private formService: FormService, private router: Router) {
    this.authService
      .onTokenChange()
      .subscribe(async (token: NbAuthJWTToken) => {
        this._token = 'Bearer ' + token.getValue().split('||')[1];
        this.userId = token.getValue().split('||')[0];
        this.companyid = token.getValue().split('||')[2];
        this.role = token.getValue().split('||')[3];
        if(this.role === 'admin'){
          this.isAdmin = true;
          this.isMobileUser = false;
        } else if(this.role === 'CompanyAdmin'){
          this.isCompanyAdmin = true;
          this.isMobileUser = false;
        } else {
          if(router.url.substr(0,22) !== '/auth/recover-password'){
            this.isMobileUser = true;
            this.router.navigate(['/auth/login']);
          }
        }
        this.requestHeader = new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: this._token,
          userid: this.userId,
          companyid: this.companyid,
        });
      });
  }


  public getProjects() {
    let headers = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: this._token,
        companyid: this.companyid
      },
    };
    return this.http.get(this.apiURL + '/projects.list',
      headers
    );
  }
  public getUsers() {
    return this.http.get(this.apiURL + '/users.list', {
      headers: this.requestHeader,
    });
  }
  public getUserById() {
    let headers = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: this._token,
        userid: this.userId,
      },
    };
    return this.http.get(this.apiURL + '/users.getUserInfoById', headers);
  }
  public getUser(_id: string) {
    let headers = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: this._token,
        _id: _id,
      },
    };
    return this.http.get(this.apiURL + '/users.id', headers);
  }
  public getAanluitingCount() {
    return this.http.get(this.apiURL + '/projects.getAansluitingCount', {
      headers: this.requestHeader,
    });
  }

  public getTotalStatistics(itemChoice: string, time: string, finished: string, datum: string, stukSelected: string){
    let header = {
        'Content-Type': 'application/json',
        Authorization: this._token,
        itemchoice: itemChoice,
        time: time,
        finished: finished,
        datum: datum,
        stuk: stukSelected,
        companyid: this.companyid
    };
    return this.http.get(this.apiURL + '/statistics.getTotalStatistics', {headers: header});
  }
  public getSlokkerProjects() {
    return this.http.get(this.apiURL + '/slokkerprojects.list', {
      headers: this.requestHeader,
    });
  }
  public getGroupById(groupId: string) {
    let headers = {
      'Content-Type': 'application/json',
      Authorization: this._token,
      userid: this.userId,
      _id: groupId,
    };
    return this.http.get(this.apiURL + '/groups.id ', {
      headers: headers,
    });
  }
  public async getGroupByIdWithoutSubscribe(groupId: string) {
    let headers = {
      'Content-Type': 'application/json',
      Authorization: this._token,
      userid: this.userId,
      _id: groupId,  // Note: This might be incorrect usage for headers. Typically, '_id' wouldn't be passed as a header.
    };
    const response = await firstValueFrom(this.http.get(this.apiURL + '/groups.id ', { headers: headers }));
    return response;
  }
  public getGroupByIdLighterVersion(groupId: string) {
    let headers = {
      'Content-Type': 'application/json',
      Authorization: this._token,
      userid: this.userId,
      _id: groupId,
    };
    return this.http.get(this.apiURL + '/groups.idWebsite ', {
      headers: headers,
    });
  }
  public addPostNumbersToGroup(group: Group) {
    return this.http.post(
      this.apiURL + '/groups.addPostNumbers',
      JSON.stringify(group),
      {
        headers: this.requestHeader,
      },
    );
  }
  public getProjectById(id: string) {
    let headers = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: this._token,
        userid: this.userId,
        _id: id,
      },
    };
    return this.http.get(this.apiURL + '/projects.id', headers);
  }

  public deleteProjectById(project: Project) {
    return this.http.post(
      this.apiURL + '/projects.delete',
      JSON.stringify(project),
      {
        headers: this.requestHeader,
      },
    );
  }

  public deleteSlokkerById(slokkerProject: SlokkerProjects) {
    return this.http.post(
      this.apiURL + '/slokkerprojects.delete',
      JSON.stringify(slokkerProject),
      {
        headers: this.requestHeader,
      },
    );
  }

  public deleteGroupById(group: Group) {
    return this.http.post(
      this.apiURL + '/groups.delete',
      JSON.stringify(group),
      {
        headers: this.requestHeader,
      },
    );
  }

  forgotPassword(email: string) {

    const header = new HttpHeaders({
      'Content-Type': 'application/json',
      email: email,
    });
    return this.http
      .get(this.apiURL + '/users.sendPasswordRecovery', {
        headers: header,
      })
      .pipe(tap((x) => {}));
  }

  recoverPassword(wachtwoord: string, code: string, id: string) {
    const header = new HttpHeaders({
      'Content-Type': 'application/json',
      password: wachtwoord,
      code: code,
      id: id,
    });
    return this.http
      .get(this.apiURL + '/users.recoverPassword', {
        headers: header,
      })
      .pipe(tap((x) => {}));
  }
  public getAllGroups() {
    return this.http.get(this.apiURL + '/groups.getAllGroups', {
      headers: this.requestHeader,
    });
  }
  public getGroupsArchive() {
    return this.http.get(this.apiURL + '/groups.archive', {
      headers: this.requestHeader,
    });
  }
  public sendInvoice(company: Company, fromDate: string, toDate: string) {
    let header = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this._token,
      userid: this.userId,
      companyid: this.companyid,
      fromdate: fromDate,
      todate: toDate
    });
    return this.http.post(
      this.apiURL + '/companys.sendInvoice',
      JSON.stringify(company),
      {
        headers: header,
      },
    );
  }

  public createGroup(group: Group) {
    return this.http.post(
      this.apiURL + '/groups.create',
      JSON.stringify(group),
      {
        headers: this.requestHeader,
      },
    );
  }

  public updateGroup(group: Group) {
    if(group._id == null){
      group._id = group.id;
    }
    return this.http.post(
      this.apiURL + '/groups.update',
      JSON.stringify(group),
      {
        headers: this.requestHeader,
      },
    );
  }

  public updateUser(user: User) {
    let header = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this._token,
      userid: this.userId,
      companyid: this.companyid,
      _id: user._id
    });
    return this.http.post(
      this.apiURL + '/users.update',
      JSON.stringify(user),
      {
        headers: header,
      },
    );
  }

  getSlokkerProjectById(_id: string) {
    let headers = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: this._token,
        userid: this.userId,
        _id: _id,
      },
    };
    return this.http.get(this.apiURL + '/slokkerprojects.id', headers);
  }

  getCompany() {
    let headers = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: this._token,
        _id: this.companyid,
      },
    };
    return this.http.get(this.apiURL + '/companys.id', headers);
  }

  updateCompany(company) {
    return this.http.post(
      this.apiURL + '/companys.update',
      JSON.stringify(company),
      {
        headers: this.requestHeader,
      },
    );
  }

  updateProject(project: Project) {
    return this.http.post(
      this.apiURL + '/projects.createOrUpdate',
      JSON.stringify(project),
      {
        headers: this.requestHeader,
      },
    );
  }

  updateSlokkerProject(slokkerProject: SlokkerProjects) {
    return this.http.post(
      this.apiURL + '/slokkerprojects.createOrUpdate',
      JSON.stringify(slokkerProject),
      {
        headers: this.requestHeader,
      },
    );
  }

  deleteUser(deleteUser: User) {
      return this.http.post(
        this.apiURL + '/users.delete',
        JSON.stringify(deleteUser),
        {headers: this.requestHeader},
      );
  }

   createMultipleProjects(data: any, group: Group, isIncremented: string, huisnummers: number[], isLot: string) {
    let header = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this._token,
      userid: this.userId,
      companyid: this.companyid,
      isincremented: isIncremented,
      islot: isLot
    });
      if(group._id == null){
        group._id = group.id;
      }
      data.huisNummers = huisnummers;
      data.group_id = group._id;
      return this.http.post(
        this.apiURL + '/projects.createMultipleProjects',
        JSON.stringify(data),
        {
          headers: header,
        },
      );
  }

  createMultipleProjectsExcel(projectList: Project[], currentSlokkerProjects: SlokkerProjects[], group: Group) {
    let headers = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: this._token,
        companyid: this.companyid,
        groupid: group._id
      },
    };
    let sendObject = { projectList: projectList, slokkerProjectList: currentSlokkerProjects };
    return this.http.post(
      this.apiURL + '/projects.createMultipleProjectsExcel',
      JSON.stringify(sendObject),
      headers
    );
  }

  addUser(user: User) {
    let headers = {
      headers: {
        'Content-Type': 'application/json'
      },
    };
    return this.http.post(
      this.apiURL + '/users.create',
      JSON.stringify(user),
        headers
      ,
    );
  }

  createSlokkerProject(slokkerProjectSend: SlokkerProjects, group_id: string) {
    let headers = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: this._token,
        companyid: this.companyid,
        groupid: group_id
      },
    };
    return this.http.post(
      this.apiURL + '/slokkerprojects.create',
      JSON.stringify(slokkerProjectSend),
      headers
    );
  }

  setLambertCoordinates(groupid: string, arraylist: LambertObject[]) {
    let headers = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: this._token,
        companyid: this.companyid,
        groupid: groupid
      },
    };
    return this.http.post(
      this.apiURL + '/projects.setLambertCoordinates',
      JSON.stringify(arraylist),
      headers
    );
  }

  getMeerwerkById(_id: string) {
    let headers = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: this._token,
        _id: _id,
      },
    };
    return this.http.get(this.apiURL + '/meerwerken.id', headers);
  }

  deleteMeerwerkById(deleteMeerwerk: Meerwerk) {
    let headers = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: this._token,
        companyid: this.companyid
      },
    };
    return this.http.post(
      this.apiURL + '/meerwerken.delete',
      JSON.stringify(deleteMeerwerk),
      headers
    );
  }

  updateMeerwerk(meerwerkSend: Meerwerk, _id?) {
    return this.http.post(
      this.apiURL + '/meerwerken.createOrUpdate',
      JSON.stringify(meerwerkSend),
      {
        headers: this.requestHeader,
      },
    );
  }

  getMeerwerken() {
    let headers = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: this._token,
        companyid: this.companyid
      },
    };
    return this.http.get(this.apiURL + '/meerwerken.list', headers);
  }

  getAllGroupsNoProjects() {
    return this.http.get(this.apiURL + '/groups.getAllGroupsNoProjects', {
      headers: this.requestHeader,
    });
  }

  updateSettings(group: Group) {
    if(group._id == null){
      group._id = group.id;
    }
    return this.http.post(
      this.apiURL + '/groups.updateSettings',
      JSON.stringify(group),
      {
        headers: this.requestHeader,
      },
    );
  }

  updateUserInfo(user: User) {
    let header = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this._token
    });
    return this.http.post(
      this.apiURL + '/users.updateUser',
      JSON.stringify(user),
      {
        headers: header,
      },
    );
  }

  updateTotalenMeetstaat(group: Group) {
    if(group._id == null){
      group._id = group.id;
    }
    return this.http.post(
      this.apiURL + '/groups.updateTotalenMeetstaat',
      JSON.stringify(group),
      {
        headers: this.requestHeader,
      },
    );
  }

  archiveGroup(group: Group, isarchive: boolean) {
    let header = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this._token,
      _id: group._id,
      isarchive: isarchive.toString()
    });
    return this.http.get(this.apiURL + '/groups.archiveGroup', {headers: header});
  }

  makePdf(pdfIds: SendPdfID, groupId: string, pdfBenaming: string) {
    let header = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this._token,
      groupid: groupId,
      companyid: this.companyid,
      userid: this.userId,
      pdfBenaming: pdfBenaming
    });

    return this.http.post(
      this.apiURL + '/makePDF',
      JSON.stringify(pdfIds),
      {
        headers: header
      },
    );
  }

  makeHuisaansluitingPdf(id: string, title: string) {
    let headers = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: this._token,
        id: id,
        bestandnaam: title
      },
    };
    return this.http.get(this.apiURL + '/projects.makeHuisaansluitingPdf', headers);
  }

  makeKolkPdf(_id: string, title: string) {
    let headers = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: this._token,
        id: _id,
        bestandnaam: title
      },
    };
    return this.http.get(this.apiURL + '/projects.makeKolkPdf', headers);
  }

  getGroupSettingsVariables() {
    let headers = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: this._token,
        companyid: this.companyid
      },
    };
    return this.http.get(this.apiURL + '/groups.getGroupSettingsVariables', headers);
  }

  sendAccountDeletionRequest(user: string) {
    let headers = {
      headers: {
        'Content-Type': 'application/json',
        userid: user
      },
    };
    return this.http.get(this.apiURL + '/users.sendAccountDeletionRequest', headers);
  }

  getConnectedUsersOfGroups() {
    let headers = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: this._token,
        companyid: this.companyid
      },
    };
    return this.http.get(this.apiURL + '/groups.getConnectedUsersOfGroups', headers);
  }

  makeMeerwerkPdf(_id: string) {
    let headers = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: this._token,
        _id: _id
      },
    };
    return this.http.get(this.apiURL + '/meerwerken.makeMeerwerkPdf', headers);
  }

  getLastWorkerDateOfSlokker(_id: string): Promise<any> {
    let headers = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: this._token,
        _id: _id
      },
    };
    return firstValueFrom(this.http.get(this.apiURL + '/slokkerprojects.getLastWorkerDate', headers));
  }

  getSchademeldingen(groupId: string) {
    if(groupId == null) groupId = '';
    let headers = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: this._token,
        companyid: this.companyid,
        groupid: groupId
      },
    };

    return this.http
      .get( this.apiURL + '/schademeldings.list' , headers)
      .pipe(tap((x) => {}));
  }

  deleteSchademelding(schademelding: Schademelding) {
    let headers = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: this._token
      },
    };
    return this.http.post(
      this.apiURL + '/schademeldings.delete',
      JSON.stringify(schademelding),
      headers
    );
  }

  getSchademelding(_id: string) {
    let headers = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: this._token,
        _id: _id
      },
    };

    return this.http
      .get( this.apiURL + '/schademeldings.id' , headers)
      .pipe(tap((x) => {}));
  }

  updateSchademelding(data: Schademelding) {
    let headers = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: this._token
      },
    };

    return this.http.post(
      this.apiURL + '/schademeldings.update',
      JSON.stringify(data),
      headers
    );
  }

  getPopulatedSchademelding(_id: string) {
    let headers = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: this._token,
        _id: _id
      },
    };

    return this.http
      .get( this.apiURL + '/schademeldings.getPopulatedSchademelding' , headers)
      .pipe(tap((x) => {}));
  }

  updateSchademeldingHasBeenViewed(_id: string) {
    let headers = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: this._token,
        companyid: this.companyid,
        _id: _id
      },
    };

    return this.http
      .get( this.apiURL + '/schademeldings.updateSchademeldingHasBeenViewed' , headers)
      .pipe(tap((x) => {}));
  }

  createSchademelding(schademelding: Schademelding) {
    let headers = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: this._token,
        companyid: this.companyid
      },
    };
    schademelding.company_id = this.companyid;

    return this.http.post(
      this.apiURL + '/schademeldings.create',
      JSON.stringify(schademelding),
      headers
    );
  }

  updateMeerwerkHasBeenViewed(_id: string) {
    let headers = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: this._token,
        companyid: this.companyid,
        _id: _id
      },
    };

    return this.http
      .get( this.apiURL + '/meerwerken.updateMeerwerkHasBeenViewed' , headers)
      .pipe(tap((x) => {}));
  }

  makeOwAndSchademeldingPdfZip(sendIdArrays: any, _id: string) {
    let headers = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: this._token,
        companyid: this.companyid,
        groupid: _id
      },
    };

    return this.http.post(
      this.apiURL + '/makeOwAndSchademeldingPdfZip',
      JSON.stringify(sendIdArrays),
      headers
    );
  }

  makeSchademeldingPdf(_id: string) {
    let headers = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: this._token,
        _id: _id
      },
    };
    return this.http.get(this.apiURL + '/schademeldings.makeSchademeldingPdf', headers);
  }
}
