import {Component, OnInit, ElementRef, ViewChild, OnDestroy} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {UntypedFormBuilder, UntypedFormGroup} from '@angular/forms';
import {FormService} from '../../../../services/form.service';
import {ApiService} from '../../../../services/api.service';
import {SlokkerProjects} from '../../../../models/slokker-projects';
import {NbToastrService} from "@nebular/theme";
import {Slokkers} from "../../../../models/slokkers";
import { finalize } from 'rxjs/operators';
import { Company } from 'models/company';
import {Group} from "../../../../models/groups";
import { User } from 'models/user';
import {SlokkerprojectLastworkerDialogConfirmComponent} from "./slokkerproject-lastworker-dialog-confirm/slokkerproject-lastworker-dialog-confirm.component";
import {
  ProjectViewDialogComponent
} from '../../projects/project-view/project-view-dialog/project-view-dialog.component';
import { GoogleMapsLocatiePopupComponent } from '../../googleMapsLocatiePopup/googleMapsLocatiePopup.component';
import {AngularFireStorage} from "@angular/fire/compat/storage";
import { MatDialog } from '@angular/material/dialog';
import moment from 'moment/moment';
import { HasChangedPopupComponent } from '../../has-changed-popup/has-changed-popup.component';
import { CdkDragDrop, CdkDragEnd, CdkDragEnter, CdkDragStart, moveItemInArray } from '@angular/cdk/drag-drop';


@Component({
  selector: 'ngx-products-edit',
  templateUrl: './slokkerproject-edit.component.html',
  styleUrls: [
    './slokkerproject-edit.component.scss',
    '../../styles/project-view.scss',
  ],
})
export class SlokkerprojectEditComponent implements OnInit,OnDestroy {
  public currentProject: SlokkerProjects;
  public hasPreviousPage: boolean = false;
  public index: number;
  public slokkerForm: UntypedFormGroup;
  public totalProjectCount: number;
  public isLoaded: boolean = false;
  public latitude: number;
  public longitude: number;
  public isFirst: boolean = false;
  public isLast: boolean = false;
  public _id: string;
  public slokkerProjectSend: SlokkerProjects;
  private lastProjects: SlokkerProjects[] = [];
  public photos: string[];
  schetsPhotos: string[];
  public imagePath;
  public currentUser: User;
  newDate: Date;
  uploadForm: UntypedFormGroup;
  imageChangedEvent: any = '';
  selectedPhoto = false;
  chosenImageList: any[] = [];
  chosenImageListIndex: number [] = [];
  schetsChosenImageList: any[] = [];
  schetsChosenImageListIndex: number [] = [];
  usersWhoEdited: string = '';
  group: Group;
  days: string[] = ['Zondag','Maandag','Dinsdag','Woensdag','Donderdag','Vrijdag','Zaterdag'];

  public company: Company;
  public companyId;
  projectEditedByGronwderker: boolean;
  heeftPloegen: boolean;
  hasChangedValue: boolean = false;
  constructor(
    private formBuilder: UntypedFormBuilder,
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    private formService: FormService,
    private toastrService: NbToastrService,
    private storage: AngularFireStorage,
    private dialog: MatDialog
  ) {
    route.params.subscribe((val) => {
      this.isLoaded = false;

      if(this.formService.lastProjects.length === 0){
         this.hasPreviousPage = false;
      } else {
        this.hasPreviousPage = true;
      }
      this._id = this.route.snapshot.paramMap.get('id');
      this.loadData();
      });
  }

  async ngOnInit(): Promise<void> {
  }

  Date(created: string) {
    return new Date(created).toLocaleDateString();
  }


  onCloseClick() {
  }

  onPreviousClick() {
    const index = this.lastProjects.findIndex(x => x._id === this._id);
    if (index !== 0) {
      const project = this.lastProjects[index - 1];
      if(!project.isMeerwerk){
        if(project.isSlokker == null || project.isSlokker === false){
          this.checkChangedValue('/pages/projectedit/' + project._id);
        } else {
          this.checkChangedValue('/pages/slokkerprojectedit/' + project._id);
        }
      } else {
        this.checkChangedValue('/pages/meerwerkedit/' + project._id);
      }
    }
  }

