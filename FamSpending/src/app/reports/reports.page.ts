import { Component, OnInit, Inject, LOCALE_ID } from '@angular/core';
import { DatabaseService } from '../services/database/database.service';
import { formatDate } from '@angular/common';
import { SummaryTotal } from '../models/SummaryTotal';
import { ViewControllerService } from '../services/viewController/view-controller.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.page.html',
  styleUrls: ['./reports.page.scss'],
})
export class ReportsPage implements OnInit {

  type:any;
  types=[];

  today = new Date();

  first="Today";
  second="Yesterday";

  firstDisplayDate:any;
  secondDisplayDate:any;

  firstTotalSpends:any = 0;
  secondTotalSpends:any = 0;

  categoryMap: Map<any, SummaryTotal>;

  memberMap : Map<any, SummaryTotal>;

  firstSpendsByNecessary: Array<{unnecessary: any, total: any}>;
  secondSpendsByNecessary: Array<{unnecessary: any, total: any}>;

  necessaryMap : Map<any, SummaryTotal>;

  constructor(
    private database: DatabaseService,
    @Inject(LOCALE_ID) private locale: string,
    public alertViewer: ViewControllerService
  ){ 

  }

  ngOnInit() {

    this.reportTypeInitializer();
  }

  ionViewWillEnter() {

    this.first = "Today";
    this.second = "Yesterday";
    this.dataInitForTodayAndYesterday();

  }

  private reportTypeInitializer(){

    this.type = 1;

    this.types = [];

    this.types.push( { id:1,name:"Today and Yesterday"} );
    this.types.push( { id:2,name:"This and Last Week"} );
    this.types.push( { id:3,name:"This and Last Month"} );
    this.types.push( { id:4,name:"This and Last year"} );

  }

  /** Set displaying reports data for selected report type from drop down
   **/ 
  aReportIsSelected(){

    /**    Reports
     *  { id:1,name:"Today and Yesterday"}          
        { id:2,name:"This and Last Week"}    
        { id:3,name:"This and Last Month"}     
        { id:4,name:"This and Last year"}
     */

    switch (this.type) {
      case 1:
        this.first = "Today";
        this.second = "Yesterday";
        this.dataInitForTodayAndYesterday(); //today
        break;
      case 2:
        this.first = "This Week";
        this.second = "Last Week";
        this.dataInitForThisAndLastWeek();  //Yesterday
        break;
      case 3:
        this.first = "This Month";
        this.second = "Last Month";
        this.dataInitForThisAndLastMonth();  //This Week
        break;
      case 4:
        this.first = "This Year";
        this.second = "Last Year";
        this.dataInitForThisAndLastYear();  //Last Week
        break;
      default:
        break;
    }

  }

  private getSummaryToArray(thisStart:string, thisEnd:string, lastStart:string, lastEnd:string){
     
    this.getTotalSpending(thisStart, thisEnd,"first");
    this.getTotalSpending(lastStart, lastEnd,"second");

    this.getSpendsForCategories(thisStart, thisEnd,lastStart, lastEnd);

    this.getSpendsForMembers(thisStart, thisEnd,lastStart, lastEnd);

    this.getSpendsForNecessary(thisStart, thisEnd,lastStart, lastEnd);
 
  }

  /** Initialize the data for today to display */ 
  private dataInitForTodayAndYesterday(){

    //--- today
    let todayDateString = formatDate(this.today, 'yyyy-MM-dd', this.locale);

    this.firstDisplayDate = ' '+formatDate(this.today, 'MMM dd', this.locale);

    //--- yesterday
    let yesterday = new Date(this.today);
    yesterday.setDate(this.today.getDate() - 1);
    let yesterdayDateString = formatDate(yesterday, 'yyyy-MM-dd', this.locale);

    this.secondDisplayDate = ' '+formatDate(yesterday, 'MMM dd', this.locale);

    this.getSummaryToArray(todayDateString, todayDateString, yesterdayDateString, yesterdayDateString);

  }

