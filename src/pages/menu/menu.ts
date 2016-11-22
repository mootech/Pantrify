import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, ModalController } from 'ionic-angular';
import { PantryList } from '../pantryList/pantryList';
import { Settings } from '../settings/settings';
import { Help } from '../help/help';
import { Feedback } from '../feedback/feedback';

@Component({
  templateUrl: 'menu.html'
})
export class Menu {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = PantryList;

  pages: Array<{title: string, component: any, icon: string}>;
  pages2: Array<{title: string, component: any, icon: string}>;

  constructor(public platform: Platform, public modalCtrl: ModalController) {
    this.pages = [{ title: 'Pantry', component: PantryList, icon: 'home' }];

    this.pages2 = [{ title: 'Settings', component: Settings, icon: 'settings' },
      { title: 'Send feedback', component: Feedback, icon: 'text' },
      { title: 'Help', component: Help, icon: 'help-circle' }];
  }

  openPage(page) {
    this.nav.setRoot(page.component);
  }
}
