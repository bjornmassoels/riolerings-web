import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ApiService } from 'services/api.service';
import { FormService } from 'services/form.service';
import {NbToastrService} from "@nebular/theme";

@Component({
  selector: 'slokkerproject-lastworker-dialog-confirm',
  templateUrl: './slokkerproject-lastworker-dialog-confirm.component.html',
  styleUrls: ['./slokkerproject-lastworker-dialog-confirm.component.scss']
})
export class SlokkerprojectLastworkerDialogConfirmComponent implements OnInit {

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
    this.apiService.updateSlokkerProject(this.formService.currentSlokkerProject).subscribe(async() => {
      this.toastrService.success( 'De slokker is gewijzigd', 'Succes!');
      this.formService.isUpdated = true;
      this.dialog.closeAll();
      await this.delay(1000);
    }, error => {
      this.toastrService.danger('Er is iets misgegaan', 'Error');
    });
  }
  delay(timeInMillis: number): Promise<void> {
    return new Promise((resolve) => setTimeout(() => resolve(), timeInMillis));
  }


}
