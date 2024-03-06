// no-scroll-input.directive.ts
import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: 'input[type="number"]',
})
export class NoScrollInputFixDirective {
  @HostListener('wheel', ['$event'])
  onWheel(event: Event) {
    event.preventDefault();
  }
}
