import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VariablesService {

  public cancelDownload : boolean = false;


  constructor() {

  }
}
