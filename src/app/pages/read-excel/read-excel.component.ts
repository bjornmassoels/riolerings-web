 import { Component, OnInit } from '@angular/core';
import {Group} from '../../../models/groups';
import * as XLSX from 'xlsx';
import {ExcelObject} from '../../../models/excelObject';
import {ExcelObjectAansluitingen} from '../../../models/excelObjectAansluitingen';
import {Project} from '../../../models/project';
import {UntypedFormBuilder} from "@angular/forms";
import {FormService} from "../../../services/form.service";
import {Router} from "@angular/router";
import {User} from "../../../models/user";
import {ApiService} from "../../../services/api.service";
import {dwaSettings} from "../../../models/dwaSettings";
import {slokkerSettings} from "../../../models/slokkerSettings";
import {rwaSettings} from "../../../models/rwaSettings";
 import { SlokkerProjects } from '../../../models/slokker-projects';

@Component({
  selector: 'read-excel',
  templateUrl: './read-excel.component.html',
  styleUrls: ['./read-excel.component.scss'],
})
export class ReadExcelComponent implements OnInit {
  group: Group;
  title = 'XlsRead';
  file: File;
  heeftploegen: boolean = false;
  arrayBuffer: any;
  filelist: any;
  isLoaded: boolean = false;
  infoForm: any;
  projectList: Project[] = [];
  wachtAansluitingList: Project[] = [];
  slokkerProjectList: SlokkerProjects[] = [];
  allUsers: User[];
  isInfoOpen: boolean = false;

  constructor(private formBuilder: UntypedFormBuilder, private formService:FormService, private router: Router, private apiService: ApiService) {

  }

