import { Component, OnInit, ElementRef, ViewChild, Inject, OnDestroy, Directive, HostListener } from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {FormArray, UntypedFormBuilder, UntypedFormGroup} from '@angular/forms';
import {Project} from '../../../../models/project';
import {FormService} from '../../../../services/form.service';
import {ApiService} from '../../../../services/api.service';
import {NbToastrService} from '@nebular/theme';
import { Company } from 'models/company';
import { finalize } from 'rxjs/operators';
import {User} from "../../../../models/user";
import {Group} from "../../../../models/groups";
import {ProjectViewDialogComponent} from "../project-view/project-view-dialog/project-view-dialog.component";
import {ProjectLastworkerDialogConfirmComponent} from "./project-lastworker-dialog-confirm/project-lastworker-dialog-confirm.component";
import { GoogleMapsLocatiePopupComponent } from '../../googleMapsLocatiePopup/googleMapsLocatiePopup.component';
import {AngularFireStorage} from "@angular/fire/compat/storage";
import { MatDialog } from '@angular/material/dialog';



@Component({
  selector: 'ngx-products-edit',
  templateUrl: './project-edit.component.html',
  styleUrls: [
    './project-edit.component.scss',
    '../../styles/project-view.scss',
  ],
})
export class ProjectEditComponent implements OnInit,OnDestroy {
  public currentProject: Project;
  public isLoaded: boolean = false;
  public hasPreviousPage: boolean = false;
  public latitude: number;
  public longitude: number;
  public _id: string;
  public index: number;
  public group: Group;
  public imagePath;

  selectedPhoto2 = false;
  imageChangedEvent2: any = '';
  public imagePath2;
  heeftPloegen: boolean;
  infoForm: UntypedFormGroup;
  dwaForm: UntypedFormGroup;
  rwaForm: UntypedFormGroup;
  uploadForm: UntypedFormGroup;

  imageChangedEvent: any = '';
  selectedPhoto = false;
  userr: any;

  chosenImageList: any[] = [];
  chosenImageListIndex: number [] = [];

  chosenImageList2: any[] = [];
  chosenImageList2Index: number[] = [];
  newDate: Date;
  inDrukMofDwa: boolean = false;
  inDrukMofRwa: boolean = false;
  putSoorten = ['onbekend', 'open sleuf', 'onderdoor', 'BSS', 'asfalt', 'beton'];
  putKaders = ['onbekend', 'Beton', 'Aluminium'];
  buisTypes = ['Gres', 'PVC', 'PP'];
  buisArray = ['onbekend', 'inDrukMof', 'T-Buis', 'T-Stuk'];
  isFotoRWA: boolean = false;
  isFotoDWA: boolean = false;
  public totalProjectCount: number;
  public isFirst: boolean = false;
  public isLast: boolean = false;
  private lastProjects: Project[] = [];
  public company: Company;
  public companyId;
  public ploegBazen: User[] = [];

