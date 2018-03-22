import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from './loading/loading.component';
import { LoaderSmallComponent } from './loader-small/loader-small.component';

@NgModule({
  declarations: [
    LoadingComponent,
    LoaderSmallComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    LoadingComponent,
    LoaderSmallComponent
  ],
  providers: [

  ]
})
export class SharedModule { }
