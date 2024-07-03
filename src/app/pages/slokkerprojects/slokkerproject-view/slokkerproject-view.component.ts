import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  Inject, OnDestroy,
} from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { UntypedFormBuilder } from '@angular/forms';
import { FormService } from '../../../../services/form.service';
import { ApiService } from '../../../../services/api.service';
import { SlokkerProjects } from '../../../../models/slokker-projects';
import { Project } from '../../../../models/project';

import { SlokkerprojectViewDialogComponent } from './slokkerproject-view-dialog/slokkerproject-view-dialog.component';
import { SlokkerprojectViewDeleteDialogComponent } from './slokkerproject-view-delete-dialog/slokkerproject-view-delete-dialog.component';
import { Company } from 'models/company';
import { Group } from 'models/groups';
import { NbToastrService } from '@nebular/theme';
import { VariablesService } from 'services/variables.service';
import { User } from 'models/user';
import { Slokkers } from '../../../../models/slokkers';
import { GoogleMapsLocatiePopupComponent } from '../../googleMapsLocatiePopup/googleMapsLocatiePopup.component';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'ngx-products-edit',
  templateUrl: './slokkerproject-view.component.html',
  styleUrls: [
    './slokkerproject-view.component.scss',
    '../../styles/project-view.scss',
  ],
})
export class SlokkerprojectViewComponent implements OnInit,OnDestroy {
  days: string[] = ['Zondag','Maandag','Dinsdag','Woensdag','Donderdag','Vrijdag','Zaterdag'];

  public currentProject: SlokkerProjects;
  public company: Company;
  public hasPreviousPage: boolean = false;
  public index: number;
  public totalProjectCount: number;
  public isLoaded: boolean = false;
  public isFirst: boolean = false;
  public isLast: boolean = false;
  public latitude: number;
  public longitude: number;
  public _id: string;
  data: any;
  private lastProjects: SlokkerProjects[] = [];
  public group: Group = new Group();
  heeftPloegen: boolean;
  public users: User[];
  public usersWhoEdited: string = '';

