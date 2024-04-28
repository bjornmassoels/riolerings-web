import {Component, OnInit, ElementRef, ViewChild, OnDestroy} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {UntypedFormBuilder, UntypedFormGroup} from '@angular/forms';
import {FormService} from '../../../../services/form.service';
import {ApiService} from '../../../../services/api.service';
import {Project} from "../../../../models/project";
import {NbToastrService} from "@nebular/theme";
import { finalize } from 'rxjs/operators';
import { Company } from 'models/company';
import {Group} from "../../../../models/groups";
import { User } from 'models/user';
import {Meerwerk} from "../../../../models/meerwerk";
import {MeerwerkenLastworkerDialogConfirmComponent} from "./meerwerken-lastworker-dialog-confirm/meerwerken-lastworker-dialog-confirm.component";
import {
  ProjectViewDialogComponent
} from '../../projects/project-view/project-view-dialog/project-view-dialog.component';
import { GoogleMapsLocatiePopupComponent } from '../../googleMapsLocatiePopup/googleMapsLocatiePopup.component';
import {AngularFireStorage} from "@angular/fire/compat/storage";
import { MatDialog } from '@angular/material/dialog';
import { HasChangedPopupComponent } from '../../has-changed-popup/has-changed-popup.component';
import moment from 'moment';



@Component({
  selector: 'ngx-meerwerken-edit',
  templateUrl: './meerwerken-edit.component.html',
  styleUrls: [
    './meerwerken-edit.component.scss',
    '../../styles/project-view.scss',
  ],
})
export class MeerwerkenEditComponent implements OnInit {
  days: string[] = ['Zondag','Maandag','Dinsdag','Woensdag','Donderdag','Vrijdag','Zaterdag'];

