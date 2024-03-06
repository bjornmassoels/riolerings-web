import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
  name: 'choicePipe'
})
export class choicePipe implements PipeTransform {
  constructor() {
  }

  transform(value: any, ...args: any[]): any {
      switch (value) {
          case 'bocht':
              return 'Bochten (stuks)';
              break;
          case 'buisHor':
              return 'Buizen (hor. meter)';
              break;
          case 'buisVert':
              return 'Buizen (vert. meter)';
              break;
          case 'reductie':
              return 'Reductie (stuks)';
              break;
          case 'y':
              return 'Y-stuks';
              break;
      }
  }
}
