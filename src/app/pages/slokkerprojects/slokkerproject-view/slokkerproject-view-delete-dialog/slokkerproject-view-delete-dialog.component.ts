import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ApiService } from 'services/api.service';
import { FormService } from 'services/form.service';

@Component({
  selector: 'slokkerproject-view-delete-dialog',
  templateUrl: './slokkerproject-view-delete-dialog.component.html',
  styleUrls: ['./slokkerproject-view-delete-dialog.component.scss']
})
export class SlokkerprojectViewDeleteDialogComponent implements OnInit {

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
    if(this.formService.deleteSlokkerProject._id == null){
      this.formService.deleteSlokkerProject._id = this.formService.deleteSlokkerProject.id;
    }
    await this.apiService.deleteSlokkerById(this.formService.deleteSlokkerProject).subscribe(x => {
    });
   this.closeDialog();
   this.goToPrevious();
  }
}
