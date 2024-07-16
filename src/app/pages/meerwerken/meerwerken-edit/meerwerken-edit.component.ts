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
import { Schademelding } from '../../../../models/schademelding';
import { MeerwerkViewDeleteDialogComponent } from '../meerwerken-view/meerwerk-view-delete-dialog/meerwerk-view-delete-dialog.component';
import { DialogOverviewExampleDialog3 } from '../meerwerken-view/meerwerken-view.component';
import { VariablesService } from '../../../../services/variables.service';



@Component({
  selector: 'ngx-meerwerken-edit',
  templateUrl: './meerwerken-edit.component.html',
  styleUrls: [
    './meerwerken-edit.component.scss',
    '../../styles/project-view.scss',
  ],
})
export class MeerwerkenEditComponent implements OnInit , OnDestroy{
  days: string[] = ['Zondag','Maandag','Dinsdag','Woensdag','Donderdag','Vrijdag','Zaterdag'];

  public currentProject: Meerwerk;
  public hasPreviousPage: boolean = false;
  public index: number;
  public meerwerkForm: UntypedFormGroup;
  public totalProjectCount: number;
  public isLoaded: boolean = false;
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
  isSaving: boolean = false;
  public company: Company;
  public companyId;
  projectEditedByGronwderker: boolean;
  heeftPloegen: boolean;
  hasChangedValue: boolean = false;
  owAndSchademeldingList: Schademelding[];
  constructor(
    private formBuilder: UntypedFormBuilder,
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    private formService: FormService,
    private toastrService: NbToastrService,
    private storage: AngularFireStorage,
    private dialog: MatDialog,
    private variablesService: VariablesService
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
    let nextObject = this.owAndSchademeldingList[this.index - 1];
    let route;
    if(nextObject.isMeerwerk){
      route = '/pages/meerwerkedit/' + nextObject._id
    } else {
      route = '/pages/schademeldingedit/' +  nextObject.group_id  + '/' + nextObject._id
    }
    this.checkChangedValueAndNavigate(route);
  }

  onNextClick() {
    let nextObject = this.owAndSchademeldingList[this.index + 1];
    let route;
    if(nextObject.isMeerwerk){
      route = '/pages/meerwerkedit/' + nextObject._id
    } else {
      route = '/pages/schademeldingedit/' + nextObject.group_id + '/' + nextObject._id
    }
    this.checkChangedValueAndNavigate(route);
    }


  private loadData() {
    this.hasChangedValue = false;
    this.isSaving = false;
    this.owAndSchademeldingList = this.formService.owAndSchademeldingList;

    this.projectEditedByGronwderker = false;
    this.apiService.getMeerwerkById(this._id).subscribe(async (x) => {
      this.currentProject = x as Meerwerk;
      if(this.currentProject._id == null){
        this.currentProject._id = this.currentProject.id;
      }
      this.group = this.currentProject.group_id;
      this.formService.deleteMeerwerk = this.currentProject;
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
          activiteit: this.currentProject.activiteit,
          minutesWorked: this.currentProject.minutesWorked != null ? this.currentProject.minutesWorked.toString() : '',
          opmerking: this.currentProject.opmerking,
          countEmployees: this.currentProject.countEmployees != null ? this.currentProject.countEmployees.toString() : '1',
          startDate: this.currentProject.startDate != null ? moment(this.currentProject.startDate) : ''
        });

      this.uploadForm = this.formBuilder.group({
        file: ['']
      });
      this.photos = this.currentProject.photos;


      const indexer = this.owAndSchademeldingList?.findIndex(x => x._id === this._id);
      this.index = indexer;

      while(this.apiService.thisCompany == null){
        await this.delay(50)
      }
      this.company = this.apiService.thisCompany;
      this.companyId = this.company._id;
      this.formService.isViewingOwAndSchademeldingList = true;

      this.isLoaded = true;
      this.meerwerkForm.valueChanges.subscribe(x => {
        this.hasChangedValue = true;
      });

      if(!this.currentProject.hasBeenViewed){
        this.apiService.updateMeerwerkHasBeenViewed(this._id).subscribe(x => {
          this.currentProject.hasBeenViewed = true;
        });
      }
    });
  }


  dateToDateString(date: Date){
    return this.days[date.getDay()].substring(0,3) + ' ' +('0' + date.getDate()).slice(-2) + '/' + ('0' + (date.getMonth() + 1)).slice(-2) + '/' + ('0' + date.getFullYear()).slice(-2);
  }
  async onSubmitForm() {
    if(this.isSaving)return;
    this.isSaving = true;
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
                this.isSaving = false;
                this.chosenImageListIndex = [];
              } else {
                this.isSaving = false;
              }
            });
          } else {
            await this.apiService.updateMeerwerk(this.meerwerkSend).subscribe(async () => {
              this.toastrService.success(this.meerwerkSend.street + ' onvoorzien werk is opgeslagen', 'Succes!');
              this.chosenImageList = [];
              this.chosenImageListIndex = [];
              this.isSaving = false;
              this.hasChangedValue = false;
            });
          }
        } else {
          await this.apiService.updateMeerwerk(this.meerwerkSend).subscribe(async () => {
            this.toastrService.success(this.meerwerkSend.street + ' onvoorzien werk is opgeslagen', 'Succes!');
            this.chosenImageList = [];
            this.chosenImageListIndex = [];
            this.isSaving = false;
            this.hasChangedValue = false;
          });
        }
      });
    } else {
      this.uploadImages();
    }
  }

  async generatePDF() {
    let title = '';
    title = (this.currentProject.activiteit ? this.currentProject.activiteit + '-' : '') + this.currentProject.street + (this.currentProject.huisNr ? '-' + this.currentProject.huisNr : '') + "-onvoorzien werk";
    title = title.replace('/', '-');
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog3, {
      width: '7000px',
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

  generateRandomName(): string {
    const timestamp = Date.now();
    const random = Math.floor(100000000 + Math.random() * 900000000);
    const name = `fotos/${this.companyId}/${timestamp}-${random}`;
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
  ngOnDestroy(){
    this.formService.previousIndexScroll = this.index;
    this.formService.previousPageForScrollIndex = 'schademelding';
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
                            this.isSaving = false;
                            this.hasChangedValue = false;
                            this.chosenImageList = [];
                            this.chosenImageListIndex = [];
                          } else {
                            this.isSaving = false;
                          }
                        });
                      } else {
                        await this.apiService.updateMeerwerk(this.meerwerkSend).subscribe(async () => {
                          this.toastrService.success(this.meerwerkSend.street + ' onvoorzien werk is opgeslagen', 'Succes!');
                          this.chosenImageList = [];
                          this.chosenImageListIndex = [];
                          this.currentProject = null;
                          this.isSaving = false;
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
                        this.isSaving = false;
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
    this.checkChangedValueAndNavigate('/pages/meerwerkview/' + this._id);
  }
  setDate(event) {
    if(event !== ''){
      this.newDate = new Date(event);
    } else if(event === ''){
      this.newDate = null;
    }
  }

  goToPrevious() {
    this.formService.previousIndexScroll = this.index;
    this.formService.previousPageForScrollIndex = 'schademelding';
    this.checkChangedValueAndNavigate('/pages/groupview/' + this.currentProject.group_id._id);
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
}
interface Data {
  pdf: any;  // use a more specific type if possible
  // add other properties if needed
}
