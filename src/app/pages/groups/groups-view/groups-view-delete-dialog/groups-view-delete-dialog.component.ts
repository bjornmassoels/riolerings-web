import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ApiService } from 'services/api.service';
import { FormService } from 'services/form.service';
import {NbToastrService} from "@nebular/theme";

@Component({
  selector: 'groups-view-delete-dialog',
  templateUrl: './groups-view-delete-dialog.component.html',
  styleUrls: ['./groups-view-delete-dialog.component.scss']
})
export class GroupsViewDeleteDialogComponent implements OnInit {
  isSaving: boolean = false;

  constructor(
    private dialog: MatDialog,
    private apiService: ApiService,
    private formService: FormService,
    private router: Router,
    private toastrService: NbToastrService
  ) { }

  ngOnInit(): void {
  }


  goToPrevious() {
    let reverseArray = this.formService.previousPage.reverse();

    this.router.navigate([reverseArray[1]]);
  }

  closeDialog(){
    this.dialog.closeAll();
  }

 async onDelete(){
  this.isSaving = true;
   this.toastrService.success(
     'Het project wordt verwijderd. Dit kan even duren',
     'Even geduld',
     { duration: 5000 },
   );


    await this.apiService.deleteGroupById(this.formService._chosenGroup).subscribe(() =>{
      this.dialog.closeAll();
      this.isSaving = false;
      this.router.navigate(['/pages/groups']);
    });
    // this.formService._allGroups = this.formService._allGroups.filter(group => (
    //   group._id !== this.formService._chosenGroup._id
    // ));
  }
}
