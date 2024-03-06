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



@Component({
  selector: 'ngx-meerwerken-edit',
  templateUrl: './meerwerken-edit.component.html',
  styleUrls: [
    './meerwerken-edit.component.scss',
    '../../styles/project-view.scss',
  ],
})
export class MeerwerkenEditComponent implements OnInit {
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
    this.apiService.getMeerwerkById(this._id).subscribe(async (x) => {
      this.currentProject = x as Meerwerk;
      this.newDate = null;

      this.group = this.currentProject.group_id;

      if(this.currentProject.lastWorkerDate != null){
        let timeBetweenLastEdit = Math.floor((new Date().getTime() - new Date(this.currentProject.lastWorkerDate).getTime()) / (1000 * 60 * 60 ));
        if(timeBetweenLastEdit < 8){
          this.formService.workerHours = timeBetweenLastEdit;
          this.formService.workerName = this.currentProject.lastWorker.name;
          this.projectEditedByGronwderker = true;
        }
      }
        this.meerwerkForm = this.formBuilder.group({
          postNumber: this.currentProject.postNumber,
          street: this.currentProject.street,
          huisNr: this.currentProject.huisNr,
          minutesWorked: this.currentProject.minutesWorked != null ? this.currentProject.minutesWorked.toString() : '',
          opmerking: this.currentProject.opmerking,
          countEmployees: this.currentProject.countEmployees != null ? this.currentProject.countEmployees.toString() : '1'
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
    });
  }

  goToPrevious() {
    this.router.navigate(['/pages/groupview', this.group._id]);
  }

  async onSubmitForm() {
    let meerwerk = this.meerwerkForm.value;

    if(this.newDate != null){
      meerwerk.startDate = this.newDate;
    }
    if(this.currentProject._id == null){
      meerwerk._id = this.currentProject.id;
    } else{
      meerwerk._id = this.currentProject._id;
    }
    this.meerwerkSend = meerwerk;
    if(this.chosenImageList == null || this.chosenImageList.length === 0){
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
              this.isLoaded = false;
              await this.delay(1000);
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
            await this.delay(1000);
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
    }
  }
  delay(timeInMillis: number): Promise<void> {
    return new Promise((resolve) => setTimeout(() => resolve(), timeInMillis));
  }

  imagePopUp(photo: string) {
    this.formService._chosenPhoto = photo;
    let dialogRef = this.dialog.open(ProjectViewDialogComponent, {
      height: '98vh',
      width: '37vw',
    });
  }
  deleteFoto(i: number) {
    this.photos[i] = null;
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
                          this.isLoaded = false;
                          await this.delay(1000);
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

  onSubmit(value: any) {

  }
  openMapDialog(xCoord: number, yCoord: number, soort: string): void {
    this.dialog.open(GoogleMapsLocatiePopupComponent, {
      data: { xCoord, yCoord , soort},
    });
  }
  goToView() {
    this.router.navigate(['/pages/meerwerkview', this._id]);
  }
  setDate(event) {
    if(event !== ''){
      this.newDate = new Date(event);
    } else if(event === ''){
      this.newDate = null;
    }
  }
}
