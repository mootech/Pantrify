import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from 'ionic-angular';

import { ItemModal } from '../../modals/item/item';
import { FirebaseService } from '../../providers/firebase.provider';

const types = {
  food: 0,
  drinks: 1,
  home: 2
};

@Component({
  selector: 'folder-item',
  templateUrl: 'folder-item.html'
})
export class FolderItemComponent implements OnInit {

  @Input('products') products;
  @Input('type') type;
  @Input('folder') folder;

  items: Array<any> = [];
  folders: Array<any> = [];

  constructor(public modalCtrl: ModalController, private _fbService: FirebaseService) { }

  ngOnInit() {
    Object.keys(this.products).forEach(key => {
      this.items.push({
        $key: key,
        title: this.products[key].title,
        units: this.products[key].units,
        minimum: this.products[key].minimum
      });
    });
    this.items.sort((a, b) => {
      const nameA = a.title.toLowerCase();
      const nameB = b.title.toLowerCase();
      if (nameA < nameB)
        return -1;
      if (nameA > nameB)
        return 1;
      return 0;
    });
    this.folders = this._fbService.getFolders();
  }

  onAdd(item) {
    this._fbService.updateItemFolder(item, this.type,
      { title: item.title, units: parseInt(item.units, 10) + 1 }, this.folder);
  }

  onRemove(item) {
    this._fbService.updateItemFolder(item, this.type,
      { title: item.title, units: parseInt(item.units, 10) - 1 }, this.folder);
  }

  onEdit(item) {
    const editItemModal = this.modalCtrl.create(ItemModal, {
      item,
      type: 'edit',
      folders: this.folders[types[this.type]]
    });
    editItemModal.onDidDismiss(data => {
      if (data) {
        if (data.type === 'remove') {
          this._fbService.removeItemFolder(item, this.type, this.folder);
        } else {
          if (data.moveFolder !== '') {
            this._fbService.removeItemFolder(item, this.type, this.folder);
            this._fbService.pushItemFolder({ title: data.title, units: parseInt(data.units, 10),
              minimum: parseInt(data.minimum, 10) }, this.type, data.moveFolder);
          } else {
            this._fbService.updateItemFolder(item, this.type,
              { title: data.title, units: parseInt(data.units, 10),
                minimum: parseInt(data.minimum, 10) }, this.folder);
          }
        }
      }
    });
    editItemModal.present();
  }
}
