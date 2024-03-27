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

@Component({
  selector: 'ngx-meerwerken-view',
  templateUrl: './meerwerken-view.component.html',
  styleUrls: [
    './meerwerken-view.component.scss',
    '../../styles/project-view.scss',
  ],
})
export class MeerwerkenViewComponent implements OnInit {
  days: string[] = ['Zondag','Maandag','Dinsdag','Woensdag','Donderdag','Vrijdag','Zaterdag'];

  public currentProject: Meerwerk;
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
  private lastProjects: Project[] = [];
  public group: Group = new Group();

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

  imagePopUp(photo: string) {
    this.formService._chosenPhoto = photo;
    let dialogRef = this.dialog.open(MeerwerkViewDialogComponent, {
      height: '98vh',
      width: '37vw',
    });
  }

  private loadData() {
    this.lastProjects = this.formService.lastProjects;
    this.apiService.getMeerwerkById(this._id).subscribe(async (x) => {
      this.currentProject = x as Meerwerk;

      if (this.currentProject._id == null) {
        this.currentProject._id = this.currentProject.id;
      }
      const indexer = this.lastProjects.findIndex((x) => x._id === this._id);
      this.index = indexer;
      this.group = this.currentProject.group_id;
      this.totalProjectCount = this.lastProjects?.length;
      if (this.currentProject.startDate != null) {
        this.currentProject.startDate = new Date(this.currentProject.startDate);
      } else {
        this.currentProject.startDate = null;
      }
      if(this.currentProject.created != null) this.currentProject.createdDate = new Date(this.currentProject.created);
      if(this.currentProject.updated != null)this.currentProject.updated = new Date(this.currentProject.updated);
      if(this.currentProject.lastWorkerDate != null)this.currentProject.lastWorkerDate = new Date(this.currentProject.lastWorkerDate);
      this.formService.deleteMeerwerk = this.currentProject;
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
      while(this.apiService.thisCompany == null){
        await this.delay(50)
      }
      this.company = this.apiService.thisCompany;
      this.isLoaded = true;
    });
  }
  async generatePDF() {
    let title = '';
    if(this.currentProject.street != null && this.currentProject.street !== '' && (this.currentProject.huisNr == null || this.currentProject.huisNr === '')){
      title = this.currentProject.street + "-onvoorzien werk";
    } else if((this.currentProject.street == null || this.currentProject.street === '') && this.currentProject.huisNr != null && this.currentProject.huisNr !== ''){
      title = this.currentProject.huisNr + "-onvoorzien werk";
    } else if((this.currentProject.street == null || this.currentProject.street === '') &&  (this.currentProject.huisNr == null || this.currentProject.huisNr === '')){
      title = "onvoorzien werk";
    } else {
      title = this.currentProject.street + '-' + this.currentProject.huisNr + "-onvoorzien werk";
    }
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog3, {
      width: '550px',
      data: title,
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      title = result;
      if (this.variablesService.cancelDownload === false) {
        this.toastrService.success('DE PDF IS AAN HET DOWNLOADEN.');
        this.toggleDisplay();
        const options = {
          filename: title + '.pdf',
          image: { type: 'png' },
          html2canvas: { useCORS: true },
          jsPDF: { orientation: 'portrait', format: 'a4'},
          margin: [2, 2, 2, 2],
          pagebreak: { before: '.page-break' },
        };

        let element = document.getElementById('printContainer');

        await html2pdf().from(element).set(options).save();
        this.isLoaded = false;
        await this.delay(10);
        this.isLoaded = true;
        this.toggleDisplay();
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
