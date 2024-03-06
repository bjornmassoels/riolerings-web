import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ApiService } from 'services/api.service';
import { FormService } from 'services/form.service';

@Component({
  selector: 'meerwerken-lastworker-dialog',
  templateUrl: './meerwerken-lastworker-dialog.component.html',
  styleUrls: ['./meerwerken-lastworker-dialog.component.scss']
})
export class MeerwerkenLastworkerDialogComponent implements OnInit {

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
