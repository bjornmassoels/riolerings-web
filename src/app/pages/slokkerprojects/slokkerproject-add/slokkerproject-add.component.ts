import { Component, OnInit, ElementRef , ViewChild} from '@angular/core';
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
import {AngularFireStorage} from "@angular/fire/compat/storage";
import { HasChangedPopupComponent } from '../../has-changed-popup/has-changed-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { Waterafvoer } from '../../../../models/waterafvoer';


@Component({
  selector: 'ngx-slokkerproject-add',
  templateUrl: './slokkerproject-add.component.html',
  styleUrls: [
    './slokkerproject-add.component.scss',
    '../../styles/project-view.scss',
  ],
})
export class SlokkerprojectAddComponent implements OnInit {
  public currentProject: SlokkerProjects;
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
  currentStreet: string = '';
  public imagePath;
  public currentUser: User;
  private lastSlokkerIndexFound: string;
  private currentSlokkerIndex: string;


  uploadForm: UntypedFormGroup;
  imageChangedEvent: any = '';
  selectedPhoto = false;
  chosenImageList: any[] = [];
  chosenImageListIndex: number [] = [];
  private group: Group;

  public company: Company;
  public companyId;
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

  delay(timeInMillis: number): Promise<void> {
    return new Promise((resolve) => setTimeout(() => resolve(), timeInMillis));
  }

  isNumeric(value: any): boolean {
    return (typeof value === 'number' || (typeof value === 'string' && value.trim() !== '')) && !isNaN(value as any) && isFinite(value as any);
  }
  private loadData() {
    this.hasChangedValue = false;
    this.apiService.getGroupById(this._id).subscribe( async x => {
      this.group = x as Group;
      this.lastSlokkerIndexFound = Math.max.apply(Math, this.group.slokkerProjectList.map(
        (x) =>  {
          if(this.isNumeric(+x.index)){
            return x.index;
          } else {
            return -1;
          }
        }
     ));
        while(this.apiService.thisCompany == null){
          await this.delay(50)
        }
        this.company = this.apiService.thisCompany;
        this.companyId = this.company._id;
        this.currentProject = new SlokkerProjects();
        this.currentProject.company_id = this.companyId;
        if(this.lastSlokkerIndexFound.toString() === '-Infinity'){
          this.lastSlokkerIndexFound = '0';
        }
        this.currentProject.index = (+this.lastSlokkerIndexFound + 1).toString();
        this.photos = [null,null,null];
        let slokker = new Slokkers();
        slokker.inDrukMof = true;
        slokker.tussenIPRechts = "R";
        slokker.tussenIPLinks = "R";
        slokker.buisType = "PVC";
        slokker.infiltratieKlok = false;
        slokker.aansluitingOpengracht = false;
        slokker.plaatsAansluiting = "180";
        slokker.diameter = "160";
        slokker.tBuisStuk = 'aanboring';
        this.currentProject.photos = new Array(3).fill(null);
        this.currentProject.slokker = slokker;
        if(this.currentStreet !== ''){
          this.currentProject.street = this.currentStreet;
        }
        this.slokkerForm = this.formBuilder.group({
          street: this.currentProject.street,
          huisNr: this.currentProject.huisNr,
          opmerking: this.currentProject.opmerking,
          index: this.currentProject.index,
          buis: this.currentProject.slokker.buis,
          bocht: this.group.bochtenInGraden? null : this.currentProject.slokker.bocht,
          gradenBocht45: !this.group.bochtenInGraden ? null : this.currentProject.slokker.gradenBocht45,
          gradenBocht90: !this.group.bochtenInGraden ? null : this.currentProject.slokker.gradenBocht90,
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
          xCoord: this.currentProject.slokker.xCoord,
          yCoord: this.currentProject.slokker.yCoord,
          zCoord: this.currentProject.slokker.zCoord,
        });
        this.uploadForm = this.formBuilder.group({
          file: ['']
        });
        this.slokkerForm.valueChanges.subscribe(x => {
          this.hasChangedValue = true;
        });
        this.isLoaded = true;
      });
  }

