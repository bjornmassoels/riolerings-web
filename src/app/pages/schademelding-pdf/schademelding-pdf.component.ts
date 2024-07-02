import { Component, Input, OnInit } from '@angular/core';
import { Schademelding } from '../../../models/schademelding';
import { Company } from '../../../models/company';
import { Group } from '../../../models/groups';

@Component({
  selector: 'ngx-schademelding-pdf',
  templateUrl: './schademelding-pdf.component.html',
  styleUrls: ['./schademelding-pdf.component.scss'],
})
export class SchademeldingPdfComponent implements OnInit {
  @Input() public schademelding: Schademelding;
  @Input() public company: Company;
  @Input() public group: Group;
  isLoaded: boolean = false;
  constructor() {
  }

  ngOnInit(): void {
    this.schademelding.date = new Date(this.schademelding.date);
    if(this.schademelding.startTijdHerstelling) this.schademelding.startTijdHerstelling = new Date(this.schademelding.startTijdHerstelling);
    if(this.schademelding.eindTijdHerstelling) this.schademelding.eindTijdHerstelling = new Date(this.schademelding.eindTijdHerstelling);
    this.isLoaded = true;

  }
  checkIfSchadeGerichtAanIsNutsleidingenOfAndere() {
    if(this.schademelding.schadeGerichtAan && (this.schademelding.schadeGerichtAan === 'Nutsleidingen' || this.schademelding.schadeGerichtAan === 'Andere')){
      return true;
    } else {
      return false;
    }
  }
  checkIfHerstellingIsNotEmpty() {
    if(this.schademelding.detailsHerstelling || this.schademelding.startTijdHerstelling || this.schademelding.eindTijdHerstelling ||
      this.schademelding.aantalPersonenHerstelling){
      return true;
    } else {
      return false;
    }
  }
  checkIfPolitieIsNotEmpty() {
    if(this.schademelding.gemeentePolitie || this.schademelding.isMinnelijkeVaststelling || this.schademelding.isBetwistingMogelijk || this.schademelding.isProcesVerbaal){
      return true;
    } else {
      return false;
    }
  }
  NullToZero(number) {
    if (number == null) {
      return 0;
    } else {
      return number;
    }
  }
 NullToEmptyStr(string) {
    if (string == null) {
      return '';
    } else {
      return string;
    }
 }

}
