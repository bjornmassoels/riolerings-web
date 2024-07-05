import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NbPopoverDirective, NbToastrService } from '@nebular/theme';
import { delay, Observable } from 'rxjs';
import { FormControl, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { startWith, map, timeout, tap } from 'rxjs/operators';
import { ApiService } from '../../../../services/api.service';
import { FormService } from '../../../../services/form.service';
import { Project } from '../../../../models/project';
import { Group } from '../../../../models/groups';
import { MatDialog } from '@angular/material/dialog';
import { GroupsViewDeleteDialogComponent } from './groups-view-delete-dialog/groups-view-delete-dialog.component';
import { ExcelService } from '../../../../services/ExcelService';
import { Company } from '../../../../models/company';
import { ArchivePopupComponent } from '../archive-popup/archive-popup.component';
import {GroupsViewMeetstaatDialogComponent} from "./groups-view-meetstaat-dialog/groups-view-meetstaat-dialog.component";
import FileSaver, {saveAs} from "file-saver";
import { NieuweExcelService } from '../../../../services/NieuweExcelService';
import { SendPdfID } from '../../../../models/sendPdfID';
import {io} from 'socket.io-client';
import { HttpClient } from '@angular/common/http';
import { makePdfResponse } from '../../../../models/makePdfResponse';
import { Waterafvoer } from '../../../../models/waterafvoer';
import { Slokkers } from '../../../../models/slokkers';
import { GroupsViewPdfDownloadDialogComponent } from './groups-view-pdf-download-dialog/groups-view-pdf-download-dialog.component';
import moment from 'moment';
import { MatMenuTrigger } from '@angular/material/menu';
import { Schademelding } from '../../../../models/schademelding';
import { Meerwerk } from '../../../../models/meerwerk';
import { NbBooleanInput } from '@nebular/theme/components/helpers';

declare var Pace: any;

@Component({
  selector: 'ngx-groups-view',
  templateUrl: './groups-view.component.html',
  styleUrls: ['./groups-view.component.scss'],
})
export class GroupsViewComponent implements OnInit, OnDestroy {
  @ViewChild('popoverDirective') popover: NbPopoverDirective;
  protected readonly Math = Math;
  showProjectDetails: boolean = false;
  public projectItem: Project = new Project();
  protected readonly onclick = onclick;
  selectEverythingOwAndSchade: boolean;
  public hasPreviousPage: boolean = false;
  public group: Group;
  public _id: string;
  usersBox: any;
  public projects: Array<Project> = [];
  public slokkerProjects: Array<Project> = [];
  public meerwerkenList: Array<Schademelding> = [];
  public allProjects: Array<any> = [];
  public allProjectsBetweenDates: Array<Project> = [];
  public isOn: boolean;
  public selectAllCheckbox: any;
  public company: Company;
  public isArchived: boolean = false;
  public selectEverything: boolean = false;
  searchForm = new FormControl();
  filteredStreets: Observable<string[]>;
  isLoadingBar: boolean = false;
  pdfProgress: string;
  startDate: Date;
  endDate: Date;
  firstUser: string;
  sorteerItems: string[] = ['Straat & huisnr', 'Huisnummer', 'Volgnummer' ];
  sorteerItems2: string[] = ['Afwerkingsdatum/\nlaatst gewijzigd', 'Startdatum', 'Aanmaakdatum'];
  filterItems: string[] = ['Alle aansluitingen','Afgewerkt', 'Niet afgewerkt', 'Huisaansluiting', 'Wachtaansluiting', 'Kolk'];
  filterItem: string = "Alle aansluitingen";
  filterSelect: string = 'Alle aansluitingen';
  sorteerSelect: string = 'Straat & huisnr';
  sorteerItem: string = 'Straat & huisnr';
  currentProject: Project;
  range: any;
  isPrint: boolean = false;
  public searchAllProjectsList: Project[];
  progress = 0;
  socket;
  totalProjectCount: number;
  isDownloading: boolean = false;
  isGeneratingPDF: boolean;
  filterStraatText: string = '';
  dateSorteer: string;
  pdfProgressBlocks: number[];
  filterTussenDateStartString: string;
  filterTussenDateEndString: string;
  allStreetNames: string[] = [];
  selectedHuisaansluitingen: number;
  selectedWachtaansluitingen: number;
  selectedKolken: number;
  selectedHuisaansluitingenWithValue: number;
  selectedWachtaansluitingenWithValue: number;
  selectedKolkenWithValue: number;
  populatedProjects: Project[];
  schademeldingList: Schademelding[];
  owAndSchademeldingList: Schademelding[];
  isViewingOwAndSchademeldingList: boolean;
  newSchademeldingCounter: number;
  newMeerwerkCounter: number;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private toastrService: NbToastrService,
    private formService: FormService,
    private route: ActivatedRoute,
    private excelService: ExcelService,
    private dialog: MatDialog,
    private nieuweExcelService: NieuweExcelService,
    private httpClient: HttpClient,
  ) {
  }

  async ngOnInit(): Promise<void> {
    this._id = this.route.snapshot.paramMap.get('id');
    this.loadData(this._id);
    if (this.formService.previousSorteer != null) {
      this.sorteerItem = this.formService.previousSorteer;
      this.sorteerSelect = this.formService.previousSorteer;
    }
    if(this.formService.previousDateSorteer != null && this.formService.previousDateSorteer !== ''){
      this.dateSorteer = this.formService.previousDateSorteer;
    }
    if (this.formService.previousFilter != null) {
      this.filterItem = this.formService.previousFilter;
      this.filterSelect = this.formService.previousFilter;
    }
    if (this.formService.previousStreet != null) {
      this.searchForm.setValue(this.formService.previousStreet);
      this.filterStraatText = this.formService.previousStreet;
    }
    if(this.formService.previousDateSorteer != null && this.formService.previousDateSorteer !== ''){
      this.dateSorteer = this.formService.previousDateSorteer;
    }
    if(this.formService.filterTussenDateStartString != null && this.formService.filterTussenDateEndString != null){
      this.range = {
        start: moment(this.formService.filterTussenDateStartString),
        end: moment(this.formService.filterTussenDateEndString)
      };
      this.filterTussenDateStartString = this.formService.filterTussenDateStartString;
      this.filterTussenDateEndString = this.formService.filterTussenDateEndString;
    }
    if(this.formService.isViewingOwAndSchademeldingList != null){
      this.isViewingOwAndSchademeldingList = this.formService.isViewingOwAndSchademeldingList;
    }

  }

  async loadData(groupId) {
    this.isGeneratingPDF = false;
    this.filterStraatText = '';
    this.isDownloading = false;
    this.selectEverything = false;
    this.selectEverythingOwAndSchade = false;
    this.isViewingOwAndSchademeldingList = false;
    this.newMeerwerkCounter = 0;
    this.newSchademeldingCounter = 0;
    this.dateSorteer = 'Afwerkingsdatum';
    this.allStreetNames = [];
    this.apiService.getGroupByIdLighterVersion(groupId).subscribe(async (x) => {
      this.group = x as unknown as Group;
      if (this.group._id == null) {
        this.group._id = this.group.id;
      }
      if (this.group.archived == null || this.group.archived === false) {
        this.isArchived = false;
      } else {
        this.isArchived = true;
      }
      if (this.group.users != null && this.group.users.length >= 1) {
        if (this.group.users[0].name == null || this.group.users[0].name === '') {
          this.firstUser = this.group.users[0].email;
        } else {
          this.firstUser = this.group.users[0].name;
        }
        this.group.users = this.group.users.filter(x => x.name !== "bjorn programmeur selux");
      }
      this.projects = this.group.projectList;
      if (this.projects != null) {
        for (let project of this.projects) {

          project.createdDate = new Date(project.created);
          if (project.startDate != null) {
            project.startDate = new Date(project.startDate);
          }
          if(project.afgewerktDatum != null){
             project.afgewerktDatum = new Date(project.afgewerktDatum);
          }
          if(project.updated != null)project.updated = new Date(project.updated);
          if(project.street != null && project.street !== '' && this.allStreetNames.indexOf(project.street.trim()) === -1){
            this.allStreetNames.push(project.street.trim());
          }
          project.isSlokker = false;
          project.isMeerwerk = false;
          project.isSelected = false;
        }
      }
      this.allProjects = this.projects;
      this.slokkerProjects = this.group.slokkerProjectList as Project[];
      if (this.slokkerProjects != null) {
        for (let slokker of this.slokkerProjects) {
          slokker.createdDate = new Date(slokker.created);
          if (slokker.startDate != null) {
            slokker.startDate = new Date(slokker.startDate);
          }
          if(slokker.afgewerktDatum != null){
            slokker.afgewerktDatum = new Date(slokker.afgewerktDatum);
          }
          if(slokker.updated != null)slokker.updated = new Date(slokker.updated);
          if(slokker.street != null && slokker.street !== '' && this.allStreetNames.indexOf(slokker.street.trim()) === -1){
            this.allStreetNames.push(slokker.street.trim());
          }
          slokker.isMeerwerk = false;
          slokker.isSlokker = true;
          slokker.isSelected = false;
          this.allProjects.push(slokker);
        }
      }

      this.meerwerkenList = this.group.meerwerkList as unknown as Schademelding[];
      if (this.meerwerkenList != null && this.meerwerkenList.length > 0) {
        for (let meerwerk of this.meerwerkenList) {
          meerwerk.createdDate = new Date(meerwerk.created);
          if(meerwerk.updated != null)meerwerk.updated = new Date(meerwerk.updated);
          if (meerwerk.startDate != null) {
            meerwerk.startDate = new Date(meerwerk.startDate);
          }
          meerwerk.photos = meerwerk.photos.filter(x => x != null);

          if(!meerwerk.hasBeenViewed){
            this.newMeerwerkCounter++;
          }
          meerwerk.isMeerwerk = true;
          meerwerk.isSelected = false;
          meerwerk.isSchademelding = false;
        }
      } else {
        this.meerwerkenList = [];
      }
      this.schademeldingList = this.group.schademeldingList as Schademelding[];
      if (this.schademeldingList != null && this.schademeldingList.length > 0) {
        for (let schademelding of this.schademeldingList) {
          schademelding.createdDate = new Date(schademelding.created);
          if(schademelding.date)schademelding.date = new Date(schademelding.date);
          schademelding.isMeerwerk = false;
          schademelding.isSelected = false;
          schademelding.isSchademelding = true;
          if(!schademelding.hasBeenViewed){
            this.newSchademeldingCounter++;
          }
        }
      } else {
        this.schademeldingList = [];
      }
      this.owAndSchademeldingList = [...this.schademeldingList, ...this.meerwerkenList];
      this.owAndSchademeldingList.sort((a, b) => {
        let aDate = a.isMeerwerk? a.startDate : a.date;
        let bDate = b.isMeerwerk? b.startDate : b.date;
        if(aDate == null){
          return 1;
        }
        if(bDate == null){
          return -1;
        }
        if(aDate.getTime() < bDate.getTime()){
          return 1;
        }
        if(aDate.getTime() > bDate.getTime()){
          return -1;
        }
      });
      this.formService.owAndSchademeldingList = this.owAndSchademeldingList;
      this.searchAllProjectsList = this.allProjects;
      this.formService.lastProjects = this.allProjects;
      this.currentProject = new Project();

      this.currentProject.isSlokker = false;
      this.currentProject.isWachtAansluiting = false;
      this.currentProject.isMeerwerk = false;

      this.allStreetNames.sort( (a, b) => { return a.localeCompare(b); });

      this.filteredStreets = this.searchForm.valueChanges.pipe(
        startWith(this.formService.previousStreet ? this.formService.previousStreet : ''),
        map(value => typeof value === 'string' ? value.toLowerCase() : value.street.toLowerCase()),
        tap(straat => {this.formService.previousStreet = straat;
          this.filterStraatText = straat;}),
        map(name => name ? this.filterStreets(name) : this.allStreetNames.slice()),
        tap(() => this.filterAndSort())
      );

      while (this.apiService.thisCompany == null) {
        await this.delay(50)
      }
      this.company = this.apiService.thisCompany
      this.isOn = true;
      Pace.stop();
      await this.delay(50);
      if (this.formService.previousIndex != null || this.formService.previousIndexScroll != null) {
        let behavior: string = 'auto';
        let rows;
        if(this.isViewingOwAndSchademeldingList){
          rows = document.getElementsByClassName("schademelding");
          setTimeout(() => {
            if(rows[this.formService.previousIndexScroll] != null){
              rows[this.formService.previousIndexScroll].scrollIntoView({
                behavior: <ScrollBehavior>behavior.toString(),
                block: 'center'
              });
              this.formService.previousIndexScroll = null;
            }
          }, 10);
        } else {
          rows = document.getElementsByClassName("scroll");
          setTimeout(() => {
            if(rows[this.formService.previousIndex] != null){
              rows[this.formService.previousIndex].scrollIntoView({
                behavior: <ScrollBehavior>behavior.toString(),
                block: 'center'
              });
              this.formService.previousIndex = null;
            }
          }, 10);
        }

      }
      this.formService._allProjects = this.allProjects;
    });
  }

  goToPrevious() {
    this.router.navigate(['/pages/groups']);
  }


  async onDelete(chosenProject: Project) {
    this.formService._preventNavigation = true;
    this.formService._chosenProject = chosenProject;
    if (this.formService._chosenProject.slokker != null) {
      this.formService._isSlokker = true;
      this.formService._chosenSlokkerProject = chosenProject;
    }
    let dialogRef = this.dialog.open(GroupsViewDeleteDialogComponent, {
      height: '19vh',
      width: '27vw',
    });
    dialogRef.afterClosed().subscribe(() => {
      this.allProjects = this.formService._allProjects;
      this.formService._preventNavigation = false;
    });

  }

  async selectSort(filter: string) {
    this.searchAllProjectsList = this.allProjects;
    this.sorteerItem = filter;
    this.filterAndSort();
  }
  async selectFilter(filter: string) {
    this.searchAllProjectsList = this.allProjects;
    this.filterItem = filter;
    this.filterAndSort();
  }
  async filterAndSort(){
    let filteredProjects = this.allProjects;
    if(this.filterStraatText.trim() !== ''){
      filteredProjects = this.filterStraatText?.trim()
        ? filteredProjects.filter(project => project.street?.toLowerCase().includes(this.filterStraatText?.toLowerCase()))
        : filteredProjects;
    }
    if(this.filterTussenDateStartString != null && this.filterTussenDateEndString != null){
      filteredProjects = await this.filterProjectsByDate(new Date(this.filterTussenDateStartString),
        new Date(this.filterTussenDateEndString), filteredProjects);
    }
    this.searchAllProjectsList = filteredProjects;

      if (this.filterItem === "Afgewerkt") {
        this.searchAllProjectsList = this.searchAllProjectsList.filter(x => x.finished);
    } else if (this.filterItem === "Niet afgewerkt") {
        this.searchAllProjectsList = this.searchAllProjectsList.filter(x => x.finished == null || x.finished === false);
    } else if (this.filterItem === "Huisaansluiting") {
        this.searchAllProjectsList = this.searchAllProjectsList.filter(x => x.droogWaterAfvoer != null && (!x.isWachtAansluiting && !x.droogWaterAfvoer.isWachtaansluiting && !x.regenWaterAfvoer.isWachtaansluiting));
    } else if (this.filterItem === "Wachtaansluiting") {
        this.searchAllProjectsList = this.searchAllProjectsList.filter(x => x.droogWaterAfvoer != null && (x.isWachtAansluiting || x.droogWaterAfvoer.isWachtaansluiting || x.regenWaterAfvoer.isWachtaansluiting));
      } else if (this.filterItem === "Kolk") {
        this.searchAllProjectsList = this.searchAllProjectsList.filter(x => x.isSlokker);
    }

    if (this.sorteerItem === "Straat & huisnr") {
      await this.sortByStreet();
    } else if (this.sorteerItem === "Huisnummer") {
      await this.sortByHuisnummer();
    } else if(this.sorteerItem === 'Volgnummer'){
      await this.sortByIndexNummer();
    } else if (this.sorteerItem === 'Aanmaakdatum') {
      await this.sortByCreatedDate();
    }  else if (this.sorteerItem === 'Startdatum') {
      await this.sortByStartDate();
    } else if(this.sorteerItem === 'Afwerkingsdatum/\nlaatst gewijzigd'){
      await this.sortByAfwerkingsDatum();
    } else {
      await this.sortByStreet();
    }
    await this.checkIfSelectedAansluitingen();
  }

  async checkIfSelectedAansluitingen(){
    if(this.searchAllProjectsList.filter(x => x.isSelected).length > 0){
      let selectedProjects = this.searchAllProjectsList.filter(x => x.isSelected);
      if(this.populatedProjects == null){
       let populatedGroup = await this.apiService.getGroupByIdWithoutSubscribe(this._id) as Group;
        this.populatedProjects = populatedGroup.projectList as Project[];
        let populatedSlokkerProjects = populatedGroup.slokkerProjectList as Project[];
        this.populatedProjects =  [...this.populatedProjects, ...populatedSlokkerProjects];
      }
      let tempSelectedPopulatedProjects = [];
      for(let selectedProject of selectedProjects){
        let tempProject = this.populatedProjects.find(x => x._id === selectedProject._id);
        tempSelectedPopulatedProjects.push(tempProject);
      }
      this.selectedHuisaansluitingen = tempSelectedPopulatedProjects.filter(x => x?.droogWaterAfvoer != null
        && ((x.isWachtAansluiting == null || !x.isWachtAansluiting) &&
          (x.droogWaterAfvoer?.isWachtaansluiting == null || !x.droogWaterAfvoer.isWachtaansluiting) &&
          (x.regenWaterAfvoer?.isWachtaansluiting == null || !x.regenWaterAfvoer.isWachtaansluiting))).length;
      this.selectedWachtaansluitingen = tempSelectedPopulatedProjects.filter(x =>  x?.droogWaterAfvoer != null && ((x.isWachtAansluiting != null && x.isWachtAansluiting) ||
        (x.droogWaterAfvoer?.isWachtaansluiting != null && x.droogWaterAfvoer.isWachtaansluiting) ||
        (x.regenWaterAfvoer?.isWachtaansluiting != null && x.regenWaterAfvoer.isWachtaansluiting))).length;
      this.selectedKolken = tempSelectedPopulatedProjects.filter(x => x?.slokker != null).length;
      this.selectedHuisaansluitingenWithValue = tempSelectedPopulatedProjects.filter(x => (this.checkHasAfvoer(x?.droogWaterAfvoer) || this.checkHasAfvoer(x?.regenWaterAfvoer))
        && ((x.isWachtAansluiting == null || !x.isWachtAansluiting) &&
          (x.droogWaterAfvoer?.isWachtaansluiting == null || !x.droogWaterAfvoer.isWachtaansluiting) &&
          (x.regenWaterAfvoer?.isWachtaansluiting == null || !x.regenWaterAfvoer.isWachtaansluiting))).length;
      this.selectedWachtaansluitingenWithValue = tempSelectedPopulatedProjects.filter(x =>  (this.checkHasAfvoer(x?.droogWaterAfvoer) || this.checkHasAfvoer(x?.regenWaterAfvoer))
        && (x.isWachtAansluiting || x.droogWaterAfvoer.isWachtaansluiting || x.regenWaterAfvoer.isWachtaansluiting)).length;
      this.selectedKolkenWithValue = tempSelectedPopulatedProjects.filter(x => x?.slokker != null && this.checkHasKolk(x.slokker)).length;

      this.popover.show();
    } else {
      this.selectedHuisaansluitingen = null;
      this.selectedWachtaansluitingen = null;
      this.selectedKolken = null;
      if(this.popover){
        this.popover.hide();
      }
    }
  }

  checkIfHasSelected(){
    if(!this.isViewingOwAndSchademeldingList){
      return this.selectedHuisaansluitingen || this.selectedWachtaansluitingen || this.selectedKolken;
    } else {
       return this.owAndSchademeldingList?.filter(x => x.isSelected).length > 0;
    }
  }

  async sortByStreet() {
    this.projects.sort(this.sortIndex);
    this.searchAllProjectsList.sort(this.sortIndex);
  }

  sortByHuisnummer() {
    const sortIndex = function(p1: Project, p2: Project) {
      // Helper function to check if a string contains any digit
      const containsDigit = (str: string) => /\d/.test(str);

      // Helper function to check if a string is purely numeric
      const isNumeric = (str: string) => /^\d+$/.test(str);

      // Cleanup function
      const cleanUp = (str: string | null) => str ? str.trim().toUpperCase() : '';

      // Prepare values
      p1.huisNr = cleanUp(p1.huisNr);
      p2.huisNr = cleanUp(p2.huisNr);

      // Sorting for empty strings or equal huisNr
      if (!p1.huisNr && !p2.huisNr) return 0;
      if (!p1.huisNr) return 1; // Put empty at the end
      if (!p2.huisNr) return -1; // Put empty at the end

      // Determine the type of huisNr for sorting
      const isP1Numeric = isNumeric(p1.huisNr);
      const isP2Numeric = isNumeric(p2.huisNr);
      const isP1AlphabeticOnly = !containsDigit(p1.huisNr);
      const isP2AlphabeticOnly = !containsDigit(p2.huisNr);

      // Alphabetic-only values come first
      if (isP1AlphabeticOnly && !isP2AlphabeticOnly) return -1;
      if (!isP1AlphabeticOnly && isP2AlphabeticOnly) return 1;

      // If both are numeric or both are alphanumeric (with digits), sort numerically where possible
      if ((isP1Numeric && isP2Numeric) || (!isP1AlphabeticOnly && !isP2AlphabeticOnly)) {
        const num1 = parseInt(p1.huisNr.match(/\d+/)[0], 10);
        const num2 = parseInt(p2.huisNr.match(/\d+/)[0], 10);
        if (num1 !== num2) return num1 - num2; // Sort by numeric part
        // If numeric parts are equal, sort by full string
        return p1.huisNr.localeCompare(p2.huisNr);
      }

      // Fallback to regular string comparison (should rarely be reached due to above conditions)
      return p1.huisNr.localeCompare(p2.huisNr);
    };

    this.projects.sort(sortIndex);
    this.searchAllProjectsList.sort(sortIndex);
  }


  sortByIndexNummer() {
    const sortIndex = function(p1: Project, p2: Project) {
      if (p1.index == null || p1.index === '') {
        return 1;
      } else if (p2.index == null || p2.index === '') {
        return -1;
      } else {
        let h1 = p1.index.replace(/[^0-9]/g, '');
        let h2 = p2.index.replace(/[^0-9]/g, '');
        if (+h1 === +h2) {
          let h1String = p1.index.replace(/^\D+/g, '');
          let h2String = p2.index.replace(/^\D+/g, '');
          if (h1String < h2String) {
            return -1;
          } else if (h2String < h1String) {
            return 1;
          } else {
            return 0;
          }
        } else if (+h1 < +h2) {
          return -1;
        } else if (+h2 < +h1) {
          return 1;
        }
      }
    };
    this.projects.sort(sortIndex);
    this.searchAllProjectsList.sort(sortIndex);
  }

  sortByCreatedDate() {
    const sortIndex = function(p1: Project, p2: Project) {
      if (p1.createdDate < p2.createdDate) {
        return 1;
      }
      if (p1.createdDate > p2.createdDate) {
        return -1;
      }
      return 0;
    };

    this.projects.sort(sortIndex);
    this.searchAllProjectsList.sort(sortIndex);
  }
  sortByStartDate() {
    const sortIndex = function(p1: Project, p2: Project) {
      if(p1.startDate == null){
        return 1;
      }
      if(p2.startDate == null){
        return -1;
      }
      if (p1.startDate < p2.startDate) {
        return 1;
      }
      if (p1.startDate > p2.startDate) {
        return -1;
      }
      return 0;
    };

    this.projects.sort(sortIndex);
    this.searchAllProjectsList.sort(sortIndex);
  }

  sortByAfgewerkt(afgewerkt: boolean) {
    let projects;
    if (afgewerkt) {
      projects = this.searchAllProjectsList.filter(x => x.finished);
    } else {
      projects = this.searchAllProjectsList.filter(x => !x.finished);
    }
    this.searchAllProjectsList = projects;
    this.projects = projects;
    this.projects.sort(this.sortIndex);
    this.searchAllProjectsList.sort(this.sortIndex);
  }

  sortByProjectSort(soort: string) {
    let projects;
    if (soort === 'HA') {
      projects = this.searchAllProjectsList.filter(x => x.droogWaterAfvoer != null && (!x.isWachtAansluiting && !x.droogWaterAfvoer.isWachtaansluiting && !x.regenWaterAfvoer.isWachtaansluiting));
    } else if (soort === 'WA') {
      projects = this.searchAllProjectsList.filter(x => x.droogWaterAfvoer != null && (x.isWachtAansluiting || x.droogWaterAfvoer.isWachtaansluiting || x.regenWaterAfvoer.isWachtaansluiting));
    } else if (soort === 'Slokker') {
      projects = this.searchAllProjectsList.filter(x => x.isSlokker);
    }
    this.searchAllProjectsList = projects;
    this.projects = projects;
    this.projects.sort(this.sortIndex);
    this.searchAllProjectsList.sort(this.sortIndex);
  }

  _filter(name: string): any[] {
    const filterValue = name.toLowerCase();
    return this.projects.filter(project => project.street?.toLowerCase().includes(filterValue));
  }

  onSearch(_id: string) {
    this.formService.previousPage.push('/pages/groupview/' + this._id);
    this.router.navigate(['/pages/projectview', _id]);
  }

  onSearchInput(input: string) {
    this.filterStraatText = input;
    this.filterAndSort();
  }

  filterProjectsByDate(startDate, endDate, projects) {
    const startMoment = startDate ? moment(startDate).startOf('day') : null;
    const endMoment = endDate ? moment(endDate).endOf('day') : null;

    if(this.formService.previousDateSorteer === 'Startdatum'){
      return projects.filter(project =>
        (!startMoment || moment(project.startDate).isSameOrAfter(startMoment)) &&
        (!endMoment || moment(project.startDate).isSameOrBefore(endMoment))
      );
    } else {
      return projects.filter(project => project.finished && project.afgewerktDatum != null &&
        (!startMoment || moment(project.afgewerktDatum).isSameOrAfter(startMoment)) &&
        (!endMoment || moment(project.afgewerktDatum).isSameOrBefore(endMoment))
      );
    }
  }
  filterStreets(filter: string): string[] {
    filter = filter.toLowerCase();
    return this.projects
      .map(project => project.street?.trim())
      .filter((street, index, streets) => street?.toLowerCase().includes(filter) && streets.indexOf(street) === index);
  }

  uniqueStreets(): string[] {
    return this.projects
      .map(project => project.street)
      .filter((street, index, streets) => streets.indexOf(street) === index);
  }

  async dateChanged() {
    await this.delay(50)
    this.filterTussenDateStartString = this.range.start.toDate().toString();
    this.filterTussenDateEndString = this.range.end?.toDate()?.toString();
    this.filterAndSort();
  }


  Date(created: string) {
    return new Date(created).toLocaleDateString();
  }

  openProject(project: Project) {
    this.formService.lastProjects = this.searchAllProjectsList;
    if (this.formService._preventNavigation == false) {
      if (project._id == null || project._id === '') {
        project._id = project.id;
      }
      this.formService.previousPage.push('/pages/groupview/' + this._id);
      if (project.isSlokker) {
        this.router.navigate(['/pages/slokkerprojectview', project._id]);
      }else {
        this.router.navigate(['/pages/projectview', project._id]);
      }
    }
  }

  editProject(project: Project) {
    this.formService.lastProjects = this.searchAllProjectsList;
    if (this.formService._preventNavigation == false) {
      if (project._id == null || project._id === '') {
        project._id = project.id;
      }
      this.formService.previousPage.push('/pages/groupview/' + this._id);
      if (project.isSlokker) {
        this.router.navigate(['/pages/slokkerprojectedit', project._id]);
      }  else {
        this.router.navigate(['/pages/projectedit', project._id]);
      }
    }
  }

  sortIndex = function(p1: Project, p2: Project) {
      function isNumeric(value: any): boolean {
        return (typeof value === 'number' || (typeof value === 'string' && value.trim() !== '')) && !isNaN(value as any) && isFinite(value as any);
      }

    if (!p1.isMeerwerk && !p2.isMeerwerk) {
      if (p1.street == null || p1.street === '') {
        return 1;
      } else if (p2.street == null || p2.street === '') {
        return -1;
      }
      p1.street = p1.street.trim();
      p2.street = p2.street.trim()
      if (p1.huisNr != null) {
        p1.huisNr = p1.huisNr.trim();
      }
      if (p2.huisNr != null) {
        p2.huisNr = p2.huisNr.trim();
      }
      if (p1.index != null) {
        p1.index = p1.index.trim();
      }
      if (p2.index != null) {
        p2.index = p2.index.trim();
      }
      if (p1.street.toLowerCase() === p2.street.toLowerCase()) {
        if ((((p1.huisNr == null || p1.huisNr === '') && (p2.huisNr == null || p2.huisNr === '')) || p1.huisNr === p2.huisNr) &&
          ((p1.droogWaterAfvoer?.isWachtaansluiting || p1.regenWaterAfvoer?.isWachtaansluiting || p1.isWachtAansluiting || p1.isSlokker) && (p2.droogWaterAfvoer?.isWachtaansluiting || p2.regenWaterAfvoer?.isWachtaansluiting || p2.isWachtAansluiting || p2.isSlokker))) {
          if (p1.index == null || p1.index === '') {
            return -1;
          } else if (p2.index == null || p2.index === '') {
            return 1;
          } else {
            let h1 = p1.index.replace(/[^0-9]/g, '');
            let h2 = p2.index.replace(/[^0-9]/g, '');
            if (+h1 === +h2) {
              let h1String = p1.index.replace(/^\D+/g, '');
              let h2String = p2.index.replace(/^\D+/g, '');
              if (h1String < h2String) {
                return -1;
              } else if (h2String < h1String) {
                return 1;
              } else {
                return 0;
              }
            } else if (+h1 < +h2) {
              return -1;
            } else if (+h2 < +h1) {
              return 1;
            }
          }

        } else if ((p1.droogWaterAfvoer?.isWachtaansluiting || p1.regenWaterAfvoer?.isWachtaansluiting || p1.isWachtAansluiting || p1.isSlokker) &&
          (p2.droogWaterAfvoer?.isWachtaansluiting || p2.regenWaterAfvoer?.isWachtaansluiting || p2.isWachtAansluiting || p2.isSlokker) &&
          (p1.huisNr == null || p1.huisNr === '') && (p2.huisNr == null || p2.huisNr === '')) {
          if (p1.index == null || p1.index === '') {
            return -1;
          } else if (p2.index == null || p2.index === '') {
            return 1;
          } else {
            let h1 = p1.index.replace(/[^0-9]/g, '');
            let h2 = p2.index.replace(/[^0-9]/g, '');
            if (+h1 === +h2) {
              let h1String = p1.index.replace(/^\D+/g, '');
              let h2String = p2.index.replace(/^\D+/g, '');
              if (h1String < h2String) {
                return -1;
              } else if (h2String < h1String) {
                return 1;
              } else {
                return 0;
              }
            } else if (+h1 < +h2) {
              return -1;
            } else if (+h2 < +h1) {
              return 1;
            }
          }
        } else if (((p1.droogWaterAfvoer?.isWachtaansluiting || p1.regenWaterAfvoer?.isWachtaansluiting || p1.isWachtAansluiting || p1.isSlokker) && !p2.isWachtAansluiting &&
          !p2.droogWaterAfvoer?.isWachtaansluiting && !p2.regenWaterAfvoer?.isWachtaansluiting && !p2.isSlokker) && p1.huisNr === p2.huisNr) {
          return 1;
        } else if ((!p1.droogWaterAfvoer?.isWachtaansluiting && !p1.regenWaterAfvoer?.isWachtaansluiting && !p1.isWachtAansluiting && !p1.isSlokker &&
          (p2.droogWaterAfvoer?.isWachtaansluiting || p2.regenWaterAfvoer?.isWachtaansluiting || p2.isWachtAansluiting || p2.isSlokker)) && p1.huisNr === p2.huisNr) {
          return -1;
        } else if (isNumeric(+p1.huisNr) && isNumeric(+p2.huisNr)) {
          if (+p1.huisNr === +p2.huisNr) {
            if ((p1.droogWaterAfvoer?.isWachtaansluiting || p1.regenWaterAfvoer?.isWachtaansluiting || p1.isWachtAansluiting || p1.isSlokker) &&
              !p2.droogWaterAfvoer?.isWachtaansluiting && !p2.regenWaterAfvoer?.isWachtaansluiting && !p2.isWachtAansluiting && !p2.isSlokker) {
              return 1;
            } else if (!p1.droogWaterAfvoer?.isWachtaansluiting && !p1.regenWaterAfvoer?.isWachtaansluiting && !p1.isWachtAansluiting && !p1.isSlokker &&
              (p2.droogWaterAfvoer?.isWachtaansluiting || p2.regenWaterAfvoer?.isWachtaansluiting || p2.isWachtAansluiting || p2.isSlokker)) {
              return -1;
            }
            return 0;
          }
          if (+p1.huisNr < +p2.huisNr) {
            return -1;
          } else if (+p2.huisNr < +p1.huisNr) {
            return 1;
          }
        }
        if (p1.huisNr == null || p1.huisNr === '') {
          return -1;
        } else if (p2.huisNr == null || p2.huisNr === '') {
          return 1;
        } else {
          let h1 = p1.huisNr.replace(/[^0-9]/g, '');
          let h2 = p2.huisNr.replace(/[^0-9]/g, '');
          if (+h1 === +h2) {
            let h1String = p1.huisNr.replace(/^\D+/g, '');
            let h2String = p2.huisNr.replace(/^\D+/g, '');
            if (h1String < h2String) {
              return -1;
            } else if (h2String < h1String) {
              return 1;
            } else if (h2String === h1String) {
              return 0;
            }
          } else if (+h1 < +h2) {
            return -1;
          } else if (+h2 < +h1) {
            return 1;
          }
        }
      }  else if (p1.street.toLowerCase() < p2.street.toLowerCase()) {
      return -1;
      } else if (p2.street.toLowerCase() < p1.street.toLowerCase()) {
        return 1;
      }
      return 0;
    } else {
      if (p1.isMeerwerk === false) {
        return 1;
      } else if (p2.isMeerwerk === false) {
        return -1;
      } else if (new Date(p1.created).getTime() < new Date(p2.created).getTime()) {
        return 1;
      } else if (new Date(p2.created).getTime() < new Date(p1.created).getTime()) {
        return -1;
      }
    }
  };

  goToAddProject() {
    if (this.group._id == null || this.group._id === '') {
      this.group._id = this.group.id;
    }
    this.formService.previousPage.push('/pages/groupview/' + this._id);
    this.router.navigate(['/pages/project-add', this._id]);
  }

  goToPostnummers() {
    if (this.group._id == null || this.group._id === '') {
      this.group._id = this.group.id;
    }
    this.formService.previousPage.push('/pages/groupview/' + this._id);
    this.router.navigate(['/pages/postnummer-settings', this._id]);
  }

  downloadExcelClientData() {
    let title = ' Project gegevens';
    let hasSelected = false;
    let tempProjects = [];
    let tempSlokkerProjects = [];
    let tempGroup = this.group;
    for (let project of this.allProjects) {
      if (project.isSelected && !project.isMeerwerk) {
        hasSelected = true;
        if (project.isSlokker == null || project.isSlokker === false) {
          tempProjects.push(project);
        } else {
          tempSlokkerProjects.push(project);
        }
      }
    }
    tempProjects.sort(this.sortIndex);
    tempSlokkerProjects.sort(this.sortIndex);
    if (hasSelected === true) {
      tempGroup.projectList = tempProjects;
      tempGroup.slokkerProjectList = tempSlokkerProjects;

      let realProjects = [];
      let realSlokkerProjects = [];
      this.apiService.getGroupById(this._id).subscribe((x) => {
        let populatedGroup = x as Group;
        tempGroup.projectList.forEach((project) => {
          realProjects.push(populatedGroup.projectList.find(x => x._id === project._id));
        });
        tempGroup.slokkerProjectList.forEach((project) => {
          realSlokkerProjects.push(populatedGroup.slokkerProjectList.find(x => x._id === project._id));
        });
        tempGroup.projectList = realProjects;
        tempGroup.slokkerProjectList = realSlokkerProjects;

        for(let project of tempGroup.projectList){
          if (project.isWachtAansluiting || project.droogWaterAfvoer.isWachtaansluiting || project.regenWaterAfvoer.isWachtaansluiting) {
            project.equipNrRiolering = tempGroup.rbProjectNr + ((project.index != null && project.index !== '') ? '-volgnr= ' + project.index : '');
            project.naamFiche = 'GEM=' + tempGroup.gemeenteCode + ' projectnr=' + tempGroup.rbProjectNr + ' adres=' + project.street + (project.huisNr != null && project.huisNr !== '' ? ' - ' + project.huisNr : '') + ' wa='  +  project.equipNrRiolering + ' AB-HA-fiche';
          } else {
            project.naamFiche = 'GEM=' + tempGroup.gemeenteCode + ' projectnr= ' + tempGroup.rbProjectNr + ' adres=' + project.street + ' ' + project.huisNr + ((project.equipNrRiolering != null && project.equipNrRiolering !== '') ? ' eq=' + project.equipNrRiolering : '') + ' AB-HA-fiche';
          }
        }
        for(let slokkerProject of tempGroup.slokkerProjectList){
          slokkerProject.equipNrRiolering = tempGroup.rbProjectNr + ((slokkerProject.index != null && slokkerProject.index !== '') ? '-kolknr' + slokkerProject.index : '');
          slokkerProject.naamFiche = 'GEM=' + tempGroup.gemeenteCode + ' projectnr=' + tempGroup.rbProjectNr +
            ' adres=' + slokkerProject.street + ' ko=' + slokkerProject.equipNrRiolering + ' AB-kolk-fiche';
        }
        this.excelService.generateExcel(
          title,
          tempGroup,
          this.company.logo,
          this.company.name,
        );
      });


    } else {
      this.toastrService.warning(
        'U heeft geen aansluiting geselecteed. Selecteer minimum 1 aansluiting of slokker.',
        'Selecteer aansluitingen',
      );
    }
  }

  async generatePDF() {


    let projects = this.searchAllProjectsList.filter((x) => {
      return x.isSelected;
    }) ;

    if (projects != null && projects.length !== 0 && !this.isGeneratingPDF) {
      const dialogRef = this.dialog.open(GroupsViewPdfDownloadDialogComponent,
        {width: '700px'});

      dialogRef.afterClosed().subscribe(result => {
        if(result != null && result.pdfBenaming != null && result.pdfBenaming !== ''){
          let pdfBenaming = result.pdfBenaming;
          this.isGeneratingPDF = true;
          this.apiService.getGroupById(this._id).subscribe(async (x) => {
            try {
              let populatedGroup = x as Group;
              let newProjects = [];
              for(let i = 0; i < projects.length; i++){
                if(projects[i].isSlokker){
                  let slokkerProject = populatedGroup.slokkerProjectList.find(x => x._id === projects[i]._id);
                  if(slokkerProject != null){
                    slokkerProject.isSlokker = true;
                    newProjects.push(slokkerProject);
                  }
                } else {
                  let project = populatedGroup.projectList.find(x => x._id === projects[i]._id);
                  if(project != null){
                    newProjects.push(project);
                  }
                }
              }
              newProjects = newProjects.sort(this.sortIndex);
              let pdfProjectIds = newProjects.filter(x => (!x.isSlokker && !x.isMeerwerk && (this.checkHasAfvoer(x.droogWaterAfvoer) || this.checkHasAfvoer(x.regenWaterAfvoer)))).map((y) => y._id);
              let pdfSlokkerProjectIds = newProjects.filter(x => (x.isSlokker && !x.isMeerwerk && this.checkHasKolk(x.slokker))).map((y) => y._id);
              let sendIdArrays = new SendPdfID();
              sendIdArrays.pdfProjectIds = pdfProjectIds;
              sendIdArrays.pdfSlokkerProjectIds = pdfSlokkerProjectIds;

              this.totalProjectCount = pdfProjectIds.length + pdfSlokkerProjectIds.length;
              if (this.totalProjectCount === 0) {
                this.toastrService.warning(
                  'U heeft geen enkele ingevulde aansluiting geselecteerd. Selecteer minimum 1 aansluiting of kolk.',
                  'Selecteer aansluitingen',
                );
                this.isGeneratingPDF = false;
                this.isLoadingBar = false;
                this.isDownloading = false;
                return;
              }

              this.isLoadingBar = true;
              this.pdfProgress = '';
              this.isDownloading = false;
              this.progress = 0;
              this.toastrService.success(
                'De fiches worden klaargemaakt. Even geduld aub...',
                'Even geduld',
                { duration: 4000 },
              );

              this.pdfProgressBlocks = [];
              for(let i = 0; i < this.totalProjectCount; i++){
                this.pdfProgressBlocks.push(i);
              }
              await this.initSocket();
              this.apiService.makePdf(sendIdArrays, this._id, pdfBenaming).subscribe(async data => {
                },
                error => { // This function will be executed when an error is emitted
                  this.isGeneratingPDF = false;
                  this.isLoadingBar = false;
                  this.isDownloading = false;
                  Pace.stop();
                  this.progress = 0;
                  console.log('Error occurred while generating PDF:', error);
                  if (error.status === 500) { // Check if the error response status is 500
                    this.toastrService.warning(
                      'Er is een fout opgetreden bij het genereren van de PDF. Probeer het later opnieuw.',
                      'Error',
                      { duration: 4000 },
                    );
                  }
                })
            } catch (e) {
              Pace.stop();
              this.progress = 0;
              this.isGeneratingPDF = false;
              this.isLoadingBar = false;
              this.isDownloading = false;
            }
          });
        }
        // Handle the result here
      });
    } else {
      if(!this.isGeneratingPDF){
        this.toastrService.warning(
          'U heeft geen aansluiting geselecteerd. Selecteer minimum 1 aansluiting of kolk.',
          'Selecteer aansluitingen',
        );
      }
    }
  }

  initSocket(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.socket == null) {

        try {
          this.socket = io('https://selux-backend.herokuapp.com',
            {
              transports: ['websocket'],
              reconnection: true,
              reconnectionAttempts: 3
            });
          // Register the client with the server
          this.socket.on('connect', () => {
            // Register the client with the server
            this.socket.emit('register', this.apiService.userId.toString()); // Replace 'userId' with actual user ID
            resolve();
          });

          this.socket.on('progress', (data: number) => {
            this.progress = data;
            this.pdfProgressBlocks = this.pdfProgressBlocks.filter(x => x !== data);
          });

          this.socket.on('completed', (url) => {
            this.isDownloading = true;
            this.progress = 0;
            Pace.stop();
            if (url.toString() != null) {
              let bestandsNaam = this.group.rbProjectNaam + ' - ' +
                this.group.rbGemeente + ' - ' +
                this.group.rbProjectNr + '.zip';
              bestandsNaam = bestandsNaam.replace('/', '_');
              bestandsNaam = bestandsNaam.replace(',', '_');

              this.downloadFile(url.toString(), bestandsNaam);
            }
          });
          this.socket.on('connect_error', (error) => {
            console.log('Connection error:', error);
            reject(error);
          });
          this.socket.on('fatal_error', (error) => {
            console.log('Fatal error:', error);
            this.toastrService.warning(
              'Er is een fout opgetreden bij het genereren van de PDF. Probeer het later opnieuw.',
              'Error',
              { duration: 4000 },
            );
            reject(error);
          });
        } catch (e) {
          console.log(e)
        }
      } else {
        resolve();  // Resolve immediately if the socket is already initialized
      }
    });
  }

  async downloadFile(url: string, bestandsnaam: string) {
    await this.delay(100);
    this.httpClient.get(url, { responseType: 'blob' })
      .subscribe((res: any) => {
        this.triggerDownload(res, bestandsnaam);
      });
  }

  triggerDownload(res: any, bestandsnaam: string) {
    const blob = new Blob([res], { type: 'application/zip' });
    FileSaver.saveAs(blob, bestandsnaam);
    this.isDownloading = false;
    this.isLoadingBar = false;
    this.isGeneratingPDF = false;
    this.toastrService.success(
      'De fiches zijn succesvol gedownload!',
      'Succes',
      { duration: 3000 },
    );
  }

  ngOnDestroy() {
    this.formService.previousStreet = this.searchForm.value;
    this.formService.previousFilter = this.filterSelect;
    this.formService.previousSorteer = this.sorteerSelect;
    this.formService.filterTussenDateStartString = this.filterTussenDateStartString;
    this.formService.filterTussenDateEndString = this.filterTussenDateEndString;
    if (this.socket) {
      this.socket.off('progress');
      this.socket.off('connect_error');
      this.socket.off('completed');
      if (this.socket.connected) {
        this.socket.disconnect();
      }
    }
  }

  delay(timeInMillis: number): Promise<void> {
    return new Promise((resolve) => setTimeout(() => resolve(), timeInMillis));
  }

  archiveGroup() {
    const dialogRef = this.dialog.open(ArchivePopupComponent, {
      height: '250px',
      width: '400px'
    });
    dialogRef.componentInstance.group = this.group;
  }

  selectProject(projectId: string) {
    const index = this.searchAllProjectsList.findIndex((x) => x._id === projectId);
    if (
      this.searchAllProjectsList[index].isSelected == null ||
      this.searchAllProjectsList[index].isSelected === false
    ) {
      this.searchAllProjectsList[index].isSelected = true;
    } else {
      this.searchAllProjectsList[index].isSelected = false;
    }
    this.checkIfSelectedAansluitingen();
  }

  selectAll() {
    if (this.selectEverything === false) {
      this.selectEverything = true;
      for (let project of this.searchAllProjectsList) {
        project.isSelected = true;
      }
    } else {
      this.selectEverything = false;
      this.searchAllProjectsList.forEach((x) => {
        x.isSelected = false;
      });
      this.allProjects.forEach((x) => {
        x.isSelected = false;
      });
    }
    this.checkIfSelectedAansluitingen();
  }

  goToMultipleAddProject() {
    if (this.group._id == null || this.group._id === '') {
      this.group._id = this.group.id;
    }
    this.formService.previousPage.push('/pages/groupview/' + this._id);
    this.router.navigate(['/pages/multiple-project-add', this._id]);
  }

  goToEdit() {
    if (this.group._id == null || this.group._id === '') {
      this.group._id = this.group.id;
    }
    this.formService.previousPage.push('/pages/groupview/' + this._id);
    this.router.navigate(['/pages/group-edit/', this._id]);
  }

  unArchiveGroup() {
    this.group.archived = false
    this.group.users = null;
    this.toastrService.success(
      'Het project wordt uit het archief gehaald',
      'Even geduld!',
    );
    this.apiService.archiveGroup(this.group, false).subscribe((x) => {
      this.router.navigate(['/pages/groupview' + this._id]);
    });
  }

  downloadExcelClientDataMeetstaat() {
    let hasSelected = false;
    let tempProjects = [];
    let tempSlokkerProjects = [];
    let tempGroup = this.group;
    for (let project of this.searchAllProjectsList) {
      if (project.isSelected && !project.isMeerwerk) {
        hasSelected = true;
        if (project.isSlokker == null || project.isSlokker === false) {
          tempProjects.push(project);
        } else {
          tempSlokkerProjects.push(project);
        }
      }
    }
    if (hasSelected === true) {
      let dialogRef = this.dialog.open(GroupsViewMeetstaatDialogComponent, {
        height: '350px',
        width: '750px',
      });
      dialogRef.afterClosed().subscribe(() => {
        if(this.formService.isNewExcel){
          let title = 'Huis- en wachtaansluitingen DWA';
          let headers = [
            'Straat',
            'Huisnr.',
            'Volgnr.',
            'Mof',
            'T-buis',
            'T-stuk',
            'Buis hor.',
            'Buis vert.',
            'Bocht',
            'Reductie',
            'Y-stuk',
            'Gietijzer',
            'Beton',
            'Allu',
            'Fun/omh',
            'Buis',
            'Bocht',
            'Reductie',
            'Y-stuk',
          ];

          hasSelected = false;
          tempGroup.projectList = tempProjects.sort(this.sortIndex);
          tempGroup.slokkerProjectList = tempSlokkerProjects.sort(this.sortIndex);
          let realProjects = [];
          let realSlokkerProjects = [];
          this.apiService.getGroupById(this._id).subscribe((x) => {
            let populatedGroup = x as Group;
            tempGroup.projectList.forEach((project) => {
              realProjects.push(populatedGroup.projectList.find(x => x._id === project._id));
            });
            tempGroup.slokkerProjectList.forEach((project) => {
              realSlokkerProjects.push(populatedGroup.slokkerProjectList.find(x => x._id === project._id));
            });
            tempGroup.projectList = realProjects;
            tempGroup.slokkerProjectList = realSlokkerProjects;
            tempGroup.dwaPostNumbers = populatedGroup.dwaPostNumbers;
            tempGroup.rwaPostNumbers = populatedGroup.rwaPostNumbers;
            tempGroup.slokkerPostNumbers = populatedGroup.slokkerPostNumbers;
            tempGroup.dwaSettings = populatedGroup.dwaSettings;
            tempGroup.rwaSettings = populatedGroup.rwaSettings;
            tempGroup.slokkerSettings = populatedGroup.slokkerSettings;

            for(let project of tempGroup.projectList){
              if (project.isWachtAansluiting || project.droogWaterAfvoer.isWachtaansluiting || project.regenWaterAfvoer.isWachtaansluiting) {
                project.equipNrRiolering = tempGroup.rbProjectNr + ((project.index != null && project.index !== '') ? '-volgnr= ' + project.index : '');
                project.naamFiche = 'GEM=' + tempGroup.gemeenteCode + ' projectnr=' + tempGroup.rbProjectNr + ' adres=' + project.street + (project.huisNr != null && project.huisNr !== '' ? ' - ' + project.huisNr : '') + ' wa='  +  project.equipNrRiolering + ' AB-HA-fiche';
              } else {
                project.naamFiche = 'GEM=' + tempGroup.gemeenteCode + ' projectnr= ' + tempGroup.rbProjectNr + ' adres=' + project.street + ' ' + project.huisNr + ((project.equipNrRiolering != null && project.equipNrRiolering !== '') ? ' eq=' + project.equipNrRiolering : '') + ' AB-HA-fiche';
              }
            }
            for(let slokkerProject of tempGroup.slokkerProjectList){
              slokkerProject.equipNrRiolering = tempGroup.rbProjectNr + ((slokkerProject.index != null && slokkerProject.index !== '') ? '-kolknr' + slokkerProject.index : '');
              slokkerProject.naamFiche = 'GEM=' + tempGroup.gemeenteCode + ' projectnr=' + tempGroup.rbProjectNr +
                ' adres=' + slokkerProject.street + ' ko=' + slokkerProject.equipNrRiolering + ' AB-kolk-fiche';
            }
            this.nieuweExcelService.generateNewExcel(
              title,
              headers,
              tempGroup,
              this.company.logo,
              this.company.name,
              this.formService.isVordering
            );
          });
        }
      });
    } else {
      this.toastrService.warning(
        'U heeft geen aansluiting geselecteerd. Selecteer minimum 1 aansluiting of kolk.',
        'Selecteer aansluitingen',
      );
    }
  }

  setupVariables() {
    this.formService.isComingFromCreateGroup = false;
    this.formService.previousPage.push('/pages/groupview/' + this._id);
    this.router.navigate(['/pages/settings-variable', this._id]);
  }

  createSlokker() {
    this.formService.previousPage.push('/pages/groupview/' + this._id);
    this.router.navigate(['/pages/slokkerproject-add', this._id]);
  }

  readLambertExcel() {
    this.formService.previousPage.push('/pages/groupview/' + this._id);
    this.formService.currentGroup = this.group;
    this.router.navigate(['/pages/read-excel-lambert', this._id]);
  }


  createMeerwerk() {
    this.formService.previousPage.push('/pages/groupview/' + this._id);
    this.router.navigate(['/pages/meerwerk-add', this._id]);
  }

  checkHasAfvoer(dwa: Waterafvoer) {
    if (dwa == null || ((dwa.buisVoorHor == null || dwa.buisVoorHor === 0 || dwa.buisVoorHor.toString() === '')
      && (dwa.buisVoorVert == null || dwa.buisVoorVert === 0 || dwa.buisVoorVert.toString() === '')
      && (dwa.bochtVoor == null || dwa.bochtVoor === 0 || dwa.bochtVoor.toString() === '')
      && (dwa.reductieVoor == null || dwa.reductieVoor === 0 || dwa.reductieVoor.toString() === '')
      && (dwa.buisVoorHor2 == null || dwa.buisVoorHor2 === 0 || dwa.buisVoorHor2.toString() === '')
      && (dwa.buisVoorVert2 == null || dwa.buisVoorVert2 === 0 || dwa.buisVoorVert2.toString() === '')
      && (dwa.bochtVoor2 == null || dwa.bochtVoor2 === 0 || dwa.bochtVoor2.toString() === '')
      && (dwa.reductieVoor2 == null || dwa.reductieVoor2 === 0 || dwa.reductieVoor2.toString() === '')
      && (dwa.buisAchter == null || dwa.buisAchter === 0 || dwa.buisAchter.toString() === '')
      && (dwa.bochtAchter == null || dwa.bochtAchter === 0 || dwa.bochtAchter.toString() === '')
      && (dwa.reductieAchter == null || dwa.reductieAchter === 0 || dwa.reductieAchter.toString() === '')
      && (dwa.YAchter == null || dwa.YAchter === 0 || dwa.YAchter.toString() === '') &&
      (!dwa.gradenBochtVoor45 || dwa.gradenBochtVoor45 === 0 || dwa.gradenBochtVoor45.toString() === '') &&
      (!dwa.gradenBochtVoor90 || dwa.gradenBochtVoor90 === 0 || dwa.gradenBochtVoor90.toString() === '') &&
      (!dwa.gradenBocht2Voor45 || dwa.gradenBocht2Voor45 === 0 || dwa.gradenBocht2Voor45.toString() === '') &&
      (!dwa.gradenBocht2Voor90 || dwa.gradenBocht2Voor90 === 0 || dwa.gradenBocht2Voor90.toString() === '') &&
      (!dwa.gradenBochtAchter45 || dwa.gradenBochtAchter45 === 0 || dwa.gradenBochtAchter45.toString() === '') &&
      (!dwa.gradenBochtAchter90 || dwa.gradenBochtAchter90 === 0 || dwa.gradenBochtAchter90.toString() === ''))) {
      return false;
    } else {
      return true;
    }
  }

  checkHasKolk(kolk: Slokkers) {
    if (kolk == null || ((kolk.buis == null || kolk.buis === 0 || kolk.buis.toString() === '') &&
      (kolk.buis2 == null || kolk.buis2 === 0 || kolk.buis2.toString() === '') &&
      (kolk.bocht == null || kolk.bocht === 0 || kolk.bocht.toString() === '') &&
      (kolk.bocht2 == null || kolk.bocht2 === 0 || kolk.bocht2.toString() === '') &&
      (kolk.gradenBocht45 == null || kolk.gradenBocht45 === 0 || kolk.gradenBocht45.toString() === '') &&
      (kolk.gradenBocht90 == null || kolk.gradenBocht90 === 0 || kolk.gradenBocht90.toString() === '') &&
      (kolk.gradenBocht45Fase2 == null || kolk.gradenBocht45Fase2 === 0 || kolk.gradenBocht45Fase2.toString() === '') &&
      (kolk.gradenBocht90Fase2 == null || kolk.gradenBocht90Fase2 === 0 || kolk.gradenBocht90Fase2.toString() === '') &&
      (kolk.reductie == null || kolk.reductie === 0 || kolk.reductie.toString() === '') &&
      (kolk.stop == null || kolk.stop === 0 || kolk.stop.toString() === '') &&
      (kolk.infiltratieKlok == null || kolk.infiltratieKlok === false))) {
      return false;
    } else {
      return true;
    }
  }
  toggleProjectDetails() {
    this.showProjectDetails = !this.showProjectDetails;
  }


  dateToDateString(date: Date){
    return ('0' + date.getDate()).slice(-2) + '/' + ('0' + (date.getMonth() + 1)).slice(-2) + '/' + ('0' + date.getFullYear()).slice(-2);
  }

  private async sortByAfwerkingsDatum() {
    const sortIndex = function(p1: Project, p2: Project) {
      const p1NotUpdated = p1.createdDate.getTime() === p1.updated.getTime();
      const p2NotUpdated = p2.createdDate.getTime() === p2.updated.getTime();
      if (p1NotUpdated && !p2NotUpdated) {
        return 1; // p1 goes below p2
      }
      if (!p1NotUpdated && p2NotUpdated) {
        return -1; // p1 goes above p2
      }

      if (p1.afgewerktDatum != null && p2.afgewerktDatum != null) {
        if (p1.afgewerktDatum < p2.afgewerktDatum) {
          return 1;
        }
        if (p1.afgewerktDatum > p2.afgewerktDatum) {
          return -1;
        }
      } else if(p1.afgewerktDatum == null && p2.afgewerktDatum != null){
        if(p1.updated < p2.afgewerktDatum){
          return 1;
        } else if(p1.updated > p2.afgewerktDatum){
          return -1;
        }
      } else if(p1.afgewerktDatum != null && p2.afgewerktDatum == null){
        if(p1.afgewerktDatum < p2.updated){
          return 1;
        } else if( p1.afgewerktDatum > p2.updated){
          return -1;
        }
      }
      if (p1.isMeerwerk === true) {
        return 1;
      } else if (p2.isMeerwerk === true) {
        return -1;
      }
       if(p1.afgewerktDatum == null && p2.afgewerktDatum == null){
        if(p1.updated < p2.updated){
          return 1;
        } else if(p1.updated > p2.updated){
          return -1;
        }
      }
      return 0;
    };
    this.projects.sort(sortIndex);
    this.searchAllProjectsList.sort(sortIndex);
  }

  clearDate() {
    this.range = null;
    this.filterTussenDateStartString = null;
    this.filterTussenDateEndString = null;
    this.filterAndSort();
  }


  changeFilterStartDatum($event) {
    this.formService.previousDateSorteer = $event;
    this.filterAndSort();
  }

  filterOnStreetAutoComplete(street) {
    console.log(street)
    this.formService.previousStreet = street;
    this.filterStraatText = street;
    this.checkIfSelectedAansluitingen();
  }

  clearSearch() {
    this.searchForm.setValue('');
    this.formService.previousStreet = '';
    this.filterStraatText = '';
  }

  createSchademelding() {
    this.formService.previousPage.push('/pages/groupview/' + this._id);
    this.router.navigate(['/pages/schademeldingedit/' + this._id + '/' + null ]);
  }

  toggleOwAndSchademeldingView() {
    this.isViewingOwAndSchademeldingList = !this.isViewingOwAndSchademeldingList;
    this.formService.isViewingOwAndSchademeldingList = this.isViewingOwAndSchademeldingList;
  }

  editSchademelding(schademelding: Schademelding) {
    this.formService.previousPage.push('/pages/groupview/' + this._id);
    this.router.navigate(['/pages/schademeldingedit/' + this._id + '/' + schademelding._id]);
  }



  openSchademelding(schademelding: Schademelding) {
    this.formService.previousPage.push('/pages/groupview/' + this._id);
    this.router.navigate(['/pages/schademeldingview/' + this._id + '/' + schademelding._id]);
  }

  openMeerwerk(schademelding: Schademelding) {
    this.formService.previousPage.push('/pages/groupview/' + this._id);
    this.router.navigate(['/pages/meerwerkview', schademelding._id]);
  }
  editMeerwerk(schademelding: Schademelding) {
    this.formService.previousPage.push('/pages/groupview/' + this._id);
    this.router.navigate(['/pages/meerwerkedit' , schademelding._id]);
  }

  convertMinutesToHours(minutesWorked: number) {
    if(minutesWorked == null){
      return '0u 0m';
    }
    const hours = Math.floor(minutesWorked / 60);
    const minutes = minutesWorked % 60;
    return hours + 'u ' + minutes + 'm';
  }

  selectAllOwAndSchademeldingen() {
    this.selectEverythingOwAndSchade = !this.selectEverythingOwAndSchade;
    this.owAndSchademeldingList.forEach((x) => {
       x.isSelected = this.selectEverythingOwAndSchade;
     });
  }

  selectOwofSchademelding(_id: string) {
    const index = this.owAndSchademeldingList.findIndex((x) => x._id === _id);
    this.owAndSchademeldingList[index].isSelected = !this.owAndSchademeldingList[index].isSelected;
  }

  async generatePDFoWAndSchademeldingen() {

    let owAndSchademeldingen = this.owAndSchademeldingList.filter((x) => {
      return x.isSelected;
    }) ;

    if (owAndSchademeldingen != null && owAndSchademeldingen.length !== 0 && !this.isGeneratingPDF) {
          this.isGeneratingPDF = true;
            try {
               let meerwerkenIds = owAndSchademeldingen.filter(x => x.isMeerwerk).map(y => (y._id));
               let schademeldingenIds = owAndSchademeldingen.filter(x => x.isSchademelding).map(y => (y._id));
              let sendPdfids = {meerwerkenIds:meerwerkenIds,schademeldingenIds: schademeldingenIds };

              this.isLoadingBar = true;
              this.pdfProgress = '';
              this.isDownloading = false;
              this.progress = 0;
              this.toastrService.success(
                'De fiches worden klaargemaakt. Even geduld aub...',
                'Even geduld',
                { duration: 4000 },
              );

              this.pdfProgressBlocks = [];
              for(let i = 0; i < this.totalProjectCount; i++){
                this.pdfProgressBlocks.push(i);
              }
              await this.initSocket();
              this.apiService.makeOwAndSchademeldingPdfZip(sendPdfids, this._id).subscribe(async data => {
                },
                error => { // This function will be executed when an error is emitted
                  this.isGeneratingPDF = false;
                  this.isLoadingBar = false;
                  this.isDownloading = false;
                  Pace.stop();
                  this.progress = 0;
                  console.log('Error occurred while generating PDF:', error);
                  if (error.status === 500) { // Check if the error response status is 500
                    this.toastrService.warning(
                      'Er is een fout opgetreden bij het genereren van de PDF. Probeer het later opnieuw.',
                      'Error',
                      { duration: 4000 },
                    );
                  }
                })
            } catch (e) {
              Pace.stop();
              this.progress = 0;
              this.isGeneratingPDF = false;
              this.isLoadingBar = false;
              this.isDownloading = false;
            }
    } else {
      if(!this.isGeneratingPDF){
        this.toastrService.warning(
          'U heeft geen aansluiting geselecteerd. Selecteer minimum 1 aansluiting of kolk.',
          'Selecteer aansluitingen',
        );
      }
    }
  }
}