  public projectEditedByGronwderker: boolean;
  gietIjzerDWA: boolean;
  gietIjzerRWA: boolean;
  datepicker: any;
  isAnderPutjeDWA: boolean = false;
  isAnderPutjeRWA: boolean = false;
  usersWhoEdited: string;
  isAndereLiggingDWA: boolean = false;
  isAndereLiggingRWA: boolean = false;
  buisTypesRWA = ['PVC', 'PP'];
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
    private dialog: MatDialog
  ) {
    route.params.subscribe((val) => {
      this.isLoaded = false;
      if (this.formService.lastProjects.length === 0) {
        this.hasPreviousPage = false;
      } else {
        this.hasPreviousPage = true;
      }
      this.usersWhoEdited = '';
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
    const index = this.lastProjects.findIndex((x) => x._id === this._id);
    if (index !== 0) {
      const project = this.lastProjects[index - 1];
      if (!project.isMeerwerk) {
        if (project.isSlokker == null || project.isSlokker === false) {
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
      if (!project.isMeerwerk) {
        if (project.isSlokker == null || project.isSlokker === false) {
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
    this.newDate = null;
    this.projectEditedByGronwderker = false;
    this.chosenImageList = [];
    this.chosenImageList2 = [];
    this.chosenImageListIndex = [];
    this.chosenImageList2Index = [];
    this.apiService.getProjectById(this._id).subscribe(async (x) => {
      this.currentProject = x as Project;
      this.ploegBazen = this.currentProject.usersWhoEdited;
      while (this.apiService.thisCompany == null) {
        await this.delay(50)
      }
      this.company = this.apiService.thisCompany;
      this.companyId = this.company._id;
      if (this.currentProject.lastWorkerDate != null) {
        let timeBetweenLastEdit = Math.floor((new Date().getTime() - new Date(this.currentProject.lastWorkerDate).getTime()) / (1000 * 60 * 60));
        if (timeBetweenLastEdit < 8) {
          this.formService.workerHours = timeBetweenLastEdit;
          this.formService.workerName = this.currentProject.lastWorker.name;
          this.projectEditedByGronwderker = true;
        }

      }

      if (this.currentProject.startDate != null) {
        this.currentProject.startDate = new Date(this.currentProject.startDate);
      }
      if (this.currentProject.afgewerktDatum != null) {
        this.currentProject.afgewerktDatum = new Date(this.currentProject.afgewerktDatum);
      }
      this.gietIjzerDWA = this.currentProject.droogWaterAfvoer.gietijzer;
      this.gietIjzerRWA = this.currentProject.regenWaterAfvoer.gietijzer;

      this.group = this.currentProject.group_id;
      this.heeftPloegen = this.group.heeftPloegen;
      this.uploadForm = this.formBuilder.group({
        file: [''],
        file2: ['']
      });
      if (this.currentProject.droogWaterAfvoer.soortPutje === 'andere') {
        this.isAnderPutjeDWA = true;
      } else {
        this.isAnderPutjeDWA = false;
      }
      if (this.currentProject.regenWaterAfvoer.soortPutje === 'andere') {
        this.isAnderPutjeRWA = true;
      } else {
        this.isAnderPutjeRWA = false;
      }
      if (this.currentProject.droogWaterAfvoer.diameter === 'andere') {
        this.isAndereDiameterDWA = true;
      } else {
        this.isAndereDiameterDWA = false;
      }
      if (this.currentProject.regenWaterAfvoer.diameter === 'andere') {
        this.isAndereDiameterRWA = true;
      } else {
        this.isAndereDiameterRWA = false;
      }
      if (this.currentProject.droogWaterAfvoer.diameterAchter === 'andere') {
        this.isAndereDiameterDWAAchter = true;
      } else {
        this.isAndereDiameterDWAAchter = false;
      }
      if (this.currentProject.regenWaterAfvoer.diameterAchter === 'andere') {
        this.isAndereDiameterRWAAchter = true;
      } else {
        this.isAndereDiameterRWAAchter = false;
      }
      if (this.currentProject.droogWaterAfvoer.ligging === 'andere') {
        this.isAndereLiggingDWA = true;
      } else {
        this.isAndereLiggingDWA = false;
      }
      if (this.currentProject.regenWaterAfvoer.ligging === 'andere') {
        this.isAndereLiggingRWA = true;
      } else {
        this.isAndereLiggingRWA = false;
      }
      this.infoForm = this.formBuilder.group({
        street: this.currentProject.street,
        huisNr: this.currentProject.huisNr,
        opmerking: this.currentProject.opmerking,
        finished: this.currentProject.finished,
        index: this.currentProject.index,
        naamFiche: this.currentProject.naamFiche,
        equipNrRiolering: this.currentProject.equipNrRiolering,
        isGemengd: this.currentProject.isGemengd,
        usersWhoEdited: [this.currentProject.usersWhoEdited],
        startDate:  this.currentProject.startDate,
        afgewerktDatum: this.currentProject.afgewerktDatum
      });

        this.dwaForm = this.formBuilder.group({
          buisType: this.currentProject.droogWaterAfvoer.buisType == null ? '' : this.currentProject.droogWaterAfvoer.buisType.toString(),
          buisVoorHor: this.currentProject.droogWaterAfvoer.buisVoorHor,
          buisVoorVert: this.currentProject.droogWaterAfvoer.buisVoorVert,
          buisVoorHor2: this.currentProject.droogWaterAfvoer.buisVoorHor2,
          buisVoorVert2: this.currentProject.droogWaterAfvoer.buisVoorVert2,
          buisAchter: this.currentProject.droogWaterAfvoer.buisAchter,
          bochtVoor: this.group.bochtenInGraden ? null : this.currentProject.droogWaterAfvoer.bochtVoor,
          bochtVoor2: this.group.bochtenInGraden ? null : this.currentProject.droogWaterAfvoer.bochtVoor2,
          bochtAchter:  this.group.bochtenInGraden ? null : this.currentProject.droogWaterAfvoer.bochtAchter,
          gradenBochtVoor45: !this.group.bochtenInGraden ? null : this.currentProject.droogWaterAfvoer.gradenBochtVoor45,
          gradenBochtVoor90:  !this.group.bochtenInGraden ? null : this.currentProject.droogWaterAfvoer.gradenBochtVoor90,
          gradenBocht2Voor45: !this.group.bochtenInGraden ? null : this.currentProject.droogWaterAfvoer.gradenBocht2Voor45,
          gradenBocht2Voor90:  !this.group.bochtenInGraden ? null : this.currentProject.droogWaterAfvoer.gradenBocht2Voor90,
          gradenBochtAchter45: !this.group.bochtenInGraden ? null : this.currentProject.droogWaterAfvoer.gradenBochtAchter45,
          gradenBochtAchter90:  !this.group.bochtenInGraden ? null : this.currentProject.droogWaterAfvoer.gradenBochtAchter90,
          YAchter: this.currentProject.droogWaterAfvoer.YAchter,
          reductieVoor: this.currentProject.droogWaterAfvoer.reductieVoor,
          reductieVoor2: this.currentProject.droogWaterAfvoer.reductieVoor2,
          reductieAchter: this.currentProject.droogWaterAfvoer.reductieAchter,
          tBuisStuk: this.currentProject.droogWaterAfvoer.tBuisStuk,
          ligging: this.currentProject.droogWaterAfvoer.ligging,
          diameter: this.currentProject.droogWaterAfvoer.diameter,
          afstandPutMof: this.currentProject.droogWaterAfvoer.afstandPutMof,
          terugslagklep: this.currentProject.droogWaterAfvoer.terugslagklep,
          diameterPut: this.currentProject.droogWaterAfvoer.diameterPut,
          gietijzer: this.currentProject.droogWaterAfvoer.gietijzer,
          betonkader: this.currentProject.droogWaterAfvoer.betonkader,
          alukader: this.currentProject.droogWaterAfvoer.alukader,
          diepteAansluitingWoning: this.currentProject.droogWaterAfvoer.diepteAansluitingWoning,
          tussenIPLinks: this.currentProject.droogWaterAfvoer.tussenIPLinks,
          tussenIPRechts: this.currentProject.droogWaterAfvoer.tussenIPRechts,
          diepteRioleringHA: this.currentProject.droogWaterAfvoer.diepteRioleringHA,
          plaatsAansluiting: this.currentProject.droogWaterAfvoer.plaatsAansluiting == null ? '' : this.currentProject.droogWaterAfvoer.plaatsAansluiting.toString(),
          letterHor: this.currentProject.droogWaterAfvoer.letterHor == null ? '' : this.currentProject.droogWaterAfvoer.letterHor,
          putHor: this.currentProject.droogWaterAfvoer.putHor,
          letterVer: this.currentProject.droogWaterAfvoer.letterVer == null ? '' : this.currentProject.droogWaterAfvoer.letterVer,
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
          isWachtaansluiting: this.currentProject.droogWaterAfvoer.isWachtaansluiting == null ? this.currentProject.isWachtAansluiting : this.currentProject.droogWaterAfvoer.isWachtaansluiting,
          diameterAchter: this.currentProject.droogWaterAfvoer.diameterAchter == null ? this.currentProject.droogWaterAfvoer.diameter == null ? '' : this.currentProject.droogWaterAfvoer.diameter : this.currentProject.droogWaterAfvoer.diameterAchter,
          buisTypeAchter: this.currentProject.droogWaterAfvoer.buisTypeAchter == null ? this.currentProject.droogWaterAfvoer.buisType == null ? '' : this.currentProject.droogWaterAfvoer.buisType.toString() : this.currentProject.droogWaterAfvoer.buisTypeAchter,
          diameterAchterAndere: this.currentProject.droogWaterAfvoer.diameterAchterAndere == null ? this.currentProject.droogWaterAfvoer.diameter == null ? '' : this.currentProject.droogWaterAfvoer.diameter : this.currentProject.droogWaterAfvoer.diameterAchterAndere,
          sifonPutje: this.currentProject.droogWaterAfvoer.sifonPutje,
          tPutje: this.currentProject.droogWaterAfvoer.tPutje
        });

        this.rwaForm = this.formBuilder.group({
          buisType: this.currentProject.regenWaterAfvoer.buisType,
          buisVoorHor: this.currentProject.regenWaterAfvoer.buisVoorHor,
          buisVoorVert: this.currentProject.regenWaterAfvoer.buisVoorVert,
          buisVoorHor2: this.currentProject.regenWaterAfvoer.buisVoorHor2,
          buisVoorVert2: this.currentProject.regenWaterAfvoer.buisVoorVert2,
          buisAchter: this.currentProject.regenWaterAfvoer.buisAchter,
          bochtVoor: this.group.bochtenInGraden ? null : this.currentProject.regenWaterAfvoer.bochtVoor,
          bochtVoor2: this.group.bochtenInGraden ? null : this.currentProject.regenWaterAfvoer.bochtVoor2,
          bochtAchter:  this.group.bochtenInGraden ? null : this.currentProject.regenWaterAfvoer.bochtAchter,
          gradenBochtVoor45: !this.group.bochtenInGraden ? null : this.currentProject.regenWaterAfvoer.gradenBochtVoor45,
          gradenBochtVoor90:  !this.group.bochtenInGraden ? null : this.currentProject.regenWaterAfvoer.gradenBochtVoor90,
          gradenBocht2Voor45: !this.group.bochtenInGraden ? null : this.currentProject.regenWaterAfvoer.gradenBocht2Voor45,
          gradenBocht2Voor90:  !this.group.bochtenInGraden ? null : this.currentProject.regenWaterAfvoer.gradenBocht2Voor90,
          gradenBochtAchter45: !this.group.bochtenInGraden ? null : this.currentProject.regenWaterAfvoer.gradenBochtAchter45,
          gradenBochtAchter90:  !this.group.bochtenInGraden ? null : this.currentProject.regenWaterAfvoer.gradenBochtAchter90,
          YAchter: this.currentProject.regenWaterAfvoer.YAchter,
          reductieVoor: this.currentProject.regenWaterAfvoer.reductieVoor,
          reductieVoor2: this.currentProject.regenWaterAfvoer.reductieVoor2,
          reductieAchter: this.currentProject.regenWaterAfvoer.reductieAchter,
          tBuisStuk: this.currentProject.regenWaterAfvoer.tBuisStuk == null ? '' : this.currentProject.regenWaterAfvoer.tBuisStuk.toString(),
          ligging: this.currentProject.regenWaterAfvoer.ligging == null ? '' : this.currentProject.regenWaterAfvoer.ligging,
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
          gietijzer: this.currentProject.regenWaterAfvoer.gietijzer,
          betonkader: this.currentProject.regenWaterAfvoer.betonkader,
          alukader: this.currentProject.regenWaterAfvoer.alukader,
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
          isWachtaansluiting: this.currentProject.regenWaterAfvoer.isWachtaansluiting == null ? this.currentProject.isWachtAansluiting : this.currentProject.regenWaterAfvoer.isWachtaansluiting,
          diameterAchter: this.currentProject.regenWaterAfvoer.diameterAchter == null ? this.currentProject.regenWaterAfvoer.diameter == null ? '' : this.currentProject.regenWaterAfvoer.diameter : this.currentProject.regenWaterAfvoer.diameterAchter,
          buisTypeAchter: this.currentProject.regenWaterAfvoer.buisTypeAchter == null ? this.currentProject.regenWaterAfvoer.buisType == null ? '' : this.currentProject.regenWaterAfvoer.buisType.toString() : this.currentProject.regenWaterAfvoer.buisTypeAchter,
          diameterAchterAndere: this.currentProject.regenWaterAfvoer.diameterAchterAndere == null ? this.currentProject.regenWaterAfvoer.diameter == null ? '' : this.currentProject.regenWaterAfvoer.diameter : this.currentProject.regenWaterAfvoer.diameterAchterAndere,
          tPutje: this.currentProject.regenWaterAfvoer.tPutje
        });

      if (this.currentProject.photosDWA == null) {
        this.currentProject.photosDWA = [null, null, null, null, null];
      }
      if (this.currentProject.photosRWA == null) {
        this.currentProject.photosRWA = [null, null, null, null, null];
      }
      if (this.currentProject.photosDWA != null && this.currentProject.photosDWA.length !== 7) {
        this.currentProject.photosDWA[this.currentProject.photosDWA.length] = null;
      }
      if (this.currentProject.photosRWA != null && this.currentProject.photosRWA.length !== 7) {
        this.currentProject.photosRWA[this.currentProject.photosRWA.length] = null;
      }
      this.isLoaded = true;

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
      const indexer = this.lastProjects.findIndex((x) => x._id === this._id);
      this.index = indexer;
      this.totalProjectCount = this.lastProjects?.length;

      if (indexer === 0 || indexer === -1) {
        this.isFirst = true;
      } else {
        this.isFirst = false;
      }

      if (
        indexer + 1 === this.formService.lastProjects.length ||
        this.formService.lastProjects.length === 1 ||
        this.formService.lastProjects.length === 0
      ) {
        this.isLast = true;
      } else {
        this.isLast = false;
      }
      this.isLoaded = true;
    });
  }

  goToPrevious() {
    this.formService.previousIndex = this.index;
    this.router.navigate(['/pages/groupview', this.group._id]);
  }

  NullToZero(number) {
    if (number == null) {
      return 0;
    } else {
      return number;
    }
  }

  async onSubmitInfo() {
    const infoForm = this.infoForm.value as Project;
    this.currentProject.street = infoForm.street;
    this.currentProject.huisNr = infoForm.huisNr;
    this.currentProject.opmerking = infoForm.opmerking;
    this.currentProject.isWachtAansluiting = null;
    this.currentProject.startDate = infoForm.startDate;
    this.currentProject.usersWhoEdited = infoForm.usersWhoEdited;
    this.currentProject.finished = infoForm.finished;
    this.currentProject.naamFiche = infoForm.naamFiche;
    this.currentProject.equipNrRiolering = infoForm.equipNrRiolering;
    this.currentProject.isGemengd = infoForm.isGemengd;
    this.currentProject.afgewerktDatum = infoForm.afgewerktDatum;

    // DWA
    const data = this.dwaForm.value;
    this.currentProject.droogWaterAfvoer.buisType = data.buisType;
    this.currentProject.droogWaterAfvoer.buisVoorHor = data.buisVoorHor;
    this.currentProject.droogWaterAfvoer.buisVoorVert = data.buisVoorVert;
    this.currentProject.droogWaterAfvoer.reductieVoor = data.reductieVoor;
      this.currentProject.droogWaterAfvoer.buisVoorHor2 = data.buisVoorHor2;
      this.currentProject.droogWaterAfvoer.buisVoorVert2 = data.buisVoorVert2;
      this.currentProject.droogWaterAfvoer.reductieVoor2 = data.reductieVoor2;
    if(!this.group.bochtenInGraden) {
      this.currentProject.droogWaterAfvoer.bochtVoor = data.bochtVoor;
      this.currentProject.droogWaterAfvoer.bochtVoor2 = data.bochtVoor2;
      this.currentProject.droogWaterAfvoer.bochtAchter = data.bochtAchter;
    } else {
      this.currentProject.droogWaterAfvoer.gradenBochtVoor45 = data.gradenBochtVoor45;
      this.currentProject.droogWaterAfvoer.gradenBochtVoor90 = data.gradenBochtVoor90;
      this.currentProject.droogWaterAfvoer.gradenBocht2Voor45 = data.gradenBocht2Voor45;
      this.currentProject.droogWaterAfvoer.gradenBocht2Voor90 = data.gradenBocht2Voor90;
      this.currentProject.droogWaterAfvoer.gradenBochtAchter45 = data.gradenBochtAchter45;
      this.currentProject.droogWaterAfvoer.gradenBochtAchter90 = data.gradenBochtAchter90;
    }
      this.currentProject.droogWaterAfvoer.buisAchter = data.buisAchter;
    this.currentProject.droogWaterAfvoer.YAchter = data.YAchter;
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
    this.currentProject.droogWaterAfvoer.diameterPut = data.diameterPut;
    this.currentProject.droogWaterAfvoer.diepteRioleringHA = data.diepteRioleringHA;
    this.currentProject.droogWaterAfvoer.gietijzer = data.gietijzer;
    this.currentProject.droogWaterAfvoer.alukader = data.alukader;
    this.currentProject.droogWaterAfvoer.betonkader = data.betonkader;
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
    if (data.soortPutje === 'andere') {
      this.currentProject.droogWaterAfvoer.anderPutje = data.anderPutje;
    } else {
      this.currentProject.droogWaterAfvoer.anderPutje = '';
    }
    if (data.diameter === 'andere') {
      this.currentProject.droogWaterAfvoer.diameterAndere = data.diameterAndere;
    } else {
      this.currentProject.droogWaterAfvoer.diameterAndere = '';
    }
    if (data.ligging === 'andere') {
      this.currentProject.droogWaterAfvoer.liggingAndere = data.liggingAndere;
    } else {
      this.currentProject.droogWaterAfvoer.liggingAndere = '';
    }
    if (this.currentProject.droogWaterAfvoer.gietijzer === true) {
      this.currentProject.droogWaterAfvoer.alukader = false;
    }
    if (this.currentProject.droogWaterAfvoer.diameterAchter === 'andere') {
      this.currentProject.droogWaterAfvoer.diameterAchterAndere = data.diameterAchterAndere;
    }
    // RWA
    const data2 = this.rwaForm.value;
    this.currentProject.regenWaterAfvoer.buisVoorHor = data2.buisVoorHor;
    this.currentProject.regenWaterAfvoer.buisVoorVert = data2.buisVoorVert;
    this.currentProject.regenWaterAfvoer.reductieVoor = data2.reductieVoor;
    this.currentProject.regenWaterAfvoer.buisVoorHor2 = data2.buisVoorHor2;
    this.currentProject.regenWaterAfvoer.buisVoorVert2 = data2.buisVoorVert2;
    this.currentProject.regenWaterAfvoer.reductieVoor2 = data2.reductieVoor2;
    if(!this.group.bochtenInGraden) {
      this.currentProject.regenWaterAfvoer.bochtVoor = data2.bochtVoor;
      this.currentProject.regenWaterAfvoer.bochtVoor2 = data2.bochtVoor2;
      this.currentProject.regenWaterAfvoer.bochtAchter = data2.bochtAchter;
    } else {
      this.currentProject.regenWaterAfvoer.gradenBochtVoor45 = data2.gradenBochtVoor45;
      this.currentProject.regenWaterAfvoer.gradenBochtVoor90 = data2.gradenBochtVoor90;
      this.currentProject.regenWaterAfvoer.gradenBocht2Voor45 = data2.gradenBocht2Voor45;
      this.currentProject.regenWaterAfvoer.gradenBocht2Voor90 = data2.gradenBocht2Voor90;
      this.currentProject.regenWaterAfvoer.gradenBochtAchter45 = data2.gradenBochtAchter45;
      this.currentProject.regenWaterAfvoer.gradenBochtAchter90 = data2.gradenBochtAchter90;
    }
    this.currentProject.regenWaterAfvoer.buisAchter = data2.buisAchter;
    this.currentProject.regenWaterAfvoer.YAchter = data2.YAchter;
    this.currentProject.regenWaterAfvoer.reductieAchter = data2.reductieAchter;
    this.currentProject.regenWaterAfvoer.tBuisStuk = data2.tBuisStuk;
    this.currentProject.regenWaterAfvoer.ligging = data2.ligging;
    this.currentProject.regenWaterAfvoer.diameter = data2.diameter;
    this.currentProject.regenWaterAfvoer.afstandPutMof = data2.afstandPutMof;
    this.currentProject.regenWaterAfvoer.terugslagklep = data2.terugslagklep;
    this.currentProject.regenWaterAfvoer.diameterPut = data2.diameterPut;
    this.currentProject.regenWaterAfvoer.diepteAansluitingWoning = data2.diepteAansluitingWoning;
    this.currentProject.regenWaterAfvoer.tussenIPLinks = data2.tussenIPLinks;
    this.currentProject.regenWaterAfvoer.tussenIPRechts = data2.tussenIPRechts;
    this.currentProject.regenWaterAfvoer.diepteRioleringHA = data2.diepteRioleringHA;
    this.currentProject.regenWaterAfvoer.plaatsAansluiting = data2.plaatsAansluiting;
    this.currentProject.regenWaterAfvoer.letterHor = data2.letterHor;
    this.currentProject.regenWaterAfvoer.diameterPut = data2.diameterPut;
    this.currentProject.regenWaterAfvoer.putHor = data2.putHor;
    this.currentProject.regenWaterAfvoer.letterVer = data2.letterVer;
    this.currentProject.regenWaterAfvoer.putVer = data2.putVer;
    this.currentProject.regenWaterAfvoer.mof = data2.mof;
    this.currentProject.regenWaterAfvoer.krimpmof = data2.krimpmof;
    this.currentProject.regenWaterAfvoer.gietijzer = data2.gietijzer;
    this.currentProject.regenWaterAfvoer.alukader = data2.alukader;
    this.currentProject.regenWaterAfvoer.betonkader = data2.betonkader;
    this.currentProject.regenWaterAfvoer.koppelstuk = data2.koppelstuk;
    this.currentProject.regenWaterAfvoer.stop = data2.stop;
    this.currentProject.regenWaterAfvoer.andere = data2.andere;
    this.currentProject.regenWaterAfvoer.xCoord = data2.xCoord;
    this.currentProject.regenWaterAfvoer.yCoord = data2.yCoord;
    this.currentProject.regenWaterAfvoer.zCoord = data2.zCoord;
    this.currentProject.regenWaterAfvoer.infilPutje = data2.infilPutje;
    this.currentProject.regenWaterAfvoer.aanslBovRWA = data2.aanslBovRWA;
    this.currentProject.regenWaterAfvoer.aanslOpenRWA = data2.aanslOpenRWA;
    this.currentProject.regenWaterAfvoer.isPP = data2.isPP;
    this.currentProject.regenWaterAfvoer.soortPutje = data2.soortPutje;
    this.currentProject.regenWaterAfvoer.isWachtaansluiting = data2.isWachtaansluiting;
    this.currentProject.regenWaterAfvoer.buisTypeAchter = data2.buisTypeAchter;
    this.currentProject.regenWaterAfvoer.diameterAchter = data2.diameterAchter;
    this.currentProject.regenWaterAfvoer.buisType = data2.buisType;
    if (this.currentProject.regenWaterAfvoer.gietijzer === true) {
      this.currentProject.regenWaterAfvoer.alukader = false;
    }
    this.currentProject.regenWaterAfvoer.tPutje = data2.tPutje;
    if (data2.soortPutje === 'andere') {
      this.currentProject.regenWaterAfvoer.anderPutje = data2.anderPutje;
    } else {
      this.currentProject.regenWaterAfvoer.anderPutje = '';
    }
    if (data2.diameter === 'andere') {
      this.currentProject.regenWaterAfvoer.diameterAndere = data2.diameterAndere;
    } else {
      this.currentProject.regenWaterAfvoer.diameterAndere = '';
    }
    if (data2.ligging === 'andere') {
      this.currentProject.regenWaterAfvoer.liggingAndere = data2.liggingAndere;
    } else {
      this.currentProject.regenWaterAfvoer.liggingAndere = '';
    }
    if (this.currentProject.regenWaterAfvoer.diameterAchter === 'andere') {
      this.currentProject.regenWaterAfvoer.diameterAchterAndere = data2.diameterAchterAndere;
    }
    if (this.currentProject._id == null) {
      this.currentProject._id = this.currentProject.id;
    }
    if (this.currentProject.droogWaterAfvoer.isWachtaansluiting || this.currentProject.regenWaterAfvoer.isWachtaansluiting) {
      this.currentProject.index = infoForm.index;
    }
    if (this.currentProject.photosDWA[this.currentProject.photosDWA.length - 1] == null && this.currentProject.photosDWA.length > 5) {
      this.currentProject.photosDWA.splice(this.currentProject.photosDWA.length - 1, 1);
    }
    if (this.currentProject.photosDWA[this.currentProject.photosDWA.length - 1] == null && this.currentProject.photosDWA.length > 5) {
      this.currentProject.photosDWA.splice(this.currentProject.photosDWA.length - 1, 1);
    }
    if (this.currentProject.photosRWA[this.currentProject.photosRWA.length - 1] == null && this.currentProject.photosRWA.length > 5) {
      this.currentProject.photosRWA.splice(this.currentProject.photosRWA.length - 1, 1);
    }
    if (this.currentProject.photosRWA[this.currentProject.photosRWA.length - 1] == null && this.currentProject.photosRWA.length > 5) {
      this.currentProject.photosRWA.splice(this.currentProject.photosRWA.length - 1, 1);
    }
    this.apiService.getProjectById(this._id).subscribe(async (x) => {
      const tempProject = x as Project;
      if (this.chosenImageList.length === 0 && this.chosenImageList2.length === 0) {
        if (tempProject.lastWorkerDate != null) {
          let timeBetweenLastEdit = Math.floor((new Date().getTime() - new Date(tempProject.lastWorkerDate).getTime()) / (1000 * 60 * 60));
          if (timeBetweenLastEdit < 8) {
            this.formService.workerHours = timeBetweenLastEdit;
            this.formService.workerName = tempProject.lastWorker.name;
            this.formService.currentProject = this.currentProject;
            let dialogRef = this.dialog.open(ProjectLastworkerDialogConfirmComponent, {
              height: '220px',
              width: '37vw',
            });
            dialogRef.afterClosed().subscribe(() => {
              if (this.formService.isUpdated) {
                this.chosenImageList = [];
                this.chosenImageList2 = [];
                this.chosenImageListIndex = [];
                this.chosenImageList2Index = [];
                if (this.newDate != null) {
                  this.newDate = null;
                }
              }
            });
          } else {
            await this.apiService.updateProject(this.currentProject).subscribe(async () => {
              this.toastrService.success('De aansluiting is gewijzigd', 'Succes!');
              this.chosenImageList = [];
              this.chosenImageList2 = [];
              this.chosenImageListIndex = [];
              this.chosenImageList2Index = [];
              if (this.newDate != null) {
                this.newDate = null;
              }
            });
          }
        } else {
          await this.apiService.updateProject(this.currentProject).subscribe(async () => {
            this.toastrService.success('De aansluiting is gewijzigd', 'Succes!');
            this.chosenImageList = [];
            this.chosenImageList2 = [];
            this.chosenImageListIndex = [];
            this.chosenImageList2Index = [];
            if (this.newDate != null) {
              this.newDate = null;
            }
          });
        }
      } else {
        await this.uploadImages();
      }
    });

  }


  generateRandomName(): string {
    const random = Math.floor(100000000 + Math.random() * 900000);
    const name = 'fotos/' + this.companyId + '/' + random;
    return name;
  }

  NullToString(check) {
    if (check == null || check === 0) {
      return '';
    } else {
      return check;
    }
  }


  onFileSelect2(event, i: number) {          //RWA
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
      if (this.currentProject.photosRWA != null && i > 4 && this.currentProject.photosRWA.length < 7) {
        this.currentProject.photosRWA[this.currentProject.photosRWA.length] = null;
      }
      this.isFotoRWA = true;
    };
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
      if (this.currentProject.photosDWA != null && i > 4 && this.currentProject.photosDWA.length < 7) {
        this.currentProject.photosDWA[this.currentProject.photosDWA.length] = null;
      }
      this.isFotoDWA = true;
    };
  }

  async uploadImages() {

    const fileToUpload = this.uploadForm.get('file').value;

    // this.toastrService.show('Foto is aan het uploaden.', 'Even geduld!');
    if (this.chosenImageList.length === 0 && this.chosenImageList2.length !== 0) {  //RWA
      let counter = 0;
      for (let j = 0; j < this.chosenImageList2.length; j++) {
        const fileRef2 = this.storage.ref(this.generateRandomName());
        const task2 = fileRef2.putString(this.chosenImageList2[j], 'data_url');

        task2
          .snapshotChanges()
          .pipe(
            finalize(() => {
              fileRef2.getDownloadURL().subscribe(async (url) => {
                if (url) {
                  if (this.currentProject.photosRWA == null) {
                    this.currentProject.photosRWA = [];
                  }
                  let index = this.chosenImageList2Index[j];
                  this.currentProject.photosRWA[index] = url;
                  counter++;
                  if (counter === this.chosenImageList2.length) {
                    this.apiService.getProjectById(this._id).subscribe(async (x) => {
                      const tempProject = x as Project;
                      if (tempProject.lastWorkerDate != null) {
                        let timeBetweenLastEdit = Math.floor((new Date().getTime() - new Date(tempProject.lastWorkerDate).getTime()) / (1000 * 60 * 60));
                        if (timeBetweenLastEdit < 8) {
                          this.formService.workerHours = timeBetweenLastEdit;
                          this.formService.workerName = tempProject.lastWorker.name;
                          this.formService.currentProject = this.currentProject;
                          let dialogRef = this.dialog.open(ProjectLastworkerDialogConfirmComponent, {
                            height: '220px',
                            width: '37vw',
                          });
                          dialogRef.afterClosed().subscribe(() => {
                            if (this.formService.isUpdated) {
                              this.newDate = null;
                              this.chosenImageList = [];
                              this.chosenImageList2 = [];
                              this.chosenImageListIndex = [];
                              this.chosenImageList2Index = [];
                            }
                          });
                        } else {
                          await this.apiService.updateProject(this.currentProject).subscribe(async x => {
                            this.currentProject = null;
                            this.chosenImageList = [];
                            this.chosenImageList2 = [];
                            this.chosenImageListIndex = [];
                            this.chosenImageList2Index = [];
                            this.isFotoRWA = false;
                            this.isLoaded = false;
                            this.usersWhoEdited = '';
                            this.newDate = null;
                            this.toastrService.success('De aansluiting is gewijzigd', 'Succes!');
                            await this.delay(1000);
                            this.loadData();
                          });
                        }
                      } else {
                        await this.apiService.updateProject(this.currentProject).subscribe(async x => {
                          this.currentProject = null;
                          this.chosenImageList = [];
                          this.chosenImageList2 = [];
                          this.chosenImageListIndex = [];
                          this.chosenImageList2Index = [];
                          this.isFotoRWA = false;
                          this.newDate = null;
                          this.usersWhoEdited = '';
                          this.isLoaded = false;
                          this.toastrService.success('De aansluiting is gewijzigd', 'Succes!');
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
    } else if (this.chosenImageList2.length === 0 && this.chosenImageList.length !== 0) {  //DWA
      let counter = 0;
      for (let j = 0; j < this.chosenImageList.length; j++) {
        const fileRef2 = this.storage.ref(this.generateRandomName());
        const task2 = fileRef2.putString(this.chosenImageList[j], 'data_url');

        task2
          .snapshotChanges()
          .pipe(
            finalize(() => {
              fileRef2.getDownloadURL().subscribe(async (url2) => {
                if (url2) {
                  if (this.currentProject.photosDWA == null) {
                    this.currentProject.photosDWA = [];
                  }
                  let index = this.chosenImageListIndex[j];
                  this.currentProject.photosDWA[index] = url2;
                  counter++;
                  if (counter === this.chosenImageList.length) {
                    this.apiService.getProjectById(this._id).subscribe(async (x) => {
                      const tempProject = x as Project;
                      if (tempProject.lastWorkerDate != null) {
                        let timeBetweenLastEdit = Math.floor((new Date().getTime() - new Date(tempProject.lastWorkerDate).getTime()) / (1000 * 60 * 60));
                        if (timeBetweenLastEdit < 8) {
                          this.formService.workerHours = timeBetweenLastEdit;
                          this.formService.workerName = tempProject.lastWorker.name;
                          this.formService.currentProject = this.currentProject;
                          let dialogRef = this.dialog.open(ProjectLastworkerDialogConfirmComponent, {
                            height: '220px',
                            width: '37vw',
                          });
                          dialogRef.afterClosed().subscribe(() => {
                            if (this.formService.isUpdated) {
                              this.newDate = null;
                              this.chosenImageList = [];
                              this.chosenImageList2 = [];
                              this.chosenImageListIndex = [];
                              this.chosenImageList2Index = [];
                              this.newDate = null;
                            }
                          });
                        } else {
                          await this.apiService.updateProject(this.currentProject).subscribe(async () => {
                            this.currentProject = null;
                            this.chosenImageList = [];
                            this.chosenImageList2 = [];
                            this.chosenImageListIndex = [];
                            this.chosenImageList2Index = [];
                            this.isFotoDWA = false;
                            this.isLoaded = false;
                            this.newDate = null;
                            this.usersWhoEdited = '';
                            this.toastrService.success('De aansluiting is gewijzigd', 'Succes!');
                            await this.delay(1000);
                            this.loadData();
                          });
                        }
                      } else {
                        await this.apiService.updateProject(this.currentProject).subscribe(async () => {
                          this.currentProject = null;
                          this.chosenImageList = [];
                          this.chosenImageList2 = [];
                          this.chosenImageListIndex = [];
                          this.chosenImageList2Index = [];
                          this.isFotoDWA = false;
                          this.newDate = null;
                          this.usersWhoEdited = '';
                          this.isLoaded = false;
                          this.toastrService.success('De aansluiting is gewijzigd', 'Succes!');
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
    } else {       //DWA & RWA

      let counter1 = 0;
      for (let j = 0; j < this.chosenImageList.length; j++) {
        let fileRef = this.storage.ref(this.generateRandomName());
        let task = fileRef.putString(this.chosenImageList[j], 'data_url');

        task
          .snapshotChanges()
          .subscribe(() => {
              fileRef.getDownloadURL().subscribe(async (url) => {
                if (url) {
                  if (this.currentProject.photosDWA == null) {
                    this.currentProject.photosDWA = [];
                  }
                  let index = this.chosenImageListIndex[j];
                  this.currentProject.photosDWA[index] = url;
                  counter1++;
                  if (counter1 === this.chosenImageList.length) {
                    let counter2 = 0;
                    for (let k = 0; k < this.chosenImageList2.length; k++) {
                      let fileRef2 = this.storage.ref(this.generateRandomName());
                      let task2 = fileRef2.putString(this.chosenImageList2[k], 'data_url');

                      task2
                        .snapshotChanges()
                        .pipe(
                          finalize(() => {
                            fileRef2.getDownloadURL().subscribe(async (url2) => {
                              if (url2) {
                                if (this.currentProject.photosRWA == null) {
                                  this.currentProject.photosRWA = [];
                                }
                                let index2 = this.chosenImageList2Index[k];
                                this.currentProject.photosRWA[index2] = url2;
                                counter2++;
                                if (counter2 === this.chosenImageList2.length && this.chosenImageList.length === counter1) {
                                  this.apiService.getProjectById(this._id).subscribe(async (x) => {
                                    const tempProject = x as Project;
                                    if (tempProject.lastWorkerDate != null) {
                                      let timeBetweenLastEdit = Math.floor((new Date().getTime() - new Date(tempProject.lastWorkerDate).getTime()) / (1000 * 60 * 60));
                                      if (timeBetweenLastEdit < 8) {
                                        this.formService.workerHours = timeBetweenLastEdit;
                                        this.formService.workerName = tempProject.lastWorker.name;
                                        this.formService.currentProject = this.currentProject;
                                        let dialogRef = this.dialog.open(ProjectLastworkerDialogConfirmComponent, {
                                          height: '220px',
                                          width: '37vw',
                                        });
                                        dialogRef.afterClosed().subscribe(() => {
                                          if (this.formService.isUpdated) {
                                            this.newDate = null;
                                            this.chosenImageList = [];
                                            this.chosenImageList2 = [];
                                            this.chosenImageListIndex = [];
                                            this.chosenImageList2Index = [];
                                          }
                                        });
                                      } else {
                                        await this.apiService.updateProject(this.currentProject).subscribe(async x => {
                                          this.currentProject = null;
                                          this.chosenImageList = [];
                                          this.chosenImageList2 = [];
                                          this.isFotoDWA = false;
                                          this.isFotoRWA = false;
                                          this.isLoaded = false;
                                          this.newDate = null;
                                          this.usersWhoEdited = '';
                                          this.toastrService.success('De aansluiting is gewijzigd', 'Succes!');
                                          await this.delay(1000);
                                          this.loadData();
                                        });
                                      }
                                    } else {
                                      await this.apiService.updateProject(this.currentProject).subscribe(async x => {
                                        this.currentProject = null;
                                        this.chosenImageList = [];
                                        this.chosenImageList2 = [];
                                        this.isFotoDWA = false;
                                        this.isFotoRWA = false;
                                        this.isLoaded = false;
                                        this.newDate = null;
                                        this.usersWhoEdited = '';

                                        this.toastrService.success('De aansluiting is gewijzigd', 'Succes!');
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
                }
              });
            }
          )
      }


    }
  }

  imagePopUp(photo: string) {
    this.formService._chosenPhoto = photo;
    let dialogRef = this.dialog.open(ProjectViewDialogComponent, {
      height: '98vh',
      width: '37vw',
    });
  }

  goToView() {
    this.router.navigate(['/pages/projectview', this._id]);
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

  setVolgnummer(event: boolean) {
    if (event === true) {
      this.currentProject.isWachtAansluiting = true;
      this.currentProject.droogWaterAfvoer.isWachtaansluiting = true;
      this.currentProject.regenWaterAfvoer.isWachtaansluiting = true;
      this.dwaForm.get('isWachtaansluiting').setValue(true);
      this.rwaForm.get('isWachtaansluiting').setValue(true);
    } else if (event === false) {
      this.currentProject.isWachtAansluiting = false;
      this.currentProject.droogWaterAfvoer.isWachtaansluiting = false;
      this.currentProject.regenWaterAfvoer.isWachtaansluiting = false;
      this.dwaForm.get('isWachtaansluiting').setValue(false);
      this.rwaForm.get('isWachtaansluiting').setValue(false);
    }
  }

  delay(timeInMillis: number): Promise<void> {
    return new Promise((resolve) => setTimeout(() => resolve(), timeInMillis));
  }


  deleteFotoDwa(i: number) {
    let length = this.currentProject.photosDWA.length;
    this.currentProject.photosDWA[i] = null;
    for (let j = 0; j < length; j++) {
      if (this.currentProject.photosDWA[j] == null && j > 4) {
        this.currentProject.photosDWA.splice(j, 1);
        length--;
        j--;
      }
    }
    if (this.currentProject.photosDWA != null && this.currentProject.photosDWA.length >= 5 && this.currentProject.photosDWA.length < 7) {
      this.currentProject.photosDWA[this.currentProject.photosDWA.length] = null;
    }
  }
  clearDate() {
    this.infoForm.controls['startDate'].setValue(null);
  }
  deleteFotoRwa(i: number) {
    let length = this.currentProject.photosRWA.length;
    this.currentProject.photosRWA[i] = null;
    for (let j = 0; j < length; j++) {
      if (this.currentProject.photosRWA[j] == null && j > 4) {
        this.currentProject.photosRWA.splice(j, 1);
        length--;
        j--;
      }
    }
    if (this.currentProject.photosRWA != null && this.currentProject.photosRWA.length >= 5 && this.currentProject.photosRWA.length < 7) {
      this.currentProject.photosRWA[this.currentProject.photosRWA.length] = null;
    }
  }

  setDate(event) {
    if (event !== '') {
      this.newDate = new Date(event);
    } else if (event === '') {
      this.newDate = null;
    }
  }

  ngOnDestroy() {
    this.formService.previousIndex = this.index;
  }

  checkAndereDiameterDWA(event: any) {
    if (this.dwaForm.value.diameter === 'andere') {
      this.isAndereDiameterDWA = true;
    } else {
      this.isAndereDiameterDWA = false;
    }
  }

  checkAndereDiameterRWA(event: any) {
    if (this.rwaForm.value.diameter === 'andere') {
      this.isAndereDiameterRWA = true;
    } else {
      this.isAndereDiameterRWA = false;
    }
  }

  checkAndereDiameterDWAAchter(event: any) {
    if (event === 'andere') {
      this.isAndereDiameterDWAAchter = true;
    } else {
      this.isAndereDiameterDWAAchter = false;
    }
  }

  checkAndereDiameterRWAAchter(event: any) {
    if (event === 'andere') {
      this.isAndereDiameterRWAAchter = true;
    } else {
      this.isAndereDiameterRWAAchter = false;
    }
  }

  checkSoortDWA(event: any) {
    if (event === 'andere') {
      this.isAnderPutjeDWA = true;
    } else {
      this.isAnderPutjeDWA = false;
    }
  }

  checkSoortRWA(event: any) {
    if (event === 'andere') {
      this.isAnderPutjeRWA = true;
    } else {
      this.isAnderPutjeRWA = false;
    }
  }

  checkAndereLiggingDWA(event: any) {
    if (event === 'andere') {
      this.isAndereLiggingDWA = true;
    } else {
      this.isAndereLiggingDWA = false;
    }
  }

  checkAndereLiggingRWA(event: any) {
    if (event === 'andere') {
      this.isAndereLiggingRWA = true;
    } else {
      this.isAndereLiggingRWA = false;
    }
  }

  setWachtaansluiting($event: boolean, soort: string) {
    if (soort === 'dwa') {
      this.currentProject.droogWaterAfvoer.isWachtaansluiting = $event;
    } else {
      this.currentProject.regenWaterAfvoer.isWachtaansluiting = $event;
    }
    this.currentProject.isWachtAansluiting = null;
  }
  openMapDialog(xCoord: number, yCoord: number, soort: string): void {
    this.dialog.open(GoogleMapsLocatiePopupComponent, {
      data: { xCoord, yCoord , soort},
    });
  }

  changeAfgewerkt($event: boolean) {
    if($event === true){
      this.infoForm.controls['afgewerktDatum'].setValue(new Date());
    } else {
      this.infoForm.controls['afgewerktDatum'].setValue(null);
    }
  }

  clearAfgewerktDate() {
    this.infoForm.controls['afgewerktDatum'].setValue(null);
  }
}

