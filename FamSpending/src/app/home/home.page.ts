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
    // let spit = title.match(/([\w+]+)/g);
    // this.alertViewer.presentAlert("onViewTitleChanged! ",spit[0]+" / " + spit[1]);
    // let months = ['January','February','March','April','May','June','July','August','September','October','November','December']; 

    // let checker = months.find(x=>x ===spit[0]);

    // this.alertViewer.presentAlert("onViewTitleChanged 2 ",checker);

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

  onCurrentDateChanged(event:Date) {

    
    // this.alertViewer.presentAlert("onCurrentDateChanged! ",event.toDateString());
  
    /* var today = new Date();
    today.setHours(0, 0, 0, 0);
    event.setHours(0, 0, 0, 0);

    if (this.calendar.mode === 'month') {
        if (event.getFullYear() < today.getFullYear() || (event.getFullYear() === today.getFullYear() && event.getMonth() <= today.getMonth())) {
            this.lockSwipeToNext = true;
        } else {
            this.lockSwipeToNext = false;
        }
    } */
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

    let date6Early = new Date();
    date6Early.setMonth(date6Early.getMonth() - 6);
    let dateStart6Early =  formatDate(date6Early, 'yyyy-MM-dd', this.locale);
    //this.alertViewer.presentAlert("onCurrentDateChanged 1 ",dateStart6Early);
    
    let dateStart =  formatDate(new Date(year.toString()+'-'+month.toString()+1+'-'+1), 'yyyy-MM-dd', this.locale);
    let dateEnd =  formatDate(new Date(year.toString()+'-'+month.toString()+1+'-'+this.newDateToday.getDate()), 'yyyy-MM-dd', this.locale);
    
    //update global expenditure array 
    this.getExpendituresFromTo(dateStart6Early,dateEnd);

    setTimeout(() =>
    {
      
      let expendituresLength = this.expenditures.length;
      
      for (let j = 0; j < expendituresLength; j++) {
        let spends = 0;
        
        spends = this.expenditures[j].total;

        let dateString = this.expenditures[j].date;

        let eventDate = new Date(dateString);

        if(spends!=0){
          events.push({
            title: 'Total Spending Rs. '+ spends,
            startTime: new Date( Date.UTC( eventDate.getFullYear(),eventDate.getMonth(),eventDate.getDate() ) ),
            endTime: new Date(Date.UTC( eventDate.getFullYear(),eventDate.getMonth(),eventDate.getDate()+1 )),
            allDay: true,
            date:dateString,
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