  onNextClick() {
    const index = this.lastProjects.findIndex(x => x._id === this._id);
    if (this.lastProjects.length > index + 1) {
      const project = this.lastProjects[index + 1];
      if(!project.isMeerwerk){
        if(project.isSlokker == null || project.isSlokker === false){
          this.checkChangedValue('/pages/projectedit/' +  project._id);
        } else {
          this.checkChangedValue('/pages/slokkerprojectedit/' + project._id);
        }
      } else {
        this.checkChangedValue('/pages/meerwerkedit/' + project._id);
      }
      }
    }


  private loadData() {
    this.lastProjects = this.formService.lastProjects;
    this.projectEditedByGronwderker = false;
    this.hasChangedValue = false;
    this.apiService.getSlokkerProjectById(this._id).subscribe(async(x) => {
      this.currentProject = x as SlokkerProjects;
      while(this.apiService.thisCompany == null){
        await this.delay(50)
      }
      this.company = this.apiService.thisCompany;
      this.companyId = this.company._id;
      this.newDate = null;

      this.group = this.currentProject.group_id;
      if (this.currentProject.latitudeList != null) {
        this.latitude = this.currentProject.latitudeList[
        this.currentProject.latitudeList.length - 1
          ];
      }
      if (this.currentProject.longitudeList != null) {
        this.longitude = this.currentProject.longitudeList[
        this.currentProject.longitudeList.length - 1
          ];
      }

      if(this.currentProject.lastWorkerDate != null){
        this.currentProject.lastWorkerDate = new Date(this.currentProject.lastWorkerDate);
        let timeBetweenLastEdit = Math.floor((new Date().getTime() - this.currentProject.lastWorkerDate.getTime()) / (1000 * 60 * 60 ));
        if(timeBetweenLastEdit < 8){
          this.formService.workerHours = timeBetweenLastEdit;
          this.formService.workerName = this.currentProject.lastWorker.name;
          this.projectEditedByGronwderker = true;
        }
      }
      if(this.currentProject.created != null) this.currentProject.createdDate = new Date(this.currentProject.created);
      if(this.currentProject.updated != null)this.currentProject.updated = new Date(this.currentProject.updated);
      this.heeftPloegen = this.group.heeftPloegen;
        this.slokkerForm = this.formBuilder.group({
          street: this.currentProject.street,
          huisNr: this.currentProject.huisNr,
          opmerking: this.currentProject.opmerking,
          index: this.currentProject.index,
          finished: this.currentProject.finished,
          naamFiche: this.currentProject.naamFiche,
          equipNrRiolering: this.currentProject.equipNrRiolering,
          buis: this.currentProject.slokker.buis,
          buis2: this.currentProject.slokker.buis2,
          bocht: this.group.bochtenInGraden? null : this.currentProject.slokker.bocht,
          bocht2:  this.group.bochtenInGraden? null :this.currentProject.slokker.bocht2,
          gradenBocht45: !this.group.bochtenInGraden? null : this.currentProject.slokker.gradenBocht45,
          gradenBocht90: !this.group.bochtenInGraden? null : this.currentProject.slokker.gradenBocht90,
          gradenBocht45Fase2: !this.group.bochtenInGraden? null : this.currentProject.slokker.gradenBocht45Fase2,
          gradenBocht90Fase2: !this.group.bochtenInGraden? null : this.currentProject.slokker.gradenBocht90Fase2,
          reductie: this.currentProject.slokker.reductie,
          Y: this.currentProject.slokker.Y,
          tussenIPLinks: this.currentProject.slokker.tussenIPLinks,
          tussenIPRechts: this.currentProject.slokker.tussenIPRechts,
          afstandPutMof: this.currentProject.slokker.afstandPutMof,
          diepteAansluitingMv: this.currentProject.slokker.diepteAansluitingMv,
          diepteAanboringRiool: this.currentProject.slokker.diepteAanboringRiool,
          mof: this.currentProject.slokker.mof,
          krimpmof: this.currentProject.slokker.krimpmof,
          koppelstuk: this.currentProject.slokker.koppelstuk,
          stop: this.currentProject.slokker.stop,
          andere: this.currentProject.slokker.andere,
          buisType: 'PVC',
          infiltratieKlok: this.currentProject.slokker.infiltratieKlok,
          aansluitingOpengracht: this.currentProject.slokker.aansluitingOpengracht,
          plaatsAansluiting: this.currentProject.slokker.plaatsAansluiting,
          diameter: this.currentProject.slokker.diameter,
          tBuisStuk: this.currentProject.slokker.tBuisStuk,
          startDate:  this.currentProject.startDate != null ? moment(this.currentProject.startDate) : null,
          afgewerktDatum: this.currentProject.afgewerktDatum != null ? moment(this.currentProject.afgewerktDatum): null,
          xCoord: this.currentProject.slokker.xCoord,
          yCoord: this.currentProject.slokker.yCoord,
          zCoord: this.currentProject.slokker.zCoord,
        });

      this.uploadForm = this.formBuilder.group({
        file: [''],
        fileSchets: ['']
      });
      if(this.currentProject.schetsPhotos == null || this.currentProject.schetsPhotos.length === 0){
        this.currentProject.schetsPhotos = [null, null];
      }

      if(this.currentProject.photos != null && this.currentProject.photos.length !== 6){
        this.currentProject.photos[this.currentProject.photos.length] = null;
      }

      this.schetsPhotos = this.currentProject.schetsPhotos;
      this.photos = this.currentProject.photos;

      this.usersWhoEdited = '';
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

      const indexer = this.lastProjects.findIndex(x => x._id === this._id);
      this.index = indexer;
      this.totalProjectCount = this.lastProjects?.length;
      if (indexer === 0 || indexer === -1) {
        this.isFirst = true;
      } else {
        this.isFirst = false;
      }
      if ( (indexer + 1) === this.formService.lastProjects.length || this.formService.lastProjects.length === 1 || this.formService.lastProjects.length === 0) {
        this.isLast = true;
      } else {
        this.isLast = false;
      }
      this.slokkerForm.valueChanges.subscribe(x => {
        this.hasChangedValue = true;
      });
      this.isLoaded = true;
    });
  }
  clearDate() {
    this.slokkerForm.controls['startDate'].setValue(null);
  }
  goToPrevious() {
    this.formService.previousIndex = this.index;
    this.checkChangedValue('/pages/groupview/' + this.group._id);
  }
  async onSubmitForm() {
    if(this.currentProject._id == null){
      this.currentProject._id = this.currentProject.id;
    }
    if(this.currentProject.slokker._id == null){
      this.currentProject.slokker._id = this.currentProject.slokker.id;
    }
    let slokkerProject = this.slokkerForm.value;

      // slokker initialisatie
      let slokker = new Slokkers();
      slokker.diameter = slokkerProject.diameter;
      slokker.inDrukMof = slokkerProject.inDrukMof;
      slokker.buis2 = slokkerProject.buis2;

      if(!this.group.bochtenInGraden){
        slokker.bocht = slokkerProject.bocht;
        slokker.bocht2 = slokkerProject.bocht2;
      } else {
        slokker.gradenBocht45 = slokkerProject.gradenBocht45;
        slokker.gradenBocht90 = slokkerProject.gradenBocht90;
        slokker.gradenBocht45Fase2 = slokkerProject.gradenBocht45Fase2;
        slokker.gradenBocht90Fase2 = slokkerProject.gradenBocht90Fase2;
      }
      slokker.buis = slokkerProject.buis;
      slokker.reductie = slokkerProject.reductie;
      slokker.Y = slokkerProject.Y;
      slokker.tussenIPLinks = slokkerProject.tussenIPLinks;
      slokker.tussenIPRechts = slokkerProject.tussenIPRechts;
      slokker.afstandPutMof = slokkerProject.afstandPutMof;
      slokker.diepteAansluitingMv = slokkerProject.diepteAansluitingMv;
      slokker.diepteAanboringRiool = slokkerProject.diepteAanboringRiool;
      slokker.mof = slokkerProject.mof;
      slokker.krimpmof = slokkerProject.krimpmof;
      slokker.koppelstuk = slokkerProject.koppelstuk;
      slokker.stop = slokkerProject.stop;
      slokker.andere = slokkerProject.andere;
      slokker.buisType = 'PVC';
      slokker.infiltratieKlok = slokkerProject.infiltratieKlok;
      slokker.aansluitingOpengracht = slokkerProject.aansluitingOpengracht;
      slokker.plaatsAansluiting = slokkerProject.plaatsAansluiting;
      slokker.tBuisStuk = slokkerProject.tBuisStuk;
      slokker.xCoord = slokkerProject.xCoord;
      slokker.yCoord = slokkerProject.yCoord;
      slokker.zCoord = slokkerProject.zCoord;
      slokker._id = this.currentProject.slokker._id;

      //project init
    let realSlokkerProject = new SlokkerProjects();
    realSlokkerProject._id = this.currentProject._id;
    realSlokkerProject.slokker = slokker;
    realSlokkerProject.street = slokkerProject.street;
    realSlokkerProject.huisNr = slokkerProject.huisNr;
    realSlokkerProject.opmerking = slokkerProject.opmerking;
    realSlokkerProject.index = slokkerProject.index;
    realSlokkerProject.finished = slokkerProject.finished;
    realSlokkerProject.naamFiche = slokkerProject.naamFiche;
    realSlokkerProject.equipNrRiolering = slokkerProject.equipNrRiolering;
    realSlokkerProject.naamFiche = 'GEM=' + this.group.gemeenteCode + ' projectnr=' + this.group.rbProjectNr + ' / ' + this.group.aannemerProjectNr +
    ' adres=' + realSlokkerProject.street +  ((realSlokkerProject.index != null && realSlokkerProject.index !== '')?
      '-kolknr'  + realSlokkerProject.index : '') + ' AB-kolk-fiche';
    realSlokkerProject.group_id = this.group;
    realSlokkerProject.startDate = slokkerProject.startDate;
    realSlokkerProject.afgewerktDatum = slokkerProject.afgewerktDatum;
    if(this.newDate != null){
      realSlokkerProject.startDate = this.newDate;
    }
    this.slokkerProjectSend = realSlokkerProject;
    if(this.photos[this.photos.length - 1] == null && this.photos.length > 3){
      this.photos.splice(this.photos.length - 1,1);
    }
    if(this.photos[this.photos.length - 1] == null && this.photos.length > 3){
      this.photos.splice(this.photos.length - 1,1);
    }
    if(this.photos[this.photos.length - 1] == null && this.photos.length > 3){
      this.photos.splice(this.photos.length - 1,1);
    }
    this.chosenImageList = [];
    this.chosenImageListIndex = [];
    if(this.photos.filter(x => x != null && x.substring(0,5) !== 'https') != null && this.photos.filter(x => x != null && x.substring(0,5) !== 'https').length > 0){
      for(let i = 0; i < this.photos.length; i++){
        if(this.photos[i] != null && this.photos[i].substring(0,5) !== 'https'){
          this.chosenImageListIndex.push(i);
          this.chosenImageList.push(this.photos[i]);
        }
      }
    }
    this.schetsChosenImageList = [];
    this.schetsChosenImageListIndex = [];
    if(this.schetsPhotos.filter(x => x != null && x.substring(0,5) !== 'https') != null && this.schetsPhotos.filter(x => x != null && x.substring(0,5) !== 'https').length > 0){
      for(let i = 0; i < this.schetsPhotos.length; i++){
        if(this.schetsPhotos[i] != null && this.schetsPhotos[i].substring(0,5) !== 'https'){
          this.schetsChosenImageListIndex.push(i);
          this.schetsChosenImageList.push(this.schetsPhotos[i]);
        }
      }
    }

    if(this.chosenImageList.length === 0 && this.schetsChosenImageList.length === 0){
      this.slokkerProjectSend.photos = this.photos;
      this.slokkerProjectSend.schetsPhotos = this.schetsPhotos;
      const tempProject = await this.apiService.getLastWorkerDateOfSlokker(this._id) as SlokkerProjects;
      let timeBetweenLastEdit;
      if(tempProject.lastWorkerDate != null){
        timeBetweenLastEdit = Math.floor((new Date().getTime() - new Date(tempProject.lastWorkerDate).getTime()) / (1000 * 60 * 60));
      }
      if (timeBetweenLastEdit != null && timeBetweenLastEdit < 8) {
          this.formService.workerHours = timeBetweenLastEdit;
          this.formService.workerName = tempProject.lastWorker.name;
          this.formService.currentSlokkerProject = this.slokkerProjectSend;
          let dialogRef = this.dialog.open(SlokkerprojectLastworkerDialogConfirmComponent, {
            height: '220px',
            width: '37vw',
          });
          dialogRef.afterClosed().subscribe(() => {
            if (this.formService.isUpdated) {
              this.chosenImageList = [];
              this.schetsChosenImageList = [];
              this.hasChangedValue = false;
              this.chosenImageListIndex = [];
              this.schetsChosenImageListIndex = [];
              if (this.newDate != null) {
                this.currentProject.startDate = realSlokkerProject.startDate;
              }
              this.currentProject.createdDate = new Date(this.currentProject.created);
              if(this.photos.length < 6){
                this.photos.push(null);
              }
              this.newDate = null;
            }
          });
      } else {
        this.saveSlokkerProject();
      }
    } else {
      this.slokkerProjectSend = realSlokkerProject;
      this.uploadImages();
    }
  }

