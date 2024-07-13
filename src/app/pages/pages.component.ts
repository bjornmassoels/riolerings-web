import { Component, Directive, HostListener, OnInit } from '@angular/core';

import { MENU_ITEMS } from './pages-menu';
import { NbIconLibraries } from '@nebular/theme';

@Component({
  selector: 'ngx-pages',
  styleUrls: ['pages.component.scss'],
  template: `
    <ngx-one-column-layout>
      <nb-menu [items]="menu"></nb-menu>
      <router-outlet></router-outlet>
    </ngx-one-column-layout>
  `,
})
export class PagesComponent implements OnInit{
  constructor(private iconLibraries: NbIconLibraries){

  }

  menu = MENU_ITEMS;
  async ngOnInit() {
    this.iconLibraries.registerFontPack('fa', {
      packClass: 'fa', iconClassPrefix: 'fa'
    });
  }
}

