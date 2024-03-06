import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import {NbToastrService} from "@nebular/theme";
import { FormService } from '../../../services/form.service';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'update-popup-dialog',
  templateUrl: './update-popup-dialog.component.html',
  styleUrls: ['./update-popup-dialog.component.scss']
})
export class UpdatePopupDialogComponent implements OnInit {
  text: any;

  constructor(
    private dialog: MatDialog,
    private apiService: ApiService,
    private formService: FormService,
    private router: Router,
    private toastrService: NbToastrService
  ) { }

  ngOnInit(): void {
  }



  closeDialog(){
    this.dialog.closeAll();
  }
}
