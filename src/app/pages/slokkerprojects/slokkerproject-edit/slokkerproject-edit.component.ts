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
  public imagePath;
  public currentUser: User;
  newDate: Date;
  uploadForm: UntypedFormGroup;
  imageChangedEvent: any = '';
  selectedPhoto = false;
  chosenImageList: any[] = [];
  usersWhoEdited: string = '';
  chosenImageListIndex: number [] = [];
  group: Group;

  public company: Company;
  public companyId;
  projectEditedByGronwderker: boolean;
  heeftPloegen: boolean;
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
          this.router.navigate(['/pages/projectedit', project._id]);
        } else {
          this.router.navigate(['/pages/slokkerprojectedit', project._id]);
        }
      } else {
        this.router.navigate(['/pages/meerwerkedit', project._id]);
      }
    }
  }

  onNextClick() {
    const index = this.lastProjects.findIndex(x => x._id === this._id);
    if (this.lastProjects.length > index + 1) {
      const project = this.lastProjects[index + 1];
      if(!project.isMeerwerk){
        if(project.isSlokker == null || project.isSlokker === false){
          this.router.navigate(['/pages/projectedit', project._id]);
        } else {
          this.router.navigate(['/pages/slokkerprojectedit', project._id]);
        }
      } else {
        this.router.navigate(['/pages/meerwerkedit', project._id]);
      }
      }
    }


  private loadData() {
    this.lastProjects = this.formService.lastProjects;
    this.projectEditedByGronwderker = false;
    this.apiService.getSlokkerProjectById(this._id).subscribe(async(x) => {
      this.currentProject = x as SlokkerProjects;
      while(this.apiService.thisCompany == null){
        await this.delay(50)
      }
      if(this.currentProject.startDate != null){
        this.currentProject.startDate = new Date(this.currentProject.startDate);
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
        let timeBetweenLastEdit = Math.floor((new Date().getTime() - new Date(this.currentProject.lastWorkerDate).getTime()) / (1000 * 60 * 60 ));
        if(timeBetweenLastEdit < 8){
          this.formService.workerHours = timeBetweenLastEdit;
          this.formService.workerName = this.currentProject.lastWorker.name;
          this.projectEditedByGronwderker = true;
        }
      }
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
          startDate: this.currentProject.startDate
        });

      this.uploadForm = this.formBuilder.group({
        file: ['']
      });
      if(this.currentProject.photos != null && this.currentProject.photos.length !== 6){
        this.currentProject.photos[this.currentProject.photos.length] = null;
      }
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
      this.isLoaded = true;
    });
  }
  clearDate() {
    this.slokkerForm.controls['startDate'].setValue(null);
  }
  goToPrevious() {
    this.formService.previousIndex = this.index;
    this.router.navigate(['/pages/groupview', this.group._id]);
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
    if(this.chosenImageList == null || this.chosenImageList.length === 0){
      this.slokkerProjectSend.photos = this.photos;
      this.apiService.getSlokkerProjectById(this._id).subscribe(async (x) => {
        const tempProject = x as SlokkerProjects;
        if (tempProject.lastWorkerDate != null) {
          let timeBetweenLastEdit = Math.floor((new Date().getTime() - new Date(tempProject.lastWorkerDate).getTime()) / (1000 * 60 * 60));
          if (timeBetweenLastEdit < 8) {
            this.formService.workerHours = timeBetweenLastEdit;
            this.formService.workerName = tempProject.lastWorker.name;
            this.formService.currentSlokkerProject =  this.slokkerProjectSend ;
            let dialogRef = this.dialog.open(SlokkerprojectLastworkerDialogConfirmComponent, {
              height: '220px',
              width: '37vw',
            });
            dialogRef.afterClosed().subscribe(() => {
              if (this.formService.isUpdated) {
                this.chosenImageList = [];
                this.chosenImageListIndex = [];
                if(this.newDate != null){
                  this.currentProject.startDate = realSlokkerProject.startDate;
                }
                this.newDate = null;
              }
            });
          } else {
            await this.apiService.updateSlokkerProject(this.slokkerProjectSend).subscribe(async () => {
              this.toastrService.success(slokkerProject.street + ' slokker is opgeslagen', 'Succes!');
              this.chosenImageList = [];
              this.chosenImageListIndex = [];
              if(this.newDate != null){
                this.currentProject.startDate = realSlokkerProject.startDate;
              }
              this.newDate = null;
            });
          }
        } else {
          await this.apiService.updateSlokkerProject(this.slokkerProjectSend).subscribe(async () => {
            this.toastrService.success(slokkerProject.street + ' slokker is opgeslagen', 'Succes!');
            this.chosenImageList = [];
            this.chosenImageListIndex = [];
            if(this.newDate != null){
              this.currentProject.startDate = realSlokkerProject.startDate;
            }
            this.newDate = null;
          });
        }
      });
    } else {
      this.uploadImages();
    }
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
      this.chosenImageList.push(reader.result);
      this.chosenImageListIndex.push(i);
      if(this.currentProject.photos != null && i > 2 && this.currentProject.photos.length < 6){
        this.currentProject.photos[this.currentProject.photos.length] = null;
      }
    }
  }
  delay(timeInMillis: number): Promise<void> {
    return new Promise((resolve) => setTimeout(() => resolve(), timeInMillis));
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

  }
  async uploadImages() {
    const fileToUpload = this.uploadForm.get('file').value;

    // this.toastrService.show('Foto is aan het uploaden.', 'Even geduld!');
    let counter = 0;

    for(let i=0 ; i<this.chosenImageList.length; i++){
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
                counter++;
                let index = this.chosenImageListIndex[i];
                this.photos[index] = url;
                if(counter === this.chosenImageList.length){
                  this.slokkerProjectSend.photos = this.photos;
                  this.apiService.getSlokkerProjectById(this._id).subscribe(async (x) => {
                    const tempProject = x as SlokkerProjects;
                    if (tempProject.lastWorkerDate != null) {
                      let timeBetweenLastEdit = Math.floor((new Date().getTime() - new Date(tempProject.lastWorkerDate).getTime()) / (1000 * 60 * 60));
                      if (timeBetweenLastEdit < 8) {
                        this.formService.workerHours = timeBetweenLastEdit;
                        this.formService.workerName = tempProject.lastWorker.name;
                        this.formService.currentSlokkerProject =  this.slokkerProjectSend ;
                        let dialogRef = this.dialog.open(SlokkerprojectLastworkerDialogConfirmComponent, {
                          height: '220px',
                          width: '37vw',
                        });
                        dialogRef.afterClosed().subscribe(() => {
                          if (this.formService.isUpdated) {
                            this.newDate = null;
                            this.chosenImageList = [];
                            this.chosenImageListIndex = [];
                          }
                        });
                      } else {
                        await this.apiService.updateSlokkerProject(this.slokkerProjectSend).subscribe(async () => {
                          this.toastrService.success(this.slokkerProjectSend.street + ' slokker is opgeslagen', 'Succes!');
                          this.chosenImageList = [];
                          this.chosenImageListIndex = [];
                          this.currentProject = null;
                          this.isLoaded = false;
                          await this.delay(1000);
                          this.loadData();
                        });
                      }
                    } else {
                      await this.apiService.updateSlokkerProject(this.slokkerProjectSend).subscribe(async () => {
                        this.toastrService.success(this.slokkerProjectSend.street + ' slokker is opgeslagen', 'Succes!');
                        this.chosenImageList = [];
                        this.chosenImageListIndex = [];
                        this.currentProject = null;
                        this.isLoaded = false;
                        await this.delay(1000);
                        this.loadData();
                      });
                    }
                  });
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
    this.router.navigate(['/pages/slokkerprojectview', this._id]);
  }
  imagePopUp(photo: string) {
    this.formService._chosenPhoto = photo;
    let dialogRef = this.dialog.open(ProjectViewDialogComponent, {
      height: '98vh',
      width: '37vw',
    });
  }
  setDate(event) {
    if(event !== ''){
      this.newDate = new Date(event);
    } else if(event === ''){
      this.newDate = null;
    }
  }
}
