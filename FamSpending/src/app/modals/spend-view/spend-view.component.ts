import { Component, Input} from '@angular/core';
import { PopoverController } from '@ionic/angular';

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


  constructor( 
    private popover:PopoverController,
  ) {

  }


  closePopover(){
        this.popover.dismiss();
  }
   

}
