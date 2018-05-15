import { Subject } from 'rxjs/Subject';
import { Injectable } from '@angular/core';

@Injectable()
export class LandpageService {
  private headerTransparented = false;

  scrollTriggered = new Subject<boolean>();

  constructor() { }

  turnHeaderOpaque() {
    this.headerTransparented = false;
    this.scrollTriggered.next(this.headerTransparented);
  }

  turnHeaderTransparent() {
    this.headerTransparented = true;
    this.scrollTriggered.next(this.headerTransparented);
  }

  // false: opacity, true: transparent
  toggleHeaderOpacity(isTransparent: boolean) {
    if (isTransparent !== this.headerTransparented) {
      this.headerTransparented = isTransparent;
      this.scrollTriggered.next(this.headerTransparented);
    }
  }

  isHeaderTranrsparent() {
    return this.headerTransparented;
  }
}
