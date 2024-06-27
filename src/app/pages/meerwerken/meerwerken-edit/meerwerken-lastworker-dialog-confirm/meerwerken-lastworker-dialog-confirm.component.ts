import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ApiService } from 'services/api.service';
import { FormService } from 'services/form.service';
import {NbToastrService} from "@nebular/theme";

@Component({
  selector: 'meerwerken-lastworker-dialog-confirm',
  templateUrl: './meerwerken-lastworker-dialog-confirm.component.html',
  styleUrls: ['./meerwerken-lastworker-dialog-confirm.component.scss']
})
export class MeerwerkenLastworkerDialogConfirmComponent implements OnInit {

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
    this.apiService.updateMeerwerk(this.formService.currentMeerwerk).subscribe(async() => {
      this.toastrService.success( 'Het onvoorzien werk is gewijzigd', 'Succes!');
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
