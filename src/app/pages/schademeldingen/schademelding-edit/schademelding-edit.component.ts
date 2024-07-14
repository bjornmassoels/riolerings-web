import {Component, ElementRef, EventEmitter, Inject, NgZone, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {UntypedFormArray, UntypedFormBuilder, UntypedFormGroup} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import {catchError, finalize, forkJoin, mapTo, Observable, of} from "rxjs";
import {AngularFireStorage} from "@angular/fire/compat/storage";
import moment from "moment";
import {map, startWith, tap} from "rxjs/operators";
import { MatDialog, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import * as html2pdf from 'html2pdf.js';
import { Group } from '../../../../models/groups';
import { Schademelding } from '../../../../models/schademelding';
import { Company } from '../../../../models/company';
import { User } from '../../../../models/user';
import { ApiService } from '../../../../services/api.service';
import { FormService } from '../../../../services/form.service';
import { Photo } from '../../../../models/photo';
import { HasChangedPopupComponent } from '../../has-changed-popup/has-changed-popup.component';
import { PhotoPopupDialog } from './photo-popup/photo-popup.component';
import { MatButton } from '@angular/material/button';
import {
  SchademeldingViewDeleteDialogComponent
} from '../schademeldingen-view/schademelding-view-delete-dialog/schademelding-view-delete-dialog.component';
import { DialogOverviewExampleDialog3 } from '../../meerwerken/meerwerken-view/meerwerken-view.component';
import { VariablesService } from '../../../../services/variables.service';

@Component({
  selector: 'ngx-schademelding-edit',
  templateUrl: './schademelding-edit.component.html',
  styleUrls: ['./schademelding-edit.component.scss',
    '../../styles/project-view.scss']
})
export class SchademeldingEditComponent implements OnInit, OnDestroy {
  @ViewChild('addresstext', { static: false }) public addresstext: ElementRef;
  @Output() outputEvent: EventEmitter<string> = new EventEmitter();

  allMinutes: number[] = [];
  allHours: number[] = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23];
  private _id: string;
  public isLoaded: boolean;
  uploadForm;
  tempImages: any[] = [null,null,null,null,null,null];

  schademelding: Schademelding;
  owAndSchademeldingList: Schademelding[];
  index: number;
  isNameInvalid: boolean = false;
  editForm;
  minuten: number[] = [0,15,30,45];
  company: Company;
  hasChangedValue: boolean = false;
  arbeiders: User[];
  isWerfleiderInvalid: boolean = false;
  isSaving: boolean;
  loadedCount: number = 0;
  selectedPhoto: boolean = false;
  chosenImageList: any[] = [];
  chosenImageListIndex: number [] = [];
  imageChangedEvent: any;
  imagePath: any;

  isNewSchademelding: boolean = false;
  group: Group;
  group_id: string;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    private toastrService: NbToastrService,
    private dialog: MatDialog,
    private formService: FormService,
    private storage: AngularFireStorage,
    private variablesService: VariablesService
  ) {
    for (let i = 0; i < 60; i++) {
      this.allMinutes.push(i);
    }
    route.params.subscribe((val) => {
      this.loadData();
    });
  }

  ngOnInit(){}

  loadData() {
    this.loadedCount = 0;
    this._id = this.route.snapshot.paramMap.get('id');
    this.group_id = this.route.snapshot.paramMap.get('groupid');
    this.group = this.formService.currentGroup;
    if(this._id === 'null'){
      this.isNewSchademelding = true;
    } else {
      this.isNewSchademelding = false;
    }
    this.hasChangedValue = false;
    this.chosenImageList = [];
    this.chosenImageListIndex = [];
    this.tempImages = [null,null,null,null,null,null];
    this.isSaving = false;
    this.isLoaded = false;
    this.company = this.apiService.thisCompany;
    this.schademelding = this.formService.schademelding;
    this.owAndSchademeldingList = this.formService.owAndSchademeldingList;
    const schademelding$ = !this.isNewSchademelding ?  this.apiService.getSchademelding(this._id).pipe(
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
        this.buildForm();
      });
  }

  async buildForm(){
    while(this.loadedCount !== 2){
      await this.delay(50);
    }
    if(this.isNewSchademelding){
      this.schademelding = new Schademelding();
      this.schademelding.created = new Date();
      this.schademelding.creator_user = new User();
      this.schademelding.creator_user._id = this.apiService.userId;
      this.schademelding.hasBeenViewed = true;
    } else {
      this.schademelding.created = new Date(this.schademelding.created);
      this.schademelding._id = this._id;
      this.formService.deleteSchademelding = this.schademelding;
    }
    this.index = this.owAndSchademeldingList?.findIndex(x => x._id === this._id);

    let startTijdHerstelling;
    let eindTijdHerstelling;
    if(this.schademelding.startTijdHerstelling != null){
      this.schademelding.startTijdHerstelling = new Date(this.schademelding.startTijdHerstelling);
      startTijdHerstelling = (('0' + this.schademelding.startTijdHerstelling.getHours()).slice(-2) + ':' + ('0' + this.schademelding.startTijdHerstelling.getMinutes()).slice(-2)).toString();
    }
    if(this.schademelding.eindTijdHerstelling != null){
      this.schademelding.eindTijdHerstelling = new Date(this.schademelding.eindTijdHerstelling);
      eindTijdHerstelling = (('0' + this.schademelding.eindTijdHerstelling.getHours()).slice(-2) + ':' + ('0' + this.schademelding.eindTijdHerstelling.getMinutes()).slice(-2)).toString();
    }
    if(this.schademelding.photos == null) this.schademelding.photos = [];
    this.schademelding.photos = this.schademelding.photos.filter(x => x != null);

    this.editForm = this.formBuilder.group({
      date: this.schademelding.date != null ? moment(this.schademelding.date) : null,
      tijdstipUur: this.schademelding.date == null ? 8 : +new Date(this.schademelding.date).getHours(),
      tijdstipMinuten: this.schademelding.date == null ? 0 : +new Date(this.schademelding.date).getMinutes(),
      werf: this.schademelding.group_id?.rbProjectNaam != null? this.schademelding.group_id.rbProjectNaam : '',
      gemeente_en_straat: this.schademelding.gemeente_en_straat,
      huisnr_of_nummer: this.schademelding.huisnr_of_nummer,
      schadeGerichtAan: this.schademelding.schadeGerichtAan,
      schadeGerichtAanAndereString: this.schademelding.schadeGerichtAanAndereString,
      schadeDoorWie: this.schademelding.schadeDoorWie,
      schadeDoorWat: this.schademelding.schadeDoorWat,
      soortActiviteit: this.schademelding.soortActiviteit,
      soortActiviteitAndereString: this.schademelding.soortActiviteitAndereString,
      oorzaakSchade: this.schademelding.oorzaakSchade,
      isBetwistingMogelijk: this.schademelding.isBetwistingMogelijk,
      isLeidingPlanOpWerf: this.schademelding.isLeidingPlanOpWerf,
      isLeidingVolgensPlan: this.schademelding.isLeidingVolgensPlan,
      diepteLeiding: this.schademelding.diepteLeiding,
      leidingBeschermd: this.schademelding.leidingBeschermd,
      leidingBeschermdAndereString: this.schademelding.leidingBeschermdAndereString,
      diepteGraafwerken: this.schademelding.diepteGraafwerken,
      plaatsVanWerken: this.schademelding.plaatsVanWerken,
      plaatsVanWerkenAndereString: this.schademelding.plaatsVanWerkenAndereString,
      omschrijvingSchade: this.schademelding.omschrijvingSchade,
      isMinnelijkeVaststelling: this.schademelding.isMinnelijkeVaststelling,
      isProcesVerbaal: this.schademelding.isProcesVerbaal,
      gemeentePolitie: this.schademelding.gemeentePolitie,
      photos: this.formBuilder.array([]),
      datumHerstelling: this.schademelding.startTijdHerstelling != null ? moment(this.schademelding.startTijdHerstelling) : null,
      herstelStartUur: startTijdHerstelling != null ? +startTijdHerstelling.split(':')[0] : undefined,
      herstelStartMinuten: startTijdHerstelling != null ? +startTijdHerstelling.split(':')[1] : undefined,
      herstelEindUur: eindTijdHerstelling != null ? +eindTijdHerstelling.split(':')[0] : undefined,
      herstelEindMinuten: eindTijdHerstelling != null ? +eindTijdHerstelling.split(':')[1] : undefined,
      aantalPersonenHerstelling: this.schademelding.aantalPersonenHerstelling,
      detailsHerstelling: this.schademelding.detailsHerstelling,
      tegenPartij: this.schademelding.tegenPartij
    });
    this.uploadForm = this.formBuilder.group({
      file: [''],
      photos: new UntypedFormArray([])
    });
    this.editForm.valueChanges.subscribe(x => {
      this.hasChangedValue = true;
    })
    this.schademelding.photos.forEach(x => {
      this.photosGetter().push(this.setPhotoOnLoad(x.beschrijving, x.src));
    });
    this.addPhoto();

    this.isLoaded = true;

    if(!this.isNewSchademelding && !this.schademelding.hasBeenViewed){
      this.apiService.updateSchademeldingHasBeenViewed(this.schademelding._id).subscribe(x => {
        this.schademelding.hasBeenViewed = true;
      });
    }

    while(this.apiService.thisCompany == null){
      await this.delay(50);
    }
    this.company = this.apiService.thisCompany;
    this.formService.isViewingOwAndSchademeldingList = true;
  }

  addPhoto() {
    let photosValue = this.photosGetter().value;
    if(this.photosGetter().length < 6 && (photosValue.length === 0 || (photosValue[photosValue.length - 1] != null && photosValue[photosValue.length - 1].src !== '') || this.tempImages[photosValue.length - 1] != null)){
      this.photosGetter().push(this.newPhoto());
    }
  }
  async onSubmit() {
    this.isNameInvalid = false;
    if(!this.isSaving){
      this.isSaving = true;
      this.isWerfleiderInvalid = false;
      let data = this.editForm.value;
      if(!this.isNewSchademelding){
        data._id = this._id;
      }
      data.created = this.schademelding.created;
      if(data.oorzaakSchade === 'Niet van toepassing'){
        data.oorzaakSchade = null;
      }
      if(data.date != null){
        data.date = new Date(data.date);
        if(data.tijdstipUur != null && data.tijdstipMinuten != null){
          data.date.setHours(data.tijdstipUur);
          data.date.setMinutes(data.tijdstipMinuten);
        } else {
          data.date.setHours(0);
          data.date.setMinutes(0);
        }
      }
      if(data.datumHerstelling != null){
        data.startTijdHerstelling = new Date(data.datumHerstelling);
        if(data.herstelStartUur != null && data.herstelStartMinuten != null){
          data.startTijdHerstelling.setHours(data.herstelStartUur);
          data.startTijdHerstelling.setMinutes(data.herstelStartMinuten);
          if(data.herstelEindUur != null && data.herstelEindMinuten != null){
            data.eindTijdHerstelling = new Date(data.datumHerstelling);
            data.eindTijdHerstelling.setHours(data.herstelEindUur);
            data.eindTijdHerstelling.setMinutes(data.herstelEindMinuten);
          }
        } else {
          data.startTijdHerstelling.setHours(0);
          data.startTijdHerstelling.setMinutes(0);
        }
      } else {
        data.startTijdHerstelling = null;
        data.eindTijdHerstelling = null;
      }
      if(this.schademelding.creator_user){
        data.created = this.schademelding.created;
        data.creator_user = this.schademelding.creator_user;
      }
      if(this.chosenImageList != null && this.chosenImageList.length > 0){
        this.schademelding = data;
        this.schademelding.photos = this.schademelding.photos.filter(x => x != null && x.src != null && x.src !== '');
        this.uploadImages();
      } else {
        data.photos = this.photosGetter().value;
        data.photos = data.photos.filter(x => x != null && x.src != null && x.src !== '');
        this.saveOrCreateSchademelding(data);
      }

    }
  }

  clearDatum() {
    this.editForm.get('date').setValue(null);
  }
  clearDatumHerstelling() {
    this.editForm.get('datumHerstelling').setValue(null);
  }
  ngOnDestroy(){
    this.formService.previousIndexScroll = this.index;
    this.formService.previousPageForScrollIndex = 'schademelding';
  }

  goToPrevious() {
    this.formService.previousIndexScroll = this.index;
    this.formService.previousPageForScrollIndex = 'schademelding';
    this.checkChangedValueAndNavigate('/pages/groupview/' + this.group_id);
  }
  delay(timeInMillis: number): Promise<void> {
    return new Promise((resolve) => setTimeout(() => resolve(), timeInMillis));
  }

  async uploadImages() {

    this.schademelding.photos = this.photosGetter().value;
    let counter = 0;

    for(let i=0 ; i < this.chosenImageList.length; i++){
      const fileRef = this.storage.ref(this.generateRandomName());
      const task = fileRef.putString(this.chosenImageList[i], 'data_url');

      task
        .snapshotChanges()
        .pipe(
          finalize(() => {
            fileRef.getDownloadURL().subscribe(async (url) => {
              if (url) {
                counter++;
                let index = this.chosenImageListIndex[i];
                this.schademelding.photos[index] = new Photo();
                this.schademelding.photos[index].src = url;
                this.schademelding.photos[index].beschrijving = this.photosGetter().at(index).value.beschrijving;

                if(counter === this.chosenImageList.length){
                  this.schademelding.photos = this.schademelding.photos.filter(x => x != null && x.src != null && x.src !== '');
                  this.saveOrCreateSchademelding(this.schademelding);

                }
              }
            });
          })
        )
        .subscribe();
    }
  }
  onDeleteClick() {
    this.formService.previousPage = ['/pages/groupview/' + this.group_id];
    const dialogRef = this.dialog.open(SchademeldingViewDeleteDialogComponent, {
      width:'450px',
      panelClass: 'mat-dialog-padding'
    });
  }

  onNextClick() {
    let nextObject = this.owAndSchademeldingList[this.index + 1];
    let route;
    if(nextObject.isMeerwerk){
      route = '/pages/meerwerkedit/' + nextObject._id
    } else {
      route = '/pages/schademeldingedit/' + this.group_id + '/' + nextObject._id
    }
    this.checkChangedValueAndNavigate(route);
  }

  checkChangedValueAndNavigate(route: string){
    if(this.hasChangedValue){
      this.formService.previousRoute = route;
      const dialogRef = this.dialog.open(HasChangedPopupComponent, {
        width:'450px',
        height:'200px',
        panelClass: 'mat-dialog-padding'
      });
    } else {
      this.router.navigate([route]);
    }
  }
  onPreviousClick() {
    let nextObject = this.owAndSchademeldingList[this.index - 1];
    let route;
    if(nextObject.isMeerwerk){
      route = '/pages/meerwerkedit/' + nextObject._id
    } else {
      route = '/pages/schademeldingedit/' + this.group_id + '/' + nextObject._id
    }
    this.checkChangedValueAndNavigate(route);
  }


  photosGetter(): UntypedFormArray {
    return this.uploadForm.get('photos') as UntypedFormArray;
  }
  newPhoto(): UntypedFormGroup {
    return this.formBuilder.group({
      beschrijving: '',
      src: ''
    });
  }
  updatePhoto(index: number, src: string) {
    // Ensure the index is within the bounds of the array
    if(index >= 0 && index < this.photosGetter().length) {
      // Create a new FormGroup with the updated values
      const beschrijving = this.photosGetter().at(index).value.beschrijving;
      const updatedPhoto = this.setPhotoOnLoad(beschrijving, src);

      // Update the FormGroup at the specified index
      this.photosGetter().at(index).patchValue(updatedPhoto.value);
    }
  }
  setPhotoOnLoad(beschrijving: string, src: string): UntypedFormGroup {

    return this.formBuilder.group({
      beschrijving,
      src
    });
  }
  removePhoto(i: number) {
    this.photosGetter().removeAt(i);
    this.schademelding.photos.splice(i,1);
    this.addPhoto();
  }

  changeBeschrijving() {
    this.hasChangedValue = true;
  }

  onFileSelect(event, i: number) {
    let file;

    this.selectedPhoto = true;
    this.imageChangedEvent = event;
    if (event.target.files.length > 0) {
      file = event.target.files[0];
      this.uploadForm.get('file').setValue(file);
    }
    let reader = new FileReader();
    this.imagePath = file;
    reader.readAsDataURL(file);
    reader.onload = (_event) => {
      this.chosenImageList.push(reader.result);
      this.chosenImageListIndex.push(i);
      this.hasChangedValue = true;
      this.tempImages[i] = reader.result.toString();
      this.addPhoto();
    };
  }
  imagePopUp(photo: string) {
    this.formService._chosenPhoto = photo;
    let dialogRef = this.dialog.open(PhotoPopupDialog, {
      height: '98vh',
      width: '42vw',
      panelClass: 'mat-dialog-padding'
    });
  }
  generateRandomName(): string {
    if(this.company._id == null) this.company._id = this.company.id;
    const random = Math.floor(100000000 + Math.random() * 900000);
    const name = 'fotos/' + this.company._id + '/' + random;
    return name;
  }

  checkIfSchadeGerichtAanIsNutsleidingenOfAndere() {
    if(this.editForm.get('schadeGerichtAan').value && (this.editForm.get('schadeGerichtAan').value === 'Nutsleidingen' || this.editForm.get('schadeGerichtAan').value === 'Andere')){
      return true;
    } else {
      return false;
    }
  }

  async generatePDF() {
    let title = '';
    if (this.schademelding._id == null) {
      this.schademelding._id = this.schademelding.id;
    }
    let fileName = 'Schademelding' + (this.schademelding.tegenPartij ? '-' + this.schademelding.tegenPartij : '') + (this.schademelding.gemeente_en_straat? '-' + this.schademelding.gemeente_en_straat : '') +
      (this.schademelding.huisnr_of_nummer? ' ' + this.schademelding.huisnr_of_nummer : '') +  (this.group.rbProjectNaam ? '-' + this.group.rbProjectNaam : '');
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog3, {
      width: '700px',
      data: fileName,
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      title = result;
      if (this.variablesService.cancelDownload === false) {
        this.toastrService.success('DE PDF IS AAN HET DOWNLOADEN.');
        this.apiService.makeSchademeldingPdf(this.schademelding._id).subscribe((data:  Data) => {
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

  private saveOrCreateSchademelding(data) {
    data.group_id = this.group_id;

    if(this.isNewSchademelding){
      data.creator_user = new User();
      data.creator_user._id = this.apiService.userId;
      this.apiService.createSchademelding(data).subscribe(async x => {
        let newSchademelding = x as Schademelding;
        newSchademelding.date = new Date(newSchademelding.date);
        this.owAndSchademeldingList.unshift(newSchademelding);
        this.owAndSchademeldingList.forEach(x => x.date = new Date(x.date));
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
        this.formService.schademeldingen = this.owAndSchademeldingList;
        this.formService.schademelding = null;
        this.toastrService.success( 'De schademelding is aangemaakt', 'Succes!');
        this.outputEvent.emit('schademelding');
        await this.delay(80);
        await this.router.navigate(['/pages/schademeldingedit/' + this.group_id + '/' + newSchademelding._id]);
      }, error => {
        this.toastrService.danger( 'Er is intern iets misgelopen', 'Mislukt!');
        this.isSaving = false;
      });
    } else {
      this.apiService.updateSchademelding(data).subscribe(x => {
        if(this.owAndSchademeldingList){
          this.owAndSchademeldingList[this.index] = data;
        }
        this.formService.schademeldingen = this.owAndSchademeldingList;
        this.formService.schademelding = data;
        this.hasChangedValue = false;
        this.chosenImageList = [];
        this.chosenImageListIndex = [];
        this.tempImages = [null,null,null,null,null,null];
        this.photosGetter().clear();
        this.schademelding.photos.forEach(x => {
          this.photosGetter().push(this.setPhotoOnLoad(x.beschrijving, x.src));
        });
        this.addPhoto();
        this.toastrService.success( 'De schademelding is aangepast', 'Succes!');
        this.isSaving = false;
      }, error => {
        this.toastrService.danger( 'Er is intern iets misgelopen', 'Mislukt!');
        this.isSaving = false;
      });
    }
  }



  goToView() {
    this.checkChangedValueAndNavigate('/pages/schademeldingview/' + this.group_id + '/' + this._id);
  }
}



interface Data {
  pdf: any;  // use a more specific type if possible
  // add other properties if needed
}
