import { Directive, ElementRef, Renderer2, OnInit, HostListener, ViewChild, AfterViewInit } from '@angular/core';

@Directive({
  selector: '[appShowDetail]'
})
export class ShowDetailDirective implements OnInit {

  constructor(private elRef: ElementRef,
              private renderer: Renderer2) { }

  ngOnInit() {

  }

  @HostListener('mouseenter') mouseOver(e: Event) {
    this.renderer.removeClass(this.elRef.nativeElement.firstElementChild.firstElementChild, 'glyphicon-chevron-down');
    this.renderer.addClass(this.elRef.nativeElement.firstElementChild.firstElementChild, 'glyphicon-chevron-up');
  }

  @HostListener('mouseleave') mouseOut(e: Event) {
    this.renderer.removeClass(this.elRef.nativeElement.firstElementChild.firstElementChild, 'glyphicon-chevron-up');
    this.renderer.addClass(this.elRef.nativeElement.firstElementChild.firstElementChild, 'glyphicon-chevron-down');
  }
}
