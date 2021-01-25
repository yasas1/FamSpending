import { Component, ViewChild ,OnInit, Inject, LOCALE_ID} from '@angular/core';
import { formatDate } from '@angular/common';

import { AlertController,Platform } from '@ionic/angular';
import { CalendarComponent } from 'ionic2-calendar';
import { ViewControllerService } from '../services/viewController/view-controller.service';
import { DatabaseService } from '../services/database/database.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{

  eventSource = [];
  viewTitle: string;

  private newDateToday = new Date();

  calendar = {
    mode: 'month',
    currentDate: new Date(),
    dateFormatter: {
      formatMonthViewDay: function(date:Date) {
          return date.getDate().toString();
      }            
    }
  };
 
  selectedDate: Date;

  private expenditures: Array<{date: string, total: any}>;

  @ViewChild(CalendarComponent) myCal: CalendarComponent;

  constructor(
    private alertCtrl: AlertController,
    @Inject(LOCALE_ID) private locale: string,
    private database: DatabaseService, 
    private alertViewer: ViewControllerService,
    private platform: Platform,
  ){

  }

  ngOnInit() {

    this.platform
    .ready()
    .then(() =>
    {
      setTimeout(() =>
      {
        this.spendingsInitializer();
      }, 400);
    });
    
  }

  ionViewDidLoad() {
    
    
  }

  
  next() {
    this.myCal.slideNext();
  }
  
  back() {
    this.myCal.slidePrev();
  }
  
  // Selected date reange and hence title changed
  onViewTitleChanged(title) {
    this.viewTitle = title;
  }
  
  // Calendar event was clicked
  async onEventSelected(event) {
    
    let start = formatDate(event.startTime, 'fullDate', this.locale);
    let end = formatDate(event.endTime, 'fullDate', this.locale);
  
    const alert = await this.alertCtrl.create({
      header: start,
      subHeader: event.desc,
      message: 'Total Spending: ' + 'Rs. '+ event.spends,
      buttons: ['OK'],
    });
    alert.present();
  }

  onCurrentDateChanged(event:Date){
    console.log(event);
  }

  markDisabled = (date: Date) => {

    var current = new Date();
    if (date.getFullYear() == current.getFullYear() && date.getMonth() == current.getMonth() && date.getDate() == current.getDate()){
      return false;
    }
    else {
      return date >= current;
    }
  };

  createRandomEvents() {
    var events = [];

    console.log( Date.UTC(2021,0,15));
    events.push({
      title: 'Total Spending Rs.1500',
      startTime: new Date(Date.UTC(2021,0,21)),
      endTime: new Date(Date.UTC(2021,0,22)),
      allDay: true,
    },
    {
      title: 'Total Spending Rs.700',
      startTime: new Date(Date.UTC(2021,0,18)),
      endTime: new Date(Date.UTC(2021,0,19)),
      allDay: true,
    });
   
    this.eventSource = events;

  }

  private spendingsInitializer(){

    var events = [];

    let year = this.newDateToday.getFullYear();
    let month = this.newDateToday.getMonth();

    //set dates to get total spendings foreach day
    let dateStart =  formatDate(new Date(year.toString()+'-'+month.toString()+1+'-'+1), 'yyyy-MM-dd', this.locale);
    let dateEnd =  formatDate(new Date(year.toString()+'-'+month.toString()+1+'-'+this.newDateToday.getDate()), 'yyyy-MM-dd', this.locale);
    
    //update global expenditure array 
    this.getExpendituresFromTo(dateStart,dateEnd);

    setTimeout(() =>
    {
      
      let expendituresLength = this.expenditures.length;
      

      for (let i = 0; i < this.newDateToday.getDate(); i++) {

        let spends = 0;
        let loopDateString = year.toString()+'-'+month.toString()+1+'-'+(i+1);

        //set total spendings from dates
        for (let j = 0; j < expendituresLength; j++) {
          if( this.compareDate(this.expenditures[j].date ,loopDateString)==0){
            spends = this.expenditures[j].total;
            break;
          }
        }

        //push into spending array
        if(spends!=0){
          events.push({
            title: 'Total Spending Rs. '+ spends,
            startTime: new Date(Date.UTC(year,month,(i+1))),
            endTime: new Date(Date.UTC(year,month,(i+2))),
            allDay: true,
            date:loopDateString,
            spends:spends
          });   
        }
            
      }
      this.eventSource =[];
      this.eventSource = events;

    }, 600); 

  }

  


  public getExpendituresFromTo(datestart:string, dateEnd:string){

    this.expenditures = [];

    this.database.getExpendituresForMonth(datestart,dateEnd).then((result) => { 

      let expenditures;

      if(result != 0){

        expenditures =  result;  

        let expendituresLength = expenditures.length;

        if(expendituresLength > 0){

          for(let i=0; i < expendituresLength; i++) { 

            this.expenditures.push({
              date: expenditures[i].date ,
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

  addExpendituresDB() {

    this.createRandomEvents();
      
  }

  
  

  private compareDate(date1: string, date2: string): number{

    let d1 = new Date(date1); let d2 = new Date(date2);

    // Check if the dates are equal
    let same = d1.getTime() === d2.getTime();
    if (same) return 0;

    // Check if the first is greater than second
    if (d1 > d2) return 1;
  
    // Check if the first is less than second
    if (d1 < d2) return -1;
  }

}
