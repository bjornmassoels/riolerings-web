import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { FormArray, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Project } from '../../../../models/project';
import { FormService } from '../../../../services/form.service';
import { ApiService } from '../../../../services/api.service';
import { SlokkerProjects } from '../../../../models/slokker-projects';
import { NbToastrService } from '@nebular/theme';
import { Group } from '../../../../models/groups';
import { Waterafvoer } from '../../../../models/waterafvoer';
import { NbAuthService } from '@nebular/auth';
import { Slokkers } from '../../../../models/slokkers';
import {AngularFireStorage} from "@angular/fire/compat/storage";

@Component({
  selector: 'ngx-products-add',
  templateUrl: './project-add-excel.component.html',
  styleUrls: [
    './project-add-excel.component.scss',
    '../../styles/project-view.scss',
  ],
})
export class ProjectAddExcelComponent implements OnInit {
  public currentProject: Project;
  public isLoaded: boolean = false;
  public hasPreviousPage: boolean = false;
  public latitude: number;
  public longitude: number;
  nextVolgNummer: number = 0;
  public _id: string;
  public index: number;
  public group: Group;
  public imagePath;
  public imagePath2;
  infoForm: UntypedFormGroup;
  dwaForm: UntypedFormGroup;
  rwaForm: UntypedFormGroup;

  gietIjzerDWA: boolean;
  gietIjzerRWA: boolean;
  imageChangedEvent: any = '';
  selectedPhoto = false;
  imageChangedEvent2: any = '';
  selectedPhoto2 = false;
  chosenImageList: any[] = [];
  chosenImageList2: any[] = [];
  buisTypes = ['Gres', 'PVC', 'PP'];
  buisArray = [
    'onbekend',
    'T-Buis',
    'T-Stuk',
    'Y-Stuk',
    'flexibele aansluiting',
    'aanboring',
  ];
  public company;
  public companyId;
  isAnderPutjeDWA: boolean;
  isAnderPutjeRWA: boolean;
  isAndereLiggingDWA: boolean = false;
  isAndereLiggingRWA: boolean = false;
  isSaving: boolean = false;
  buisTypesRWA = ['PVC', 'PP'];

  hasChangedMateriaalBuisDWA: boolean = false;
  hasChangedDiameterBuisDWA: boolean = false;
  hasChangedMateriaalBuisRWA: boolean = false;
  hasChangedDiameterBuisRWA: boolean = false;
  isAndereDiameterDWA: boolean = false;
  isAndereDiameterRWA: boolean = false;
  isAndereDiameterDWAAchter: boolean = false;
  isAndereDiameterRWAAchter: boolean = false;
  slokkerForm: UntypedFormGroup;
  currentSlokkerProject: SlokkerProjects;
  constructor(
    private formBuilder: UntypedFormBuilder,
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    private formService: FormService,
    private toastrService: NbToastrService,
    private storage: AngularFireStorage,
    private authService: NbAuthService,
  ) {}

  async ngOnInit(): Promise<void> {
    this.loadData();
  }

  Date(created: string) {
    return new Date(created).toLocaleDateString();
  }

