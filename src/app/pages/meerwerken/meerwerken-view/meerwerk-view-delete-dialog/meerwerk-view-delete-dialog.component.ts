import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ApiService } from 'services/api.service';
import { FormService } from 'services/form.service';

@Component({
  selector: 'meerwerk-view-delete-dialog',
  templateUrl: './meerwerk-view-delete-dialog.component.html',
  styleUrls: ['./meerwerk-view-delete-dialog.component.scss']
})
export class MeerwerkViewDeleteDialogComponent implements OnInit {

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
    if(this.formService.deleteMeerwerk._id == null){
      this.formService.deleteMeerwerk._id = this.formService.deleteMeerwerk.id;
    }
    this.apiService.deleteMeerwerkById(this.formService.deleteMeerwerk).subscribe(x => {
      this.closeDialog();
      this.goToPrevious();
    });

  }
}
