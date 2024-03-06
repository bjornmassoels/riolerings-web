import { Component, OnInit, ElementRef , ViewChild} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {FormArray, UntypedFormBuilder, UntypedFormGroup} from '@angular/forms';
import {Project} from '../../../../models/project';
import {FormService} from '../../../../services/form.service';
import {ApiService} from '../../../../services/api.service';
import {NbToastrService} from '@nebular/theme';
import { Company } from 'models/company';
import { finalize } from 'rxjs/operators';
import {Group} from "../../../../models/groups";
import {Waterafvoer} from "../../../../models/waterafvoer";
import {NbAuthService} from "@nebular/auth";
import {AngularFireStorage} from "@angular/fire/compat/storage";


@Component({
  selector: 'ngx-products-add',
  templateUrl: './project-add.component.html',
  styleUrls: [
    './project-add.component.scss',
    '../../styles/project-view.scss',
  ],
})
export class ProjectAddComponent implements OnInit {
  public currentProject: Project;
  public isLoaded: boolean = false;
  public hasPreviousPage: boolean = false;
  public latitude: number;
  public longitude: number;
  nextVolgNummer: number = 0;
  public _id: string;
  public index: number;
  public group: Group;
  gietIjzerDWA:boolean = true;
  gietIjzerRWA:boolean = true;
  public imagePath;
  public imagePath2;
  infoForm: UntypedFormGroup;
  dwaForm: UntypedFormGroup;
  rwaForm: UntypedFormGroup;
  uploadForm: UntypedFormGroup;
  isFotoDWA: boolean = false;
  isFotoRWA: boolean = false;
  imageChangedEvent: any = '';
  selectedPhoto = false;
  imageChangedEvent2: any = '';
  selectedPhoto2 = false;
  chosenImageList: any[] = [];
  chosenImageList2: any[] = [];
  currentStreet: string = '';
  chosenImageListIndex: number [] = [];
  chosenImageList2Index: number[] = [];
  isAnderPutjeDWA: boolean;
  isAnderPutjeRWA: boolean;

  isAndereLiggingDWA: boolean = false;
  isAndereLiggingRWA: boolean = false;
  buisTypes = ['Gres', 'PVC', 'PP'];
  buisTypesRWA = ['PVC', 'PP'];

  buisArray = ['onbekend','T-Buis', 'T-Stuk', 'Y-Stuk', 'flexibele aansluiting','aanboring'];
  public company;
  public companyId;
  hasChangedMateriaalBuisDWA: boolean = false;
  hasChangedDiameterBuisDWA: boolean = false;
  hasChangedMateriaalBuisRWA: boolean = false;
  hasChangedDiameterBuisRWA: boolean = false;
  isAndereDiameterDWA: boolean = false;
  isAndereDiameterRWA: boolean = false;
  isAndereDiameterDWAAchter: boolean = false;
  isAndereDiameterRWAAchter: boolean = false;
  constructor(
    private formBuilder: UntypedFormBuilder,
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    private formService: FormService,
    private toastrService: NbToastrService,
    private storage: AngularFireStorage,
    private authService: NbAuthService
  ) {
    router.events.subscribe((event) => {
      if(event instanceof NavigationEnd) {
        this.isLoaded = false;
        this._id = this.route.snapshot.paramMap.get('id');
        this.loadData();
      }
    });
  }

  async ngOnInit(): Promise<void> {
  }