  private loadData() {
      this.isAnderPutjeDWA = false;
      this.isAnderPutjeRWA = false;
      this.isAndereDiameterDWA = false;
      this.isAndereDiameterRWA = false;
      this.isAndereLiggingDWA = false;
      this.isAndereLiggingRWA = false;
      this.isSaving = false;
      this.currentProject = new Project();
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
      this.currentProject.droogWaterAfvoer.diameter = '125';
      this.currentProject.droogWaterAfvoer.diameterAchter = "125";
      this.currentProject.droogWaterAfvoer.gietijzer = true;
      this.gietIjzerDWA = true;
      this.gietIjzerRWA = true;
      this.currentProject.regenWaterAfvoer.gietijzer = true;
      this.currentProject.droogWaterAfvoer.diameterPut = 315;
      this.currentProject.droogWaterAfvoer.plaatsAansluiting = 180;
      this.currentProject.regenWaterAfvoer.plaatsAansluiting = 180;
      this.currentProject.regenWaterAfvoer.diameterPut = 250;
      this.currentProject.regenWaterAfvoer.diameter = '160';
      this.currentProject.regenWaterAfvoer.diameterAchter = "160";
      this.currentProject.regenWaterAfvoer.tussenIPLinks = 'R';
      this.currentProject.regenWaterAfvoer.tussenIPRechts = 'R';
      this.currentProject.droogWaterAfvoer.soortPutje = 'kunststof';
      this.currentProject.regenWaterAfvoer.soortPutje = 'kunststof';
      this.currentProject.droogWaterAfvoer.tBuisStuk = 'T-Stuk';
      this.currentProject.regenWaterAfvoer.tBuisStuk = 'aanboring';
      this.apiService
        .createGroup(this.formService.currentGroup)
        .subscribe(async (x) => {
          this.group = x as Group;
          while(this.apiService.thisCompany == null){
            await this.delay(50)
          }
          this.company = this.apiService.thisCompany;
          this.companyId = this.company._id;
          if (this.group._id == null) {
            this.group._id = this.group.id;
          }
          // @ts-ignore

          this.formService.currentGroup = this.group;
          this.currentProject.projectNr = this.group.rbProjectNr;
          this.currentProject.projectNaam = this.group.rbProjectNaam;
          this.currentProject.werfleider = this.group.aannemerWerfleider;
          this.currentProject.gemeente = this.group.rbGemeente;
          this.currentProject.startDate = null;
          this.currentProject.created = new Date().toString();
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
          this.currentSlokkerProject = new SlokkerProjects();
          this.currentSlokkerProject.photos = new Array(3).fill(null);
          this.currentSlokkerProject.slokker = slokker;
          this.infoForm = this.formBuilder.group({
            opmerking: this.currentProject.opmerking,
            putje: this.currentProject.putje,
          });
          this.dwaForm = this.formBuilder.group({
            buisType:
              this.currentProject.droogWaterAfvoer.buisType == null
                ? ''
                : this.currentProject.droogWaterAfvoer.buisType.toString(),
            buisVoorHor: this.currentProject.droogWaterAfvoer.buisVoorHor,
            buisVoorVert: this.currentProject.droogWaterAfvoer.buisVoorVert,
            buisAchter: this.currentProject.droogWaterAfvoer.buisAchter,
            bochtVoor: this.currentProject.droogWaterAfvoer.bochtVoor,
            bochtAchter: this.currentProject.droogWaterAfvoer.bochtAchter,
            YAchter: this.currentProject.droogWaterAfvoer.YAchter,
            reductieVoor: this.currentProject.droogWaterAfvoer.reductieVoor,
            reductieAchter: this.currentProject.droogWaterAfvoer.reductieAchter,
            tBuisStuk: this.currentProject.droogWaterAfvoer.tBuisStuk,
            ligging: this.currentProject.droogWaterAfvoer.ligging,
            diameter: this.currentProject.droogWaterAfvoer.diameter,
            afstandPutMof: this.currentProject.droogWaterAfvoer.afstandPutMof,
            terugslagklep: this.currentProject.droogWaterAfvoer.terugslagklep,
            diameterPut: this.currentProject.droogWaterAfvoer.diameterPut,
            diepteAansluitingWoning:
              this.currentProject.droogWaterAfvoer.diepteAansluitingWoning,
            tussenIPLinks: this.currentProject.droogWaterAfvoer.tussenIPLinks,
            tussenIPRechts: this.currentProject.droogWaterAfvoer.tussenIPRechts,
            diepteRioleringHA:
              this.currentProject.droogWaterAfvoer.diepteRioleringHA,
            plaatsAansluiting:
              this.currentProject.droogWaterAfvoer.plaatsAansluiting == null
                ? ''
                : this.currentProject.droogWaterAfvoer.plaatsAansluiting.toString(),
            letterHor:
              this.currentProject.droogWaterAfvoer.letterHor == null
                ? ''
                : this.currentProject.droogWaterAfvoer.letterHor,
            putHor: this.currentProject.droogWaterAfvoer.putHor,
            letterVer:
              this.currentProject.droogWaterAfvoer.letterVer == null
                ? ''
                : this.currentProject.droogWaterAfvoer.letterVer,
            putVer: this.currentProject.droogWaterAfvoer.putVer,
            mof: this.currentProject.droogWaterAfvoer.mof,
            krimpmof: this.currentProject.droogWaterAfvoer.krimpmof,
            gietijzer: this.currentProject.droogWaterAfvoer.gietijzer,
            betonkader: this.currentProject.droogWaterAfvoer.betonkader,
            alukader: this.currentProject.droogWaterAfvoer.alukader,
            koppelstuk: this.currentProject.droogWaterAfvoer.koppelstuk,
            stop: this.currentProject.droogWaterAfvoer.stop,
            andere: this.currentProject.droogWaterAfvoer.andere,
            soortPutje: this.currentProject.droogWaterAfvoer.soortPutje,
            anderPutje: this.currentProject.droogWaterAfvoer.anderPutje,
            liggingAndere: this.currentProject.droogWaterAfvoer.liggingAndere,
            diameterAndere: this.currentProject.droogWaterAfvoer.diameterAndere,
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
            bochtVoor: this.currentProject.regenWaterAfvoer.bochtVoor,
            bochtAchter: this.currentProject.regenWaterAfvoer.bochtAchter,
            YAchter: this.currentProject.regenWaterAfvoer.YAchter,
            reductieVoor: this.currentProject.regenWaterAfvoer.reductieVoor,
            reductieAchter: this.currentProject.regenWaterAfvoer.reductieAchter,
            tBuisStuk:
              this.currentProject.regenWaterAfvoer.tBuisStuk == null
                ? ''
                : this.currentProject.regenWaterAfvoer.tBuisStuk.toString(),
            ligging:
              this.currentProject.regenWaterAfvoer.ligging == null
                ? ''
                : this.currentProject.regenWaterAfvoer.ligging,
            diameter: this.currentProject.regenWaterAfvoer.diameter,
            afstandPutMof: this.currentProject.regenWaterAfvoer.afstandPutMof,
            terugslagklep: this.currentProject.regenWaterAfvoer.terugslagklep,
            gietijzer: this.currentProject.regenWaterAfvoer.gietijzer,
            betonkader: this.currentProject.regenWaterAfvoer.betonkader,
            alukader: this.currentProject.regenWaterAfvoer.alukader,
            diameterPut: this.currentProject.regenWaterAfvoer.diameterPut,
            diepteAansluitingWoning:
              this.currentProject.regenWaterAfvoer.diepteAansluitingWoning,
            tussenIPLinks: this.currentProject.regenWaterAfvoer.tussenIPLinks,
            tussenIPRechts: this.currentProject.regenWaterAfvoer.tussenIPRechts,
            diepteRioleringHA:
              this.currentProject.regenWaterAfvoer.diepteRioleringHA,
            plaatsAansluiting:
              this.currentProject.regenWaterAfvoer.plaatsAansluiting == null
                ? ''
                : this.currentProject.regenWaterAfvoer.plaatsAansluiting.toString(),
            letterHor:
              this.currentProject.regenWaterAfvoer.letterHor == null
                ? ''
                : this.currentProject.regenWaterAfvoer.letterHor.toString(),
            putHor: this.currentProject.regenWaterAfvoer.putHor,
            letterVer:
              this.currentProject.regenWaterAfvoer.letterVer == null
                ? ''
                : this.currentProject.regenWaterAfvoer.letterVer.toString(),
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
            isPP: this.currentProject.regenWaterAfvoer.isPP,
            liggingAndere: this.currentProject.regenWaterAfvoer.liggingAndere,
            diameterAndere: this.currentProject.regenWaterAfvoer.diameterAndere,
            diameterAchter: this.currentProject.regenWaterAfvoer.diameterAchter ,
            buisTypeAchter: this.currentProject.regenWaterAfvoer.buisTypeAchter,
            diameterAchterAndere: this.currentProject.regenWaterAfvoer.diameterAchterAndere,
            tPutje: this.currentProject.regenWaterAfvoer.tPutje
          });
          this.slokkerForm = this.formBuilder.group({
            opmerking: this.currentSlokkerProject.opmerking,
            buis: this.currentSlokkerProject.slokker.buis,
            bocht: this.currentSlokkerProject.slokker.bocht,
            reductie: this.currentSlokkerProject.slokker.reductie,
            Y: this.currentSlokkerProject.slokker.Y,
            tussenIPLinks: this.currentSlokkerProject.slokker.tussenIPLinks,
            tussenIPRechts: this.currentSlokkerProject.slokker.tussenIPRechts,
            afstandPutMof: this.currentSlokkerProject.slokker.afstandPutMof,
            diepteAansluitingMv: this.currentSlokkerProject.slokker.diepteAansluitingMv,
            diepteAanboringRiool: this.currentSlokkerProject.slokker.diepteAanboringRiool,
            mof: this.currentSlokkerProject.slokker.mof,
            krimpmof: this.currentSlokkerProject.slokker.krimpmof,
            koppelstuk: this.currentSlokkerProject.slokker.koppelstuk,
            stop: this.currentSlokkerProject.slokker.stop,
            andere: this.currentSlokkerProject.slokker.andere,
            buisType: 'PVC',
            infiltratieKlok: this.currentSlokkerProject.slokker.infiltratieKlok,
            aansluitingOpengracht: this.currentSlokkerProject.slokker.aansluitingOpengracht,
            plaatsAansluiting: this.currentSlokkerProject.slokker.plaatsAansluiting,
            diameter: this.currentSlokkerProject.slokker.diameter,
            tBuisStuk: this.currentSlokkerProject.slokker.tBuisStuk
          });
          this.isLoaded = true;
        });
  }
  goToPrevious() {
    const reverseArray = this.formService.previousPage.reverse();
    this.formService.PreloadProject = null;
    this.router.navigate([reverseArray[0]]);
  }

