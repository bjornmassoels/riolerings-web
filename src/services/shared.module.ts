import { NgModule } from '@angular/core';
import { NoScrollInputFixDirective } from './no-scroll-input-fix.directive';

@NgModule({
  declarations: [
    // other declarations...
    NoScrollInputFixDirective
  ],
  exports: [
    // other exports...
    NoScrollInputFixDirective
  ]
})
export class SharedModule { }
