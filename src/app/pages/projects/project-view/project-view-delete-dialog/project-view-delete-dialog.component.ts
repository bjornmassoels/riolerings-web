import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'services/api.service';
import { FormService } from 'services/form.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'project-view-delete-dialog',
  templateUrl: './project-view-delete-dialog.component.html',
  styleUrls: ['./project-view-delete-dialog.component.scss']
})
export class ProjectViewDeleteDialogComponent implements OnInit {

  private reverseArray;

  constructor(
    private dialog: MatDialog,
    private apiService: ApiService,
    private formService: FormService,
    private router: Router
  ) {
    this.reverseArray = this.formService.previousPage.reverse()
  }

  ngOnInit(): void {
  }

  goToPrevious() {
    this.router.navigate([this.reverseArray[0]]);
  }

  closeDialog(){
    this.dialog.closeAll();
  }

 async onDelete(){
    if(this.formService.PreloadProject._id == null){
      this.formService.PreloadProject._id = this.formService.PreloadProject.id;
    }
    this.apiService.deleteProjectById(this.formService.PreloadProject).subscribe(x => {
      this.closeDialog();
      this.goToPrevious();
    });

  }
}
