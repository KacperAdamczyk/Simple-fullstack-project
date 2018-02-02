import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[appStopClickEventPropagation]'
})
export class StopClickEventPropagationDirective {

  constructor(el: ElementRef) {
    el.nativeElement.addEventListener('click', (event) => event.stopPropagation());
  }
}
