import { Component, Input, OnInit } from '@angular/core';
import { Group } from 'models/groups';
import { Project } from 'models/project';
import {Company} from "../../../models/company";
import {DialogOverviewExampleDialog2} from "../../pages/slokkerprojects/slokkerproject-view/slokkerproject-view.component";

@Component({
  selector: 'ngx-slokker-pdf',
  templateUrl: './slokker-pdf.component.html',
  styleUrls: ['./slokker-pdf.component.scss'],
})
export class SlokkerPDFComponent implements OnInit {
  @Input() public currentProject: Project;
  @Input() public group: Group;
  @Input() public company: Company;
  public hasPhoto: boolean = false;
  public has4Photos: boolean = false;
  public currentFotoText: string[];
  public realProject: Project;
  constructor() {
  }

  ngOnInit(): void {
    this.realProject = Object.assign({}, this.currentProject);
    let newPhotos = [];
    let newText = [];
    this.realProject.equipNrRiolering = this.group.rbProjectNr +  ((this.realProject.index != null && this.realProject.index !== '')?  '-kolknr'  + this.realProject.index : '') ;
    this.realProject.naamFiche = 'GEM=' + this.group.gemeenteCode + ' projectnr=' + this.group.rbProjectNr + ' / ' + this.group.aannemerProjectNr +
      ' adres=' + this.realProject.street +  ((this.realProject.index != null && this.realProject.index !== '')?
        '-kolknr'  + this.realProject.index : '') + ' AB-kolk-fiche';

    for(let i = 0; i < this.realProject.photos.length; i++){
      if(this.realProject.photos[i] != null && this.realProject.photos[i] !== ''){
        switch(i){
          case 0: newText.push(" Boring of opening van aansluiting op hoofdriool");
            break;
          case 1: newText.push(" Na plaatsing fundering, buizen, hulpstukken en HA-putje, vanaf de " +
            "aansluitopening richting putje");
            break;
          case 2: newText.push(" Zelfde als foto 2, maar met omhulling");
            break;
          case 3: newText.push(" Extra foto");
            break;
          case 4: newText.push(" Extra foto");
            break;
          case 5: newText.push(" Extra foto");
            break;
        }
        newPhotos.push(this.realProject.photos[i]);
      }
    }
    this.currentFotoText = newText;
    this.realProject.photos = newPhotos;
    if(newPhotos.length === 0){
      this.hasPhoto = false;
      this.has4Photos = false;
    } else if(newPhotos.length <= 3){
      this.hasPhoto = true;
      this.has4Photos = false;
    } else {
      this.hasPhoto = true;
      this.has4Photos = true;
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
}
