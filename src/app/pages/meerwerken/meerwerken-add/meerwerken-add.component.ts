import { Component, OnInit, ElementRef , ViewChild} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {UntypedFormBuilder, UntypedFormGroup} from '@angular/forms';
import {FormService} from '../../../../services/form.service';
import {ApiService} from '../../../../services/api.service';
import {NbToastrService} from "@nebular/theme";
import { finalize } from 'rxjs/operators';
import { Company } from 'models/company';
import {Group} from "../../../../models/groups";
import { User } from 'models/user';
import {Meerwerk} from "../../../../models/meerwerk";
import {AngularFireStorage} from "@angular/fire/compat/storage";


@Component({
  selector: 'ngx-meerwerken-add',
  templateUrl: './meerwerken-add.component.html',
  styleUrls: [
    './meerwerken-add.component.scss',
    '../../styles/project-view.scss',
  ],
})
export class MeerwerkenAddComponent implements OnInit {
  public currentMeerwerk: Meerwerk;
  public index: number;
  public meerwerkForm: UntypedFormGroup;
  public totalProjectCount: number;
  public isLoaded: boolean = false;
  public _id: string;
  public meerwerkSend: Meerwerk;
  public photos: string[];
  public imagePath;
  public currentUser: User;
  isSaving: boolean = false;


  uploadForm: UntypedFormGroup;
  imageChangedEvent: any = '';
  selectedPhoto = false;
  chosenImageList: any[] = [];
  chosenImageListIndex: number [] = [];
  private group: Group;

  public company: Company;
  public companyId;
  private newDate: Date;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    private formService: FormService,
    private toastrService: NbToastrService,
    private storage: AngularFireStorage
  ) {
    route.params.subscribe((val) => {
      this.isLoaded = false;
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


  private loadData() {
    this.apiService.getGroupById(this._id).subscribe(async x => {
      this.group = x as Group;
      this.currentMeerwerk = new Meerwerk();
      this.currentMeerwerk.company_id = this.companyId;
      this.photos = [null,null,null,null, null, null];
      this.currentMeerwerk.photos = this.photos;
      this.currentMeerwerk.countEmployees = 1;
      this.meerwerkForm = this.formBuilder.group({
          postNumber: this.currentMeerwerk.postNumber,
          street: this.currentMeerwerk.street,
          huisNr: this.currentMeerwerk.huisNr,
          activiteit: this.currentMeerwerk.activiteit,
          minutesWorked: this.currentMeerwerk.minutesWorked != null ? this.currentMeerwerk.minutesWorked.toString() : '',
          opmerking: this.currentMeerwerk.opmerking,
          countEmployees: this.currentMeerwerk.countEmployees != null ? this.currentMeerwerk.countEmployees.toString() : ''
      });
      this.uploadForm = this.formBuilder.group({
          file: ['']
      });
      while(this.apiService.thisCompany == null){
        await this.delay(50)
      }
      this.company = this.apiService.thisCompany;
      this.companyId = this.company._id;
      this.isLoaded = true;
      });
      // @ts-ignore
  }

  goToPrevious() {
    this.router.navigate(['/pages/groupview/' + this._id]);
  }

  delay(timeInMillis: number): Promise<void> {
    return new Promise((resolve) => setTimeout(() => resolve(), timeInMillis));
  }

  onSubmitForm() {
    if(this.isSaving)return;
    this.isSaving = true;
    if(this.group._id == null){
      this.group._id = this.group.id;
    }
    let meerwerk = this.meerwerkForm.value;
    if(this.newDate != null){
      meerwerk.startDate = this.newDate;
    } else {
      meerwerk.startDate = new Date();
    }
    if(this.currentMeerwerk._id == null){
      meerwerk._id = this.currentMeerwerk.id;
    } else{
      meerwerk._id = this.currentMeerwerk._id;
    }
    meerwerk.group_id = this.group;
    meerwerk.company_id = this.companyId;
    meerwerk.creator_user = this.apiService.userId;
    this.meerwerkSend = meerwerk;
    if(this.chosenImageList == null || this.chosenImageList.length === 0){
      this.apiService.updateMeerwerk(this.meerwerkSend).subscribe(x => {
        this.currentMeerwerk = null;
        this.chosenImageList = [];
        this.chosenImageListIndex = [];
        this.isSaving = false;
        this.isLoaded = false;
        this.toastrService.success(this.meerwerkSend.street + '- Onvoorzien werk + ' + this.meerwerkSend.huisNr + ' is aangemaakt', 'Succes!');
        this.loadData();
      }, error => {
        this.isSaving = false;
        this.toastrService.warning('Er is iets misgegaan, probeer het opnieuw.', 'Oops!');
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
                counter++;
                let index = this.chosenImageListIndex[i];
                this.photos[index] = url;
                if(counter === this.chosenImageList.length){
                  this.meerwerkSend.photos = this.photos;
                  this.apiService.updateMeerwerk(this.meerwerkSend).subscribe( x =>{
                    this.isSaving = false;
                    this.toastrService.success(this.meerwerkSend.street + '- onvoorzien werk + ' + this.meerwerkSend.huisNr + ' is aangemaakt', 'Succes!');
                    this.meerwerkSend = null;
                    this.chosenImageList = [];
                    this.chosenImageListIndex = [];
                    this.isLoaded = false;
                    this.loadData();
                  }, error => {
                    this.isSaving = false;
                    this.toastrService.warning('Er is iets misgegaan, probeer het opnieuw.', 'Oops!');
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

  goToView() {
    this.router.navigate(['/pages/slokkerprojectview', this._id]);
  }

  setDate(event) {
    if(event !== ''){
      this.newDate = new Date(event);
    } else if(event === ''){
      this.newDate = null;
    }
  }
}