  saveSlokkerProject(){
    this.apiService.updateSlokkerProject(this.slokkerProjectSend).subscribe(async () => {
      this.toastrService.success(this.slokkerProjectSend.street + ' slokker is opgeslagen', 'Succes!');
      if(this.photos.length < 6){
        this.photos.push(null);
      }
      this.chosenImageList = [];
      this.schetsChosenImageList = [];
      this.hasChangedValue = false;
      this.chosenImageListIndex = [];
      this.schetsChosenImageListIndex = [];
      if(this.newDate != null){
        this.currentProject.startDate = this.newDate;
      }
      this.hasChangedValue = false;
      this.newDate = null;
    });
  }

  generateRandomName(): string {
    const random = Math.floor(100000000 + Math.random() * 900000);
    const name = 'fotos/' + this.companyId + '/' + random;
    return name;
  }

  onFileSelect(event, i: number) {
    var file;
    this.selectedPhoto = true;
    this.imageChangedEvent = event;
    if (event.target.files.length > 0) {
      file = event.target.files[0];
      this.uploadForm.get('file').setValue(file);
    }
    var reader = new FileReader();
    this.imagePath = file;
    reader.readAsDataURL(file);
    reader.onload = (_event) => {
      this.hasChangedValue = true;
      this.photos[i] = reader.result as string;
      if(this.photos != null && i > 2 && this.photos.length < 6){
        this.photos.push(null);
      }
    }
  }
  delay(timeInMillis: number): Promise<void> {
    return new Promise((resolve) => setTimeout(() => resolve(), timeInMillis));
  }