  public currentProject: Meerwerk;
  public hasPreviousPage: boolean = false;
  public index: number;
  public meerwerkForm: UntypedFormGroup;
  public totalProjectCount: number;
  public isLoaded: boolean = false;
  public isFirst: boolean = false;
  public isLast: boolean = false;
  public _id: string;
  public meerwerkSend: Meerwerk;
  private lastProjects: Project[] = [];
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
  private group: Group;

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
        this.checkChangedValue('/pages/meerwerkedit/' +  project._id);
      }
    }
  }

  onNextClick() {
    const index = this.lastProjects.findIndex(x => x._id === this._id);
    if (this.lastProjects.length > index + 1) {
      const project = this.lastProjects[index + 1];
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


  private loadData() {
    this.hasChangedValue = false;
    this.lastProjects = this.formService.lastProjects;
    this.projectEditedByGronwderker = false;
    this.apiService.getMeerwerkById(this._id).subscribe(async (x) => {
      this.currentProject = x as Meerwerk;

      this.group = this.currentProject.group_id;

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
        this.meerwerkForm = this.formBuilder.group({
          postNumber: this.currentProject.postNumber,
          street: this.currentProject.street,
          huisNr: this.currentProject.huisNr,
          minutesWorked: this.currentProject.minutesWorked != null ? this.currentProject.minutesWorked.toString() : '',
          opmerking: this.currentProject.opmerking,
          countEmployees: this.currentProject.countEmployees != null ? this.currentProject.countEmployees.toString() : '1',
          startDate: this.currentProject.startDate != null ? moment(this.currentProject.startDate) : ''
        });

      this.uploadForm = this.formBuilder.group({
        file: ['']
      });
      this.photos = this.currentProject.photos;


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
      while(this.apiService.thisCompany == null){
        await this.delay(50)
      }
      this.company = this.apiService.thisCompany;
      this.companyId = this.company._id;
      this.isLoaded = true;
      this.meerwerkForm.valueChanges.subscribe(x => {
        this.hasChangedValue = true;
      });
    });
  }

  goToPrevious() {
    this.checkChangedValue('/pages/groupview/' + this.group._id);
  }
  dateToDateString(date: Date){
    return this.days[date.getDay()].substring(0,3) + ' ' +('0' + date.getDate()).slice(-2) + '/' + ('0' + (date.getMonth() + 1)).slice(-2) + '/' + ('0' + date.getFullYear()).slice(-2);
  }
  async onSubmitForm() {
    let meerwerk = this.meerwerkForm.value;

    if(this.currentProject._id == null){
      meerwerk._id = this.currentProject.id;
    } else{
      meerwerk._id = this.currentProject._id;
    }
    this.meerwerkSend = meerwerk;
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
    if(this.chosenImageList.length === 0){
      this.meerwerkSend.photos = this.photos;
      this.apiService.getMeerwerkById(this._id).subscribe(async (x) => {
        const tempProject = x as Meerwerk;
        if (tempProject.lastWorkerDate != null) {
          let timeBetweenLastEdit = Math.floor((new Date().getTime() - new Date(tempProject.lastWorkerDate).getTime()) / (1000 * 60 * 60));
          if (timeBetweenLastEdit < 8) {
            this.formService.workerHours = timeBetweenLastEdit;
            this.formService.workerName = tempProject.lastWorker.name;
            this.formService.currentMeerwerk =  this.meerwerkSend ;
            let dialogRef = this.dialog.open(MeerwerkenLastworkerDialogConfirmComponent, {
              height: '220px',
              width: '37vw',
            });
            dialogRef.afterClosed().subscribe(() => {
              if (this.formService.isUpdated) {
                this.newDate = null;
                this.hasChangedValue = false;
                this.chosenImageList = [];
                this.chosenImageListIndex = [];
              }
            });
          } else {
            await this.apiService.updateMeerwerk(this.meerwerkSend).subscribe(async () => {
              this.toastrService.success(this.meerwerkSend.street + ' onvoorzien werk is opgeslagen', 'Succes!');
              this.chosenImageList = [];
              this.chosenImageListIndex = [];
              this.currentProject = null;
              this.hasChangedValue = false;
              this.isLoaded = false;
              await this.delay(100);
              this.loadData();
            });
          }
        } else {
          await this.apiService.updateMeerwerk(this.meerwerkSend).subscribe(async () => {
            this.toastrService.success(this.meerwerkSend.street + ' onvoorzien werk is opgeslagen', 'Succes!');
            this.chosenImageList = [];
            this.chosenImageListIndex = [];
            this.currentProject = null;
            this.isLoaded = false;
            this.hasChangedValue = false;
            await this.delay(100);
            this.loadData();
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
  getCorrespondingTemporaryImage(i: number) {
    let index = this.chosenImageListIndex.indexOf(i);
    if(index !== -1){
      return this.chosenImageList[index];
    } else {
      return false;
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
      this.photos[i] = reader.result as string;
      this.hasChangedValue = true;
    };
  }
  delay(timeInMillis: number): Promise<void> {
    return new Promise((resolve) => setTimeout(() => resolve(), timeInMillis));
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
  clearDate() {
    this.meerwerkForm.controls['startDate'].setValue(null);
  }
  deleteFoto(i: number) {
    this.photos[i] = null;
    this.hasChangedValue = true;
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
                  this.meerwerkSend.photos = this.photos;
                  this.apiService.getMeerwerkById(this._id).subscribe(async (x) => {
                    const tempProject = x as Meerwerk;
                    if (tempProject.lastWorkerDate != null) {
                      let timeBetweenLastEdit = Math.floor((new Date().getTime() - new Date(tempProject.lastWorkerDate).getTime()) / (1000 * 60 * 60));
                      if (timeBetweenLastEdit < 8) {
                        this.formService.workerHours = timeBetweenLastEdit;
                        this.formService.workerName = tempProject.lastWorker.name;
                        this.formService.currentMeerwerk =  this.meerwerkSend ;
                        let dialogRef = this.dialog.open(MeerwerkenLastworkerDialogConfirmComponent, {
                          height: '220px',
                          width: '37vw',
                        });
                        dialogRef.afterClosed().subscribe(() => {
                          if (this.formService.isUpdated) {
                            this.newDate = null;
                            this.hasChangedValue = false;
                            this.chosenImageList = [];
                            this.chosenImageListIndex = [];
                          }
                        });
                      } else {
                        await this.apiService.updateMeerwerk(this.meerwerkSend).subscribe(async () => {
                          this.toastrService.success(this.meerwerkSend.street + ' onvoorzien werk is opgeslagen', 'Succes!');
                          this.chosenImageList = [];
                          this.chosenImageListIndex = [];
                          this.currentProject = null;
                          this.hasChangedValue = false;
                          this.isLoaded = false;
                          await this.delay(100);
                          this.loadData();
                        });
                      }
                    } else {
                      await this.apiService.updateMeerwerk(this.meerwerkSend).subscribe(async () => {
                        this.toastrService.success(this.meerwerkSend.street + ' onvoorzien werk is opgeslagen', 'Succes!');
                        this.chosenImageList = [];
                        this.chosenImageListIndex = [];
                        this.currentProject = null;
                        this.hasChangedValue = false;
                        this.isLoaded = false;
                        await this.delay(100);
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

  onSubmit(value: any) {

  }
  openMapDialog(xCoord: number, yCoord: number, soort: string): void {
    this.dialog.open(GoogleMapsLocatiePopupComponent, {
      data: { xCoord, yCoord , soort},
    });
  }
  goToView() {
    this.checkChangedValue('/pages/meerwerkview/' + this._id);
  }
  setDate(event) {
    if(event !== ''){
      this.newDate = new Date(event);
    } else if(event === ''){
      this.newDate = null;
    }
  }
}
