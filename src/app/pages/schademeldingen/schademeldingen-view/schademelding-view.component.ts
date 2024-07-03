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
import { SchademeldingViewDialogComponent } from './schademelding-view-dialog/schademelding-view-dialog.component';
import * as html2pdf from 'html2pdf.js';
import { SchademeldingViewDeleteDialogComponent } from './schademelding-view-delete-dialog/schademelding-view-delete-dialog.component';
import { Company } from 'models/company';
import { Group } from 'models/groups';
import { NbToastrService } from '@nebular/theme';
import { VariablesService } from 'services/variables.service';
import { GoogleMapsLocatiePopupComponent } from '../../googleMapsLocatiePopup/googleMapsLocatiePopup.component';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Schademelding } from '../../../../models/schademelding';
import { tap } from 'rxjs/operators';
import { catchError, forkJoin, mapTo, of } from 'rxjs';

@Component({
  selector: 'ngx-schademeldingen-view',
  templateUrl: './schademelding-view.component.html',
  styleUrls: [
    './schademelding-view.component.scss',
    '../../styles/project-view.scss'
  ],
})
export class SchademeldingViewComponent implements OnInit, OnDestroy {
  days: string[] = ['Zondag','Maandag','Dinsdag','Woensdag','Donderdag','Vrijdag','Zaterdag'];

  public schademelding: Schademelding;
  public company: Company;
  public hasPreviousPage: boolean = false;
  public index: number;
  public totalProjectCount: number;
  public isLoaded: boolean = false;
  public latitude: number;
  public longitude: number;
  public _id: string;
  group_id: string;
  data: any;
  owAndSchademeldingList: Schademelding[];
  public group: Group;
  loadedCount = 0;
  printSchademelding: Schademelding;
  isPrint: boolean;

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
      this.isPrint = false;
      this.schademelding = null;
      this._id = this.route.snapshot.paramMap.get('id');
      this.group_id = this.route.snapshot.paramMap.get('groupid');
      this.group = this.formService.currentGroup;
      this.owAndSchademeldingList = this.formService.owAndSchademeldingList;
      const schademelding$ = this.schademelding == null ?  this.apiService.getPopulatedSchademelding(this._id).pipe(
        tap(x => {
          this.schademelding = x as Schademelding;
          if (this.schademelding._id == null) {
            this.schademelding._id = this.schademelding.id;
          }
          this.formService.schademelding = this.schademelding;
        }),
        catchError(error => {
          console.error('Failed to load or create schademelding', error);
          return of(0); // Return 0 or handle as needed
        }),
        mapTo(1)
      ): of(1);

      const group$ = this.group == null ? this.apiService.getGroupByIdLighterVersion(this.group_id).pipe(
        tap(x => {
          this.group = x as Group;
          this.formService.currentGroup = this.group;
        }),
        mapTo(1)
      ) : of(1);

      forkJoin([schademelding$,  group$])
        .pipe(tap(([count1, count2]) => this.loadedCount = count1 + count2 ))
        .subscribe(() => {
          this.loadData();
        });
    });
  }

  async ngOnInit(): Promise<void> {}

  Date(created: string) {
    return new Date(created).toLocaleDateString();
  }


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
    let dialogRef = this.dialog.open(SchademeldingViewDialogComponent, {
      height: '98vh',
      width: '37vw',
    });
  }

  private async loadData() {
      while(this.loadedCount !== 2){
        await this.delay(50);
      }
      const indexer = this.owAndSchademeldingList?.findIndex((x) => x._id === this._id);
      this.index = indexer;
      this.group = this.schademelding.group_id;

      if (this.schademelding.date != null) {
        this.schademelding.date = new Date(this.schademelding.date);
      } else {
        this.schademelding.date = null;
      }
      if(this.schademelding.created != null) {
        this.schademelding.created = new Date(this.schademelding.created);
        this.schademelding.createdDate = new Date(this.schademelding.created);
      }

      this.formService.deleteSchademelding = this.schademelding;

      while(this.apiService.thisCompany == null){
        await this.delay(50)
      }
      this.company = this.apiService.thisCompany;
      this.formService.isViewingOwAndSchademeldingList = true;

      this.isLoaded = true;

      if(!this.schademelding.hasBeenViewed){
        this.apiService.updateSchademeldingHasBeenViewed(this._id).subscribe(x => {
          this.schademelding.hasBeenViewed = true;
        });
      }
  }
  async generatePDF() {
    this.printSchademelding =  this.schademelding;
    if(this.printSchademelding._id == null){
      this.printSchademelding._id = this.schademelding.id;
    }
    if(this.printSchademelding.created != null) this.printSchademelding.created = new Date(this.printSchademelding.created);
    if(this.printSchademelding.date != null) this.printSchademelding.date = new Date(this.printSchademelding.date);

    await this.delay(100);

    this.isPrint = true;
    await this.delay(100);

    this.toggleDisplay();
    await this.delay(50);
    let options;
    let fileName
    fileName = 'Schademelding' + (this.printSchademelding.tegenPartij ? '-' + this.printSchademelding.tegenPartij : '') +  (this.printSchademelding.group_id.rbProjectNaam != null ? '-' + this.printSchademelding.group_id.rbProjectNaam : '') + '.pdf';
    options = {
      filename:
      fileName,
      image: {type: 'png'},
      html2canvas: {useCORS: true},
      jsPDF: {orientation: 'portrait', format: 'a4', compressPdf: true},
      margin: [3, 0.5, 0.5, 0.5],
      pagebreak: { mode: 'avoid-all', avoid:  '.pageBreak'}
    };

    let element = document.getElementById('printContainer');

    await html2pdf().from(element).set(options).save();
    this.toggleDisplay();
    this.toastrService.success( 'Het schaderapport is gedownload.', 'Succes!');
    this.isPrint = false;
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
    if (this.schademelding._id == null) {
      this.schademelding._id = this.schademelding.id;
    }
    this.router.navigate([
      '/pages/schademeldingedit/' + this.group._id + '/' +
      this.schademelding._id,
    ]);
  }
  onDeleteClick() {
    this.formService.previousPage = ['/pages/groupview/' + this.group_id];
    const dialogRef = this.dialog.open(SchademeldingViewDeleteDialogComponent, {
      width:'450px',
      panelClass: 'mat-dialog-padding'
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
        this.schademelding.group_id.aannemerProjectNr +
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
  selector: 'dialog-overview-example-dialog5',
  templateUrl: 'name-pdf-dialog-schademelding.html',
})
export class DialogOverviewExampleDialog5 {
  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog5>,
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