  delay(timeInMillis: number): Promise<void> {
    return new Promise((resolve) => setTimeout(() => resolve(), timeInMillis));
  }


  async onSubmitInfo() {
    if(this.isSaving)return;
    this.isSaving = true;
    this.toastrService.success(
      'Het project en aansluitingen worden aangemaakt, dit kan even duren',
      'Even geduld',
      { duration: 5000 },
    );
    const infoForm = this.infoForm.value as Project;
    this.formService.currentGroup.heeftPloegen = infoForm.heeftPloegen;
    let excelProjects = this.formService.currentProjects;
    for (let project of excelProjects) {
      project.company_id = this.companyId;
      project.group_id = this.group;
      project.opmerking = infoForm.opmerking;
      project.photosDWA = [null, null, null, null, null];
      project.photosRWA = [null, null, null, null, null];
      // DWA
      const data = this.dwaForm.value;
      project.droogWaterAfvoer = new Waterafvoer();
      project.droogWaterAfvoer.buisType = data.buisType;
      project.droogWaterAfvoer.buisVoorHor = data.buisVoorHor;
      project.droogWaterAfvoer.buisVoorVert = data.buisVoorVert;
      project.droogWaterAfvoer.buisAchter = data.buisAchter;
      project.droogWaterAfvoer.bochtVoor = data.bochtVoor;
      project.droogWaterAfvoer.bochtAchter = data.bochtAchter;
      project.droogWaterAfvoer.YAchter = data.YAchter;
      project.droogWaterAfvoer.reductieVoor = data.reductieVoor;
      project.droogWaterAfvoer.reductieAchter = data.reductieAchter;
      project.droogWaterAfvoer.tBuisStuk = data.tBuisStuk;
      project.droogWaterAfvoer.ligging = data.ligging;
      project.droogWaterAfvoer.diameter = data.diameter;
      project.droogWaterAfvoer.afstandPutMof = data.afstandPutMof;
      project.droogWaterAfvoer.terugslagklep = data.terugslagklep;
      project.droogWaterAfvoer.diameterPut = data.diameterPut;
      project.droogWaterAfvoer.diepteAansluitingWoning =
        data.diepteAansluitingWoning;
      project.droogWaterAfvoer.tussenIPLinks = data.tussenIPLinks;
      project.droogWaterAfvoer.tussenIPRechts = data.tussenIPRechts;
      project.droogWaterAfvoer.diepteRioleringHA = data.diepteRioleringHA;
      project.droogWaterAfvoer.plaatsAansluiting = data.plaatsAansluiting;
      project.droogWaterAfvoer.letterHor = data.letterHor;
      project.droogWaterAfvoer.putHor = data.putHor;
      project.droogWaterAfvoer.letterVer = data.letterVer;
      project.droogWaterAfvoer.putVer = data.putVer;
      project.droogWaterAfvoer.mof = data.mof;
      project.droogWaterAfvoer.krimpmof = data.krimpmof;
      project.droogWaterAfvoer.alukader = data.alukader;
      project.droogWaterAfvoer.betonkader = data.betonkader;
      project.droogWaterAfvoer.koppelstuk = data.koppelstuk;
      project.droogWaterAfvoer.koppelstuk = data.koppelstuk;
      project.droogWaterAfvoer.stop = data.stop;
      project.droogWaterAfvoer.andere = data.andere;
      project.droogWaterAfvoer.xCoord = data.xCoord;
      project.droogWaterAfvoer.yCoord = data.yCoord;
      project.droogWaterAfvoer.zCoord = data.zCoord;
      project.droogWaterAfvoer.gietijzer = data.gietijzer;
      project.droogWaterAfvoer.betonkader = data.betonkader;
      project.droogWaterAfvoer.alukader = data.alukader;
      project.droogWaterAfvoer.soortPutje = data.soortPutje;
      project.droogWaterAfvoer.buisTypeAchter = data.buisTypeAchter;
      project.droogWaterAfvoer.diameterAchter = data.diameterAchter;
      project.droogWaterAfvoer.sifonPutje = data.sifonPutje;
      project.droogWaterAfvoer.tPutje = data.tPutje;
      if(data.soortPutje === 'andere'){
        project.droogWaterAfvoer.anderPutje = data.anderPutje;
      } else {
        project.droogWaterAfvoer.anderPutje = '';
      }
      if(data.diameter === 'andere'){
        project.droogWaterAfvoer.diameterAndere = data.diameterAndere;
      } else {
        project.droogWaterAfvoer.diameterAndere = '';
      }
      if(data.ligging === 'andere'){
        project.droogWaterAfvoer.liggingAndere = data.liggingAndere;
      } else {
        project.droogWaterAfvoer.liggingAndere = '';
      }
      if(project.droogWaterAfvoer.gietijzer === true){
        project.droogWaterAfvoer.alukader = false;
      }
      if (project.droogWaterAfvoer.diameterAchter === 'andere') {
        project.droogWaterAfvoer.diameterAchterAndere = data.diameterAchterAndere;
      }
      // RWA
      const data2 = this.rwaForm.value;
      project.regenWaterAfvoer = new Waterafvoer();
      project.regenWaterAfvoer.buisVoorHor = data2.buisVoorHor;
      project.regenWaterAfvoer.buisVoorVert = data2.buisVoorVert;
      project.regenWaterAfvoer.buisAchter = data2.buisAchter;
      project.regenWaterAfvoer.bochtVoor = data2.bochtVoor;
      project.regenWaterAfvoer.bochtAchter = data2.bochtAchter;
      project.regenWaterAfvoer.YAchter = data2.YAchter;
      project.regenWaterAfvoer.reductieVoor = data2.reductieVoor;
      project.regenWaterAfvoer.reductieAchter = data2.reductieAchter;
      project.regenWaterAfvoer.tBuisStuk = data2.tBuisStuk;
      project.regenWaterAfvoer.ligging = data2.ligging;
      project.regenWaterAfvoer.diameter = data2.diameter;
      project.regenWaterAfvoer.afstandPutMof = data2.afstandPutMof;
      project.regenWaterAfvoer.terugslagklep = data2.terugslagklep;
      project.regenWaterAfvoer.diameterPut = data2.diameterPut;
      project.regenWaterAfvoer.diepteAansluitingWoning =
        data2.diepteAansluitingWoning;
      project.regenWaterAfvoer.tussenIPLinks = data2.tussenIPLinks;
      project.regenWaterAfvoer.tussenIPRechts = data2.tussenIPRechts;
      project.regenWaterAfvoer.diepteRioleringHA = data2.diepteRioleringHA;
      project.regenWaterAfvoer.plaatsAansluiting = data2.plaatsAansluiting;
      project.regenWaterAfvoer.letterHor = data2.letterHor;
      project.regenWaterAfvoer.putHor = data2.putHor;
      project.regenWaterAfvoer.letterVer = data2.letterVer;
      project.regenWaterAfvoer.putVer = data2.putVer;
      project.regenWaterAfvoer.mof = data2.mof;
      project.regenWaterAfvoer.krimpmof = data2.krimpmof;
      project.regenWaterAfvoer.gietijzer = data2.gietijzer;
      project.regenWaterAfvoer.betonkader = data2.betonkader;
      project.regenWaterAfvoer.alukader = data2.alukader;
      project.regenWaterAfvoer.koppelstuk = data2.koppelstuk;
      project.regenWaterAfvoer.stop = data2.stop;
      project.regenWaterAfvoer.andere = data2.andere;
      project.regenWaterAfvoer.alukader = data2.alukader;
      project.regenWaterAfvoer.betonkader = data2.betonkader;
      project.regenWaterAfvoer.koppelstuk = data2.koppelstuk;
      project.regenWaterAfvoer.xCoord = data2.xCoord;
      project.regenWaterAfvoer.yCoord = data2.yCoord;
      project.regenWaterAfvoer.zCoord = data2.zCoord;
      project.regenWaterAfvoer.infilPutje = data2.infilPutje;
      project.regenWaterAfvoer.aanslBovRWA = data2.aanslBovRWA;
      project.regenWaterAfvoer.aanslOpenRWA = data2.aanslOpenRWA;
      project.regenWaterAfvoer.putje = data2.putje;
      project.regenWaterAfvoer.isPP = data2.isPP;
      project.regenWaterAfvoer.soortPutje = data2.soortPutje;
      project.regenWaterAfvoer.buisType = data2.buisType;
      project.regenWaterAfvoer.buisTypeAchter = data2.buisTypeAchter;
      project.regenWaterAfvoer.diameterAchter = data2.diameterAchter;
      project.regenWaterAfvoer.tPutje = data2.tPutje;
      if(data2.soortPutje === 'andere'){
        project.regenWaterAfvoer.anderPutje = data2.anderPutje;
      } else {
        project.regenWaterAfvoer.anderPutje = '';
      }
      if(data2.diameter === 'andere'){
        project.regenWaterAfvoer.diameterAndere = data2.diameterAndere;
      } else {
        project.regenWaterAfvoer.diameterAndere = '';
      }
      if(data2.ligging === 'andere'){
        project.regenWaterAfvoer.liggingAndere = data2.liggingAndere;
      } else {
        project.regenWaterAfvoer.liggingAndere = '';
      }
      if(project.regenWaterAfvoer.gietijzer === true){
        project.regenWaterAfvoer.alukader = false;
      }
      if (project.regenWaterAfvoer.diameterAchter === 'andere') {
        project.regenWaterAfvoer.diameterAchterAndere = data2.diameterAchterAndere;
      }
    }

    //wachtaansluitingen
    for (let project of this.formService.currentWachtAansluitingen) {
      project.company_id = this.companyId;
      project.group_id = this.group;
      project.opmerking = infoForm.opmerking;
      project.photosDWA = [null, null, null, null, null];
      project.photosRWA = [null, null, null, null, null];
      // DWA
      const data = this.dwaForm.value;
      project.droogWaterAfvoer = new Waterafvoer();
      project.droogWaterAfvoer.buisType = data.buisType;
      project.droogWaterAfvoer.buisVoorHor = data.buisVoorHor;
      project.droogWaterAfvoer.buisVoorVert = data.buisVoorVert;
      project.droogWaterAfvoer.buisAchter = data.buisAchter;
      project.droogWaterAfvoer.bochtVoor = data.bochtVoor;
      project.droogWaterAfvoer.bochtAchter = data.bochtAchter;
      project.droogWaterAfvoer.YAchter = data.YAchter;
      project.droogWaterAfvoer.reductieVoor = data.reductieVoor;
      project.droogWaterAfvoer.reductieAchter = data.reductieAchter;
      project.droogWaterAfvoer.tBuisStuk = data.tBuisStuk;
      project.droogWaterAfvoer.ligging = data.ligging;
      project.droogWaterAfvoer.diameter = data.diameter;
      project.droogWaterAfvoer.afstandPutMof = data.afstandPutMof;
      project.droogWaterAfvoer.terugslagklep = data.terugslagklep;
      project.droogWaterAfvoer.diameterPut = data.diameterPut;
      project.droogWaterAfvoer.diepteAansluitingWoning =
        data.diepteAansluitingWoning;
      project.droogWaterAfvoer.tussenIPLinks = data.tussenIPLinks;
      project.droogWaterAfvoer.tussenIPRechts = data.tussenIPRechts;
      project.droogWaterAfvoer.diepteRioleringHA = data.diepteRioleringHA;
      project.droogWaterAfvoer.plaatsAansluiting = data.plaatsAansluiting;
      project.droogWaterAfvoer.letterHor = data.letterHor;
      project.droogWaterAfvoer.putHor = data.putHor;
      project.droogWaterAfvoer.letterVer = data.letterVer;
      project.droogWaterAfvoer.putVer = data.putVer;
      project.droogWaterAfvoer.mof = data.mof;
      project.droogWaterAfvoer.krimpmof = data.krimpmof;
      project.droogWaterAfvoer.alukader = data.alukader;
      project.droogWaterAfvoer.betonkader = data.betonkader;
      project.droogWaterAfvoer.koppelstuk = data.koppelstuk;
      project.droogWaterAfvoer.koppelstuk = data.koppelstuk;
      project.droogWaterAfvoer.stop = data.stop;
      project.droogWaterAfvoer.andere = data.andere;
      project.droogWaterAfvoer.xCoord = data.xCoord;
      project.droogWaterAfvoer.yCoord = data.yCoord;
      project.droogWaterAfvoer.zCoord = data.zCoord;
      project.droogWaterAfvoer.gietijzer = data.gietijzer;
      project.droogWaterAfvoer.betonkader = data.betonkader;
      project.droogWaterAfvoer.alukader = data.alukader;
      project.droogWaterAfvoer.soortPutje = data.soortPutje;
      project.droogWaterAfvoer.isWachtaansluiting = true;
      project.droogWaterAfvoer.buisTypeAchter = data.buisTypeAchter;
      project.droogWaterAfvoer.diameterAchter = data.diameterAchter;
      project.droogWaterAfvoer.sifonPutje = data.sifonPutje;
      project.droogWaterAfvoer.tPutje = data.tPutje;

      if(data.soortPutje === 'andere'){
        project.droogWaterAfvoer.anderPutje = data.anderPutje;
      } else {
        project.droogWaterAfvoer.anderPutje = '';
      }
      if(data.diameter === 'andere'){
        project.droogWaterAfvoer.diameterAndere = data.diameterAndere;
      } else {
        project.droogWaterAfvoer.diameterAndere = '';
      }
      if(data.ligging === 'andere'){
        project.droogWaterAfvoer.liggingAndere = data.liggingAndere;
      } else {
        project.droogWaterAfvoer.liggingAndere = '';
      }
      if(project.droogWaterAfvoer.gietijzer === true){
        project.droogWaterAfvoer.alukader = false;
      }
      if (project.droogWaterAfvoer.diameterAchter === 'andere') {
        project.droogWaterAfvoer.diameterAchterAndere = data.diameterAchterAndere;
      }

      // RWA
      const data2 = this.rwaForm.value;
      project.regenWaterAfvoer = new Waterafvoer();
      project.regenWaterAfvoer.buisVoorHor = data2.buisVoorHor;
      project.regenWaterAfvoer.buisVoorVert = data2.buisVoorVert;
      project.regenWaterAfvoer.buisAchter = data2.buisAchter;
      project.regenWaterAfvoer.bochtVoor = data2.bochtVoor;
      project.regenWaterAfvoer.bochtAchter = data2.bochtAchter;
      project.regenWaterAfvoer.YAchter = data2.YAchter;
      project.regenWaterAfvoer.reductieVoor = data2.reductieVoor;
      project.regenWaterAfvoer.reductieAchter = data2.reductieAchter;
      project.regenWaterAfvoer.tBuisStuk = data2.tBuisStuk;
      project.regenWaterAfvoer.ligging = data2.ligging;
      project.regenWaterAfvoer.diameter = data2.diameter;
      project.regenWaterAfvoer.afstandPutMof = data2.afstandPutMof;
      project.regenWaterAfvoer.terugslagklep = data2.terugslagklep;
      project.regenWaterAfvoer.diameterPut = data2.diameterPut;
      project.regenWaterAfvoer.diepteAansluitingWoning =
        data2.diepteAansluitingWoning;
      project.regenWaterAfvoer.tussenIPLinks = data2.tussenIPLinks;
      project.regenWaterAfvoer.tussenIPRechts = data2.tussenIPRechts;
      project.regenWaterAfvoer.diepteRioleringHA = data2.diepteRioleringHA;
      project.regenWaterAfvoer.plaatsAansluiting = data2.plaatsAansluiting;
      project.regenWaterAfvoer.letterHor = data2.letterHor;
      project.regenWaterAfvoer.putHor = data2.putHor;
      project.regenWaterAfvoer.letterVer = data2.letterVer;
      project.regenWaterAfvoer.putVer = data2.putVer;
      project.regenWaterAfvoer.mof = data2.mof;
      project.regenWaterAfvoer.krimpmof = data2.krimpmof;
      project.regenWaterAfvoer.gietijzer = data2.gietijzer;
      project.regenWaterAfvoer.betonkader = data2.betonkader;
      project.regenWaterAfvoer.alukader = data2.alukader;
      project.regenWaterAfvoer.koppelstuk = data2.koppelstuk;
      project.regenWaterAfvoer.stop = data2.stop;
      project.regenWaterAfvoer.andere = data2.andere;
      project.regenWaterAfvoer.alukader = data2.alukader;
      project.regenWaterAfvoer.betonkader = data2.betonkader;
      project.regenWaterAfvoer.koppelstuk = data2.koppelstuk;
      project.regenWaterAfvoer.xCoord = data2.xCoord;
      project.regenWaterAfvoer.yCoord = data2.yCoord;
      project.regenWaterAfvoer.zCoord = data2.zCoord;
      project.regenWaterAfvoer.infilPutje = data2.infilPutje;
      project.regenWaterAfvoer.aanslBovRWA = data2.aanslBovRWA;
      project.regenWaterAfvoer.aanslOpenRWA = data2.aanslOpenRWA;
      project.regenWaterAfvoer.isPP = data2.isPP;
      project.regenWaterAfvoer.soortPutje = data2.soortPutje;
      project.regenWaterAfvoer.isWachtaansluiting = true;
      project.regenWaterAfvoer.buisType = data2.buisType;
      project.regenWaterAfvoer.buisTypeAchter = data2.buisTypeAchter;
      project.regenWaterAfvoer.diameterAchter = data2.diameterAchter;
      project.regenWaterAfvoer.tPutje = data2.tPutje;
      if(data2.soortPutje === 'andere'){
        project.regenWaterAfvoer.anderPutje = data2.anderPutje;
      } else {
        project.regenWaterAfvoer.anderPutje = '';
      }
      if(data2.diameter === 'andere'){
        project.regenWaterAfvoer.diameterAndere = data2.diameterAndere;
      } else {
        project.regenWaterAfvoer.diameterAndere = '';
      }
      if(data2.ligging === 'andere'){
        project.regenWaterAfvoer.liggingAndere = data2.liggingAndere;
      } else {
        project.regenWaterAfvoer.liggingAndere = '';
      }
      if(project.regenWaterAfvoer.gietijzer === true){
        project.regenWaterAfvoer.alukader = false;
      }
      if (project.regenWaterAfvoer.diameterAchter === 'andere') {
        project.regenWaterAfvoer.diameterAchterAndere = data2.diameterAchterAndere;
      }
      excelProjects.push(project);
    }
    for(let slokkerProject of this.formService.currentSlokkerProjects){
      slokkerProject.company_id = this.companyId;
      slokkerProject.group_id = this.group;
      slokkerProject.huisNr = '';
      slokkerProject.opmerking = infoForm.opmerking;
      slokkerProject.photos = [null, null, null];
      const data = this.slokkerForm.value;
      slokkerProject.slokker = new Slokkers();
      slokkerProject.slokker.buis = data.buis;
      slokkerProject.slokker.bocht = data.bocht;
      slokkerProject.slokker.reductie = data.reductie;
      slokkerProject.slokker.Y = data.Y;
      slokkerProject.slokker.tussenIPLinks = data.tussenIPLinks;
      slokkerProject.slokker.tussenIPRechts = data.tussenIPRechts;
      slokkerProject.slokker.afstandPutMof = data.afstandPutMof;
      slokkerProject.slokker.diepteAansluitingMv = data.diepteAansluitingMv;
      slokkerProject.slokker.diepteAanboringRiool = data.diepteAanboringRiool;
      slokkerProject.slokker.mof = data.mof;
      slokkerProject.slokker.krimpmof = data.krimpmof;
      slokkerProject.slokker.koppelstuk = data.koppelstuk;
      slokkerProject.slokker.stop = data.stop;
      slokkerProject.slokker.andere = data.andere;
      slokkerProject.slokker.buisType = data.buisType;
      slokkerProject.slokker.infiltratieKlok = data.infiltratieKlok;
      slokkerProject.slokker.aansluitingOpengracht = data.aansluitingOpengracht;
      slokkerProject.slokker.plaatsAansluiting = data.plaatsAansluiting;
      slokkerProject.slokker.diameter = data.diameter;
      slokkerProject.slokker.tBuisStuk = data.tBuisStuk;
    }
    this.apiService
      .createMultipleProjectsExcel(excelProjects, this.formService.currentSlokkerProjects, this.formService.currentGroup)
      .subscribe((x) => {
        this.isSaving = false;
        this.toastrService.success(
          'Het project en de aansluitingen zijn aangemaakt!',
          'Succes!',
        );
        this.formService.isComingFromCreateGroup = true;
        this.router.navigate([
          '/pages/settings-variable',
          this.formService.currentGroup._id,
        ]);
      }, error => {
        this.isSaving = false;
        this.toastrService.danger('Er is iets misgegaan, probeer opnieuw', 'Fout');
      });
  }
  editGietijzerDWA() {
    if (this.gietIjzerDWA) {
      this.gietIjzerDWA = false;
    } else {
      this.gietIjzerDWA = true;
    }
  }
  editGietijzerRWA() {
    if (this.gietIjzerRWA) {
      this.gietIjzerRWA = false;
    } else {
      this.gietIjzerRWA = true;
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
}

