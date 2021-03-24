import { Component,Input, OnInit } from '@angular/core';
import { Spending } from 'src/app/models/Spending';
import { DatabaseService } from 'src/app/services/database/database.service';

@Component({
  selector: 'app-spend-list-popover',
  templateUrl: './spend-list-popover.component.html',
  styleUrls: ['./spend-list-popover.component.scss'],
})
export class SpendListPopoverComponent implements OnInit {

  @Input() date:string;
  @Input() total:string;

  Spendings: Array<Spending>;

  constructor(private database: DatabaseService) { }

  ngOnInit() {}

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
