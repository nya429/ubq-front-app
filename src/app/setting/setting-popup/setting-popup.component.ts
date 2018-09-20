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
  head: string;

  @ViewChild('popup') private elRef: ElementRef;

  constructor(private settingService: SettingService) { }

  ngOnInit() {
    this.popupSub = this.settingService.poped.subscribe((popup: object) => this.onPopup(popup));
  }

  ngOnDestroy() {
    this.popupSub.unsubscribe();
  }
  
  onPopup(popup: object) {
    this.head = `Backend  has changed to ${popup['host'].toUpperCase()}`;
    this.display = popup['poped'];
  }

  onDismiss() {
    this.display = false;
    this.settingService.getSettingListByOptions();
  }
 
  @HostListener('document:click', ['$event.target'])
  onClickOutSide(targetElement) {
      if(!this.elRef) {
        return;
      }
      const clickedInside = this.elRef.nativeElement.contains(targetElement);
      if (!clickedInside) {
          this.onDismiss();
      }
  }
}
