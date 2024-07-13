import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { Company } from 'models/company';
import { dwaSettings } from 'models/dwaSettings';
import { Group } from 'models/groups';
import { Postnumbers } from 'models/postnumbers';
import { rwaSettings } from 'models/rwaSettings';
import { SlokkerPostnumbers } from 'models/slokker-postnumbers';
import { slokkerSettings } from 'models/slokkerSettings';
import { ApiService } from 'services/api.service';
import { FormService } from 'services/form.service';
import { HasChangedPopupComponent } from '../../has-changed-popup/has-changed-popup.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'settings-variable',
  templateUrl: './settings-variable.component.html',
  styleUrls: ['./settings-variable.component.scss']
})
export class SettingsVariableComponent implements OnInit {

  dwaForm: UntypedFormGroup;
  rwaForm: UntypedFormGroup;
  slokkerForm: UntypedFormGroup;
  schademeldingForm: UntypedFormGroup;
  instellingenForm: UntypedFormGroup;
  isComingFromCreateGroup: boolean;

  isSaving: boolean = false;
  public isLoaded: boolean = false;
  _id: string;
  group: Group;
  company: Company;
  formcontrolCompany: Company;

  dwaValueChanged: boolean;
  rwaValueChanged: boolean;
  slokkerValueChanged: boolean;
  groupsWithSettings: Group[];
  bochtenInGraden: any;
  tempSelectedGroup: Group;
  constructor(
    private formBuilder: UntypedFormBuilder,
    private apiService: ApiService,
    private route: ActivatedRoute,
    private toastrService: NbToastrService,
    private formService: FormService,
    private router: Router,
    private dialog: MatDialog
  ) {
    route.params.subscribe((val) => {
      this._id = this.route.snapshot.paramMap.get('id');
      this.loadData();
    });
  }
     private loadData() {
    this.dwaValueChanged = false;
    this.rwaValueChanged = false;
    this.slokkerValueChanged = false;
    this.isSaving = false;
    this.isComingFromCreateGroup = this.formService.isComingFromCreateGroup;
    this.apiService.getGroupSettingsVariables().subscribe((x) => {
      this.groupsWithSettings = x as Group[];
    });
       this.apiService.getGroupById(this._id).subscribe((x) => {
         this.group = (x as unknown) as Group;
         if(this.group.dwaSettings == null){
           this.group.dwaSettings = new dwaSettings();
           this.buildEmptyFormDWA();
        } else {
           this.buildFormDWA();
         }
        if(this.group.rwaSettings == null){
           this.group.rwaSettings = new rwaSettings();
           this.buildEmptyFormRWA();
        } else {
          this.buildFormRWA();
         }
        if(this.group.slokkerSettings == null ){
          this.group.slokkerSettings = new slokkerSettings();
          this.buildEmptyFormSlokker();
       } else {
          this.buildFormSlokker();
        }
        this.buildSchademelding();
         if(this.group._id == null || this.group._id === ''){
           this.group._id =  this.group.id;
         }
         this.bochtenInGraden = this.group.bochtenInGraden;
         if(this.isComingFromCreateGroup){
           if(this.groupsWithSettings != null && this.groupsWithSettings.length > 1){
             this.bochtenInGraden =  this.groupsWithSettings[1].bochtenInGraden;
           } else {
             this.bochtenInGraden = true;
           }
         }
           this.isLoaded = true;
        this.dwaForm.valueChanges.subscribe(x => {
           this.dwaValueChanged = true;
        })
         this.rwaForm.valueChanges.subscribe(x => {
           this.rwaValueChanged = true;
         })
         this.slokkerForm.valueChanges.subscribe(x => {
           this.slokkerValueChanged = true;
         })
      });
     }


  ngOnInit(): void {
  }