  constructor(
    private formBuilder: UntypedFormBuilder,
    private variablesService: VariablesService,
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    private formService: FormService,
    private dialog: MatDialog,
    private toastrService: NbToastrService,
  ) {
    route.params.subscribe((val) => {
      this.isLoaded = false;
      if (this.formService.lastProjects.length === 0) {
        this.hasPreviousPage = false;
      } else {
        this.hasPreviousPage = true;
      }
      this.usersWhoEdited = '';
      this._id = this.route.snapshot.paramMap.get('id');
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
        if (project.isSlokker == null || project.isSlokker === false) {
          this.formService.PreloadProject = project as Project;
          this.formService.preloadSlokkerProject = null;
          this.router.navigate(['/pages/projectview', project._id]);
        } else {
          this.formService.preloadSlokkerProject = project as SlokkerProjects;
          this.formService.PreloadProject = null;
          this.router.navigate(['/pages/slokkerprojectview', project._id]);
        }
    }
  }

  onNextClick() {
    const index = this.lastProjects.findIndex((x) => x._id === this._id);
    if (this.lastProjects.length > index + 1) {
      const project = this.lastProjects[index + 1];
        if (project.isSlokker == null || project.isSlokker === false) {
          this.formService.PreloadProject = project as Project;
          this.formService.preloadSlokkerProject = null;
          this.router.navigate(['/pages/projectview', project._id]);
        } else {
          this.formService.preloadSlokkerProject = project as SlokkerProjects;
          this.formService.PreloadProject = null;
          this.router.navigate(['/pages/slokkerprojectview', project._id]);
        }
    }
  }

  imagePopUp(photo: string) {
    this.formService._chosenPhoto = photo;
    let dialogRef = this.dialog.open(SlokkerprojectViewDialogComponent, {
      height: '94vh',
      width: '50vw',
    });
  }

  private loadData() {
    this.lastProjects = this.formService.lastProjects;
    this.apiService.getSlokkerProjectById(this._id).subscribe(async (x) => {
      this.currentProject = x as SlokkerProjects;
      while(this.apiService.thisCompany == null){
        await this.delay(50)
      }
      this.company = this.apiService.thisCompany;
      if (this.currentProject._id == null) {
        this.currentProject._id = this.currentProject.id;
      }
      this.formService._chosenSlokkerProject = this.currentProject;
      const indexer = this.lastProjects.findIndex((x) => x._id === this._id);
      this.index = indexer;
      this.group = this.currentProject.group_id;
      this.heeftPloegen = this.group.heeftPloegen;
      this.totalProjectCount = this.lastProjects?.length;
      if (this.currentProject.startDate != null) {
        this.currentProject.startDate = new Date(this.currentProject.startDate);
      }
      if(this.currentProject.afgewerktDatum != null){
        this.currentProject.afgewerktDatum = new Date(this.currentProject.afgewerktDatum);
      }
      if(this.currentProject.schetsPhotos == null){
        this.currentProject.schetsPhotos = [null, null];
      }
      if(this.currentProject.created != null) this.currentProject.createdDate = new Date(this.currentProject.created);
      if(this.currentProject.updated != null)this.currentProject.updated = new Date(this.currentProject.updated);
      if(this.currentProject.lastWorkerDate != null)this.currentProject.lastWorkerDate = new Date(this.currentProject.lastWorkerDate);
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
      this.formService.deleteSlokkerProject = this.currentProject;
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

      this.isLoaded = true;
    });
  }

  async generatePDF() {
    this.currentProject.equipNrRiolering = this.group.rbProjectNr +  ((this.currentProject.index != null && this.currentProject.index !== '')?  '-kolknr'  + this.currentProject.index : '') ;
    this.currentProject.naamFiche = 'GEM=' + this.group.gemeenteCode + ' projectnr=' + this.group.rbProjectNr + ' / ' + this.group.aannemerProjectNr +
      ' adres=' + this.currentProject.street +  ((this.currentProject.index != null && this.currentProject.index !== '')?
        '-kolknr'  + this.currentProject.index : '') + ' AB-kolk-fiche';
    let title =  'Kolk' + (this.currentProject.street != null && this.currentProject.street !== '' ? '-' + this.currentProject.street : '') +
      (this.currentProject.huisNr != null && this.currentProject.huisNr !== '' ? '-' + this.currentProject.huisNr : '') +
      (this.currentProject.index != null && this.currentProject.index !== '' ? '-' + this.currentProject.index : '');
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog2, {
      width: '550px',
      data: title,
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      title = result;
      if (this.variablesService.cancelDownload === false) {
        this.toastrService.success('DE PDF IS AAN HET DOWNLOADEN.');
        this.apiService.makeKolkPdf(this.currentProject._id, title).subscribe((data:  Data) => {
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
      this.variablesService.cancelDownload = false;
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

  goToPrevious() {
    this.formService.previousIndex = this.index;
    this.router.navigate(['/pages/groupview', this.group._id]);
  }

  goToEdit() {
    if (this.currentProject._id == null) {
      this.currentProject._id = this.currentProject.id;
    }
    this.router.navigate([
      '/pages/slokkerprojectedit',
      this.currentProject._id,
    ]);
  }
  async onDeleteProject() {
    this.formService.previousPage = ['/pages/groupview/' + this.currentProject.group_id._id];
    let dialogRef = this.dialog.open(SlokkerprojectViewDeleteDialogComponent, {
      height: '19vh',
      width: '27vw',
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

      img.download =
        'Foto ' + (i) + '-' +
        this.currentProject.street +
        '-' +  this.currentProject.index +
        '.png';

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
  checkHasKolk(kolk: Slokkers) {
    if ((kolk.buis == null || kolk.buis === 0 || kolk.buis.toString() === '') &&
      (kolk.buis2 == null || kolk.buis2 === 0 || kolk.buis2.toString() === '') &&
      (kolk.bocht == null || kolk.bocht === 0 || kolk.bocht.toString() === '') &&
      (kolk.bocht2 == null || kolk.bocht2 === 0 || kolk.bocht2.toString() === '') &&
      (kolk.gradenBocht45 == null || kolk.gradenBocht45 === 0 || kolk.gradenBocht45.toString() === '') &&
      (kolk.gradenBocht90 == null || kolk.gradenBocht90 === 0 || kolk.gradenBocht90.toString() === '') &&
      (kolk.gradenBocht45Fase2 == null || kolk.gradenBocht45Fase2 === 0 || kolk.gradenBocht45Fase2.toString() === '') &&
      (kolk.gradenBocht90Fase2 == null || kolk.gradenBocht90Fase2 === 0 || kolk.gradenBocht90Fase2.toString() === '') &&
      (kolk.reductie == null || kolk.reductie === 0 || kolk.reductie.toString() === '') &&
      (kolk.stop == null || kolk.stop === 0 || kolk.stop.toString() === '') &&
      (kolk.infiltratieKlok == null || kolk.infiltratieKlok === false)){
      return false;
    } else {
      return true;
    }
  }
  checkIfHasCoords(slokker: Slokkers) {
    if((slokker.xCoord != null && slokker.xCoord !== '') || (slokker.yCoord != null && slokker.yCoord !== '') || (slokker.zCoord != null && slokker.zCoord !== '')){
      return true;
    } else {
      return false;
    }
  }
  deleteFoto(i: number) {
    this.currentProject[i] = null;
  }
  dateToDateString(date: Date){
    return this.days[date.getDay()].substring(0,3) + ' ' +('0' + date.getDate()).slice(-2) + '/' + ('0' + (date.getMonth() + 1)).slice(-2) + '/' + ('0' + date.getFullYear()).slice(-2);
  }
  NullToZero(numberr: number) {
    if (numberr == null) {
      return 0;
    } else {
      return numberr;
    }
  }
  openMapDialog(xCoord: number, yCoord: number, soort: string): void {
    this.dialog.open(GoogleMapsLocatiePopupComponent, {
      data: { xCoord, yCoord , soort},
    });
  }
}
@Component({
  selector: 'dialog-overview-example-dialog2',
  templateUrl: 'name-pdf-dialog-slokker.html',
})
export class DialogOverviewExampleDialog2 {
  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog2>,
    public variableService: VariablesService,
    @Inject(MAT_DIALOG_DATA) public data: string,
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
