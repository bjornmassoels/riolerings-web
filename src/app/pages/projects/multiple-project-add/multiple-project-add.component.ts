
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import { ApiService } from 'services/api.service';
import {Group} from "../../../../models/groups";
import {FormService} from "../../../../services/form.service";
import {Waterafvoer} from "../../../../models/waterafvoer";
import {NbToastrService} from "@nebular/theme";
import {Company} from "../../../../models/company";
import {Project} from "../../../../models/project";
import {AngularFireStorage} from "@angular/fire/compat/storage";
@Component({
  selector: 'ngx-multiple-project-add',
  templateUrl: './multiple-project-add.component.html',
  styleUrls: ['./multiple-project-add.component.scss', '../../styles/project-view.scss'],
})
export class MultipleProjectAddComponent implements OnInit {
  public currentProject: Project;
  public isLoaded: boolean = false;
  public hasPreviousPage: boolean = false;
  public _id: string;
  public index: number;
  public firstOfArray: boolean = true;
  public group: Group;
  gietIjzerDWA:boolean = true;
  gietIjzerRWA:boolean = true;
  public imagePath;
  public imagePath2;
  infoForm: UntypedFormGroup;
  dwaForm: UntypedFormGroup;
  rwaForm: UntypedFormGroup;
  uploadForm: UntypedFormGroup;
  setVariables: boolean =false;
  isIncremented: boolean = false;
  isLot: boolean = false;
  variablesCount: number;
  counter: number = 0;
  equipmentArray: string[] = [];
  chosenImageList: any[] = [];
  isLoadingBar: boolean = false;
  isAnderPutjeDWA: boolean;
  isAnderPutjeRWA: boolean;
  isAndereLiggingDWA: boolean = false;
  isAndereLiggingRWA: boolean = false;
  huisNummers: number[];

  buisTypes = ['Gres', 'PVC', 'PP'];
  buisArray = ['onbekend','T-Buis', 'T-Stuk', 'Y-Stuk', 'flexibele aansluiting','aanboring'];

  public company: Company;
  public companyId;
  totalDeleted:number;
  equipmentNr: string;
  public lastOfArray: boolean = false;
  buisTypesRWA = ['PVC', 'PP'];

  hasChangedMateriaalBuisDWA: boolean = false;
  hasChangedDiameterBuisDWA: boolean = false;
  hasChangedMateriaalBuisRWA: boolean = false;
  hasChangedDiameterBuisRWA: boolean = false;
  isAndereDiameterDWA: boolean = false;
  isAndereDiameterRWA: boolean = false;
  isAndereDiameterDWAAchter: boolean = false;
  isAndereDiameterRWAAchter: boolean = false;
  isSaving: boolean;
  constructor(
    private apiService: ApiService,
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private formService: FormService,
    private toastrService: NbToastrService,
    private storage: AngularFireStorage,
  ) {
    route.params.subscribe((event) => {
        this.isLoaded = false;
        this._id = this.route.snapshot.paramMap.get('id');
        this.loadData();
    });
  }

