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
    this.types.push( { id:4,name:"Last Week"} );
    this.types.push( { id:5,name:"This Month"} );
    this.types.push( { id:6,name:"Last Month"} );
    this.types.push( { id:7,name:"This year"} );
    this.types.push( { id:8,name:"Last Year"} );

  }

  /** Set displaying reports data for selected report type from drop down
   **/ 
  aReportIsSelected(){

    /**    Reports
     *  { id:1,name:"Today"}         // done
        { id:2,name:"Yesterday"}     // done
        { id:3,name:"This Week"}     // done
        { id:4,name:"Last Week"}
        { id:5,name:"This Month"}    // done
        { id:6,name:"Last Month"}    // done
        { id:7,name:"This year"}     // done
        { id:8,name:"Last Year"}     // done
     */

    switch (this.type) {
      case 1:
        this.dataInitForToday(); //today
        break;
      case 2:
        this.dataInitForYesterday();  //Yesterday
        break;
      case 3:
        this.dataInitForThisWeek();  //This Week
        break;
      case 4:
        this.dataInitForLastWeek();  //Last Week
        break;
      case 5:
        this.dataInitForThisMonth();   //This Month
        break;
      case 6:
        this.dataInitForLastMonth();  //Last Month
        break;
      case 7:
        this.dataInitForThisYear();  //This Year
        break;
      case 8:
        this.dataInitForLastYear();  //Last Year
        break;
      default:
        break;
  }


  }

  /** Initialize the data for today to display */ 
  private dataInitForToday(){

    this.displayDate = formatDate(this.today, 'EEEE MMMM dd yyyy', this.locale);

    let todayDateString = formatDate(this.today, 'yyyy-MM-dd', this.locale);

    setTimeout(() =>
    {
      this.getTotalSpending(todayDateString, todayDateString);
      this.getSpendings(todayDateString);
      this.getSpendsForCategories(todayDateString, todayDateString);
      this.getSpendsForMembers(todayDateString, todayDateString);
      this.getSpendsForNecessary(todayDateString, todayDateString);

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
      this.getTotalSpending(yesterdayDateString, yesterdayDateString);
      this.getSpendings(yesterdayDateString);
      this.getSpendsForCategories(yesterdayDateString, yesterdayDateString);
      this.getSpendsForMembers(yesterdayDateString, yesterdayDateString);
      this.getSpendsForNecessary(yesterdayDateString, yesterdayDateString);

    }, 400);

  }

  /** Initialize the data for this week to display */ 
  private dataInitForThisWeek(){

    let today = new Date(this.today);
    let first = today.getDate() - today.getDay() +1;

    let weekStart = new Date( today.setDate(first) );
    let weekEnd = new Date( today.setDate(weekStart.getDate()+6) );    
    
    let weekStartString = formatDate(weekStart, 'yyyy-MM-dd', this.locale);
    let weekEndString = formatDate(weekEnd, 'yyyy-MM-dd', this.locale);

    this.displayDate = formatDate(weekStart, 'EEE MMM dd', this.locale)+ " to "+ formatDate(weekEnd, 'EEE MMM dd yyyy', this.locale);

    setTimeout(() =>
    {
      this.getTotalSpending(weekStartString,weekEndString);
      this.Spendings = []; // individual spendings are not displaied for more than one day
      this.getSpendsForCategories(weekStartString,weekEndString);
      this.getSpendsForMembers(weekStartString,weekEndString);
      this.getSpendsForNecessary(weekStartString,weekEndString);

    }, 400);

  }

  /** Initialize the data for last week to display */ 
  private dataInitForLastWeek(){

    let today = new Date(this.today);
    let first = today.getDate() - today.getDay()  - 6 ;

    let weekStart = new Date( today.setDate(first) );
    let weekEnd = new Date( today.setDate(weekStart.getDate()+6) );    
    
    let weekStartString = formatDate(weekStart, 'yyyy-MM-dd', this.locale);
    let weekEndString = formatDate(weekEnd, 'yyyy-MM-dd', this.locale);

    this.displayDate = formatDate(weekStart, 'EEE MMM dd', this.locale)+ " to "+ formatDate(weekEnd, 'EEE MMM dd yyyy', this.locale);

    setTimeout(() =>
    {
      this.getTotalSpending(weekStartString,weekEndString);
      this.Spendings = []; // individual spendings are not displaied for more than one day
      this.getSpendsForCategories(weekStartString,weekEndString);
      this.getSpendsForMembers(weekStartString,weekEndString);
      this.getSpendsForNecessary(weekStartString,weekEndString);

    }, 400);

  }

  /** Initialize the data for this month to display */ 
  private dataInitForThisMonth(){

    let month = this.today.getMonth() +1;
    let year = this.today.getFullYear();

    let daysInMonth = new Date(year, month,0).getDate(); 

    let monthStartDate =  formatDate(new Date(year.toString()+'-'+month.toString()+'-'+1), 'yyyy-MM-dd', this.locale);
    let monthEndDate = formatDate(new Date(year.toString()+'-'+month.toString()+'-'+daysInMonth), 'yyyy-MM-dd', this.locale);

    this.displayDate = formatDate(this.today, 'MMMM yyyy', this.locale);

    setTimeout(() =>
    {
      this.getTotalSpending(monthStartDate,monthEndDate);
      this.Spendings = []; // individual spendings are not displaied for more than one day
      this.getSpendsForCategories(monthStartDate,monthEndDate);
      this.getSpendsForMembers(monthStartDate,monthEndDate);
      this.getSpendsForNecessary(monthStartDate,monthEndDate);

    }, 400);

  }

   /** Initialize the data for last month to display */ 
  private dataInitForLastMonth(){

    let getMonth = this.today.getMonth();

    let month = getMonth == 0 ? 12 : getMonth;
    let year = this.today.getFullYear();

    let daysInMonth = new Date(year, month,0).getDate(); 

    let monthStartDate =  formatDate(new Date(year.toString()+'-'+month.toString()+'-'+1), 'yyyy-MM-dd', this.locale);
    let monthEndDate = formatDate(new Date(year.toString()+'-'+month.toString()+'-'+daysInMonth), 'yyyy-MM-dd', this.locale);

    this.displayDate = formatDate(new Date(monthStartDate), 'MMMM yyyy', this.locale);

    setTimeout(() =>
    {
      this.getTotalSpending(monthStartDate,monthEndDate);
      this.Spendings = []; // individual spendings are not displaied for more than one day
      this.getSpendsForCategories(monthStartDate,monthEndDate);
      this.getSpendsForMembers(monthStartDate,monthEndDate);
      this.getSpendsForNecessary(monthStartDate,monthEndDate);

    }, 400);

  }

  /** Initialize the data for this year to display */ 
  private dataInitForThisYear(){

  
    let year = this.today.getFullYear();


    let yeartartDate =  formatDate(new Date(year.toString()+'-01-01'), 'yyyy-MM-dd', this.locale);
    let yearEndDate = formatDate(new Date(year.toString()+'-12-31'), 'yyyy-MM-dd', this.locale);

    this.displayDate = "Year "+ year;

    setTimeout(() =>
    {
      this.getTotalSpending(yeartartDate,yearEndDate);
      this.Spendings = []; // individual spendings are not displaied for more than one day
      this.getSpendsForCategories(yeartartDate,yearEndDate);
      this.getSpendsForMembers(yeartartDate,yearEndDate);
      this.getSpendsForNecessary(yeartartDate,yearEndDate);

    }, 400);

  }

  /** Initialize the data for this year to display */ 
  private dataInitForLastYear(){

  
    let year = this.today.getFullYear() - 1;


    let yeartartDate =  formatDate(new Date(year.toString()+'-01-01'), 'yyyy-MM-dd', this.locale);
    let yearEndDate = formatDate(new Date(year.toString()+'-12-31'), 'yyyy-MM-dd', this.locale);

    this.displayDate = "Year "+ year;

    setTimeout(() =>
    {
      this.getTotalSpending(yeartartDate,yearEndDate);
      this.Spendings = []; // individual spendings are not displaied for more than one day
      this.getSpendsForCategories(yeartartDate,yearEndDate);
      this.getSpendsForMembers(yeartartDate,yearEndDate);
      this.getSpendsForNecessary(yeartartDate,yearEndDate);

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

  /** To see the all spending for this day gouping by categories */
  public getSpendsForCategories(startDate:string,endDate:string){

    this.spendsByCategories = [];

    this.database.getSpendsGroupingCateMemForday(startDate,endDate, "category").then((result) => { 

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
  public getSpendsForMembers(startDate:string,endDate:string){

    this.spendsByMembers = [];

    this.database.getSpendsGroupingCateMemForday(startDate,endDate,"member").then((result) => { 

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
  public getSpendsForNecessary(startDate:string,endDate:string){

    this.spendsByNecessary= [];

    this.database.getSpendsGroupByNecessaryForday(startDate,endDate).then((result) => { 

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

}
