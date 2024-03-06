import { Component, Inject, OnInit } from '@angular/core';
import { Project } from 'models/project';
import { FormService } from 'services/form.service';

@Component({
  selector: 'project-view-dialog',
  templateUrl: './project-view-dialog.component.html',
  styleUrls: ['./project-view-dialog.component.scss']
})
export class ProjectViewDialogComponent implements OnInit {

  public currentProject: Project;
  public _id: string;

  constructor(
    public formService: FormService,
  ) {

  }

  ngOnInit(): void {
  }


}
