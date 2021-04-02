import { Component, Input, OnInit } from '@angular/core';
import { ModalController, PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-spend-edit',
  templateUrl: './spend-edit.component.html',
  styleUrls: ['./spend-edit.component.scss'],
})
export class SpendEditComponent implements OnInit {

  @Input() id:number;
  @Input() date:string;
  @Input() member:string;
  @Input() category:string;
  @Input() description:string;
  @Input() unnecessary:number;
  @Input() amount:number;

  constructor(private popover:PopoverController) { }

  ngOnInit() {}

  closePopover(){
        this.popover.dismiss();
  }

  editSubmition(){

  }

}
