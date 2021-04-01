import { Component, Input, Inject, LOCALE_ID} from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-spend-view',
  templateUrl: './spend-view.component.html',
  styleUrls: ['./spend-view.component.scss'],
})
export class SpendViewComponent {

  @Input() id:number;
  @Input() date:string;
  @Input() member:string;
  @Input() category:string;
  @Input() description:string;
  @Input() unnecessary:number;
  @Input() amount:number;

  thisDay:any;


  constructor( 
    @Inject(LOCALE_ID) private locale: string,
    private popover:PopoverController,
  ) {

  }

  ionViewWillEnter() {
    this.thisDay = formatDate(new Date(this.date), 'MMMM dd yyyy', this.locale);
  }


  closePopover(){
        this.popover.dismiss();
  }
   

}
