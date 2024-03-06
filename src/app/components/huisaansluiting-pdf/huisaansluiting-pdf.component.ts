import { Component, Input, OnInit } from '@angular/core';
import { Group } from 'models/groups';
import { Project } from 'models/project';
import { Company } from '../../../models/company';

@Component({
  selector: 'ngx-huisaansluiting-pdf',
  templateUrl: './huisaansluiting-pdf.component.html',
  styleUrls: ['./huisaansluiting-pdf.component.scss'],
})
export class HuisaansluitingPDFComponent implements OnInit {
  @Input() public currentProject: Project;
  @Input() public group: Group;
  @Input() public company: Company;
  public hasExtraPhotos: boolean = false;
  public hasGrondplan: boolean = false;
  public hasDWA: boolean = true;
  public hasRWA: boolean = true;
  public hasFirstPhotoPage: boolean = false;
  public hasSecondPhotoPage: boolean = false;
  public hasThirdPhotoPage: boolean = false;
  public currentFotoTextDWA: string[];
  public currentFotoTextRWA: string[];
  public isGemengd: boolean = false;
  public realProject: Project;
  constructor() {}

  ngOnInit(): void {
    this.realProject = Object.assign({},this.currentProject);
    if(this.realProject.naamFiche == null){
      this.realProject.naamFiche = '';
    }
    this.isGemengd = this.realProject.isGemengd;

    if(this.realProject.isWachtAansluiting || this.realProject.droogWaterAfvoer.isWachtaansluiting || this.realProject.regenWaterAfvoer.isWachtaansluiting){
      this.realProject.naamFiche = 'GEM=' + this.group.gemeenteCode + ' projectnr=' + this.group.rbProjectNr + ' / ' + this.group.aannemerProjectNr +
        ' adres=' + this.realProject.street + ((this.realProject.huisNr != null && this.realProject.huisNr !== '') ?
          ' - ' + this.realProject.huisNr : '') +((this.realProject.index != null && this.realProject.index !== '')?  ' -volgnr= ' + this.realProject.index : '') + ' AB-HA-fiche';
      this.realProject.equipNrRiolering = this.group.rbProjectNr + ((this.realProject.index != null && this.realProject.index !== '')? '-volgnr= ' + this.realProject.index : '') ;
      this.realProject.bestandNaam = 'WA-' + this.realProject.street + ((this.realProject.huisNr != null && this.realProject.huisNr !== '') ? '-' + this.realProject.huisNr : '') +
        ((this.realProject.index != null && this.realProject.index !== '')? '-' + this.realProject.index : '');
    } else {
      this.realProject.naamFiche = 'GEM=' + this.group.gemeenteCode + ' projectnr= ' + this.group.rbProjectNr + ' / ' + this.group.aannemerProjectNr +
        ' adres=' + this.realProject.street + ' ' + this.realProject.huisNr + ((this.realProject.equipNrRiolering != null && this.realProject.equipNrRiolering !== '') ? ' eq=' + this.realProject.equipNrRiolering : '');
      this.realProject.bestandNaam = 'HA-' + this.realProject.street + ((this.realProject.huisNr != null && this.realProject.huisNr !== '') ? '-' + this.realProject.huisNr : '');
    }
    let newPhotosDWA = [];
    let newTextDWA = [];
    let newPhotosRWA = [];
    let newTextRWA = [];
    for(let i = 0; i < this.realProject.photosDWA.length; i++){
      if(this.realProject.photosDWA[i] != null && this.realProject.photosDWA[i] !== ''){
        switch(i){
          case 0: newTextDWA.push(" Boring of opening van aansluiting op hoofdriool");
            break;
          case 1: newTextDWA.push(" Na plaatsing fundering, buizen, hulpstukken en HA-putje, vanaf de " +
            "aansluitopening richting putje");
            break;
          case 2: newTextDWA.push(" Vervolg vorige foto van omgekeerd standpunt");
            break;
          case 3: newTextDWA.push(" Verbinding tss HAputje en bestaande privé-riool");
            break;
          case 4: newTextDWA.push(" Zelfde als foto 2, maar met omhulling");
            break;
          case 5: newTextDWA.push(" Extra foto");
            break;
          case 6: newTextDWA.push(" Extra foto");
            break;
        }
        newPhotosDWA.push(this.realProject.photosDWA[i]);
      }
    }
    for(let i = 0; i < this.realProject.photosRWA.length; i++){
      if(this.realProject.photosRWA[i] != null && this.realProject.photosRWA[i] !== ''){
        switch(i){
          case 0: newTextRWA.push(" Boring of opening van aansluiting op hoofdriool");
            break;
          case 1: newTextRWA.push(" Na plaatsing fundering, buizen, hulpstukken en HA-putje, vanaf de " +
            "aansluitopening richting putje");
            break;
          case 2: newTextRWA.push(" Vervolg vorige foto van omgekeerd standpunt");
            break;
          case 3: newTextRWA.push(" Verbinding tss HAputje en bestaande privé-riool");
            break;
          case 4: newTextRWA.push(" Zelfde als foto 2, maar met omhulling");
            break;
          case 5: newTextRWA.push(" Extra foto");
            break;
          case 6: newTextRWA.push(" Extra foto");
            break;
        }
        newPhotosRWA.push(this.realProject.photosRWA[i]);
      }
    }

    if(newPhotosDWA.length === 0 && newPhotosRWA.length === 0){
      this.hasFirstPhotoPage = false;
      this.hasSecondPhotoPage = false;
      this.hasThirdPhotoPage = false;
    } else if(newPhotosDWA.length > 3 || newPhotosRWA.length > 3){
      this.hasFirstPhotoPage = true;
      this.hasSecondPhotoPage = true;
      this.hasThirdPhotoPage = false;
      if(newPhotosDWA.length > 5 || newPhotosRWA.length > 5){
        this.hasFirstPhotoPage = true;
        this.hasSecondPhotoPage = true;
        this.hasThirdPhotoPage = true;
      }
    } else {
      this.hasFirstPhotoPage = true;
      this.hasSecondPhotoPage = false;
      this.hasThirdPhotoPage = false;
    }
    this.realProject.photosDWA = newPhotosDWA;
    this.realProject.photosRWA = newPhotosRWA;
    this.currentFotoTextDWA = newTextDWA;
    this.currentFotoTextRWA = newTextRWA;


    if((this.realProject.droogWaterAfvoer.letterHor == null  || this.realProject.droogWaterAfvoer.letterHor === '') &&
      this.realProject.droogWaterAfvoer.putHor == null  &&
      (this.realProject.droogWaterAfvoer.letterVer == null  || this.realProject.droogWaterAfvoer.letterVer === '') &&
      this.realProject.droogWaterAfvoer.putVer == null &&
      (this.realProject.regenWaterAfvoer.letterHor == null  || this.realProject.regenWaterAfvoer.letterHor === '') &&
      this.realProject.regenWaterAfvoer.putHor == null  &&
      (this.realProject.regenWaterAfvoer.letterVer == null  || this.realProject.regenWaterAfvoer.letterVer === '') &&
      this.realProject.regenWaterAfvoer.putVer == null){
      this.hasGrondplan = false;
    } else {
      this.hasGrondplan = true;
    }
    if((this.realProject.droogWaterAfvoer.buisVoorHor == null || this.realProject.droogWaterAfvoer.buisVoorHor === 0 || this.realProject.droogWaterAfvoer.buisVoorHor.toString() === '' )
      && (this.realProject.droogWaterAfvoer.buisVoorVert == null || this.realProject.droogWaterAfvoer.buisVoorVert === 0 || this.realProject.droogWaterAfvoer.buisVoorVert.toString() === '')
      && (this.realProject.droogWaterAfvoer.bochtVoor == null || this.realProject.droogWaterAfvoer.bochtVoor === 0 || this.realProject.droogWaterAfvoer.bochtVoor.toString() === '')
      && (this.realProject.droogWaterAfvoer.reductieVoor == null || this.realProject.droogWaterAfvoer.reductieVoor === 0 || this.realProject.droogWaterAfvoer.reductieVoor.toString() === '')
      && (this.realProject.droogWaterAfvoer.buisVoorHor2 == null || this.realProject.droogWaterAfvoer.buisVoorHor2 === 0 || this.realProject.droogWaterAfvoer.buisVoorHor2.toString() === '' )
      && (this.realProject.droogWaterAfvoer.buisVoorVert2 == null || this.realProject.droogWaterAfvoer.buisVoorVert2 === 0 || this.realProject.droogWaterAfvoer.buisVoorVert2.toString() === '')
      && (this.realProject.droogWaterAfvoer.bochtVoor2 == null || this.realProject.droogWaterAfvoer.bochtVoor2 === 0 || this.realProject.droogWaterAfvoer.bochtVoor2.toString() === '')
      && (this.realProject.droogWaterAfvoer.reductieVoor2 == null || this.realProject.droogWaterAfvoer.reductieVoor2 === 0 || this.realProject.droogWaterAfvoer.reductieVoor2.toString() === '')){
      this.hasDWA = false;
    } else {
      this.hasDWA = true;
    }
    if((this.realProject.regenWaterAfvoer.buisVoorHor == null || this.realProject.regenWaterAfvoer.buisVoorHor === 0 || this.realProject.regenWaterAfvoer.buisVoorHor.toString() === '' )
      && (this.realProject.regenWaterAfvoer.buisVoorVert == null || this.realProject.regenWaterAfvoer.buisVoorVert === 0 || this.realProject.regenWaterAfvoer.buisVoorVert.toString() === '')
      && (this.realProject.regenWaterAfvoer.bochtVoor == null || this.realProject.regenWaterAfvoer.bochtVoor === 0 || this.realProject.regenWaterAfvoer.bochtVoor.toString() === '')
      && (this.realProject.regenWaterAfvoer.reductieVoor == null || this.realProject.regenWaterAfvoer.reductieVoor === 0 || this.realProject.regenWaterAfvoer.reductieVoor.toString() === '')
      && (this.realProject.regenWaterAfvoer.buisVoorHor2 == null || this.realProject.regenWaterAfvoer.buisVoorHor2 === 0 || this.realProject.regenWaterAfvoer.buisVoorHor2.toString() === '' )
      && (this.realProject.regenWaterAfvoer.buisVoorVert2 == null || this.realProject.regenWaterAfvoer.buisVoorVert2 === 0 || this.realProject.regenWaterAfvoer.buisVoorVert2.toString() === '')
      && (this.realProject.regenWaterAfvoer.bochtVoor2 == null || this.realProject.regenWaterAfvoer.bochtVoor2 === 0 || this.realProject.regenWaterAfvoer.bochtVoor2.toString() === '')
      && (this.realProject.regenWaterAfvoer.reductieVoor2 == null || this.realProject.regenWaterAfvoer.reductieVoor2 === 0 || this.realProject.regenWaterAfvoer.reductieVoor2.toString() === '')){
      this.hasRWA = false;
    } else {
      this.hasRWA = true;
    }
  }

  NullToZero(number) {
    if (number == null) {
      return 0;
    } else {
      return number;
    }
  }

  NullToOnbekend(number) {
    if (number == null) {
      return 'Onbekend';
    } else {
      return number + ' meter';
    }
  }
  NullToString(check) {
    if (check == null || check === 0) {
      return '';
    } else {
      return check;
    }
  }
}
