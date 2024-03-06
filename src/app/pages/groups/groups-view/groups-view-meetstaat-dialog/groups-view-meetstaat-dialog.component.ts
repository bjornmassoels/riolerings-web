import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ApiService } from 'services/api.service';
import { FormService } from 'services/form.service';
import {NbToastrService} from "@nebular/theme";

@Component({
  selector: 'groups-view-delete-dialog',
  templateUrl: './groups-view-meetstaat-dialog.component.html',
  styleUrls: ['./groups-view-meetstaat-dialog.component.scss']
})
export class GroupsViewMeetstaatDialogComponent implements OnInit {
  checkbox: any;
  constructor(
    private dialog: MatDialog,
    private apiService: ApiService,
    private formService: FormService,
    private router: Router,
    private toastrService: NbToastrService
  ) { }

  ngOnInit(): void {
    this.formService.isNewExcel = false;
    this.formService.isMeetstaatDiameter = null;
  }



  closeDialog(){
    this.dialog.closeAll();
  }


  newExcel() {
    this.formService.isNewExcel = true;
    this.formService.isMeetstaatDiameter = false;
    this.formService.isVordering = false;
    this.dialog.closeAll();
  }

  vorderNewExcel() {
    if(this.checkbox === true){
      this.formService.isNewExcel = true;
      this.formService.isMeetstaatDiameter = false;
      this.formService.isVordering = true;
      this.dialog.closeAll();
    } else {
      this.toastrService.warning( 'Als u de totalen wilt bijhouden en vorderen moet u eerst het vakje aanklikken.', 'Klik het vakje aan.');

    }
  }
}
