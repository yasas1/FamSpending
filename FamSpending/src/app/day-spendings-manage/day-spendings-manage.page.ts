import { Component ,OnInit, Inject, LOCALE_ID} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { formatDate } from '@angular/common';
import { ViewControllerService } from '../services/viewController/view-controller.service';
import { DatabaseService } from '../services/database/database.service';
import { Spending } from '../models/Spending';

@Component({
  selector: 'app-day-spendings-manage',
  templateUrl: './day-spendings-manage.page.html',
  styleUrls: ['./day-spendings-manage.page.scss'],
})
export class DaySpendingsManagePage implements OnInit {

  ParamDate = null;

  thisDay:any;

  public Spendings: Array<Spending>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private database: DatabaseService,
    private alertViewer: ViewControllerService,
    @Inject(LOCALE_ID) private locale: string
    ) {

      this.ParamDate = this.activatedRoute.snapshot.paramMap.get('date');

      this.thisDay = formatDate(new Date(this.ParamDate), 'EEEE MMMM dd yyyy', this.locale);
    }

  ngOnInit() {
    
    
    setTimeout(() =>
    {
      this.getExpenditures();
    }, 1000);

    
  }

  getExpenditures(){

    this.Spendings = [];
  
    this.database.getExpendituresByDate(this.ParamDate).then((result) => { 

      let expenditures;

      if(result != 0){

        expenditures =  result;  

        let expendituresLength = expenditures.length;

        if(expendituresLength > 0){

          for(let i=0; i < expendituresLength; i++) { 

            this.alertViewer.presentAlert("Insert Error! ",expenditures[i].amount);

            this.Spendings.push(new Spending(
              expenditures[i].id,
              expenditures[i].date,
              expenditures[i].member,
              expenditures[i].category,
              expenditures[i].description,
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