  /** Initialize the data for this week to display */ 
  private dataInitForThisAndLastWeek(){

    //---- this week
    let todayFirst = new Date(this.today);
    let first = todayFirst.getDate() - todayFirst.getDay() +1;

    let thisWeekStart = new Date( todayFirst.setDate(first) );
    let thisWeekEnd = new Date( todayFirst.setDate(thisWeekStart.getDate()+6) );    
    
    let thisWeekStartString = formatDate(thisWeekStart, 'yyyy-MM-dd', this.locale);
    let thisWeekEndString = formatDate(thisWeekEnd, 'yyyy-MM-dd', this.locale);

    this.firstDisplayDate = ' '+formatDate(thisWeekStart, 'MMM dd', this.locale)+ " to "+ formatDate(thisWeekEnd, 'MMM dd yyyy', this.locale);

    //---- last week
    let todaySecond= new Date(this.today);
    let second = todaySecond.getDate() - todaySecond.getDay()  - 6 ;

    let lastWeekStart = new Date( todaySecond.setDate(second) );
    let lastWeekEnd = new Date( todaySecond.setDate(lastWeekStart.getDate()+6) );    
    
    let lastWeekStartString = formatDate(lastWeekStart, 'yyyy-MM-dd', this.locale);
    let lastWeekEndString = formatDate(lastWeekEnd, 'yyyy-MM-dd', this.locale);

    this.secondDisplayDate = ' '+formatDate(lastWeekStart, 'MMM dd', this.locale)+ " to "+ formatDate(lastWeekEnd, 'MMM dd yyyy', this.locale);

    this.getSummaryToArray(thisWeekStartString, thisWeekEndString, lastWeekStartString, lastWeekEndString);
 

  }

  /** Initialize the data for this month to display */ 
  private dataInitForThisAndLastMonth(){

    //--- this month
    let monthFirst = this.today.getMonth() +1;
    let year = this.today.getFullYear();

    let daysInFirstMonth = new Date(year, monthFirst,0).getDate(); 

    let thisMonthStartDate =  formatDate(new Date(year.toString()+'-'+monthFirst.toString()+'-'+1), 'yyyy-MM-dd', this.locale);
    let thisMonthEndDate = formatDate(new Date(year.toString()+'-'+monthFirst.toString()+'-'+daysInFirstMonth), 'yyyy-MM-dd', this.locale);

    this.firstDisplayDate = ' '+ formatDate(this.today, 'MMMM yyyy', this.locale);

    //--- last month
    let getMonth = this.today.getMonth();
    let monthSecond = getMonth == 0 ? 12 : getMonth;

    let daysInSecondMonth = new Date(year, monthSecond,0).getDate(); 

    let lastMonthStartDate =  formatDate(new Date(year.toString()+'-'+monthSecond.toString()+'-'+1), 'yyyy-MM-dd', this.locale);
    let lastMonthEndDate = formatDate(new Date(year.toString()+'-'+monthSecond.toString()+'-'+daysInSecondMonth), 'yyyy-MM-dd', this.locale);

    this.secondDisplayDate = ' '+ formatDate(new Date(lastMonthStartDate), 'MMMM yyyy', this.locale);

    this.getSummaryToArray(thisMonthStartDate, thisMonthEndDate, lastMonthStartDate, lastMonthEndDate);

  }

  /** Initialize the data for this year to display */ 
  private dataInitForThisAndLastYear(){

    //--- this Year  
    let thisYear = this.today.getFullYear();
    let thisYeartartDate =  formatDate(new Date(thisYear.toString()+'-01-01'), 'yyyy-MM-dd', this.locale);
    let thisYearEndDate = formatDate(new Date(thisYear.toString()+'-12-31'), 'yyyy-MM-dd', this.locale);

    this.firstDisplayDate = ' '+ thisYear;

    //--- last year
    let lastYear = this.today.getFullYear() - 1;

    let lastYeartartDate =  formatDate(new Date(lastYear.toString()+'-01-01'), 'yyyy-MM-dd', this.locale);
    let lastYearEndDate = formatDate(new Date(lastYear.toString()+'-12-31'), 'yyyy-MM-dd', this.locale);

    this.secondDisplayDate = ' '+ lastYear;

    this.getSummaryToArray(thisYeartartDate, thisYearEndDate, lastYeartartDate, lastYearEndDate);

  }

