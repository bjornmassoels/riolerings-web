import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {MatDialog} from "@angular/material/dialog";
import { ApiService } from '../../../services/api.service';
import { FormService } from '../../../services/form.service';

@Component({
  selector: 'has-changed-popup',
  templateUrl: './has-changed-popup.component.html',
  styleUrls: ['./has-changed-popup.component.scss']
})
export class HasChangedPopupComponent implements OnInit {
  text: any;

  constructor(
    private dialog: MatDialog,
    private apiService: ApiService,
    private formService: FormService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }



  closeDialog(){
    this.dialog.closeAll();
  }
  doorgaan() {
    this.router.navigate([this.formService.previousRoute]);
    this.dialog.closeAll();
  }

}
