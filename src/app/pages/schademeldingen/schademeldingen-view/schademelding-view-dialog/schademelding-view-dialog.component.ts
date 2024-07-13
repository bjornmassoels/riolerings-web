import { Component, OnInit } from '@angular/core';
import { SlokkerProjects } from 'models/slokker-projects';
import { FormService } from 'services/form.service';
import {Meerwerk} from "../../../../../models/meerwerk";

@Component({
  selector: 'schademelding-view-dialog',
  templateUrl: './schademelding-view-dialog.component.html',
  standalone: true,
  styleUrls: ['./schademelding-view-dialog.component.scss'],
})
export class SchademeldingViewDialogComponent implements OnInit {

  public currentProject: Meerwerk;
  public _id: string;

  constructor(
    public formService: FormService,

  ) { }

  ngOnInit(): void {
  }

}
