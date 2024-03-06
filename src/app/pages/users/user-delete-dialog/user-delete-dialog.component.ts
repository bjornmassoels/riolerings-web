import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'services/api.service';
import { FormService } from 'services/form.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'user-delete-dialog',
  templateUrl: './user-delete-dialog.component.html',
  styleUrls: ['./user-delete-dialog.component.scss']
})
export class UserDeleteDialogComponent implements OnInit {

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
    await this.apiService.deleteUser(this.formService.deleteUser).subscribe(x => {
    });
    this.formService.deleteUser = null;
    this.closeDialog();
   this.router.navigate([('/pages/users')]) ;
  }
}