  ngOnInit(): void {

    this.apiService.getUsers().subscribe(x => {
      this.allUsers = x as User[];
      this.allUsers = this.allUsers
        .filter(user => user.name !== 'bjorn programmeur selux')
        .map(user => {
          if (!user.name) {
            user.name = user.email + this.soortTranslateShort(user.role);
          } else {
            user.name += this.soortTranslateShort(user.role);
          }
          return user;
        })
        this.sortUsers();
      this.infoForm = this.formBuilder.group({
        aannemerNaam: '',
        aannemerProjectNr: '',
        aannemerWerfleider: '',
        users: [],
        //fum/omh
        buisVertMult: 1,
        yStukMult: 0.5,
        bochtMult: 0.3,
        mofMult: 0.15
      });
    });
  }
  convertIdToNameString(user: string) {
    return this.allUsers.find(x => x._id === user).name;
  }
  sortUsers(){
    this.allUsers = this.allUsers.sort((a, b) => {
      if(a.role.localeCompare(b.role) !== 0) return b.role.localeCompare(a.role);
      if(a.name > b.name) return 1;
    });
  }
  addfile(event) {
    this.group = new Group();
    this.file = event.target.files[0];
    const fileReader = new FileReader();
    fileReader.readAsArrayBuffer(this.file);
    fileReader.onload = (e) => {
      this.arrayBuffer = fileReader.result;
      const data = new Uint8Array(this.arrayBuffer);
      const arr = new Array();
      for (let i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
      const bstr = arr.join('');
      const workbook = XLSX.read(bstr, {type: 'binary'});
      const algemeneGegevens = workbook.SheetNames[1];
      const worksheet = workbook.Sheets[algemeneGegevens];
      const arraylist = XLSX.utils.sheet_to_json(worksheet, {raw: true}) as ExcelObject[];
      this.filelist = [];
      this.group.rbNaam = arraylist[1].__EMPTY;
      this.group.rbProjectNr = arraylist[2].__EMPTY;
      this.group.rbProjectNaam = arraylist[3].__EMPTY;
      this.group.rbGemeente = arraylist[4].__EMPTY;

      this.group.bhNaam = arraylist[6].__EMPTY;
      this.group.bhProjectNr = arraylist[7].__EMPTY;
      this.group.bhProjectNaam = arraylist[8].__EMPTY;

      this.group.mogNaam = arraylist[10].__EMPTY;
      this.group.mogProjectNr = arraylist[11].__EMPTY;
      this.group.mogProjectNaam = arraylist[12].__EMPTY;

      this.group.mogNaam = arraylist[10].__EMPTY;
      this.group.mogProjectNr = arraylist[11].__EMPTY;
      this.group.mogProjectNaam = arraylist[12].__EMPTY;

      this.group.gemeenteCode =  arraylist[4].__EMPTY_4;

      this.group.dwaSettings = new dwaSettings();
      this.group.rwaSettings = new rwaSettings();
      this.group.slokkerSettings = new slokkerSettings();

      const huisaansluitingen = workbook.SheetNames[2];
      const worksheet2 = workbook.Sheets[huisaansluitingen];
      const arraylist2 = XLSX.utils.sheet_to_json(worksheet2, {raw: true}) as ExcelObjectAansluitingen[];
      this.filelist = [];
      this.projectList = Project[(arraylist2.length - 5) / 2] = [];
      let aanNemerProjectNr = this.infoForm.get('aannemerProjectNr').value;
      for (let i = 3; i < arraylist2.length - 5; i += 2) {
        const excelObjectAansluitingen = arraylist2[i] as ExcelObjectAansluitingen;
        const project = new Project();
        project.street = excelObjectAansluitingen['Aansluitingen bestaande woningen'];
        project.huisNr = excelObjectAansluitingen.__EMPTY;
        project.equipNrRiolering = excelObjectAansluitingen.__EMPTY_1;
        project.naamFiche = 'GEM=' + this.group.gemeenteCode + ' projectnr= ' + this.group.rbProjectNr + ' / ' + aanNemerProjectNr +
          ' adres=' + project.street + ' ' + project.huisNr + ((project.equipNrRiolering != null && project.equipNrRiolering !== '') ? ' eq=' + project.equipNrRiolering : '');
        this.projectList.push(project);
      }

      const wachtaansluitingen = workbook.SheetNames[3];
      const worksheet3 = workbook.Sheets[wachtaansluitingen];
      const arraylist3 = XLSX.utils.sheet_to_json(worksheet3, {raw: true}) as ExcelObjectAansluitingen[];
      this.wachtAansluitingList = Project[(arraylist3.length - 3) / 2] = [];
      for (let i = 3; i < arraylist3.length - 4; i += 2) {
        const excelObjectAansluitingen = arraylist3[i] as ExcelObjectAansluitingen;
        const project = new Project();
        project.street = excelObjectAansluitingen['Wachtaansluitingen voor onbebouwde percelen'];
        project.index = excelObjectAansluitingen.__EMPTY;
        project.equipNrRiolering = excelObjectAansluitingen.__EMPTY_1;
        project.isWachtAansluiting = true;
        project.naamFiche = 'GEM=' + this.group.gemeenteCode + ' projectnr=' + this.group.rbProjectNr + ' / ' + aanNemerProjectNr +
          ' adres=' + project.street + ((project.huisNr != null && project.huisNr !== '') ?
            ' - ' + project.huisNr : '') + ((project.index != null && project.index !== '')?
            ' volgnr=' + project.index : '') + ' AB-HA-fiche';
        this.wachtAansluitingList.push(project);
      }

      const slokkers = workbook.SheetNames[4];
      const worksheet4 = workbook.Sheets[slokkers];
      const arraylist4 = XLSX.utils.sheet_to_json(worksheet4, {raw: true}) as ExcelObjectAansluitingen[];
      this.slokkerProjectList = SlokkerProjects[arraylist4.length - 3] = [];
       for (let i = 3; i < arraylist4.length - 1; i++) {
        const excelObjectAansluitingen = arraylist4[i] as ExcelObjectAansluitingen;
        const slokkerProject = new SlokkerProjects();
         slokkerProject.street = excelObjectAansluitingen['Kolkaansluitingen'];
         slokkerProject.index = excelObjectAansluitingen.__EMPTY;
         slokkerProject.equipNrRiolering = excelObjectAansluitingen.__EMPTY_1;
         slokkerProject.naamFiche = 'GEM=' + this.group.gemeenteCode + ' projectnr=' + this.group.rbProjectNr +
           ' adres=' + slokkerProject.street +  (slokkerProject.index != null && slokkerProject.index !== ''?
             '-kolknr'  + slokkerProject.index : '') + ' AB-kolk fiche';
        this.slokkerProjectList.push(slokkerProject);
      }
      this.isLoaded = true;
    };
  }

  onSubmitInfo(form) {
    this.group.aannemerNaam = form.aannemerNaam;
    this.group.aannemerWerfleider = form.aannemerWerfleider;
    this.group.aannemerProjectNr = form.aannemerProjectNr;
    this.group.heeftPloegen = this.heeftploegen;
    this.group.buisVertMult = form.buisVertMult;
    this.group.yStukMult = form.yStukMult;
    this.group.bochtMult = form.bochtMult;
    this.group.mofMult = form.mofMult;
    this.formService.currentGroup = this.group;
    this.formService.currentProjects = this.projectList;
    this.formService.currentWachtAansluitingen = this.wachtAansluitingList;
    this.formService.currentSlokkerProjects = this.slokkerProjectList;
    this.formService.currentGroup.users = form.users;
    this.formService.previousPage.push('/pages/read-excel');
    this.router.navigate(['/pages/project-add-excel']);
  }

  changePloegen() {
    if(this.heeftploegen){
      this.heeftploegen = false;
    }else {
      this.heeftploegen = true;
    }
  }
  goToPrevious() {
    this.router.navigate(['/pages/groups']);
  }

  goToInfo() {
    this.isInfoOpen = !this.isInfoOpen;
  }
  soortTranslateShort(role: string){
    if(role === '59cf78e883680012b0438503'){
      return ' (mobile)';
    } else {
      return '';
    }
  }
}