  goToPrevious() {
    this.checkChangedValue('/pages/groupview/' + this._id);
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
  onSubmitForm() {
    let slokkerProject = this.slokkerForm.value;

      // slokker initialisatie
      let slokker = new Slokkers();
      slokker.diameter = slokkerProject.diameter;
      slokker.buis = slokkerProject.buis;
      if(!this.group.bochtenInGraden){
        slokker.bocht = slokkerProject.bocht;
      } else {
        slokker.gradenBocht45 = slokkerProject.gradenBocht45;
        slokker.gradenBocht90 = slokkerProject.gradenBocht90;
      }
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
    realSlokkerProject.photos = this.photos;
    realSlokkerProject.equipNrRiolering = slokkerProject.equipNrRiolering;
    realSlokkerProject.projectNr = this.group.rbProjectNr;
    realSlokkerProject.projectNaam = this.group.rbProjectNaam;
    realSlokkerProject.werfleider = this.group.aannemerWerfleider;
    realSlokkerProject.gemeente = this.group.rbGemeente;
    realSlokkerProject.group_id = this.group;
    realSlokkerProject.company_id = this.company;
    realSlokkerProject.isSlokker = true;
    realSlokkerProject.naamFiche = 'GEM=' + this.group.gemeenteCode + ' projectnr=' + this.group.rbProjectNr +
      ' adres=' + realSlokkerProject.street +  ((realSlokkerProject.index != null && realSlokkerProject.index !== '')?
        '-kolknr'  + realSlokkerProject.index : '') + ' AB-kolk-fiche';
    realSlokkerProject.equipNrRiolering = this.group.rbProjectNr +  ((realSlokkerProject.index != null && realSlokkerProject.index !== '')?  '-kolknr'  + realSlokkerProject.index : '') ;
    this.slokkerProjectSend = realSlokkerProject;
    this.slokkerProjectSend.company_id = this.companyId;
    this.currentStreet = realSlokkerProject.street;
    if(this.chosenImageList == null || this.chosenImageList.length === 0){
      this.apiService.createSlokkerProject(this.slokkerProjectSend, this._id).subscribe(x => {
        this.currentProject = null;
        this.hasChangedValue = false;
        this.chosenImageList = [];
        this.chosenImageListIndex = [];
        this.isLoaded = false;
        this.toastrService.success(slokkerProject.street + '- slokker + ' + slokkerProject.index + ' is aangemaakt', 'Succes!');
        this.loadData();
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

  deleteFoto(i: number) {
    let count = 0;
    this.photos[i] = null;
    for(let photo of this.photos){
      if(photo == null && count > 2){
        this.photos.splice(count,1);
      }
      count++;
    }
    count = 0;
    let lastEmpty = 0;
    for(let photo of this.photos){
      if(photo == null && count > 2){
        lastEmpty = count;
        this.photos.splice(count,1);
      }
      count++;
    }
    if(lastEmpty !== 0){
      this.photos.splice(count,lastEmpty);
    }
    if(this.photos != null && this.photos.length >= 3){
      this.photos[this.photos.length] = null;
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
                counter++;
                let index = this.chosenImageListIndex[i];
                this.photos[index] = url;
                if(counter === this.chosenImageList.length){
                  if(this.photos[this.photos.length - 1 ] == null){
                    this.photos.splice(this.photos.length -1);
                  }
                  this.slokkerProjectSend.photos = this.photos;
                  this.apiService.createSlokkerProject(this.slokkerProjectSend, this._id).subscribe( x =>{
                    this.toastrService.success(this.slokkerProjectSend.street + '- slokker + ' + this.slokkerProjectSend.index + ' is aangemaakt', 'Succes!');
                    this.currentProject = null;
                    this.chosenImageList = [];
                    this.chosenImageListIndex = [];
                    this.hasChangedValue = false;
                    this.isLoaded = false;
                    this.loadData();
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

}