  ngOnInit(): void {
  }
  private loadData() {
      this.huisNummers = [];
      this.isAnderPutjeDWA = false;
      this.isAnderPutjeRWA = false;
      this.isAndereDiameterDWA = false;
      this.isAndereDiameterRWA = false;
      this.isAndereLiggingDWA = false;
      this.isAndereLiggingRWA = false;
      this.currentProject = new Project();
      this.currentProject.putje = true;
      this.isSaving = false;
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
      this.currentProject.droogWaterAfvoer.gietijzer = true;
      this.currentProject.droogWaterAfvoer.soortPutje = 'kunststof';
      this.currentProject.regenWaterAfvoer.soortPutje = 'kunststof';
      this.currentProject.regenWaterAfvoer.gietijzer = true;
      this.currentProject.droogWaterAfvoer.diameterPut = 315;
      this.currentProject.droogWaterAfvoer.plaatsAansluiting = 180;
      this.currentProject.regenWaterAfvoer.plaatsAansluiting = 180;
      this.currentProject.regenWaterAfvoer.diameterPut = 250;
      this.currentProject.regenWaterAfvoer.diameter = "160";
      this.currentProject.regenWaterAfvoer.diameterAchter = "160";
      this.currentProject.regenWaterAfvoer.tussenIPLinks = 'R';
      this.currentProject.regenWaterAfvoer.tussenIPRechts = 'R';
      this.currentProject.photosDWA = [];
      this.currentProject.photosRWA = [];
      this.currentProject.droogWaterAfvoer.tBuisStuk = 'T-Stuk';
      this.currentProject.regenWaterAfvoer.tBuisStuk = 'aanboring';

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
        this.currentProject.startDate = null;
        this.currentProject.created = new Date().toString();

        this.uploadForm = this.formBuilder.group({
          file: [''],
          file2: ['']
        });
        this.infoForm = this.formBuilder.group({
          street: this.currentProject.street,
          totHuisNr: this.currentProject.totHuisNr,
          vanHuisNr: this.currentProject.vanHuisNr,
          opmerking: this.currentProject.opmerking,
          isWachtAansluiting: this.currentProject.isWachtAansluiting,
          putje: this.currentProject.putje
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
          plaatsAansluiting: this.currentProject.droogWaterAfvoer.plaatsAansluiting == null ? '' : this.currentProject.droogWaterAfvoer.plaatsAansluiting.toString(),
          letterHor: this.currentProject.droogWaterAfvoer.letterHor == null ? '' : this.currentProject.droogWaterAfvoer.letterHor,
          putHor: this.currentProject.droogWaterAfvoer.putHor,
          letterVer: this.currentProject.droogWaterAfvoer.letterVer  == null ? '' : this.currentProject.droogWaterAfvoer.letterVer,
          putVer: this.currentProject.droogWaterAfvoer.putVer,
          mof: this.currentProject.droogWaterAfvoer.mof,
          krimpmof: this.currentProject.droogWaterAfvoer.krimpmof,
          koppelstuk: this.currentProject.droogWaterAfvoer.koppelstuk,
          stop: this.currentProject.droogWaterAfvoer.stop,
          gietijzer: this.currentProject.droogWaterAfvoer.gietijzer,
          betonkader: this.currentProject.droogWaterAfvoer.betonkader,
          alukader: this.currentProject.droogWaterAfvoer.alukader,
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
          ligging: this.currentProject.regenWaterAfvoer.ligging == null ? '' : this.currentProject.regenWaterAfvoer.ligging.toString(),
          diameter: this.currentProject.regenWaterAfvoer.diameter,
          afstandPutMof: this.currentProject.regenWaterAfvoer.afstandPutMof,
          terugslagklep: this.currentProject.regenWaterAfvoer.terugslagklep,
          diameterPut: this.currentProject.regenWaterAfvoer.diameterPut,
          diepteAansluitingWoning: this.currentProject.regenWaterAfvoer.diepteAansluitingWoning,
          tussenIPLinks: this.currentProject.regenWaterAfvoer.tussenIPLinks,
          tussenIPRechts: this.currentProject.regenWaterAfvoer.tussenIPRechts,
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
          gietijzer: this.currentProject.regenWaterAfvoer.gietijzer,
          betonkader: this.currentProject.regenWaterAfvoer.betonkader,
          alukader: this.currentProject.regenWaterAfvoer.alukader,
          andere: this.currentProject.regenWaterAfvoer.andere,
          aanslBovRWA: this.currentProject.regenWaterAfvoer.aanslBovRWA,
          infilPutje: this.currentProject.regenWaterAfvoer.infilPutje,
          aanslOpenRWA: this.currentProject.regenWaterAfvoer.aanslOpenRWA,
          xCoord: this.currentProject.regenWaterAfvoer.xCoord,
          yCoord: this.currentProject.regenWaterAfvoer.yCoord,
          zCoord: this.currentProject.regenWaterAfvoer.zCoord,
          soortPutje: this.currentProject.regenWaterAfvoer.soortPutje,
          anderPutje: this.currentProject.regenWaterAfvoer.anderPutje,
          isPP: this.currentProject.regenWaterAfvoer.isPP,
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

  delay(timeInMillis: number): Promise<void> {
    return new Promise((resolve) => setTimeout(() => resolve(), timeInMillis));
  }


  async onSubmitInfo() {

    this.counter = 0;
      const infoForm = this.infoForm.value as Project;
    if(infoForm.street == null || infoForm.street.trim() === ''){
      this.toastrService.warning( 'De straat moet ingevuld zijn ', 'Vul straat in');
      return;
    } else if(infoForm.vanHuisNr == null  || infoForm.totHuisNr == null){
      this.toastrService.warning( 'Vul de 2 huisnummers in', 'Vul huisnummer in');
    } else {
      this.currentProject.street = infoForm.street;
      this.currentProject.vanHuisNr = infoForm.vanHuisNr;
      this.currentProject.totHuisNr = infoForm.totHuisNr;

      this.currentProject.opmerking = infoForm.opmerking;
      this.currentProject.photosDWA = [null,null,null,null,null];
      this.currentProject.photosRWA = [null,null,null,null,null];
      this.currentProject.putje = infoForm.putje;
      this.currentProject.isWachtAansluiting = null;
      // DWA
      const data = this.dwaForm.value;
      this.currentProject.droogWaterAfvoer.buisType = data.buisType;
      this.currentProject.droogWaterAfvoer.buisVoorHor = data.buisVoorHor;
      this.currentProject.droogWaterAfvoer.buisVoorVert = data.buisVoorVert;
      this.currentProject.droogWaterAfvoer.buisAchter = data.buisAchter;
      if(!this.group.bochtenInGraden) {
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
      this.currentProject.droogWaterAfvoer.afstandPutMof = data.afstandPutMof;
      this.currentProject.droogWaterAfvoer.terugslagklep = data.terugslagklep;
      this.currentProject.droogWaterAfvoer.diameterPut = data.diameterPut;
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
      this.currentProject.droogWaterAfvoer.gietijzer = data.gietijzer;
      this.currentProject.droogWaterAfvoer.betonkader = data.betonkader;
      this.currentProject.droogWaterAfvoer.alukader = data.alukader;
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
      // na invoeging edit ,deze verwijderen bij project creates
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
      if(!this.group.bochtenInGraden) {
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
      this.currentProject.regenWaterAfvoer.buisType = data2.buisType;
      this.currentProject.regenWaterAfvoer.buisTypeAchter = data2.buisTypeAchter;
      this.currentProject.regenWaterAfvoer.diameterAchter = data2.diameterAchter;
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

      this.setVariables = true;
      this.lastOfArray = false;


      if(this.isIncremented === false){
        this.variablesCount = (this.currentProject.totHuisNr - this.currentProject.vanHuisNr) + 1;
      } else {
        if(this.currentProject.vanHuisNr % 2 == 0 && this.currentProject.totHuisNr % 2 == 0 ||
          this.currentProject.vanHuisNr % 2 !== 0 && this.currentProject.totHuisNr % 2 !== 0){
          this.variablesCount = ((this.currentProject.totHuisNr - this.currentProject.vanHuisNr)/2) + 1;
        } else if(this.currentProject.vanHuisNr % 2 == 0 && this.currentProject.totHuisNr % 2 !== 0 ||
          this.currentProject.vanHuisNr % 2 !== 0 && this.currentProject.totHuisNr % 2 == 0){
          this.variablesCount = Math.floor((this.currentProject.totHuisNr - this.currentProject.vanHuisNr) / 2) + 1;
        }
      }


      if(!this.isIncremented){
        let j = 0;
        for(let i = +this.currentProject.vanHuisNr; i <= +this.currentProject.totHuisNr; i++ ){
          this.huisNummers[j] = i;
          j++;
        }
      } else {
        let j = 0;
        for(let i = +this.currentProject.vanHuisNr; i <= +this.currentProject.totHuisNr; i++ ){
          this.huisNummers[j] = i;
          i++;
          j++;
        }
      }

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
  async afterVariableOnSubmit(){
    if(!this.isSaving){
      this.isSaving = true;
      this.isLoadingBar = true;
      this.equipmentArray[this.variablesCount - 1] = this.equipmentNr;
      this.currentProject.equipMentArray = this.equipmentArray;
      await this.apiService.createMultipleProjects(this.currentProject, this.group, this.isIncremented.toString(), this.huisNummers, this.isLot.toString()).subscribe(async () =>{
        this.isLoadingBar = false;
        this.setVariables = false;
        this.toastrService.success( 'De aansluitingen zijn aangemaakt', 'Succes!');
        this.isSaving = false;
        await this.delay(1500)
        this.goToPrevious();
      }, error => {
        this.isLoadingBar = false;
        this.toastrService.danger( 'Er is iets misgelopen', 'Fout');
        this.isSaving = false;
      });
    }
  }

  checkWachtAansluiting() {
    if(this.infoForm.value.isWachtAansluiting){
      this.infoForm.value.isWachtAansluiting = false;
    }
  }

  checkFinished() {
    if(this.infoForm.value.finished){
      this.infoForm.value.finished = false;
    }
  }
  increment(event) {
    this.isIncremented = event;
  }
  setLot(event) {
    this.isLot = event;
  }
  goToPrevious() {
    if(this.setVariables === true){
      this.setVariables = false;
    } else {
      this.router.navigate(['/pages/groupview/' + this._id]);
    }
  }

  previousVariables() {
      this.equipmentArray[this.counter] = this.equipmentNr;
      this.counter--;
      this.equipmentNr = this.equipmentArray[this.counter];
      this.lastOfArray = false;
      if(this.counter === 0){
        this.firstOfArray = true;
      }
  }
  nextVariables() {
      this.firstOfArray = false;
      this.equipmentArray[this.counter] = this.equipmentNr;
      this.equipmentNr = '';
      this.counter++;
      if(this.counter + 1 === this.variablesCount){
        this.lastOfArray = true;
      }
  }
  setVolgnummer(event: boolean) {
    if(event === true){
      this.currentProject.isWachtAansluiting = true;
      this.dwaForm.get('isWachtaansluiting').setValue(true);
      this.rwaForm.get('isWachtaansluiting').setValue(true);
    } else if(event === false){
      this.currentProject.isWachtAansluiting = false;
      this.dwaForm.get('isWachtaansluiting').setValue(false);
      this.rwaForm.get('isWachtaansluiting').setValue(false);
    }
  }

  setWachtaansluiting($event: boolean, soort: string) {
    if(soort === 'dwa'){
      this.currentProject.droogWaterAfvoer.isWachtaansluiting = $event;
    } else {
      this.currentProject.regenWaterAfvoer.isWachtaansluiting = $event;
    }
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
  deleteHuisnummer() {
      let voorLaatste = false;
      let laatste = false;
      if(this.counter + 2 === this.huisNummers.length) {
        voorLaatste = true;
      }
      if(this.counter + 1 === this.huisNummers.length) {
        laatste = true;
      }
      if(this.isIncremented){
        if(voorLaatste){
          this.equipmentArray.splice(this.counter ,1);
          this.huisNummers.splice(this.counter, 1 );
          this.variablesCount--;
          this.lastOfArray = true;
        } else if(laatste){
          this.equipmentArray.splice(this.counter ,1);
          this.huisNummers.splice(this.counter, 1 );
          this.variablesCount--;
          this.counter -= 1;
          this.lastOfArray = true;
        } else {
          this.equipmentArray.splice(this.counter ,1);
          this.huisNummers.splice(this.counter, 1 );
          this.variablesCount--;
        }
      } else{
        if(voorLaatste){
          this.equipmentArray.splice(this.counter ,1);
          this.huisNummers.splice(this.counter, 1 );
          this.variablesCount--;
          this.lastOfArray = true;
        } else if(laatste){
          this.equipmentArray.splice(this.counter ,1);
          this.huisNummers.splice(this.counter, 1 );
          this.variablesCount--;
          this.counter -= 1;
          this.lastOfArray = true;
        } else {
          this.equipmentArray.splice(this.counter ,1);
          this.huisNummers.splice(this.counter, 1 );
          this.variablesCount--;
        }
      }
    if(this.counter === 0){
      this.firstOfArray = true;
    }
  }
}



