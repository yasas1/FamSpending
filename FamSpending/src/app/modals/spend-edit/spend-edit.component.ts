import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-spend-edit',
  templateUrl: './spend-edit.component.html',
  styleUrls: ['./spend-edit.component.scss'],
})
export class SpendEditComponent implements OnInit {

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {}

  dismissModal(){
    this.modalCtrl.dismiss();
  }

}
