import { Directive, Output, ElementRef, EventEmitter, HostListener } from '@angular/core';

@Directive({
  selector: '[appClickOutside]'
})
export class ClickOutsideDirective {

  constructor(private elRef: ElementRef) {
  }

  @Output() clickOutside = new EventEmitter();

  @HostListener('document:click', ['$event.target'])
  onClick(targetElement) {
      const clickedInside = this.elRef.nativeElement.contains(targetElement);
      if (!clickedInside) {
          this.clickOutside.emit(null);
      }
  }

}
