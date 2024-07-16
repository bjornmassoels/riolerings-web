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
import { MeerwerkViewDialogComponent } from './meerwerk-view-dialog/meerwerk-view-dialog.component';
import * as html2pdf from 'html2pdf.js';
import { MeerwerkViewDeleteDialogComponent } from './meerwerk-view-delete-dialog/meerwerk-view-delete-dialog.component';
import { Company } from 'models/company';
import { Group } from 'models/groups';
import { NbToastrService } from '@nebular/theme';
import { VariablesService } from 'services/variables.service';
import {Meerwerk} from "../../../../models/meerwerk";
import { GoogleMapsLocatiePopupComponent } from '../../googleMapsLocatiePopup/googleMapsLocatiePopup.component';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Schademelding } from '../../../../models/schademelding';

@Component({
  selector: 'ngx-meerwerken-view',
  templateUrl: './meerwerken-view.component.html',
  styleUrls: [
    './meerwerken-view.component.scss',
    '../../styles/project-view.scss',
  ],
})
export class MeerwerkenViewComponent implements OnInit, OnDestroy {
  days: string[] = ['Zondag','Maandag','Dinsdag','Woensdag','Donderdag','Vrijdag','Zaterdag'];

  public currentProject: Meerwerk;
  public company: Company;
  public hasPreviousPage: boolean = false;
  public index: number;
  public totalProjectCount: number;
  public isLoaded: boolean = false;
  public latitude: number;
  public longitude: number;
  public _id: string;
  data: any;
  private lastProjects: Project[] = [];
  public group: Group = new Group();
  owAndSchademeldingList: Schademelding[];

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
    let nextObject = this.owAndSchademeldingList[this.index - 1];
    let route;
    if(nextObject.isMeerwerk){
      route = '/pages/meerwerkview/' + nextObject._id
    } else {
      route = '/pages/schademeldingview/' + nextObject.group_id + '/' + nextObject._id
    }
    this.router.navigate([route]);
  }

  onNextClick() {
    let nextObject = this.owAndSchademeldingList[this.index + 1];
    let route;
    if(nextObject.isMeerwerk){
      route = '/pages/meerwerkview/' + nextObject._id
    } else {
      route = '/pages/schademeldingview/' + nextObject.group_id + '/' + nextObject._id
    }
    this.router.navigate([route]);
  }
  imagePopUp(photo: string) {
    this.formService._chosenPhoto = photo;
    let dialogRef = this.dialog.open(MeerwerkViewDialogComponent, {
      height: '98vh',
      width: '37vw',
    });
  }

  private loadData() {
    this.owAndSchademeldingList = this.formService.owAndSchademeldingList;
    this.apiService.getMeerwerkById(this._id).subscribe(async (x) => {
      this.currentProject = x as Meerwerk;

      if (this.currentProject._id == null) {
        this.currentProject._id = this.currentProject.id;
      }
      const indexer = this.owAndSchademeldingList?.findIndex((x) => x._id === this._id);
      this.index = indexer;
      this.group = this.currentProject.group_id;

      if (this.currentProject.startDate != null) {
        this.currentProject.startDate = new Date(this.currentProject.startDate);
      } else {
        this.currentProject.startDate = null;
      }
      if(this.currentProject.created != null) this.currentProject.createdDate = new Date(this.currentProject.created);
      if(this.currentProject.updated != null)this.currentProject.updated = new Date(this.currentProject.updated);
      if(this.currentProject.lastWorkerDate != null)this.currentProject.lastWorkerDate = new Date(this.currentProject.lastWorkerDate);
      this.formService.deleteMeerwerk = this.currentProject;

      while(this.apiService.thisCompany == null){
        await this.delay(50)
      }
      this.company = this.apiService.thisCompany;
      this.formService.isViewingOwAndSchademeldingList = true;

      this.isLoaded = true;

      if(!this.currentProject.hasBeenViewed){
        this.apiService.updateMeerwerkHasBeenViewed(this._id).subscribe(x => {
          this.currentProject.hasBeenViewed = true;
        });
      }
    });
  }
  async generatePDF() {
    let title = '';
    title = (this.currentProject.activiteit ? this.currentProject.activiteit + '-' : '') + this.currentProject.street + (this.currentProject.huisNr ? '-' + this.currentProject.huisNr : '') + "-onvoorzien werk";
    title = title.replace('/', '-');
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog3, {
      width: '700px',
      data: title,
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      title = result;
      if (this.variablesService.cancelDownload === false) {
        this.toastrService.success('De pdf wordt gedownload...', 'Even geduld');
        this.apiService.makeMeerwerkPdf(this.currentProject._id).subscribe((data:  Data) => {
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
  ngOnDestroy(){
    this.formService.previousIndexScroll = this.index;
    this.formService.previousPageForScrollIndex = 'schademelding';
  }

  goToPrevious() {
    this.formService.previousIndexScroll = this.index;
    this.formService.previousPageForScrollIndex = 'schademelding';
    this.router.navigate(['/pages/groupview', this.group._id]);
  }
  goToEdit() {
    if (this.currentProject._id == null) {
      this.currentProject._id = this.currentProject.id;
    }
    this.router.navigate([
      '/pages/meerwerkedit',
      this.currentProject._id,
    ]);
  }
  async onDeleteProject() {
    if(this.currentProject.group_id != null && this.currentProject.group_id?._id == null){
      this.currentProject.group_id._id = this.currentProject.group_id.id;
    }
    this.formService.previousPage = ['/pages/groupview/' + this.currentProject.group_id._id];
    let dialogRef = this.dialog.open(MeerwerkViewDeleteDialogComponent, {
      height: '19vh',
      width: '27vw',
    });
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
        '-' +
        this.currentProject.huisNr +
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
  deleteFoto(i: number) {
    this.currentProject[i] = null;
  }
  minutesToHours(minutes: number){
    switch(minutes){
      case 0: return '0 min';
      case 15: return '15 min';
      case 30: return '30 min';
      case 45: return '45 min';
      case 60: return '1 uur';
      case 75: return '1 uur 15 min';
      case 90: return '1 uur 30 min';
      case 105: return '1 uur 45 min';
      case 120: return '2 uur';
      case 135: return '2 uur 15 min';
      case 150: return '2 uur 30 min';
      case 165: return '2uur 45 min';
      case 180: return '3 uur';
      case 195: return '3 uur 15 min';
      case 210: return '3 uur 30 min';
      case 225: return '3 uur 45 min';
      case 240: return '4 uur';
      case 255: return '4 uur 15 min';
      case 270: return '4 uur 30 min';
      case 285: return '4 uur 45 min';
      case 300: return '5 uur';
      case 360: return '6 uur';
      case 420: return '7 uur';
      case 480: return '8 uur';
    }
  }
  openMapDialog(xCoord: number, yCoord: number, soort: string): void {
    this.dialog.open(GoogleMapsLocatiePopupComponent, {
      data: { xCoord, yCoord , soort},
    });
  }
  dateToDateString(date: Date){
    return this.days[date.getDay()].substring(0,3) + ' ' +('0' + date.getDate()).slice(-2) + '/' + ('0' + (date.getMonth() + 1)).slice(-2) + '/' + ('0' + date.getFullYear()).slice(-2);
  }
}
@Component({
  selector: 'dialog-overview-example-dialog3',
  templateUrl: 'name-pdf-dialog-meerwerk.html',
})
export class DialogOverviewExampleDialog3 {
  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog3>,
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