  private loadData() {
      this.isAnderPutjeDWA = false;
      this.isAnderPutjeRWA = false;
      this.isAndereDiameterDWA = false;
      this.isAndereDiameterRWA = false;
      this.isAndereDiameterRWAAchter = false;
      this.isAndereDiameterDWAAchter = false;
      this.isAndereLiggingDWA = false;
      this.isAndereLiggingRWA = false;
      this.currentProject = new Project();
      this.hasChangedDiameterBuisDWA = false;
      this.hasChangedDiameterBuisRWA = false;
      this.hasChangedMateriaalBuisDWA = false;
      this.hasChangedMateriaalBuisRWA = false;
      this.currentProject.user_id = this.apiService.userId;
      this.currentProject.company_id = this.companyId;
      this.currentProject.droogWaterAfvoer = new Waterafvoer();
      this.currentProject.regenWaterAfvoer = new Waterafvoer();
      this.currentProject.droogWaterAfvoer.buisType = 'Gres';
      this.currentProject.droogWaterAfvoer.buisTypeAchter = "Gres";
      this.currentProject.regenWaterAfvoer.buisType = 'PVC';
      this.currentProject.regenWaterAfvoer.buisTypeAchter = 'PVC';
      this.currentProject.droogWaterAfvoer.tussenIPLinks = 'D';
      this.currentProject.droogWaterAfvoer.tussenIPRechts = 'D';
      this.currentProject.droogWaterAfvoer.diameter = "125";
      this.currentProject.droogWaterAfvoer.diameterAchter = "125";
      this.currentProject.droogWaterAfvoer.diameterPut = 315;
      this.currentProject.droogWaterAfvoer.gietijzer = true;
      this.currentProject.droogWaterAfvoer.plaatsAansluiting = 180;
      this.currentProject.droogWaterAfvoer.soortPutje = 'kunststof';
      this.currentProject.droogWaterAfvoer.tBuisStuk = 'T-Stuk';
      this.currentProject.regenWaterAfvoer.tBuisStuk = 'aanboring';
      this.currentProject.regenWaterAfvoer.soortPutje = 'kunststof';
      this.currentProject.regenWaterAfvoer.plaatsAansluiting = 180;
      this.currentProject.regenWaterAfvoer.diameterPut = 250;
      this.currentProject.regenWaterAfvoer.diameter = "160";
      this.currentProject.regenWaterAfvoer.diameterAchter = "160";
      this.currentProject.regenWaterAfvoer.gietijzer = true;
      this.currentProject.regenWaterAfvoer.tussenIPLinks = 'R';
      this.currentProject.regenWaterAfvoer.tussenIPRechts = 'R';
      this.currentProject.photosDWA = [null,null,null,null,null];
      this.currentProject.photosRWA = [null,null,null,null,null];
      if(this.currentStreet !== ''){
          this.currentProject.street = this.currentStreet;
      }
      this.apiService.getGroupById(this._id).subscribe(async x => {
        this.group = x as Group;
        while(this.apiService.thisCompany == null){
          await this.delay(50)
        }
        this.company = this.apiService.thisCompany;
        this.companyId = this.company._id;
        // @ts-ignore
        this.currentProject.group_id = this._id;
        this.currentProject.projectNr = this.group.rbProjectNr;
        this.currentProject.projectNaam = this.group.rbProjectNaam;
        this.currentProject.werfleider = this.group.aannemerWerfleider;
        this.currentProject.gemeente = this.group.rbGemeente;


          this.infoForm = this.formBuilder.group({
            street: this.currentProject.street,
            huisNr: this.currentProject.huisNr,
            opmerking: this.currentProject.opmerking,
            isWachtAansluiting: this.currentProject.isWachtAansluiting,
            finished: this.currentProject.finished,
            index: this.currentProject.index,
            equipNrRiolering: this.currentProject.equipNrRiolering,
            isGemengd: this.currentProject.isGemengd
          });

        this.uploadForm = this.formBuilder.group({
          file: [''],
          file2: ['']
        });

          this.dwaForm = this.formBuilder.group({
            buisType: this.currentProject.droogWaterAfvoer.buisType == null ? '' : this.currentProject.droogWaterAfvoer.buisType.toString(),
            buisVoorHor: this.currentProject.droogWaterAfvoer.buisVoorHor,
            buisVoorVert: this.currentProject.droogWaterAfvoer.buisVoorVert,
            buisAchter: this.currentProject.droogWaterAfvoer.buisAchter,
            bochtVoor: this.group.bochtenInGraden ? null : this.currentProject.droogWaterAfvoer.bochtVoor,
            bochtAchter:  this.group.bochtenInGraden ? null : this.currentProject.droogWaterAfvoer.bochtAchter,
            gradenBochtVoor45: !this.group.bochtenInGraden ? null : this.currentProject.droogWaterAfvoer.gradenBochtVoor45,
            gradenBochtVoor90:  !this.group.bochtenInGraden ? null : this.currentProject.droogWaterAfvoer.gradenBochtVoor90,
            gradenBochtAchter45: !this.group.bochtenInGraden ? null : this.currentProject.droogWaterAfvoer.gradenBochtAchter45,
            gradenBochtAchter90:  !this.group.bochtenInGraden ? null : this.currentProject.droogWaterAfvoer.gradenBochtAchter90,
            YAchter: this.currentProject.droogWaterAfvoer.YAchter,
            reductieVoor: this.currentProject.droogWaterAfvoer.reductieVoor,
            reductieAchter: this.currentProject.droogWaterAfvoer.reductieAchter,
            tBuisStuk: this.currentProject.droogWaterAfvoer.tBuisStuk,
            ligging: this.currentProject.droogWaterAfvoer.ligging,
            diameter: this.currentProject.droogWaterAfvoer.diameter,
            afstandPutMof: this.currentProject.droogWaterAfvoer.afstandPutMof,
            terugslagklep: this.currentProject.droogWaterAfvoer.terugslagklep,
            diameterPut: this.currentProject.droogWaterAfvoer.diameterPut,
            diepteAansluitingWoning: this.currentProject.droogWaterAfvoer.diepteAansluitingWoning,
            tussenIPLinks: this.currentProject.droogWaterAfvoer.tussenIPLinks,
            tussenIPRechts: this.currentProject.droogWaterAfvoer.tussenIPRechts,
            diepteRioleringHA: this.currentProject.droogWaterAfvoer.diepteRioleringHA,
            gietijzer: this.currentProject.droogWaterAfvoer.gietijzer,
            betonkader: this.currentProject.droogWaterAfvoer.betonkader,
            alukader: this.currentProject.droogWaterAfvoer.alukader,
            plaatsAansluiting: this.currentProject.droogWaterAfvoer.plaatsAansluiting == null ? '' : this.currentProject.droogWaterAfvoer.plaatsAansluiting.toString(),
            letterHor: this.currentProject.droogWaterAfvoer.letterHor == null ? '' : this.currentProject.droogWaterAfvoer.letterHor,
            putHor: this.currentProject.droogWaterAfvoer.putHor,
            letterVer: this.currentProject.droogWaterAfvoer.letterVer  == null ? '' : this.currentProject.droogWaterAfvoer.letterVer,
            putVer: this.currentProject.droogWaterAfvoer.putVer,
            mof: this.currentProject.droogWaterAfvoer.mof,
            krimpmof: this.currentProject.droogWaterAfvoer.krimpmof,
            koppelstuk: this.currentProject.droogWaterAfvoer.koppelstuk,
            stop: this.currentProject.droogWaterAfvoer.stop,
            andere: this.currentProject.droogWaterAfvoer.andere,
            xCoord: this.currentProject.droogWaterAfvoer.xCoord,
            yCoord: this.currentProject.droogWaterAfvoer.yCoord,
            zCoord: this.currentProject.droogWaterAfvoer.zCoord,
            soortPutje: this.currentProject.droogWaterAfvoer.soortPutje,
            anderPutje: this.currentProject.droogWaterAfvoer.anderPutje,
            liggingAndere: this.currentProject.droogWaterAfvoer.liggingAndere,
            diameterAndere: this.currentProject.droogWaterAfvoer.diameterAndere,
            isWachtaansluiting: this.currentProject.droogWaterAfvoer.isWachtaansluiting,
            diameterAchter: this.currentProject.droogWaterAfvoer.diameterAchter ,
            buisTypeAchter: this.currentProject.droogWaterAfvoer.buisTypeAchter,
            diameterAchterAndere: this.currentProject.droogWaterAfvoer.diameterAchterAndere,
            sifonPutje: this.currentProject.droogWaterAfvoer.sifonPutje,
            tPutje: this.currentProject.droogWaterAfvoer.tPutje
          });
          this.rwaForm = this.formBuilder.group({
            buisType: 'PVC',
            buisVoorHor: this.currentProject.regenWaterAfvoer.buisVoorHor,
            buisVoorVert: this.currentProject.regenWaterAfvoer.buisVoorVert,
            buisAchter: this.currentProject.regenWaterAfvoer.buisAchter,
            bochtVoor: this.group.bochtenInGraden ? null : this.currentProject.regenWaterAfvoer.bochtVoor,
            bochtAchter:  this.group.bochtenInGraden ? null : this.currentProject.regenWaterAfvoer.bochtAchter,
            gradenBochtVoor45: !this.group.bochtenInGraden ? null : this.currentProject.regenWaterAfvoer.gradenBochtVoor45,
            gradenBochtVoor90:  !this.group.bochtenInGraden ? null : this.currentProject.regenWaterAfvoer.gradenBochtVoor90,
            gradenBochtAchter45: !this.group.bochtenInGraden ? null : this.currentProject.regenWaterAfvoer.gradenBochtAchter45,
            gradenBochtAchter90:  !this.group.bochtenInGraden ? null : this.currentProject.regenWaterAfvoer.gradenBochtAchter90,
            YAchter: this.currentProject.regenWaterAfvoer.YAchter,
            reductieVoor: this.currentProject.regenWaterAfvoer.reductieVoor,
            reductieAchter: this.currentProject.regenWaterAfvoer.reductieAchter,
            tBuisStuk: this.currentProject.regenWaterAfvoer.tBuisStuk  == null ? '' : this.currentProject.regenWaterAfvoer.tBuisStuk.toString(),
            ligging: this.currentProject.regenWaterAfvoer.ligging == null ? '' : this.currentProject.regenWaterAfvoer.ligging,
            diameter: this.currentProject.regenWaterAfvoer.diameter,
            afstandPutMof: this.currentProject.regenWaterAfvoer.afstandPutMof,
            terugslagklep: this.currentProject.regenWaterAfvoer.terugslagklep,
            diameterPut: this.currentProject.regenWaterAfvoer.diameterPut,
            diepteAansluitingWoning: this.currentProject.regenWaterAfvoer.diepteAansluitingWoning,
            tussenIPLinks: this.currentProject.regenWaterAfvoer.tussenIPLinks,
            tussenIPRechts: this.currentProject.regenWaterAfvoer.tussenIPRechts,
            gietijzer: this.currentProject.regenWaterAfvoer.gietijzer,
            betonkader: this.currentProject.regenWaterAfvoer.betonkader,
            alukader: this.currentProject.regenWaterAfvoer.alukader,
            diepteRioleringHA: this.currentProject.regenWaterAfvoer.diepteRioleringHA,
            plaatsAansluiting: this.currentProject.regenWaterAfvoer.plaatsAansluiting == null ? '' : this.currentProject.regenWaterAfvoer.plaatsAansluiting.toString(),
            letterHor: this.currentProject.regenWaterAfvoer.letterHor == null ? '' : this.currentProject.regenWaterAfvoer.letterHor.toString(),
            putHor: this.currentProject.regenWaterAfvoer.putHor,
            letterVer: this.currentProject.regenWaterAfvoer.letterVer == null ? '' : this.currentProject.regenWaterAfvoer.letterVer.toString(),
            putVer: this.currentProject.regenWaterAfvoer.putVer,
            mof: this.currentProject.regenWaterAfvoer.mof,
            krimpmof: this.currentProject.regenWaterAfvoer.krimpmof,
            koppelstuk: this.currentProject.regenWaterAfvoer.koppelstuk,
            stop: this.currentProject.regenWaterAfvoer.stop,
            andere: this.currentProject.regenWaterAfvoer.andere,
            aanslBovRWA: this.currentProject.regenWaterAfvoer.aanslBovRWA,
            infilPutje: this.currentProject.regenWaterAfvoer.infilPutje,
            aanslOpenRWA: this.currentProject.regenWaterAfvoer.aanslOpenRWA,
            xCoord: this.currentProject.regenWaterAfvoer.xCoord,
            yCoord: this.currentProject.regenWaterAfvoer.yCoord,
            zCoord: this.currentProject.regenWaterAfvoer.zCoord,
            soortPutje: this.currentProject.regenWaterAfvoer.soortPutje,
            anderPutje: this.currentProject.regenWaterAfvoer.anderPutje,
            liggingAndere: this.currentProject.regenWaterAfvoer.liggingAndere,
            diameterAndere: this.currentProject.regenWaterAfvoer.diameterAndere,
            isWachtaansluiting: this.currentProject.regenWaterAfvoer.isWachtaansluiting,
            diameterAchter: this.currentProject.regenWaterAfvoer.diameterAchter ,
            buisTypeAchter: this.currentProject.regenWaterAfvoer.buisTypeAchter,
            diameterAchterAndere: this.currentProject.regenWaterAfvoer.diameterAchterAndere,
            tPutje: this.currentProject.regenWaterAfvoer.tPutje
          });
        this.isLoaded = true;
      });
}

