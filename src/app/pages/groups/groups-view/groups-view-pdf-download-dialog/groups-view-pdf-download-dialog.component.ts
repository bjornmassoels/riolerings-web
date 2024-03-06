import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'services/api.service';
import { FormService } from 'services/form.service';
import {NbToastrService} from "@nebular/theme";
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'groups-view-pdf-download-dialog',
  templateUrl: './groups-view-pdf-download-dialog.component.html',
  styleUrls: ['./groups-view-pdf-download-dialog.component.scss']
})
export class GroupsViewPdfDownloadDialogComponent{
  checkbox: any;
  constructor(
    private dialog: MatDialog,
    private apiService: ApiService,
    private formService: FormService,
    private router: Router,
    private toastrService: NbToastrService,
    private dialogRef: MatDialogRef<GroupsViewPdfDownloadDialogComponent>
  ) { }


  closeDialog(){
    this.dialogRef.close({ message: 'Dialog closed' });
  }

  normaleBenaming() {
    this.dialogRef.close({ pdfBenaming: 'normaal' }); // Pass back specific data
  }

  naamgevingFicheBenaming() {
    this.dialogRef.close({ pdfBenaming: 'naamgevingfiche' });
  }
}
