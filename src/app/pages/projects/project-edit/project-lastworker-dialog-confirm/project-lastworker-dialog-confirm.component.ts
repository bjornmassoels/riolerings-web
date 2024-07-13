import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'services/api.service';
import { FormService } from 'services/form.service';
import {NbToastrService} from "@nebular/theme";
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'project-lastworker-dialog-confirm',
  templateUrl: './project-lastworker-dialog-confirm.component.html',
  styleUrls: ['./project-lastworker-dialog-confirm.component.scss']
})
export class ProjectLastworkerDialogConfirmComponent implements OnInit {

  constructor(
    private dialog: MatDialog,
    private apiService: ApiService,
    public formService: FormService,
    private router: Router,
    private toastrService: NbToastrService
  ) { }

  ngOnInit(): void {
  }


  closeDialog(){
    this.formService.isUpdated = false;
    this.dialog.closeAll();
  }

  async onChange() {
    this.apiService.updateProject(this.formService.currentProject).subscribe(async() => {
      this.toastrService.success( 'De aansluiting is gewijzigd', 'Succes!');
      await this.delay(500);
      this.dialog.closeAll();
      this.formService.isUpdated = true;
    }, error => {
      this.toastrService.danger('Er is iets misgegaan', 'Error');
    });
  }
  delay(timeInMillis: number): Promise<void> {
    return new Promise((resolve) => setTimeout(() => resolve(), timeInMillis));
  }


}
