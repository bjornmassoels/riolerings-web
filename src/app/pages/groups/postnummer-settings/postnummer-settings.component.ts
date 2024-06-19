import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { UntypedFormBuilder, FormGroup, FormArray } from '@angular/forms';
import { NbToastrService } from '@nebular/theme';

import {ActivatedRoute, Router} from '@angular/router';
import {ApiService} from "../../../../services/api.service";
import {Company} from "../../../../models/company";
import {Group} from "../../../../models/groups";
import {Project} from "../../../../models/project";
import {map, startWith} from "rxjs/operators";
import {SlokkerPostnumbers} from "../../../../models/slokker-postnumbers";
import {Postnumbers} from "../../../../models/postnumbers";
import {FormService} from "../../../../services/form.service";


@Component({
  selector: 'ngx-categories-add',
  templateUrl: './postnummer-settings.html',
  styleUrls: ['../../styles/add-form.scss', './postnummer-settings.component.scss'],
})
export class PostnummerSettingsComponent implements OnInit {
  dwaForm;
  rwaForm;
  group: Group;
  slokkerForm;
  public isLoaded: boolean = false;
  _id: string;
  company: Company;

  isBuisVoorInvalid: boolean = false;
  isBochtVoorInvalid: boolean = false;
  isYVoorInvalid: boolean = false;
  isReductieVoorInvalid: boolean = false;
  isOpenSleufInvalid: boolean = false;
  isBSSInvalid: boolean = false;
  isAsfaltInvalid: boolean = false;
  isBetonPutInvalid: boolean = false;
  isOnderDoorInvalid: boolean = false;
  isBetonKaderInvalid: boolean = false;
  isAluKaderInvalid: boolean = false;
  isBuisAchterInvalid: boolean = false;
  isBochtAchterInvalid: boolean = false;
  isYAchterInvalid: boolean = false;
  isReductieAchterInvalid: boolean = false;
  hasPreviousPage: any;
  rwaId: string;
  dwaId: string;
  slokkerId: string;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private apiService: ApiService,
    private route: ActivatedRoute,
    private toastrService: NbToastrService,
    private formService: FormService,
    private router: Router
  ) {
    route.params.subscribe((val) => {
      this._id = this.route.snapshot.paramMap.get('id');
      this.loadData(this._id);
    });
  }
    private loadData(_id: string) {
      this.apiService.getGroupById(_id).subscribe((x) => {
        this.group = (x as unknown) as Group;
        if(this.group._id == null || this.group._id === ''){
          this.group._id = this.group.id;
        }
        if(this.group.dwaPostNumbers == null){
          this.apiService.addPostNumbersToGroup(this.group).subscribe(x => {
            this.group = (x as unknown) as Group;
            if(this.group._id == null || this.group._id === ''){
              this.group._id = this.group.id;
            }
            this.dwaId = this.group.dwaPostNumbers._id;
            this.rwaId = this.group.rwaPostNumbers._id;
            this.slokkerId = this.group.slokkerPostNumbers._id;
            this.buildFormDWA();
            this.buildFormRWA();
            this.buildFormSlokker();
            this.isLoaded = true;
          });
        } else {
          this.dwaId = this.group.dwaPostNumbers._id;
          this.rwaId = this.group.rwaPostNumbers._id;
          this.slokkerId = this.group.slokkerPostNumbers._id;
          this.buildFormDWA();
          this.buildFormRWA();
          this.buildFormSlokker();
          this.isLoaded = true;
        }
      });
    }

  private buildFormRWA() {
    this.rwaForm = this.formBuilder.group({
      mof: this.group.rwaPostNumbers.mof,
      indrukmof: this.group.rwaPostNumbers.indrukmof,
      tBuis: this.group.rwaPostNumbers.tBuis,
      tStuk: this.group.rwaPostNumbers.tStuk,
      yStuk: this.group.rwaPostNumbers.yStuk,
      buisVoorHorGres: this.group.rwaPostNumbers.buisVoorHorGres,
      buisVoorHorPVC: this.group.rwaPostNumbers.buisVoorHorPVC,
      buisVoorHorPP: this.group.rwaPostNumbers.buisVoorHorPP,
      buisVoorVertGres: this.group.rwaPostNumbers.buisVoorVertGres,
      buisVoorVertPVC: this.group.rwaPostNumbers.buisVoorVertPVC,
      buisVoorVertPP: this.group.rwaPostNumbers.buisVoorVertPP,
      bochtVoor: this.group.rwaPostNumbers.bochtVoor,
      reductieVoor: this.group.rwaPostNumbers.reductieVoor,
      gietIjzer: this.group.rwaPostNumbers.gietIjzer,
      betonKader: this.group.rwaPostNumbers.betonKader,
      aluKader: this.group.rwaPostNumbers.aluKader,
      buisAchterGres: this.group.rwaPostNumbers.buisAchterGres,
      buisAchterPVC: this.group.rwaPostNumbers.buisAchterPVC,
      buisAchterPP: this.group.rwaPostNumbers.buisAchterPP,
      bochtAchter: this.group.rwaPostNumbers.bochtAchter,
      YAchter: this.group.rwaPostNumbers.YAchter,
      reductieAchter: this.group.rwaPostNumbers.reductieAchter,
      funOmh: this.group.rwaPostNumbers.funOmh,
      flexAan: this.group.rwaPostNumbers.flexAan,
      kunststof: this.group.rwaPostNumbers.kunststof,
      pvcTStuk: this.group.rwaPostNumbers.pvcTStuk,
      krimpmof: this.group.rwaPostNumbers.krimpmof,
      koppelstuk: this.group.rwaPostNumbers.koppelstuk,
      stop: this.group.rwaPostNumbers.stop,
      andere: this.group.rwaPostNumbers.andere,
      infiltratiePutje: this.group.rwaPostNumbers.infiltratiePutje,
      aanslBovAfvoer: this.group.rwaPostNumbers.aanslBovAfvoer,
      terugslagKlep: this.group.rwaPostNumbers.terugslagKlep,
      tPutje: this.group.rwaPostNumbers.tPutje,
      bocht45Voor: this.group.rwaPostNumbers.bocht45Voor,
      bocht90Voor: this.group.rwaPostNumbers.bocht90Voor,
      bocht45Achter: this.group.rwaPostNumbers.bocht45Achter,
      bocht90Achter: this.group.rwaPostNumbers.bocht90Achter
    });
  }
  private  buildFormSlokker(){
    this.slokkerForm = this.formBuilder.group({
      indrukmof: this.group.slokkerPostNumbers.indrukmof,
      tBuis: this.group.slokkerPostNumbers.tBuis,
      ytStuk: this.group.slokkerPostNumbers.ytStuk,
      flexAan: this.group.slokkerPostNumbers.flexAan,
      buis: this.group.slokkerPostNumbers.buis,
      buisVert: this.group.slokkerPostNumbers.buisVert,
      bocht: this.group.slokkerPostNumbers.bocht,
      reductie: this.group.slokkerPostNumbers.reductie,
      funOmh: this.group.slokkerPostNumbers.funOmh,
      mof: this.group.slokkerPostNumbers.mof,
      krimpmof: this.group.slokkerPostNumbers.krimpmof,
      koppelstuk: this.group.slokkerPostNumbers.koppelstuk,
      stop: this.group.slokkerPostNumbers.stop,
      andere: this.group.slokkerPostNumbers.andere,
      infiltratieKolk: this.group.slokkerPostNumbers.infiltratieKolk,
      bocht45: this.group.slokkerPostNumbers.bocht45,
      bocht90: this.group.slokkerPostNumbers.bocht90
    });
  }
  private buildFormDWA() {
    this.dwaForm = this.formBuilder.group({
      mof: this.group.dwaPostNumbers.mof,
      indrukmof: this.group.dwaPostNumbers.indrukmof,
      tBuis: this.group.dwaPostNumbers.tBuis,
      tStuk: this.group.dwaPostNumbers.tStuk,
      yStuk: this.group.dwaPostNumbers.yStuk,
      buisVoorHorGres: this.group.dwaPostNumbers.buisVoorHorGres,
      buisVoorHorPVC: this.group.dwaPostNumbers.buisVoorHorPVC,
      buisVoorHorPP: this.group.dwaPostNumbers.buisVoorHorPP,
      buisVoorVertGres: this.group.dwaPostNumbers.buisVoorVertGres,
      buisVoorVertPVC: this.group.dwaPostNumbers.buisVoorVertPVC,
      buisVoorVertPP: this.group.dwaPostNumbers.buisVoorVertPP,
      bochtVoor: this.group.dwaPostNumbers.bochtVoor,
      reductieVoor: this.group.dwaPostNumbers.reductieVoor,
      gietIjzer: this.group.dwaPostNumbers.gietIjzer,
      betonKader: this.group.dwaPostNumbers.betonKader,
      aluKader: this.group.dwaPostNumbers.aluKader,
      buisAchterGres: this.group.dwaPostNumbers.buisAchterGres,
      buisAchterPVC: this.group.dwaPostNumbers.buisAchterPVC,
      buisAchterPP: this.group.dwaPostNumbers.buisAchterPP,
      bochtAchter: this.group.dwaPostNumbers.bochtAchter,
      YAchter: this.group.dwaPostNumbers.YAchter,
      reductieAchter: this.group.dwaPostNumbers.reductieAchter,
      funOmh: this.group.dwaPostNumbers.funOmh,
      flexAan: this.group.dwaPostNumbers.flexAan,
      kunststof: this.group.dwaPostNumbers.kunststof,
      pvcTStuk: this.group.dwaPostNumbers.pvcTStuk,
      krimpmof: this.group.dwaPostNumbers.krimpmof,
      koppelstuk: this.group.dwaPostNumbers.koppelstuk,
      stop: this.group.dwaPostNumbers.stop,
      andere: this.group.dwaPostNumbers.andere,
      terugslagKlep: this.group.dwaPostNumbers.terugslagKlep,
      sifonPutje: this.group.dwaPostNumbers.sifonPutje,
      tPutje: this.group.dwaPostNumbers.tPutje,
      bocht45Voor: this.group.dwaPostNumbers.bocht45Voor,
      bocht90Voor: this.group.dwaPostNumbers.bocht90Voor,
      bocht45Achter: this.group.dwaPostNumbers.bocht45Achter,
      bocht90Achter: this.group.dwaPostNumbers.bocht90Achter
    });
  }

  onSubmitDwa(data) {
    let sendGroup = Object.assign({}, this.group);
    sendGroup.dwaPostNumbers = this.dwaForm.value as Postnumbers;
    if(sendGroup._id == null || sendGroup._id === ''){
      sendGroup._id = sendGroup.id;
    }
    sendGroup.dwaPostNumbers._id = this.dwaId;
    sendGroup.rwaPostNumbers = undefined;
    sendGroup.slokkerPostNumbers = undefined;
    sendGroup.dwaSettings = undefined;
    sendGroup.rwaSettings = undefined;
    sendGroup.slokkerSettings = undefined;

    this.apiService.updateSettings(sendGroup).subscribe(x => {
      this.toastrService.success( 'De postnummers van DWA zijn opgeslagen', 'Succes!');
      });
  }
  onSubmitRwa(data) {
    let sendGroup = Object.assign({}, this.group);
    sendGroup.rwaPostNumbers = this.rwaForm.value as Postnumbers;
    if(sendGroup._id == null || sendGroup._id === ''){
      sendGroup._id = sendGroup.id;
    }
    sendGroup.rwaPostNumbers._id = this.rwaId;
    sendGroup.dwaPostNumbers = undefined;
    sendGroup.slokkerPostNumbers = undefined;
    sendGroup.dwaSettings = undefined;
    sendGroup.rwaSettings = undefined;
    sendGroup.slokkerSettings = undefined;
    this.apiService.updateSettings(sendGroup).subscribe(x => {
      this.toastrService.success( 'De postnummers van RWA zijn opgeslagen', 'Succes!');
    });
  }
  toastBadForm() {
    this.toastrService.warning('Probeer het opnieuw', 'Oops!&');
  }

  ngOnInit(): void {
  }
  goToPrevious() {
    this.router.navigate(['/pages/groupview', this._id]);
  }
  onSubmitSlokker(data) {
    let sendGroup = Object.assign({}, this.group);
    sendGroup.slokkerPostNumbers = this.slokkerForm.value as SlokkerPostnumbers;
    if(sendGroup._id == null || sendGroup._id === ''){
      sendGroup._id = sendGroup.id;
    }
    sendGroup.slokkerPostNumbers._id = this.slokkerId;
    sendGroup.rwaPostNumbers = undefined;
    sendGroup.dwaPostNumbers = undefined;
    sendGroup.dwaSettings = undefined;
    sendGroup.rwaSettings = undefined;
    sendGroup.slokkerSettings = undefined;
    this.apiService.updateSettings(sendGroup).subscribe(x => {
      this.toastrService.success( 'De postnummers van kolken zijn opgeslagen', 'Succes!');
    });
  }
}
