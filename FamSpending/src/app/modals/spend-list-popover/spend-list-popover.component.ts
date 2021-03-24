import { Component,Input, OnInit,Inject, LOCALE_ID } from '@angular/core';
import { Spending } from 'src/app/models/Spending';
import { DatabaseService } from 'src/app/services/database/database.service';
import { formatDate } from '@angular/common';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-spend-list-popover',
  templateUrl: './spend-list-popover.component.html',
  styleUrls: ['./spend-list-popover.component.scss'],
})
export class SpendListPopoverComponent implements OnInit {

  @Input() date:string;
  @Input() total:string;

  Spendings: Array<Spending>;

  thisDay:any;
  displayDate:any;

  constructor(
    @Inject(LOCALE_ID) private locale: string,
    private popover:PopoverController,
    private database: DatabaseService) { }

  ngOnInit() {}

  ionViewWillEnter() {
    this.thisDay = formatDate(new Date(this.date), 'yyyy-MM-dd', this.locale);
    this.displayDate = formatDate(new Date(this.date), 'EEEE MMMM dd yyyy', this.locale);

    setTimeout(() =>
    {
      this.getExpenditures(this.thisDay);
    }, 500);
  }

  closePopover(){
     this.popover.dismiss();
  }

  getExpenditures(date:string){

    this.Spendings = [];
  
    this.database.getExpendituresByDate(date).then((result) => { 

      let expenditures;

      if(result != 0){

        expenditures =  result;  

        let expendituresLength = expenditures.length;

        if(expendituresLength > 0){

          for(let i=0; i < expendituresLength; i++) { 

            this.Spendings.push(new Spending(
              expenditures[i].id,
              expenditures[i].date,
              expenditures[i].member,
              expenditures[i].category,
              expenditures[i].description,
              expenditures[i].unnecessary,
              expenditures[i].amount
              ));
          }

        }
      }  
      else{
        expenditures = 0;
      } 

    });
  }

}
