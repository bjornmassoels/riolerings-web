import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ApiService } from 'services/api.service';
import { FormService } from 'services/form.service';

@Component({
  selector: 'slokkerproject-lastworker-dialog',
  templateUrl: './slokkerproject-lastworker-dialog.component.html',
  styleUrls: ['./slokkerproject-lastworker-dialog.component.scss']
})
export class SlokkerprojectLastworkerDialogComponent implements OnInit {

  constructor(
    private dialog: MatDialog,
    private apiService: ApiService,
    public formService: FormService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }


  closeDialog(){
    this.dialog.closeAll();
  }

}
