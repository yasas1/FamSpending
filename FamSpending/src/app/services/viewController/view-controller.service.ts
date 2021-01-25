import { Injectable } from '@angular/core';
import {AlertController} from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ViewControllerService {

  constructor(private alertCtrl: AlertController) {
    console.log('Hello AlertViewerProvider Provider');
  }

  public async  presentAlert(alertTitle:string, alertMessage:string) {

    
    const alert = await this.alertCtrl.create({
      header: alertTitle,
      message: alertMessage,
      buttons: ['Dismiss'],
    });
    alert.present();

    //setTimeout(()=>alert.dismiss(),3000);

  }
  
}
