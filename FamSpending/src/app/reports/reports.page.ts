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

  aReportIsSelected(){
    this.alertViewer.presentAlert("gsfg sgsfgsg! "," A Report Is Selected " + this.type);
  }

  private dataInitForToday(){

    this.displayDate = formatDate(this.today, 'EEEE MMMM dd yyyy', this.locale)

    let todayDateString = formatDate(this.today, 'yyyy-MM-dd', this.locale);

    setTimeout(() =>
    {
      this.getTotalSpending(todayDateString,todayDateString);
      this.getSpendings(todayDateString);

    }, 400);

  }

  // Get total spendings for date range
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

  // Getall spending for today
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

  // To present viewing popover
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
