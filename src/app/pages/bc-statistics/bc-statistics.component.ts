import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';


import moment from 'moment';
/*import jsPDF from 'jspdf';
import 'jspdf-autotable';*/

import { NbToastrService } from '@nebular/theme';
import {ApiService} from "../../../services/api.service";
import {OmzetStat} from "../../../models/OmzetStat";


@Component({
  selector: 'ngx-bc-statistics',
  templateUrl: './bc-statistics.component.html',
  styleUrls: ['./bc-statistics.component.scss', '../styles/item-table.scss']
})
export class BcStatisticsComponent implements OnInit {
  data: any =  'Huisaansluiting';
  radioChoice: any;
  tijd: any = 'Week';
  datumSelected: string = 'Aanmaakdatum';
  neverShow: boolean = false;
  isLoaded: boolean = false;
  times = [
    { value: 'Week' },
    { value: 'Maand' },
    { value: 'Jaar' }
  ];
  displayedColumns: string[] = [
    'Email',
    'Aantal bestellingen',
    'Gsm nummer',
    'Totale waarde',
    'Datum eerste bestelling',
    'Datum laatste bestelling'
  ];

  selectedDate: string = 'Week';
  itemChoice: string = 'Huisaansluiting';
  payMethods = [{ value: 'Alle' }, { value: 'Cash' }, { value: 'Online' }];
  // options for ngx-charts
  yScaleMax = 15000;
  showXAxis = true;
  view = [1100, 550];
  showYAxis = true;
  gradient = false;
  showLegend = false;
  showXAxisLabel = true;
  xAxisLabel = '';
  showYAxisLabel = true;
  yAxisLabel = 'Omzet in €';
  yAxisLabelProduct = 'Omzet in €';
  xAxisLabelProduct = '';
  colorScheme = {
    domain: ['#6f82a1', '#48654c', '#C2B92E', '#bd4c3d', '#db5b2c']
  };
  productRevenueData = [];
  hasStatistics: boolean = false;
  stukSelected: string = 'Meter PVC';
  time: string = 'Week';
  finished: string = 'Nee';
  finishedSelected: string = 'Nee';
  stukken = [ 'Meter PVC', 'Meter Grès', 'Bocht', 'Reductie', 'Y-stuk', 'T-Stuk', 'T-Buis', 'Aanboring', 'Mof', 'Krimpmof', 'Koppelstuk', 'Stop', 'Gietijzer', 'Beton kader', 'Alluminium kader'];
  @ViewChild('content') content: ElementRef;
  statisticsShown: boolean = true;
  isOber = false;
  vatIncluded = 'true';
  datum = 'Aanmaakdatum';

  toastGenerateStatistics: string;
  toastOops: string;

  constructor(
    private apiService: ApiService,
    private toastrService: NbToastrService,
  ) {

  }

  async ngOnInit() {

    this.generateStatistics();
  }

  onItemChange(event) {
    this.itemChoice = event.target.value;
  }

  onChangeFinished(event){
    this.finished = event;
  }
  onChangeTime(event) {
    this.time = event.target.value;
  }

  onChangeVatIncluded(event) {
    this.vatIncluded = event.target.value;
  }
  onChangeDatum(event) {
    this.datumSelected = event.target.value;
  }
  onChangeStuk(event) {
    this.stukSelected = event;
    this.data = 'Stukken';
  }

  async generateStatistics() {
    this.xAxisLabelProduct = this.time;
    this.yAxisLabelProduct = this.itemChoice;
    await this.makeCall();
    this.hasStatistics = true;
    for (let stat of this.productRevenueData) {
      stat.value = stat.value.toFixed(2);
    }

  }

  async makeCall() {
    await this.apiService.getTotalStatistics(
      this.itemChoice,
      this.time,
      this.finished,
      this.datumSelected,
      this.stukSelected
    ).subscribe(x => {
      this.productRevenueData = x as OmzetStat[];
      this.isLoaded = true;
    });
  }
}