  goToPrevious() {
    this.router.navigate(['/pages/groupview', this._id]);
  }


  async onSubmitInfo() {
    const infoForm = this.infoForm.value as Project;
    if(infoForm.street == null || infoForm.street.trim() === ''){
      this.toastrService.warning( 'De straat moet ingevuld zijn ', 'Vul straat in');
      return;
    } else {
      this.currentProject.street = infoForm.street;
      this.currentProject.huisNr = infoForm.huisNr;
      this.currentProject.opmerking = infoForm.opmerking;
      this.currentProject.isWachtAansluiting = null;
      this.currentProject.finished = infoForm.finished;
      this.currentProject.index = infoForm.index;
      this.currentProject.equipNrRiolering = infoForm.equipNrRiolering;
      this.currentProject.isGemengd = infoForm.isGemengd;
      this.currentProject.startDate = null;
      if(this.currentProject.photosDWA == null || this.currentProject.photosDWA.length === 0){
        this.currentProject.photosDWA = [null,null,null,null,null];
      } else {
        for(let i =0; i < 5; i++){
          if(i + 1 > this.currentProject.photosDWA.length){
            this.currentProject.photosDWA.push(null);
          }
        }
      }
      if(this.currentProject.photosRWA == null || this.currentProject.photosRWA.length === 0){
        this.currentProject.photosRWA = [null,null,null,null,null];
      } else {
        for(let i =0; i < 5; i++){
          if(i + 1 > this.currentProject.photosRWA.length){
            this.currentProject.photosRWA.push(null);
          }
        }
      }

      // DWA
      const data = this.dwaForm.value;
      this.currentProject.droogWaterAfvoer.buisType = data.buisType;
      this.currentProject.droogWaterAfvoer.buisVoorHor = data.buisVoorHor;
      this.currentProject.droogWaterAfvoer.buisVoorVert = data.buisVoorVert;
      this.currentProject.droogWaterAfvoer.buisAchter = data.buisAchter;
      if(!this.group.bochtenInGraden){
        this.currentProject.droogWaterAfvoer.bochtVoor = data.bochtVoor;
        this.currentProject.droogWaterAfvoer.bochtAchter = data.bochtAchter;
      } else {
        this.currentProject.droogWaterAfvoer.gradenBochtVoor45 = data.gradenBochtVoor45;
        this.currentProject.droogWaterAfvoer.gradenBochtVoor90 = data.gradenBochtVoor90;
        this.currentProject.droogWaterAfvoer.gradenBochtAchter45 = data.gradenBochtAchter45;
        this.currentProject.droogWaterAfvoer.gradenBochtAchter90 = data.gradenBochtAchter90;
      }
      this.currentProject.droogWaterAfvoer.YAchter = data.YAchter;
      this.currentProject.droogWaterAfvoer.reductieVoor = data.reductieVoor;
      this.currentProject.droogWaterAfvoer.reductieAchter = data.reductieAchter;
      this.currentProject.droogWaterAfvoer.tBuisStuk = data.tBuisStuk;
      this.currentProject.droogWaterAfvoer.ligging = data.ligging;
      this.currentProject.droogWaterAfvoer.diameter = data.diameter;
      this.currentProject.droogWaterAfvoer.diameterPut = data.diameterPut;
      this.currentProject.droogWaterAfvoer.afstandPutMof = data.afstandPutMof;
      this.currentProject.droogWaterAfvoer.terugslagklep = data.terugslagklep;
      this.currentProject.droogWaterAfvoer.gietijzer = data.gietijzer;
      this.currentProject.droogWaterAfvoer.betonkader = data.betonkader;
      this.currentProject.droogWaterAfvoer.alukader = data.alukader;
      this.currentProject.droogWaterAfvoer.diepteAansluitingWoning = data.diepteAansluitingWoning;
      this.currentProject.droogWaterAfvoer.tussenIPLinks = data.tussenIPLinks;
      this.currentProject.droogWaterAfvoer.tussenIPRechts = data.tussenIPRechts;
      this.currentProject.droogWaterAfvoer.diepteRioleringHA = data.diepteRioleringHA;
      this.currentProject.droogWaterAfvoer.plaatsAansluiting = data.plaatsAansluiting;
      this.currentProject.droogWaterAfvoer.letterHor = data.letterHor;
      this.currentProject.droogWaterAfvoer.putHor = data.putHor;
      this.currentProject.droogWaterAfvoer.letterVer = data.letterVer;
      this.currentProject.droogWaterAfvoer.putVer = data.putVer;
      this.currentProject.droogWaterAfvoer.mof = data.mof;
      this.currentProject.droogWaterAfvoer.krimpmof = data.krimpmof;
      this.currentProject.droogWaterAfvoer.koppelstuk = data.koppelstuk;
      this.currentProject.droogWaterAfvoer.stop = data.stop;
      this.currentProject.droogWaterAfvoer.andere = data.andere;
      this.currentProject.droogWaterAfvoer.xCoord = data.xCoord;
      this.currentProject.droogWaterAfvoer.yCoord = data.yCoord;
      this.currentProject.droogWaterAfvoer.zCoord = data.zCoord;
      this.currentProject.droogWaterAfvoer.soortPutje = data.soortPutje;
      this.currentProject.droogWaterAfvoer.isWachtaansluiting = data.isWachtaansluiting;
      this.currentProject.droogWaterAfvoer.buisTypeAchter = data.buisTypeAchter;
      this.currentProject.droogWaterAfvoer.diameterAchter = data.diameterAchter;
      this.currentProject.droogWaterAfvoer.sifonPutje = data.sifonPutje;
      this.currentProject.droogWaterAfvoer.tPutje = data.tPutje;
      if(data.soortPutje === 'andere'){
        this.currentProject.droogWaterAfvoer.anderPutje = data.anderPutje;
      } else {
        this.currentProject.droogWaterAfvoer.anderPutje = '';
      }
      if(data.diameter === 'andere'){
        this.currentProject.droogWaterAfvoer.diameterAndere = data.diameterAndere;
      } else {
        this.currentProject.droogWaterAfvoer.diameterAndere = '';
      }
      if(data.ligging === 'andere'){
        this.currentProject.droogWaterAfvoer.liggingAndere = data.liggingAndere;
      } else {
        this.currentProject.droogWaterAfvoer.liggingAndere = '';
      }
      if(this.currentProject.droogWaterAfvoer.gietijzer === true){
        this.currentProject.droogWaterAfvoer.alukader = false;
      }
      if (this.currentProject.droogWaterAfvoer.diameterAchter === 'andere') {
        this.currentProject.droogWaterAfvoer.diameterAchterAndere = data.diameterAchterAndere;
      }
      if(this.hasChangedMateriaalBuisDWA === true){
        this.currentProject.droogWaterAfvoer.hasChangedMateriaalBuis = true;
      }
      if(this.hasChangedDiameterBuisDWA === true){
        this.currentProject.droogWaterAfvoer.hasChangedDiameterBuis = true;
      }
      this.currentProject.droogWaterAfvoer.hasChangedMateriaalBuis = false;
      this.currentProject.droogWaterAfvoer.hasChangedDiameterBuis = false;
      // RWA
      const data2 = this.rwaForm.value;
      this.currentProject.regenWaterAfvoer.buisVoorHor = data2.buisVoorHor;
      this.currentProject.regenWaterAfvoer.buisVoorVert = data2.buisVoorVert;
      this.currentProject.regenWaterAfvoer.buisAchter = data2.buisAchter;
      if(!this.group.bochtenInGraden){
        this.currentProject.regenWaterAfvoer.bochtVoor = data2.bochtVoor;
        this.currentProject.regenWaterAfvoer.bochtAchter = data2.bochtAchter;
      } else {
        this.currentProject.regenWaterAfvoer.gradenBochtVoor45 = data2.gradenBochtVoor45;
        this.currentProject.regenWaterAfvoer.gradenBochtVoor90 = data2.gradenBochtVoor90;
        this.currentProject.regenWaterAfvoer.gradenBochtAchter45 = data2.gradenBochtAchter45;
        this.currentProject.regenWaterAfvoer.gradenBochtAchter90 = data2.gradenBochtAchter90;
      }
      this.currentProject.regenWaterAfvoer.YAchter = data2.YAchter;
      this.currentProject.regenWaterAfvoer.reductieVoor = data2.reductieVoor;
      this.currentProject.regenWaterAfvoer.reductieAchter = data2.reductieAchter;
      this.currentProject.regenWaterAfvoer.tBuisStuk = data2.tBuisStuk;
      this.currentProject.regenWaterAfvoer.ligging = data2.ligging;
      this.currentProject.regenWaterAfvoer.diameter = data2.diameter;
      this.currentProject.regenWaterAfvoer.gietijzer = data2.gietijzer;
      this.currentProject.regenWaterAfvoer.betonkader = data2.betonkader;
      this.currentProject.regenWaterAfvoer.alukader = data2.alukader;
      this.currentProject.regenWaterAfvoer.afstandPutMof = data2.afstandPutMof;
      this.currentProject.regenWaterAfvoer.terugslagklep = data2.terugslagklep;
      this.currentProject.regenWaterAfvoer.diameterPut = data2.diameterPut;
      this.currentProject.regenWaterAfvoer.diepteAansluitingWoning = data2.diepteAansluitingWoning;
      this.currentProject.regenWaterAfvoer.tussenIPLinks = data2.tussenIPLinks;
      this.currentProject.regenWaterAfvoer.tussenIPRechts = data2.tussenIPRechts;
      this.currentProject.regenWaterAfvoer.diepteRioleringHA = data2.diepteRioleringHA;
      this.currentProject.regenWaterAfvoer.plaatsAansluiting = data2.plaatsAansluiting;
      this.currentProject.regenWaterAfvoer.letterHor = data2.letterHor;
      this.currentProject.regenWaterAfvoer.putHor = data2.putHor;
      this.currentProject.regenWaterAfvoer.letterVer = data2.letterVer;
      this.currentProject.regenWaterAfvoer.putVer = data2.putVer;
      this.currentProject.regenWaterAfvoer.mof = data2.mof;
      this.currentProject.regenWaterAfvoer.krimpmof = data2.krimpmof;
      this.currentProject.regenWaterAfvoer.koppelstuk = data2.koppelstuk;
      this.currentProject.regenWaterAfvoer.stop = data2.stop;
      this.currentProject.regenWaterAfvoer.andere = data2.andere;
      this.currentProject.regenWaterAfvoer.xCoord = data2.xCoord;
      this.currentProject.regenWaterAfvoer.yCoord = data2.yCoord;
      this.currentProject.regenWaterAfvoer.zCoord = data2.zCoord;
      this.currentProject.regenWaterAfvoer.infilPutje = data2.infilPutje;
      this.currentProject.regenWaterAfvoer.aanslBovRWA = data2.aanslBovRWA;
      this.currentProject.regenWaterAfvoer.aanslOpenRWA = data2.aanslOpenRWA;
      this.currentProject.regenWaterAfvoer.soortPutje = data2.soortPutje;
      this.currentProject.regenWaterAfvoer.isWachtaansluiting = data2.isWachtaansluiting;
      this.currentProject.regenWaterAfvoer.buisTypeAchter = data2.buisTypeAchter;
      this.currentProject.regenWaterAfvoer.diameterAchter = data2.diameterAchter;
      this.currentProject.regenWaterAfvoer.buisType = data2.buisType;
      this.currentProject.regenWaterAfvoer.tPutje = data2.tPutje;
      if(data2.soortPutje === 'andere'){
        this.currentProject.regenWaterAfvoer.anderPutje = data2.anderPutje;
      } else {
        this.currentProject.regenWaterAfvoer.anderPutje = '';
      }
      if(data2.diameter === 'andere'){
        this.currentProject.regenWaterAfvoer.diameterAndere = data2.diameterAndere;
      } else {
        this.currentProject.regenWaterAfvoer.diameterAndere = '';
      }
      if(data2.ligging === 'andere'){
        this.currentProject.regenWaterAfvoer.liggingAndere = data2.liggingAndere;
      } else {
        this.currentProject.regenWaterAfvoer.liggingAndere = '';
      }
      if (this.currentProject.regenWaterAfvoer.diameterAchter === 'andere') {
        this.currentProject.regenWaterAfvoer.diameterAchterAndere= data2.diameterAchterAndere;
      }
      if(this.hasChangedMateriaalBuisRWA === true){
        this.currentProject.regenWaterAfvoer.hasChangedMateriaalBuis = true;
      }
      if(this.hasChangedDiameterBuisRWA === true){
        this.currentProject.regenWaterAfvoer.hasChangedDiameterBuis = true;
      }
      if(this.currentProject.regenWaterAfvoer.gietijzer === true){
        this.currentProject.regenWaterAfvoer.alukader = false;
      }
      this.currentProject.regenWaterAfvoer.hasChangedMateriaalBuis = false;
      this.currentProject.regenWaterAfvoer.hasChangedDiameterBuis = false;
      this.currentStreet = this.currentProject.street;
      if(this.chosenImageList.length === 0 && this.chosenImageList2.length === 0){
        await this.apiService.updateProject(this.currentProject).subscribe(x=> {
          this.toastrService.success( 'De aansluiting is aangemaakt', 'Succes!');
          this.currentProject = null;
          this.isLoaded = false;
          this.loadData();
        });
      } else {
        await this.uploadImages();
      }
    }
  }

