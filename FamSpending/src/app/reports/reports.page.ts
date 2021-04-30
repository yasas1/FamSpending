import { Component, OnInit, Inject, LOCALE_ID } from '@angular/core';
import { Spending } from '../models/Spending';
import { DatabaseService } from '../services/database/database.service';
import { ViewControllerService } from '../services/viewController/view-controller.service';
import { formatDate } from '@angular/common';
import { PopoverController } from '@ionic/angular';
import { SpendViewComponent } from '../modals/spend-view/spend-view.component';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.page.html',
  styleUrls: ['./reports.page.scss'],
})
export class ReportsPage implements OnInit {

  type:any;
  types=[];

  today = new Date();
  displayDate:any;

  totalSpends:any = 0;

  Spendings: Array<Spending>;

  spendsByCategories: Array<{category: string, total: any}>;
  spendsByMembers: Array<{member: string, total: any}>;
  spendsByNecessary: Array<{unnecessary: any, total: any}>;

  constructor(
    private alertViewer: ViewControllerService,
    private database: DatabaseService,
    @Inject(LOCALE_ID) private locale: string,
    private popoverController: PopoverController
  ){ 

  }

  ngOnInit() {

    this.reportTypeInitializer();
  }

  ionViewWillEnter() {

    this.dataInitForToday();

  }

  reportTypeInitializer(){

    this.type = 1;

    this.types = [];

    this.types.push( { id:1,name:"Today"} );
    this.types.push( { id:2,name:"Yesterday"} );
    this.types.push( { id:3,name:"This Week"} );
    this.types.push( { id:4,name:"This Month"} );
    this.types.push( { id:5,name:"Last Month"} );
    this.types.push( { id:6,name:"This year"} );
    this.types.push( { id:7,name:"Last Year"} );

  }

  /** Set displaying reports data for selected report type from drop down
   **/ 
  aReportIsSelected(){

    /**    Reports
     *  { id:1,name:"Today"} 
        { id:2,name:"Yesterday"} 
        { id:3,name:"This Week"} 
        { id:4,name:"This Month"} 
        { id:5,name:"Last Month"} 
        { id:6,name:"This year"} 
        { id:7,name:"Last Year"} 
     */

    switch (this.type) {
      case 1:
        this.dataInitForToday();
        break;
      case 2:
        this.dataInitForYesterday();
        break;
      case 3:
        console.log("It is a Tuesday.");
        break;
      default:
        console.log("No such day exists!");
        break;
  }


  }

  /** Initialize the data for today to display */ 
  private dataInitForToday(){

    this.displayDate = formatDate(this.today, 'EEEE MMMM dd yyyy', this.locale);

    let todayDateString = formatDate(this.today, 'yyyy-MM-dd', this.locale);

    setTimeout(() =>
    {
      this.getTotalSpending(todayDateString,todayDateString);
      this.getSpendings(todayDateString);
      this.getSpendsForCategories(todayDateString);
      this.getSpendsForMembers(todayDateString);
      this.getSpendsForNecessary(todayDateString);

    }, 400);

  }

  /** Initialize the data for yesterday to display */ 
  private dataInitForYesterday(){


    let yesterday = new Date(this.today);
    yesterday.setDate(this.today.getDate() - 1);

    this.displayDate = formatDate(yesterday, 'EEEE MMMM dd yyyy', this.locale);
    let yesterdayDateString = formatDate(yesterday, 'yyyy-MM-dd', this.locale);

    setTimeout(() =>
    {
      this.getTotalSpending(yesterdayDateString,yesterdayDateString);
      this.getSpendings(yesterdayDateString);
      this.getSpendsForCategories(yesterdayDateString);
      this.getSpendsForMembers(yesterdayDateString);
      this.getSpendsForNecessary(yesterdayDateString);

    }, 400);

  }

  /** Get total spendings for date range */
  getTotalSpending(startDate:string,endDate:string){
    this.totalSpends = 0;

    this.database.getTotalSpendsForDate(startDate,endDate).then((result) => { 

      let expenditures;

      if(result != 0){

        expenditures =  result;  

        let expendituresLength = expenditures.length;

        if(expendituresLength > 0){
          for(let i=0; i < expendituresLength; i++) {      
            this.totalSpends = expenditures[i].total        
          }
        }     
      }  
      else{
        this.totalSpends = 0;
      } 
    });

  }

  /** Getall spending for today */
  getSpendings(date:string){

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

  /** To present viewing popover */
  async spendViewModal(spending){

    const spendViewPopover = await this.popoverController.create({
      component: SpendViewComponent,
      componentProps: {
        id:spending.id, 
        date:spending.date,
        member:spending.member,
        category:spending.category, 
        description:spending.description,
        unnecessary:spending.unnecessary, 
        amount:spending.amount
      },
      translucent: true
    });

    await spendViewPopover.present();

  }

  /** To see the all spending for this day gouping by categories */
  public getSpendsForCategories(date:string){

    this.spendsByCategories = [];

    this.database.getSpendsGroupingCateMemForday(date, date, "category").then((result) => { 

      let expenditures;

      if(result != 0){

        expenditures =  result;  

        let expendituresLength = expenditures.length;

        if(expendituresLength > 0){

          for(let i=0; i < expendituresLength; i++) { 
           
            this.spendsByCategories.push({
              category: expenditures[i].name ,
              total:  expenditures[i].total
            });
          }

        }
      }  
      else{
        expenditures = 0;
      } 
    });
  }

  /** To see the all spending for this day gouping by members */
  public getSpendsForMembers(date:string){

    this.spendsByMembers = [];

    this.database.getSpendsGroupingCateMemForday(date,date,"member").then((result) => { 

      let expenditures;

      if(result != 0){

        expenditures =  result;  

        let expendituresLength = expenditures.length;

        if(expendituresLength > 0){

          for(let i=0; i < expendituresLength; i++) { 
            
            this.spendsByMembers.push({
              member: expenditures[i].name ,
              total:  expenditures[i].total
            });
          }

        }
      }  
      else{
        expenditures = 0;
      } 
    });
  }

  /** To see the all spending for this day gouping by essential */
  public getSpendsForNecessary(date:string){

    this.spendsByNecessary= [];

    this.database.getSpendsGroupByNecessaryForday(date).then((result) => { 

      let expenditures;

      if(result != 0){

        expenditures =  result;  

        let expendituresLength = expenditures.length;

        if(expendituresLength > 0){

          for(let i=0; i < expendituresLength; i++) { 
            
            this.spendsByNecessary.push({
              unnecessary: expenditures[i].unnecessary ,
              total:  expenditures[i].total
            });
          }

        }
      }  
      else{
        expenditures = 0;
      } 
    });
  }

  

}
