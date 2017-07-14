import { Component, ViewChild } from '@angular/core';

import { ModalController, Tabs, NavController } from 'ionic-angular';

import { CustomTabPage } from './../customTab/customTab';
import { ItemModal } from '../../modals/itemModal/itemModal';
import { HardwareBackButtonService } from '../../providers/backbutton.provider';
import { UserData } from '../../providers/user.provider';

import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { TranslateService } from '@ngx-translate/core';

class Tab {
    icon: string;
    component: any;
    items: FirebaseListObservable<any[]>;
};

const fbQuery = {
    orderByChild: 'title',
    limitToLast: 15
};

@Component({
  templateUrl: 'pantry.html'
})
export class PantryPage {
  @ViewChild('pantryTabs') tabRef: Tabs;
  
  tabs : Array<Tab>;

  constructor(private _backBtn: HardwareBackButtonService, 
              public userdata: UserData, 
              public modalCtrl: ModalController, 
              public translate: TranslateService,
              public navCtrl: NavController,
              private _af: AngularFireDatabase) {

      this.tabs = [{icon: 'pizza',  component: CustomTabPage, items:  _af.list('/' + this.userdata.getUid() + '/food', {query: fbQuery})},
              {icon: 'beer',  component: CustomTabPage, items:  _af.list('/' + this.userdata.getUid() + '/drinks', {query: fbQuery})},
              {icon: 'home',  component: CustomTabPage, items:  _af.list('/' + this.userdata.getUid() + '/home', {query: fbQuery})}];
  }

    onAdd() {
        let addModal = this.modalCtrl.create(ItemModal, {type: 'add'});
        addModal.onDidDismiss(data => {
            if (data) {
                let id = this.tabRef.getSelected().id.split('-')[1];
                if (data.isFolder) {
                    this.tabs[+id].items.push({
                        title: data.title,
                        units: data.units,
                        isFolder: data.isFolder,
                        expanded: false,
                        products: ''
                    });
                } else {
                    this.tabs[+id].items.push({
                        title: data.title,
                        units: data.units
                    });
                }
            }
        });
        addModal.present();
    }

    ionViewDidEnter() {
        this._backBtn.registerAction(() => {
          this._backBtn.doubleBackToExit();
        });
    }

    ionViewWillLeave() {
        this._backBtn.deregisterAction();
    }
}