  /** Get total spendings for date range */
  getTotalSpending(startDate:string,endDate:string,type:string){

    type=="first"? this.firstTotalSpends = 0 : this.secondTotalSpends = 0;
    
    this.database.getTotalSpendsForDate(startDate,endDate).then((result) => { 

      let expenditures;

      if(result != 0){

        expenditures =  result;  
        let expendituresLength = expenditures.length;

        if(expendituresLength > 0){
          for(let i=0; i < expendituresLength; i++) {     
            if(type=="first"){
              this.firstTotalSpends = expenditures[i].total;
            }
            else{
              this.secondTotalSpends  = expenditures[i].total;
            }     
          }
        }     
      }  
      else{
        expenditures = 0;
      } 
    });

  }

  /** To see the all spending for this day gouping by categories */
  private getSpendsForCategories(dateStart1:string,dateEnd1:string,dateStart2:string,dateEnd2:string){

    this.categoryMap = new Map<any, SummaryTotal>();

    this.database.getSpendsGroupingCateMem(dateStart1,dateEnd1,dateStart2,dateEnd2, "category").then((result) => { 

      let expenditures;

      if(result != 0){

        expenditures =  result;  
        let expendituresLength = expenditures.length;

        if(expendituresLength > 0){

          for(let i=0; i < expendituresLength; i++) { 

            let name = expenditures[i].name;
            if(expenditures[i].time == "this"){
              let sumTot = this.categoryMap.has(name)? this.categoryMap.get(expenditures[i].name): new SummaryTotal();
              sumTot.firstTotal= expenditures[i].total;
              this.categoryMap.set(name,sumTot);
            }
            else{
              let sumTot = this.categoryMap.has(name)? this.categoryMap.get(name): new SummaryTotal();
              sumTot.secondTotal= expenditures[i].total;
              this.categoryMap.set(name,sumTot)
            }     
          }
        }
      }  
      else{
        expenditures = 0;
      } 
    });

  }

  /** To see the all spending for this day gouping by members */
  private getSpendsForMembers(dateStart1:string,dateEnd1:string,dateStart2:string,dateEnd2:string){

    this.memberMap = new Map<any, SummaryTotal>();

    this.database.getSpendsGroupingCateMem(dateStart1,dateEnd1,dateStart2,dateEnd2, "member").then((result) => { 

      let expenditures;

      if(result != 0){

        expenditures =  result;  
        let expendituresLength = expenditures.length;

        if(expendituresLength > 0){

          for(let i=0; i < expendituresLength; i++) { 

            let name = expenditures[i].name;
            if(expenditures[i].time == "this"){
              let sumTot = this.memberMap.has(name)? this.memberMap.get(expenditures[i].name): new SummaryTotal();
              sumTot.firstTotal= expenditures[i].total;
              this.memberMap.set(name,sumTot);
            }
            else{
              let sumTot = this.memberMap.has(name)? this.memberMap.get(name): new SummaryTotal();
              sumTot.secondTotal= expenditures[i].total;
              this.memberMap.set(name,sumTot)
            }       
          }
        }
      }  
      else{
        expenditures = 0;
      } 
    });
  }

  /** To see the all spending for this day gouping by essential */
  private getSpendsForNecessary(dateStart1:string,dateEnd1:string,dateStart2:string,dateEnd2:string){

    this.necessaryMap = new Map<any, SummaryTotal>();

    this.database.getSpendsGroupByNecessary(dateStart1,dateEnd1,dateStart2,dateEnd2).then((result) => { 

      let expenditures;

      if(result != 0){

        expenditures =  result;  
        let expendituresLength = expenditures.length;

        if(expendituresLength > 0){

          for(let i=0; i < expendituresLength; i++) { 

            let unnecessary = expenditures[i].unnecessary;
            if(expenditures[i].time == "this"){
              let sumTot = this.necessaryMap.has(unnecessary)? this.necessaryMap.get(expenditures[i].unnecessary): new SummaryTotal();
              sumTot.firstTotal= expenditures[i].total;
              this.necessaryMap.set(unnecessary,sumTot);
            }
            else{
              let sumTot = this.necessaryMap.has(unnecessary)? this.necessaryMap.get(unnecessary): new SummaryTotal();
              sumTot.secondTotal= expenditures[i].total;
              this.necessaryMap.set(unnecessary,sumTot)
            }       
          }
        }
      }  
      else{
        expenditures = 0;
      } 
    });

    
  }


}
