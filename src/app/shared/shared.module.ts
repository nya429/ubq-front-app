import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from './loading/loading.component';
import { LoaderSmallComponent } from './loader-small/loader-small.component';
import { ClickOutsideDirective } from './click-outside.directive';
import { AutoFocusDirective } from './autoFocus.directive';
import { ScrollTriggerDirective } from './scroll-trigger.directive';

@NgModule({
  declarations: [
    LoadingComponent,
    LoaderSmallComponent,
    ClickOutsideDirective,
    AutoFocusDirective,
    ScrollTriggerDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    LoadingComponent,
    LoaderSmallComponent,
    ClickOutsideDirective,
    AutoFocusDirective,

  ],
  providers: [

  ]
})
export class SharedModule { }
