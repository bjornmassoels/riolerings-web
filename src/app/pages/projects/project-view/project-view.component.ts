import {
  Component,
  OnInit,
  Inject, OnDestroy, ElementRef, ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UntypedFormBuilder } from '@angular/forms';
import { Project } from '../../../../models/project';
import { FormService } from '../../../../services/form.service';
import { ApiService } from '../../../../services/api.service';
import { SlokkerProjects } from '../../../../models/slokker-projects';

import { ProjectViewDialogComponent } from './project-view-dialog/project-view-dialog.component';
import { Company } from '../../../../models/company';
import { ProjectViewDeleteDialogComponent } from './project-view-delete-dialog/project-view-delete-dialog.component';
import { Group } from '../../../../models/groups';
import { NbToastrService } from '@nebular/theme';
import { VariablesService } from '../../../../services/variables.service';
import {AuthGuard} from "../../../../services/auth-guard.service";
import { Waterafvoer } from '../../../../models/waterafvoer';
import { GoogleMapsLocatiePopupComponent } from '../../googleMapsLocatiePopup/googleMapsLocatiePopup.component';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'ngx-products-view',
  templateUrl: './project-view.component.html',
  styleUrls: [
    './project-view.component.scss',
    '../../styles/project-view.scss',
  ],
})
export class ProjectViewComponent implements OnInit,OnDestroy {
  public currentProject: Project;
  public company: Company;
  public isLoaded: boolean = false;
  public latitude: number;
  public longitude: number;
  public usersWhoEdited: string = '';
  public _id: string;
  public index: number;
  public hasPreviousPage: boolean;
  public group: Group;
  public totalProjectCount: number;
  public isFirst: boolean = false;
  public isLast: boolean = false;
  private lastProjects: Project[] = [];
  heeftPloegen: boolean;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    private formService: FormService,
    private dialog: MatDialog,
    private toastrService: NbToastrService,
    private variablesService: VariablesService,
    private authGuard: AuthGuard
  ) {
    route.params.subscribe((val) => {
      this.isLoaded = false;
      if (this.formService.lastProjects.length === 0) {
        this.hasPreviousPage = false;
      } else {
        this.hasPreviousPage = true;
      }
          this._id = this.route.snapshot.paramMap.get('id');
          this.usersWhoEdited = '';
          this.loadData();
    });
  }

  async ngOnInit(): Promise<void> {}

  Date(created: string) {
    return new Date(created).toLocaleDateString();
  }

  onCloseClick() {}

  onPreviousClick() {
    const index = this.lastProjects.findIndex((x) => x._id === this._id);
    if (index !== 0) {
      const project = this.lastProjects[index - 1];
      if(!project.isMeerwerk) {
        if (project.isSlokker == null || project.isSlokker === false) {
          this.formService.PreloadProject = project as Project;
          this.formService.preloadSlokkerProject = null;
          this.router.navigate(['/pages/projectview', project._id]);
        } else {
          this.formService.preloadSlokkerProject = project as SlokkerProjects;
          this.formService.PreloadProject = null;
          this.router.navigate(['/pages/slokkerprojectview', project._id]);
        }
      } else {
        this.router.navigate(['/pages/meerwerkview', project._id]);
      }
    }
  }

  onNextClick() {
    const index = this.lastProjects.findIndex((x) => x._id === this._id);
    if (this.lastProjects.length > index + 1) {
      const project = this.lastProjects[index + 1];
      if(!project.isMeerwerk) {
        if (project.isSlokker == null || project.isSlokker === false) {
          this.formService.PreloadProject = project as Project;
          this.formService.preloadSlokkerProject = null;
          this.router.navigate(['/pages/projectview', project._id]);
        } else {
          this.formService.preloadSlokkerProject = project as SlokkerProjects;
          this.formService.PreloadProject = null;
          this.router.navigate(['/pages/slokkerprojectview', project._id]);
        }
      } else {
        this.router.navigate(['/pages/meerwerkview', project._id]);
      }
    }
  }

  private loadData() {
    this.lastProjects = this.formService.lastProjects;
    this.apiService.getProjectById(this._id).subscribe(async (x) => {
      this.currentProject = x as Project;
      if (this.currentProject._id == null) {
        this.currentProject._id = this.currentProject.id;
      }
      if (this.currentProject.startDate != null) {
        this.currentProject.startDate = new Date(this.currentProject.startDate);
      } else {
        this.currentProject.startDate = null;
      }
      this.group = this.currentProject.group_id;

      this.heeftPloegen = this.group.heeftPloegen;
      this.formService._chosenProject = this.currentProject;

      if (this.currentProject.latitudeList != null) {
        this.latitude =
          this.currentProject.latitudeList[
            this.currentProject.latitudeList.length - 1
          ];
      }
      if (this.currentProject.longitudeList != null) {
        this.longitude =
          this.currentProject.longitudeList[
            this.currentProject.longitudeList.length - 1
          ];
      }
      if (this.currentProject._id == null) {
        this.currentProject._id = this._id;
      }

      this.formService.PreloadProject = this.currentProject;
      const indexer = this.lastProjects.findIndex((x) => x._id === this._id);
      this.index = indexer;
      this.totalProjectCount = this.lastProjects?.length;

      if (indexer === 0 || indexer === -1) {
        this.isFirst = true;
      } else {
        this.isFirst = false;
      }

      if (
        indexer + 1 === this.formService.lastProjects.length ||
        this.formService.lastProjects.length === 1 ||
        this.formService.lastProjects.length === 0
      ) {
        this.isLast = true;
      } else {
        this.isLast = false;
      }
      if (this.currentProject.usersWhoEdited == null) {
        this.currentProject.usersWhoEdited = [];
      }

      for (let i = 0; i < this.currentProject.usersWhoEdited.length; i++) {
        if (i === this.currentProject.usersWhoEdited.length - 1) {
          this.usersWhoEdited = this.usersWhoEdited.concat(
            this.currentProject.usersWhoEdited[i].name == null ||
              this.currentProject.usersWhoEdited[i].name == ''
              ? this.currentProject.usersWhoEdited[i].email
              : this.currentProject.usersWhoEdited[i].name,
          );
        } else {
          this.usersWhoEdited = this.usersWhoEdited.concat(
            this.currentProject.usersWhoEdited[i].name == null ||
              this.currentProject.usersWhoEdited[i].name == ''
              ? this.currentProject.usersWhoEdited[i].email
              : this.currentProject.usersWhoEdited[i].name,
            ', ',
          );
        }
      }
      while(this.apiService.thisCompany == null){
        await this.delay(50)
      }
      this.company = this.apiService.thisCompany;
      this.isLoaded = true;
    });
  }

  goToPrevious() {
    this.formService.previousIndex = this.index;
    this.router.navigate(['/pages/groupview', this.group._id]);
  }

  async onDeleteProject() {
    let dialogRef = this.dialog.open(ProjectViewDeleteDialogComponent, {
      height: '19vh',
      width: '27vw',
    });

    // this.formService._allProjects = this.formService._allProjects.filter(project => (
    // project._id !== this.formService._chosenProject._id
    // ));
  }

  async generatePDF() {
    if(this.currentProject.isWachtAansluiting || this.currentProject.droogWaterAfvoer.isWachtaansluiting || this.currentProject.regenWaterAfvoer.isWachtaansluiting){
      this.currentProject.naamFiche = 'GEM=' + this.group.gemeenteCode + ' projectnr=' + this.group.rbProjectNr + ' / ' + this.group.aannemerProjectNr +
        ' adres=' + this.currentProject.street + ((this.currentProject.huisNr != null && this.currentProject.huisNr !== '') ?
          ' - ' + this.currentProject.huisNr : '') + ((this.currentProject.index != null && this.currentProject.index !== '')? ' volgnr = ' + this.currentProject.index : '') + ' AB-HA-fiche';
      this.currentProject.equipNrRiolering = this.group.rbProjectNr + ((this.currentProject.index != null && this.currentProject.index !== '')? '-volgnr= ' + this.currentProject.index : '') ;
      this.currentProject.bestandNaam = 'WA-' + this.currentProject.street + ((this.currentProject.huisNr != null && this.currentProject.huisNr !== '') ? '-' + this.currentProject.huisNr : '') +
        ((this.currentProject.index != null && this.currentProject.index !== '')? '-' + this.currentProject.index : '');
    } else {
      this.currentProject.naamFiche = 'GEM=' + this.group.gemeenteCode + ' projectnr= ' + this.group.rbProjectNr + ' / ' + this.group.aannemerProjectNr +
        ' adres=' + this.currentProject.street + ' ' + this.currentProject.huisNr + ((this.currentProject.equipNrRiolering != null && this.currentProject.equipNrRiolering !== '') ? ' eq=' + this.currentProject.equipNrRiolering : '');
      this.currentProject.bestandNaam = 'HA-' + this.currentProject.street + ((this.currentProject.huisNr != null && this.currentProject.huisNr !== '') ? '-' + this.currentProject.huisNr : '');
    }
    let title = this.currentProject.bestandNaam;
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width:'550px',
      data: title,
    });
    dialogRef.afterClosed().subscribe(async (result) => {
      title = result;
      if (this.variablesService.cancelDownload === false) {
        this.toastrService.success('DE PDF WORDT GEDOWNLOAD. Even geduld');
        if(this.currentProject._id == null) this.currentProject._id = this.currentProject.id;
        this.apiService.makeHuisaansluitingPdf(this.currentProject._id, title).subscribe((data:  Data) => {
          const { pdf: base64PDF } = data;

          // Convert base64 to a blob
          fetch(`data:application/pdf;base64,${base64PDF}`)
            .then(res => res.blob())
            .then(blob => {
              // Create a link element
              const url = window.URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.setAttribute('download', title + '.pdf'); // or any other filename

              // Automatically download the file
              document.body.appendChild(link);
              link.click();
              link.parentNode.removeChild(link);
            });
        });
      }
    });
  }

  toggleDisplay() {
    const element = document.getElementById('printContainer');
    if (element.style.display === 'block') {
      element.style.display = 'none';
    } else {
      element.style.display = 'block';
    }
  }

  goToEdit() {
    if (this.currentProject._id == null) {
      this.currentProject._id = this.currentProject.id;
    }
    this.router.navigate(['/pages/projectedit', this.currentProject._id]);
  }

  imagePopUp(photo: string) {
    this.formService._chosenPhoto = photo;
    let dialogRef = this.dialog.open(ProjectViewDialogComponent, {
      height: '98vh',
      width: '50vw',
    });
  }

  ngOnDestroy(){
    this.formService.previousIndex = this.index;
  }
  async downloadPhotos() {
    const data = document.getElementsByName('photo');

    let j = 1;
    for (let i = 0; i < data.length; i++) {
      const img: any = document.createElement('a');

      const blob = await this.getBlobFromURL(data[i].getAttribute('src'));
      img.href = URL.createObjectURL(blob);

      if(!this.currentProject.isWachtAansluiting){
        img.download =
          'Foto ' + (i) + '-' +
          this.currentProject.street +
          '-' +
          this.currentProject.huisNr +
          '.png';
      } else {
        img.download =
          'Foto ' + (i) + '-' +
          this.currentProject.street +
          '-' +
          this.currentProject.huisNr + '-' +  this.currentProject.index +
         '.png';
      }


      document.body.appendChild(img);
      img.style = 'display: none';
      img.click();
      img.remove();

      j = j + 1;
      if (j === 9) {
        // Otherwise browser rejects downloads
        await this.delay(3000);
        j = 1;
      }
    }
  }

  async getBlobFromURL(imageUrl) {
    const blob = await fetch(imageUrl).then((r) => r.blob());

    return blob;
  }

  delay(timeInMillis: number): Promise<void> {
    return new Promise((resolve) => setTimeout(() => resolve(), timeInMillis));
  }
  NullToZero(number){
    if(number == null){
      return 0;
    } else {
      return number;
    }
  }
  NullToString(check) {
    if (check == null || check === 0) {
      return '';
    } else {
      return check;
    }
  }
  checkIfHasCoords(waterAfvoer: Waterafvoer) {
    if((waterAfvoer.xCoord != null && waterAfvoer.xCoord !== '') || (waterAfvoer.yCoord != null && waterAfvoer.yCoord !== '') || (waterAfvoer.zCoord != null && waterAfvoer.zCoord !== '')){
      return true;
    } else {
      return false;
    }
  }
  addMeterString(meter: number){
    if(meter == null || meter === 0){
      return '';
    } else {
      return meter + ' meter';
    }
  }
  addMString(meter: number){
    if(meter == null || meter === 0){
      return '';
    } else {
      return meter + ' m';
    }
  }
  addStuksString(stuks: number){
    if(stuks == null || stuks === 0){
      return '';
    } else {
      return stuks + ' stuk' + (stuks > 1 ? 's' : '');
    }
  }
  checkHasAfvoer(dwa: Waterafvoer) {
    if ((dwa.buisVoorHor == null || dwa.buisVoorHor === 0 || dwa.buisVoorHor.toString() === '')
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
      (!dwa.gradenBochtAchter90 || dwa.gradenBochtAchter90 === 0 || dwa.gradenBochtAchter90.toString() === '')) {
      return false;
    } else {
      return true;
    }
  }

  openMapDialog(xCoord: number, yCoord: number, soort: string): void {
    this.dialog.open(GoogleMapsLocatiePopupComponent, {
      data: { xCoord, yCoord , soort},
    });
  }
}
@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'name-pdf-dialog.html',
})
export class DialogOverviewExampleDialog {
  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: string,
    public variableService: VariablesService,
  ) {
    this.variableService.cancelDownload = true;
  }

  onNoClick(): void {
    this.variableService.cancelDownload = true;
    this.dialogRef.close();
  }

  onOpslaanClick() {
    this.variableService.cancelDownload = false;
  }
}
interface Data {
  pdf: any;  // use a more specific type if possible
  // add other properties if needed
}
