import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from './loading/loading.component';
import { LoaderSmallComponent } from './loader-small/loader-small.component';
import { ClickOutsideDirective } from './click-outside.directive';
@NgModule({
  declarations: [
    LoadingComponent,
    LoaderSmallComponent,
    ClickOutsideDirective,
  ],
  imports: [
    CommonModule
  ],
  exports: [
    LoadingComponent,
    LoaderSmallComponent,
    ClickOutsideDirective
  ],
  providers: [

  ]
})
export class SharedModule { }
