import { Component, OnInit } from '@angular/core';
import { SlokkerProjects } from 'models/slokker-projects';
import { FormService } from 'services/form.service';
import {Meerwerk} from "../../../../../models/meerwerk";

@Component({
  selector: 'meerwerk-view-dialog',
  templateUrl: './meerwerk-view-dialog.component.html',
  styleUrls: ['./meerwerk-view-dialog.component.scss']
})
export class MeerwerkViewDialogComponent implements OnInit {

  public currentProject: Meerwerk;
  public _id: string;

  constructor(
    public formService: FormService,

  ) { }

  ngOnInit(): void {
  }

}
