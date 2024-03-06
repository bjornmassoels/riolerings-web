import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, FormArray } from '@angular/forms';
import { NbToastrService } from '@nebular/theme';
import {Router} from "@angular/router";
import {ApiService} from "../../../services/api.service";
import {FormService} from "../../../services/form.service";
import {finalize} from "rxjs/operators";
import {Company} from "../../../models/company";
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Component({
  selector: 'ngx-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['../styles/add-form.scss', './settings.component.scss']
})
export class SettingsComponent implements OnInit {
  addForm: UntypedFormGroup;
  public isLoaded: boolean = false;
  public photo: string;
  public imagePath;
  uploadForm: UntypedFormGroup;
  imageChangedEvent: any = '';
  selectedPhoto = false;
  chosenImageList: any[] = [];
  companyId: string;

  company: Company;
  constructor(
    private formBuilder: UntypedFormBuilder,
    private apiService: ApiService,
    private toastrService: NbToastrService,
    private formService: FormService,
    private router: Router,
    private storage: AngularFireStorage
  ) {

  }
  async ngOnInit() {
      while(this.apiService.thisCompany == null){
        await this.delay(50)
      }
      this.company = this.apiService.thisCompany;
      this.companyId = this.company._id;
      this.isLoaded = true;
      this.uploadForm = this.formBuilder.group({
        file: ['']
      });
      this.photo = this.company.logo;
      this.isLoaded = true;
  }

  onSubmit(groupData) {

  }
  generateRandomName(): string {
    const random = Math.floor(100000000 + Math.random() * 900000);
    const name = 'fotos/' + this.companyId + '/' + random;
    return name;
  }
  delay(timeInMillis: number): Promise<void> {
    return new Promise((resolve) => setTimeout(() => resolve(), timeInMillis));
  }

  onFileSelect(event) {
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
    }
  }

  async uploadImages() {
    const fileToUpload = this.uploadForm.get('file').value;

    // this.toastrService.show('Foto is aan het uploaden.', 'Even geduld!');


    for(let i=0 ; i<this.chosenImageList.length; i++){
      const fileRef = this.storage.ref(this.generateRandomName());
      const task = fileRef.putString(this.chosenImageList[i], 'data_url');

      task
        .snapshotChanges()
        .pipe(
          finalize(() => {
            fileRef.getDownloadURL().subscribe(async (url) => {
              if (url) {
                  this.company.logo = url;
                  await this.apiService.updateCompany(this.company).subscribe();
                  this.chosenImageList = [];
                this.toastrService.success('Uw logo is opgeslagen', 'Succes!');
              }
            });
          })
        )
        .subscribe();
    }
  }
  toastBadForm() {
    this.toastrService.warning('Probeer het opnieuw', 'Oops!');
  }

  goToPrevious() {
    let reverseArray = this.formService.previousPage.reverse();
    this.router.navigate([reverseArray[0]]);
  }
}
