import { Component, OnInit } from '@angular/core';
import { SlokkerProjects } from 'models/slokker-projects';
import { FormService } from 'services/form.service';

@Component({
  selector: 'slokkerproject-view-dialog',
  templateUrl: './slokkerproject-view-dialog.component.html',
  styleUrls: ['./slokkerproject-view-dialog.component.scss']
})
export class SlokkerprojectViewDialogComponent implements OnInit {

  public currentProject: SlokkerProjects;
  public _id: string;

  constructor(
    public formService: FormService,

  ) { }

  ngOnInit(): void {
  }

}