  saveSettings() {
    if(this.isSaving)return;
    this.isSaving = true;
    let idDwa =  this.group.dwaSettings._id;
    let idRwa  = this.group.rwaSettings._id;
    let idSlokker = this.group.slokkerSettings._id;
    let sendGroup = Object.assign({}, this.group);
    if(this.dwaValueChanged === true){
      sendGroup.dwaSettings = this.dwaForm.value as dwaSettings;
      sendGroup.dwaSettings._id = idDwa;
      if(this.formService.currentGroup){
        this.formService.currentGroup.dwaSettings = sendGroup.dwaSettings;
      }
    } else {
      sendGroup.dwaSettings = undefined;
    }
    if(this.rwaValueChanged === true){
      sendGroup.rwaSettings = this.rwaForm.value as rwaSettings;
      sendGroup.rwaSettings._id = idRwa;
      if(this.formService.currentGroup){
        this.formService.currentGroup.rwaSettings = sendGroup.rwaSettings;
      }
    } else {
      sendGroup.rwaSettings = undefined;
    }
    if(this.slokkerValueChanged === true){
      sendGroup.slokkerSettings = this.slokkerForm.value as slokkerSettings;
      sendGroup.slokkerSettings._id = idSlokker;
      if(this.formService.currentGroup){
        this.formService.currentGroup.slokkerSettings = sendGroup.slokkerSettings;
      }
    } else {
      sendGroup.slokkerSettings = undefined;
    }

    sendGroup.bochtenInGraden = this.bochtenInGraden;
    sendGroup.gebruiktHerstellingBijSchademelding = this.schademeldingForm.value.gebruiktHerstellingBijSchademelding;
    sendGroup.gebruiktJurdischeInfoBijSchademelding = this.schademeldingForm.value.gebruiktJurdischeInfoBijSchademelding;
    if(this.formService.currentGroup){
      this.formService.currentGroup.gebruiktHerstellingBijSchademelding = sendGroup.gebruiktHerstellingBijSchademelding;
      this.formService.currentGroup.gebruiktJurdischeInfoBijSchademelding = sendGroup.gebruiktJurdischeInfoBijSchademelding;
    }

    sendGroup.dwaPostNumbers = undefined;
    sendGroup.rwaPostNumbers = undefined;
    sendGroup.slokkerPostNumbers = undefined;
    if(sendGroup._id == null || sendGroup._id === ''){
      sendGroup._id =  sendGroup.id;
    }
    this.apiService.updateSettings( sendGroup).subscribe(x => {
      this.dwaValueChanged = false;
      this.rwaValueChanged = false;
      this.slokkerValueChanged = false;
      this.isSaving = false;
      if(this.isComingFromCreateGroup){
        this.router.navigate(['/pages/groupview', sendGroup._id]);
      }
      this.toastrService.success( 'De gekozen invulvelden zijn gewijzigd.', 'Succes!');
    }, error => {
      this.isSaving = false;
      this.toastrService.warning('Er is iets misgelopen..Probeer het opnieuw', 'Oops!');
    });
  }
    private  buildFormSlokker(){
    this.slokkerForm = this.formBuilder.group({
      mof: this.group.slokkerSettings.mof,
      krimpmof: this.group.slokkerSettings.krimpmof,
      koppelstuk: this.group.slokkerSettings.koppelstuk,
       stop: this.group.slokkerSettings.stop,
       andere: this.group.slokkerSettings.andere,
      diepteAansluitingMv: this.group.slokkerSettings.diepteAansluitingMv,
       diepteAanboringRiool: this.group.slokkerSettings.diepteAanboringRiool,
      infiltratieKlok: this.group.slokkerSettings.infiltratieKlok,
      plaatsAansluiting: this.group.slokkerSettings.plaatsAansluiting
    });
   }

  private buildFormRWA() {
    this.rwaForm = this.formBuilder.group({
      diepteRioleringHA : this.group.rwaSettings.diepteRioleringHA,
       diepteAansluitingWoning: this.group.rwaSettings.diepteAansluitingWoning,
       plaatsAansluiting: this.group.rwaSettings.plaatsAansluiting,
      afstandPutMof: this.group.rwaSettings.afstandPutMof,
      terugSlagKlep: this.group.rwaSettings.terugSlagKlep,
      ssGrond: this.group.rwaSettings.ssGrond,
      mof: this.group.rwaSettings.mof,
      krimpMof: this.group.rwaSettings.krimpMof,
      koppelStuk: this.group.rwaSettings.koppelStuk,
      stop: this.group.rwaSettings.stop,
      andere: this.group.rwaSettings.andere,
      aanslBovRwa: this.group.rwaSettings.aanslBovRwa,
      infilPutje: this.group.rwaSettings.infilPutje,
      aanslOpenRwa: this.group.rwaSettings.aanslOpenRwa,
      tPutje: this.group.rwaSettings.tPutje != null && this.group.rwaSettings.tPutje === false? false : true,
    });
   }

