import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import {ActivatedRoute, Router} from "@angular/router";
import {UntypedFormBuilder} from "@angular/forms";
import {FormService} from "../../../../services/form.service";
import {ApiService} from "../../../../services/api.service";
import {ExcelObject} from "../../../../models/excelObject";
import {LambertObject} from "../../../../models/lambertObject";
import {Group} from "../../../../models/groups";

@Component({
  selector: 'read-excel-lambert',
  templateUrl: './read-excel-lambert.component.html',
  styleUrls: ['./read-excel-lambert.component.scss'],
})
export class ReadExcelLambertComponent implements OnInit {
  title = 'XlsRead';
  file: File;
  heeftploegen: boolean = false;
  arrayBuffer: any;
  filelist: any;
  isLoaded: boolean = false;
  infoForm: any;
  _id: string;
  output: LambertObject[] ;
  isInfoOpen: boolean = false;
  isloading: boolean = false;
  isSaving: boolean = false;
  constructor(private formBuilder: UntypedFormBuilder, private formService:FormService, private router: Router, private apiService: ApiService, private route: ActivatedRoute) {
    route.params.subscribe((val) => {
      this._id = this.route.snapshot.paramMap.get('id');
    });
  }

  ngOnInit(): void {

  }


  addfile(event) {
    if(this.isSaving)return
    this.isSaving = true;
    this.isloading = true;
    this.file = event.target.files[0];
    const fileReader = new FileReader();
    fileReader.readAsArrayBuffer(this.file);
    fileReader.onload = (e) => {
      this.arrayBuffer = fileReader.result;
      const data = new Uint8Array(this.arrayBuffer);
      const arr = new Array();
      for (let i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
      const bstr = arr.join('');
      const workbook = XLSX.read(bstr, {type: 'binary'});
      const dataSheet = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[dataSheet];
      const arraylist = XLSX.utils.sheet_to_json(worksheet, {raw: true}) as LambertObject[];
      this.filelist = [];
      //this.group.rbNaam = arraylist[1].__EMPTY;

      this.apiService.setLambertCoordinates(this._id, arraylist).subscribe(x => {
          this.output = x as LambertObject [];
          this.isloading = false;
          this.isSaving = false;
          this.isLoaded = true;
      }, error => {
        this.isloading = false;
        this.isSaving = false;
        this.isLoaded = true;
      });
    };
  }

  goToPrevious() {
    this.router.navigate(['/pages/groupview', this._id]);
  }

  goToInfo() {
    if(this.isInfoOpen)  {
      this.isInfoOpen = false;
    } else {
      this.isInfoOpen = true;
    }
  }
}
