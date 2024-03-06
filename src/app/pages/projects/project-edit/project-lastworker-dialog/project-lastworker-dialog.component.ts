import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ApiService } from 'services/api.service';
import { FormService } from 'services/form.service';

@Component({
  selector: 'project-lastworker-dialog',
  templateUrl: './project-lastworker-dialog.component.html',
  styleUrls: ['./project-lastworker-dialog.component.scss']
})
export class ProjectLastworkerDialogComponent implements OnInit {

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
