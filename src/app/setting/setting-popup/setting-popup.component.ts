import { Component, OnInit, OnDestroy, HostListener, ViewChild, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { SettingService } from '../setting.service';

@Component({
  selector: 'app-setting-popup',
  templateUrl: './setting-popup.component.html',
  styleUrls: ['./setting-popup.component.css']
})
export class SettingPopupComponent implements OnInit, OnDestroy {
  display: boolean;
  popupSub: Subscription;
  @ViewChild('popup') private elRef: ElementRef;

  constructor(private settingService: SettingService) { }

  ngOnInit() {
    this.popupSub = this.settingService.poped.subscribe(
      () => {this.display = true;
      console.log(this.display)}
    );
  }

  ngOnDestroy() {
    this.popupSub.unsubscribe();
  }

  onDismiss() {
    this.display = false;
  }
 
  // @HostListener('document:click', ['$event.target'])
  // onClickOutSide(targetElement) {
  //     if(!this.elRef) {
  //       return;
  //     }
  //     const clickedInside = this.elRef.nativeElement.contains(targetElement);
  //     if (!clickedInside) {
  //         this.onDismiss();
  //     }
  // }
}
