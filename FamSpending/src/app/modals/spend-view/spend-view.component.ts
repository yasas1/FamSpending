import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-spend-view',
  templateUrl: './spend-view.component.html',
  styleUrls: ['./spend-view.component.scss'],
})
export class SpendViewComponent {

  constructor( private modalCtrl: ModalController) { }

  dismissModal(){
    this.modalCtrl.dismiss();
  }

}