  generateRandomName(): string {
    const random = Math.floor(100000000 + Math.random() * 900000);
    const name = 'fotos/' + this.companyId + '/' + random;
    return name;
  }


  onFileSelect2(event, i:number) {          //RWA
    let file2;

    this.selectedPhoto2 = true;
    this.imageChangedEvent2 = event;
    if (event.target.files.length > 0) {
      file2 = event.target.files[0];
      this.uploadForm.get('file2').setValue(file2);
    }
    let reader2 = new FileReader();
    this.imagePath2 = file2;
    reader2.readAsDataURL(file2);
    reader2.onload = (_event) => {
      this.chosenImageList2.push(reader2.result);
      this.chosenImageList2Index.push(i);
      this.isFotoRWA = true;
    }
  }
  onFileSelect(event, i: number) { //DWA
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
      this.isFotoDWA = true;
    }
  }
  delay(timeInMillis: number): Promise<void> {
    return new Promise((resolve) => setTimeout(() => resolve(), timeInMillis));
  }

  async uploadImages() {

    const fileToUpload = this.uploadForm.get('file').value;


    if(this.chosenImageList.length === 0 && this.chosenImageList2.length !== 0){  //RWA
      let counter = 0;
      for (let j = 0; j < this.chosenImageList2.length;j++) {
        const fileRef2 = this.storage.ref(this.generateRandomName());
        const task2 = fileRef2.putString(this.chosenImageList2[j], 'data_url');

        task2
          .snapshotChanges()
          .pipe(
            finalize(() => {
              fileRef2.getDownloadURL().subscribe(async (url) => {
                if (url) {
                  if(this.currentProject.photosRWA == null){
                    this.currentProject.photosRWA = [];
                  }
                  let index = this.chosenImageList2Index[j];
                  this.currentProject.photosRWA[index] = url;
                  counter++;
                  if (counter === this.chosenImageList2.length) {
                    await this.apiService.updateProject(this.currentProject).subscribe();
                    this.currentProject = null;
                    this.chosenImageList = [];
                    this.chosenImageList2 = [];
                    this.chosenImageListIndex = [];
                    this.chosenImageList2Index = [];
                    this.isFotoRWA = false;
                    this.isLoaded = false;
                    this.toastrService.success('De aansluiting is gewijzigd', 'Succes!');
                    this.loadData();
                  }

                }
              });
            })
          )
          .subscribe();
      }
    } else if(this.chosenImageList2.length === 0 && this.chosenImageList.length !== 0) {  //DWA
      let counter = 0;
      for (let j = 0; j < this.chosenImageList.length;j++) {
        const fileRef2 = this.storage.ref(this.generateRandomName());
        const task2 = fileRef2.putString(this.chosenImageList[j], 'data_url');

        task2
          .snapshotChanges()
          .pipe(
            finalize(() => {
              fileRef2.getDownloadURL().subscribe(async (url2) => {
                if (url2) {
                  if(this.currentProject.photosDWA == null){
                    this.currentProject.photosDWA = [];
                  }
                  let index = this.chosenImageListIndex[j];
                  this.currentProject.photosDWA[index] = url2;
                  counter++;
                  if (counter === this.chosenImageList.length) {
                    await this.apiService.updateProject(this.currentProject).subscribe(async () => {
                      this.currentProject = null;
                      this.chosenImageList = [];
                      this.chosenImageList2 = [];
                      this.chosenImageListIndex = [];
                      this.chosenImageList2Index = [];
                      this.isLoaded = false;
                      this.isFotoDWA = false;
                      this.toastrService.success('De aansluiting is gewijzigd', 'Succes!');
                      this.loadData();
                    })
                  }
                }
              });
            })
          )
          .subscribe();

      }
    } else{       //DWA & RWA

      let counter1 = 0;
      for (let j = 0; j < this.chosenImageList.length;j++) {
        let fileRef = this.storage.ref(this.generateRandomName());
        let task = fileRef.putString(this.chosenImageList[j], 'data_url');

        task
          .snapshotChanges()
          .subscribe(() => {
              fileRef.getDownloadURL().subscribe(async (url) => {
                if (url) {
                  if(this.currentProject.photosDWA == null){
                    this.currentProject.photosDWA = [];
                  }
                  let index = this.chosenImageListIndex[j];
                  this.currentProject.photosDWA[index] = url;
                  counter1++;
                  if (counter1 === this.chosenImageList.length) {
                    let counter2 = 0;
                    for (let k = 0; k < this.chosenImageList2.length;k++) {
                      let fileRef2 = this.storage.ref(this.generateRandomName());
                      let task2 = fileRef2.putString(this.chosenImageList2[k], 'data_url');

                      task2
                        .snapshotChanges()
                        .pipe(
                          finalize(() => {
                            fileRef2.getDownloadURL().subscribe(async (url2) => {
                              if (url2) {
                                if(this.currentProject.photosRWA == null){
                                  this.currentProject.photosRWA = [];
                                }
                                let index2 = this.chosenImageList2Index[k];
                                this.currentProject.photosRWA[index2] = url2;
                                counter2++;
                                if (counter2 === this.chosenImageList2.length && this.chosenImageList.length === counter1) {
                                  await this.apiService.updateProject(this.currentProject).subscribe();
                                  this.currentProject = null;
                                  this.chosenImageList = [];
                                  this.chosenImageList2 = [];
                                  this.isFotoDWA = false;
                                  this.isFotoRWA = false;
                                  this.isLoaded = false;
                                  this.toastrService.success('De aansluiting is gewijzigd', 'Succes!');
                                  this.loadData();
                                }
                              }
                            });
                          })
                        )
                        .subscribe();
                    }
                  }
                }
              });
            }
          )
      }

    }
  }
  goToView() {
        this.router.navigate(['/pages/projectview', this._id]);
  }

  deleteFotoDwa(i: number) {
    this.currentProject.photosDWA[i] = null;
  }
  deleteFotoRwa(i: number) {
    this.currentProject.photosRWA[i] = null;
  }
  setVolgnummer(event: boolean) {
    if(event === true){
      this.nextVolgNummer = 1;
      for(let project of this.group.projectList){
        if(this.isNumeric(+project.index)) {
          if (+project.index >= this.nextVolgNummer) {
            this.nextVolgNummer = +project.index + 1;
          }
        }
      }
      this.currentProject.isWachtAansluiting = true;
      this.infoForm.get('index').patchValue(this.nextVolgNummer);
      this.dwaForm.get('isWachtaansluiting').setValue(true);
      this.rwaForm.get('isWachtaansluiting').setValue(true);
    } else if(event === false){
      this.infoForm.get('index').patchValue(null);
      this.currentProject.isWachtAansluiting = false;
      this.dwaForm.get('isWachtaansluiting').setValue(false);
      this.rwaForm.get('isWachtaansluiting').setValue(false);
    }
  }
  editGietijzerDWA() {
    if(this.gietIjzerDWA){
      this.gietIjzerDWA = false;
    } else {
      this.gietIjzerDWA = true;
    }
  }
  editGietijzerRWA() {
    if(this.gietIjzerRWA){
      this.gietIjzerRWA = false;
    } else {
      this.gietIjzerRWA = true;
    }
  }
  setWachtaansluiting($event: boolean, soort: string) {
    if(soort === 'dwa'){
      this.currentProject.droogWaterAfvoer.isWachtaansluiting = $event;
    } else {
      this.currentProject.regenWaterAfvoer.isWachtaansluiting = $event;
    }
  }
  isNumeric(value: any): boolean {
    return (typeof value === 'number' || (typeof value === 'string' && value.trim() !== '')) && !isNaN(value as any) && isFinite(value as any);
  }
  checkSoortDWA(event: any) {
    if(event === 'andere'){
      this.isAnderPutjeDWA = true;
    } else{
      this.isAnderPutjeDWA = false;
    }
  }

  checkSoortRWA(event: any) {
    if(event === 'andere'){
      this.isAnderPutjeRWA = true;
    } else{
      this.isAnderPutjeRWA = false;
    }
  }
  changeMateriaalBuisVoorPutDWA() {
    if(!this.hasChangedMateriaalBuisDWA){
      this.dwaForm.controls['buisTypeAchter'].setValue(this.dwaForm.value.buisType);
    }
    this.hasChangedMateriaalBuisDWA = true;
  }
  changeMateriaalBuisVoorPutRWA() {
    if(!this.hasChangedMateriaalBuisRWA){
      this.rwaForm.controls['buisTypeAchter'].setValue(this.rwaForm.value.buisType);
    }
    this.hasChangedMateriaalBuisRWA = true;
  }
  checkAndereDiameterDWA(event: any) {
    if(!this.hasChangedDiameterBuisDWA){
      this.dwaForm.controls['diameterAchter'].setValue(this.dwaForm.value.diameter);
      if(this.dwaForm.value.diameter === 'andere'){
        this.isAndereDiameterDWA = true;
        this.isAndereDiameterDWAAchter = true;
      } else {
        this.isAndereDiameterDWA = false;
        this.isAndereDiameterDWAAchter = false;
      }
    } else {
      if(this.dwaForm.value.diameter === 'andere'){
        this.isAndereDiameterDWA = true;
      } else {
        this.isAndereDiameterDWA = false;
      }
    }
    this.hasChangedDiameterBuisDWA = true;
  }
  checkAndereDiameterRWA(event: any) {
    if(!this.hasChangedDiameterBuisRWA){
      this.rwaForm.controls['diameterAchter'].setValue(this.rwaForm.value.diameter);
      if(this.rwaForm.value.diameter === 'andere'){
        this.isAndereDiameterRWA = true;
        this.isAndereDiameterRWAAchter = true;
      } else {
        this.isAndereDiameterRWA = false;
        this.isAndereDiameterRWAAchter = false;
      }
    } else {
      if(this.rwaForm.value.diameter === 'andere'){
        this.isAndereDiameterRWA = true;
      } else {
        this.isAndereDiameterRWA = false;
      }
    }
    this.hasChangedDiameterBuisRWA = true;
  }
  checkAndereDiameterDWAAchter(event: any) {
    if(event === 'andere'){
      this.isAndereDiameterDWAAchter = true;
    } else{
      this.isAndereDiameterDWAAchter = false;
    }
  }
  checkAndereDiameterRWAAchter(event: any) {
    if(event === 'andere'){
      this.isAndereDiameterRWAAchter = true;
    } else{
      this.isAndereDiameterRWAAchter = false;
    }
  }
  checkAndereLiggingDWA(event: any) {
    if(event === 'andere'){
      this.isAndereLiggingDWA = true;
    } else{
      this.isAndereLiggingDWA = false;
    }
  }
  checkAndereLiggingRWA(event: any) {
    if(event === 'andere'){
      this.isAndereLiggingRWA = true;
    } else{
      this.isAndereLiggingRWA = false;
    }
  }
}


