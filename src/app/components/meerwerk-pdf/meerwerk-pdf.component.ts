import { Component, Input, OnInit } from '@angular/core';
import { Group } from 'models/groups';
import { Project } from 'models/project';
import {Company} from "../../../models/company";
import {Meerwerk} from "../../../models/meerwerk";

@Component({
  selector: 'ngx-meerwerk-pdf',
  templateUrl: './meerwerk-pdf.component.html',
  styleUrls: ['./meerwerk-pdf.component.scss'],
})
export class MeerwerkPdfComponent implements OnInit {
  @Input() public currentProject: Meerwerk;
  @Input() public group: Group;
  @Input() public company: Company;

  constructor() {
  }

  ngOnInit(): void {
  }
  NullToZero(number) {
    if (number == null) {
      return 0;
    } else {
      return number;
    }
  }
  minutesToHours(minutes: number){
    switch(minutes){
      case 0: return '0 min';
      case 15: return '15 min';
      case 30: return '30 min';
      case 45: return '45 min';
      case 60: return '1 uur';
      case 75: return '1 uur 15 min';
      case 90: return '1 uur 30 min';
      case 105: return '1 uur 45 min';
      case 120: return '2 uur';
      case 135: return '2 uur 15 min';
      case 150: return '2 uur 30 min';
      case 165: return '2uur 45 min';
      case 180: return '3 uur';
      case 195: return '3 uur 15 min';
      case 210: return '3 uur 30 min';
      case 225: return '3 uur 45 min';
      case 240: return '4 uur';
      case 255: return '4 uur 15 min';
      case 270: return '4 uur 30 min';
      case 285: return '4 uur 45 min';
      case 300: return '5 uur';
      case 360: return '6 uur';
      case 420: return '7 uur';
      case 480: return '8 uur';
    }
  }
}
