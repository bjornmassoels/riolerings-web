import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ApiService } from 'services/api.service';
import { FormService } from 'services/form.service';

@Component({
  selector: 'schademelding-view-delete-dialog',
  templateUrl: './schademelding-view-delete-dialog.component.html',
  styleUrls: ['./schademelding-view-delete-dialog.component.scss']
})
export class SchademeldingViewDeleteDialogComponent implements OnInit {

  constructor(
    private dialog: MatDialog,
    private apiService: ApiService,
    private formService: FormService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  goToPrevious() {
    const reverseArray = this.formService.previousPage.reverse();
    this.router.navigate([reverseArray[0]]);
  }

  closeDialog(){
    this.dialog.closeAll();
  }

 async onDelete(){
    if(this.formService.deleteSchademelding._id == null){
      this.formService.deleteSchademelding._id = this.formService.deleteSchademelding.id;
    }
    this.apiService.deleteSchademelding(this.formService.deleteSchademelding).subscribe(x => {
      this.closeDialog();
      this.goToPrevious();
    });
  }
}
