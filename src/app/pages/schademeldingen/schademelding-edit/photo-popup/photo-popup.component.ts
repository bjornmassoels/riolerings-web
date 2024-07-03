import { Component, Inject, OnInit } from '@angular/core';
import { FormService } from '../../../../../services/form.service';

@Component({
  selector: 'photo-popup-dialog',
  templateUrl: './photo-popup.component.html',
  styleUrls: ['./photo-popup.component.scss'],
})
export class PhotoPopupDialog implements OnInit {

  public _id: string;

  constructor(
    public formService: FormService
  ) {

  }

  ngOnInit(): void {
  }

}