  getCorrespondingTemporaryImage(i: number) {
    let index = this.chosenImageListIndex.indexOf(i);
    if(index !== -1){
      return this.chosenImageList[index];
    } else {
      return false;
    }
  }
  getCorrespondingTemporaryImageSchets(i: number) {
    let index = this.schetsChosenImageListIndex.indexOf(i);
    if(index !== -1){
      return this.schetsChosenImageList[index];
    } else {
      return false;
    }
  }
  entered(event: CdkDragEnter<number>): void {
    const previousIndex = event.item.data; // Index of the dragged item
    const currentIndex = event.container.data; // Index of the current container

    this.swapItems(previousIndex, currentIndex);
  }

  swapItems(prevIndex: number, currIndex: number): void {
    if (prevIndex !== currIndex) {
      // Temporarily store the item at the current index
      let temp = this.photos[currIndex];
      // Swap the items
      this.photos[currIndex] = this.photos[prevIndex];
      this.photos[prevIndex] = temp;
    }
  }
  checkIfIsTemporaryImage(i: number) {
    if(this.photos[i] == null){
      return;
    }
    if(this.photos[i].substring(0,5) !== 'https'){
      return true;
    } else {
      return false;
    }
  }
  checkIfIsTemporaryImageSchets(i: number) {
    if(this.schetsPhotos[i] == null){
      return;
    }
    if(this.schetsPhotos[i].substring(0,5) !== 'https'){
      return true;
    } else {
      return false;
    }
  }
  onFileSelectSchets(event, i: number) {
    var file;
    this.selectedPhoto = true;
    this.imageChangedEvent = event;
    if (event.target.files.length > 0) {
      file = event.target.files[0];
      this.uploadForm.get('fileSchets').setValue(file);
    }
    var reader = new FileReader();
    this.imagePath = file;
    reader.readAsDataURL(file);
    reader.onload = (_event) => {
      this.hasChangedValue = true;
      this.schetsPhotos[i] = reader.result as string;
      if(this.schetsPhotos != null && this.schetsPhotos.length < 2){
        this.schetsPhotos.push(null);
      }
    }
  }
  dateToDateString(date: Date){
    return this.days[date.getDay()].substring(0,3) + ' ' +('0' + date.getDate()).slice(-2) + '/' + ('0' + (date.getMonth() + 1)).slice(-2) + '/' + ('0' + date.getFullYear()).slice(-2);
  }
  deleteFoto(i: number) {
    this.photos[i] = null;
    let length = this.photos.length;

    for(let i = 0; i < length;i++) {
      if(this.photos[i] == null && i > 2){
        this.photos.splice(i,1);
        length--;
        i--;
      }
    }
    if(this.currentProject.photos != null && this.currentProject.photos.length >= 3 && this.currentProject.photos.length < 6){
      this.currentProject.photos[this.currentProject.photos.length] = null;
    }
    this.hasChangedValue = true;
  }
  deleteFotoSchets(i: number) {
    this.schetsPhotos[i] = null;
    this.schetsChosenImageList.splice(i,1);
    this.schetsChosenImageListIndex.splice(i,1);
    this.hasChangedValue = true;
  }
  async uploadImages() {
    let counter = 0;

    for(let i= 0 ; i < this.chosenImageList.length; i++){
      const fileRef = this.storage.ref(this.generateRandomName());
      const task = fileRef.putString(this.chosenImageList[i], 'data_url');

      task
        .snapshotChanges()
        .pipe(
          finalize(() => {
            fileRef.getDownloadURL().subscribe(async (url) => {
              if (url) {
                if(this.photos == null){
                  this.photos = [];
                }
                let index = this.chosenImageListIndex[i];
                this.photos[index] = url;
                counter++;
                if((this.chosenImageList.length + this.schetsChosenImageList.length) === counter){
                  this.slokkerProjectSend.photos = this.photos;
                  this.slokkerProjectSend.schetsPhotos = this.schetsPhotos;
                  const tempProject = await this.apiService.getLastWorkerDateOfSlokker(this._id) as SlokkerProjects;
                  let timeBetweenLastEdit;
                  if(tempProject.lastWorkerDate != null){
                    timeBetweenLastEdit = Math.floor((new Date().getTime() - new Date(tempProject.lastWorkerDate).getTime()) / (1000 * 60 * 60));
                  }
                  if (timeBetweenLastEdit != null && timeBetweenLastEdit < 8) {
                    this.formService.workerHours = timeBetweenLastEdit;
                    this.formService.workerName = tempProject.lastWorker.name;
                    this.formService.currentSlokkerProject = this.slokkerProjectSend;
                    let dialogRef = this.dialog.open(SlokkerprojectLastworkerDialogConfirmComponent, {
                      height: '220px',
                      width: '37vw',
                    });
                    dialogRef.afterClosed().subscribe(async () => {
                      if (this.formService.isUpdated) {
                        this.loadData();
                      }
                    });
                  } else {
                      this.apiService.updateSlokkerProject(this.slokkerProjectSend).subscribe(async () => {
                        this.toastrService.success(this.slokkerProjectSend.street + ' slokker is opgeslagen', 'Succes!');
                        this.currentProject = null;
                        this.hasChangedValue = false;
                        this.isLoaded = false;
                        await this.delay(100);
                        this.loadData();
                      });
                    }
                }
              }
            });
          })
        )
        .subscribe();
    }

    for(let i= 0 ; i < this.schetsChosenImageList.length; i++){
      const fileRef = this.storage.ref(this.generateRandomName());
      const task = fileRef.putString(this.schetsChosenImageList[i], 'data_url');

      task
        .snapshotChanges()
        .pipe(
          finalize(() => {
            fileRef.getDownloadURL().subscribe(async (url) => {
              if (url) {
                if(this.schetsPhotos == null){
                  this.schetsPhotos = [];
                }
                let index = this.schetsChosenImageListIndex[i];
                this.schetsPhotos[index] = url;
                counter++;
                if((this.chosenImageList.length + this.schetsChosenImageList.length) === counter){
                  this.slokkerProjectSend.photos = this.photos;
                  this.slokkerProjectSend.schetsPhotos = this.schetsPhotos;
                  const tempProject = await this.apiService.getLastWorkerDateOfSlokker(this._id) as SlokkerProjects;
                  let timeBetweenLastEdit;
                  if(tempProject.lastWorkerDate != null){
                    timeBetweenLastEdit = Math.floor((new Date().getTime() - new Date(tempProject.lastWorkerDate).getTime()) / (1000 * 60 * 60));
                  }
                  if (timeBetweenLastEdit != null && timeBetweenLastEdit < 8) {
                    this.formService.workerHours = timeBetweenLastEdit;
                    this.formService.workerName = tempProject.lastWorker.name;
                    this.formService.currentSlokkerProject = this.slokkerProjectSend;
                    let dialogRef = this.dialog.open(SlokkerprojectLastworkerDialogConfirmComponent, {
                      height: '220px',
                      width: '37vw',
                    });
                    dialogRef.afterClosed().subscribe(async () => {
                      if (this.formService.isUpdated) {
                        this.loadData();
                      }
                    });
                  } else {
                    this.apiService.updateSlokkerProject(this.slokkerProjectSend).subscribe(async () => {
                      this.toastrService.success(this.slokkerProjectSend.street + ' slokker is opgeslagen', 'Succes!');
                      this.newDate = null;
                      this.isLoaded = false;
                      this.currentProject = null;
                      await this.delay(100);
                      this.loadData();
                    });
                  }
                }
              }
            });
          })
        )
        .subscribe();
    }
  }
  openMapDialog(xCoord: number, yCoord: number, soort: string): void {
    this.dialog.open(GoogleMapsLocatiePopupComponent, {
      data: { xCoord, yCoord , soort},
    });
  }
  onSubmit(value: any) {

  }
  ngOnDestroy(){
    this.formService.previousIndex = this.index;
  }
  goToView() {
    this.checkChangedValue('/pages/slokkerprojectview/' + this._id);
  }
  changeAfgewerkt($event: boolean) {
    if($event === true){
      this.slokkerForm.controls['afgewerktDatum'].setValue(moment(new Date()));
    } else {
      this.slokkerForm.controls['afgewerktDatum'].setValue(null);
    }
  }

  imagePopUp(photo: string) {
    this.formService._chosenPhoto = photo;
    let dialogRef = this.dialog.open(ProjectViewDialogComponent, {
      height: '94vh',
      width: '50vw',
    });
  }
  checkChangedValue(route: string){
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
  clearAfgewerktDate() {
    this.slokkerForm.controls['afgewerktDatum'].setValue(null);
  }
  enteredSchets(event: CdkDragEnter<number>): void {
    const previousIndex = event.item.data; // Index of the dragged item
    const currentIndex = event.container.data; // Index of the current container

    this.swapItemsSchets(previousIndex, currentIndex);
  }

  swapItemsSchets(prevIndex: number, currIndex: number): void {
    if (prevIndex !== currIndex) {
      // Temporarily store the item at the current index
      let temp = this.schetsPhotos[currIndex];
      // Swap the items
      this.schetsPhotos[currIndex] = this.schetsPhotos[prevIndex];
      this.schetsPhotos[prevIndex] = temp;
    }
  }
}