  private buildFormDWA() {
    this.dwaForm = this.formBuilder.group({
      diepteRioleringHA : this.group.dwaSettings.diepteRioleringHA,
      diepteAansluitingWoning: this.group.dwaSettings.diepteAansluitingWoning,
      plaatsAansluiting: this.group.dwaSettings.plaatsAansluiting,
      afstandPutMof: this.group.dwaSettings.afstandPutMof,
      ssGrond: this.group.dwaSettings.ssGrond,
      mof: this.group.dwaSettings.mof,
      krimpMof: this.group.dwaSettings.krimpMof,
      koppelStuk: this.group.dwaSettings.koppelStuk,
      stop: this.group.dwaSettings.stop,
      andere: this.group.dwaSettings.andere,
      terugSlagKlep: this.group.dwaSettings.terugSlagKlep,
      sifonPutje: this.group.dwaSettings.sifonPutje != null && this.group.dwaSettings.sifonPutje === false? false : true,
      tPutje: this.group.dwaSettings.tPutje != null && this.group.dwaSettings.tPutje === false? false : true,
    });
  }

  //normaal komen ze niet in de empty forms!!
  private buildEmptyFormSlokker(){
    this.slokkerForm = this.formBuilder.group({
      mof: true,
      krimpmof: true,
      koppelstuk: true,
      stop: true,
      andere: true,
      diepteAansluitingMv: true,
      diepteAanboringRiool: true,
      infiltratieKlok: true,
      plaatsAansluiting: true
    });
  }
  goToPrevious() {
    this.checkChangedValue('/pages/groupview/' + this._id);
  }
  buildEmptyFormDWA() {
    this.dwaForm = this.formBuilder.group({
      diepteRioleringHA : true,
      diepteAansluitingWoning: true,
      plaatsAansluiting: true,
      afstandPutMof: true,
      ssGrond: true,
      mof: true,
      krimpMof: true,
      koppelStuk: true,
      stop: true,
      andere: true,
      terugSlagKlep: true,
      sifonPutje: true,
      tPutje: true,
    });
  }
  buildEmptyFormRWA() {
    this.rwaForm = this.formBuilder.group({
      diepteRioleringHA : true,
      diepteAansluitingWoning: true,
      plaatsAansluiting: true,
      afstandPutMof: true,
      terugSlagKlep: true,
      ssGrond: true,
      mof: true,
      krimpMof: true,
      koppelStuk: true,
      stop: true,
      andere: true,
      aanslBovRwa: true,
      infilPutje: true,
      aanslOpenRwa: true,
      tPutje: true,
    });
  }
  checkChangedValue(route: string){
    if(this.dwaValueChanged || this.rwaValueChanged || this.slokkerValueChanged){
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

  changeGroupVariableSettings($event: any) {
    this.tempSelectedGroup = this.groupsWithSettings.find(x => x.rbProjectNaam === $event);
    this.dwaValueChanged = true;
    this.rwaValueChanged = true;
    this.slokkerValueChanged = true;
    let dwaId = this.group.dwaSettings._id;
    let rwaId = this.group.rwaSettings._id;
    let slokkerId = this.group.slokkerSettings._id;
    let tempGroup = Object.assign({}, this.tempSelectedGroup);
    this.group.dwaSettings = tempGroup.dwaSettings;
    this.group.rwaSettings = tempGroup.rwaSettings;
    this.group.slokkerSettings = tempGroup.slokkerSettings;
    this.group.dwaSettings._id = dwaId;
    this.group.rwaSettings._id = rwaId;
    this.group.slokkerSettings._id = slokkerId;
    this.group.bochtenInGraden = tempGroup.bochtenInGraden;
    this.bochtenInGraden = tempGroup.bochtenInGraden;
    this.group.gebruiktHerstellingBijSchademelding = tempGroup.gebruiktHerstellingBijSchademelding == null ? true : tempGroup.gebruiktHerstellingBijSchademelding;
    this.group.gebruiktJurdischeInfoBijSchademelding = tempGroup.gebruiktJurdischeInfoBijSchademelding == null ? false : tempGroup.gebruiktJurdischeInfoBijSchademelding;


    this.buildFormDWA();
    this.buildFormRWA();
    this.buildFormSlokker();
    this.buildSchademelding();
  }

  private buildSchademelding() {
    this.schademeldingForm = this.formBuilder.group({
      gebruiktHerstellingBijSchademelding: this.group.gebruiktHerstellingBijSchademelding,
      gebruiktJurdischeInfoBijSchademelding: this.group.gebruiktJurdischeInfoBijSchademelding
    });
  }
}
