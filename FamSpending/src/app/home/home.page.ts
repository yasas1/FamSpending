import { Component, ViewChild , Inject, LOCALE_ID} from '@angular/core';
import { formatDate } from '@angular/common';

import { AlertController } from '@ionic/angular';
import { CalendarComponent } from 'ionic2-calendar';
import { ViewControllerService } from '../services/viewController/view-controller.service';
import { DatabaseService } from '../services/database/database.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  eventSource = [];
  viewTitle: string;

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
 
  @ViewChild(CalendarComponent) myCal: CalendarComponent;


  constructor(
    private alertCtrl: AlertController,
    @Inject(LOCALE_ID) private locale: string,
    private database: DatabaseService, 
    private alertViewer: ViewControllerService
    ) {}

  
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
      // Use Angular date pipe for conversion
      let start = formatDate(event.startTime, 'fullDate', this.locale);
      let end = formatDate(event.endTime, 'fullDate', this.locale);
   
      const alert = await this.alertCtrl.create({
        header: start,
        subHeader: event.desc,
        message: 'Total Spending: ' + 'Rs.1500 ',
        buttons: ['OK'],
      });
      alert.present();
    }
  
    onCurrentDateChanged(event:Date){
      console.log(event);
    }
  
    markDisabled = (date: Date) => {
      var current = new Date();
      return date >= current;
    };

  createRandomEvents() {
    var events = [];
    var date = new Date("2021-01-20");

    console.log( Date.UTC(2021,0,15));
    events.push({
      title: 'Total Spending Rs.1500',
      startTime: new Date(Date.UTC(2021,0,20)),
      endTime: new Date(Date.UTC(2021,0,20)),
      allDay: false,
    },
    {
      title: 'Total Spending Rs.700',
      startTime: new Date(Date.UTC(2021,0,18)),
      endTime: new Date(Date.UTC(2021,0,18)),
      allDay: false,
    });
   
    this.eventSource = events;
  }

  addExpendituresDB() {

    this.insertCategories();
    this.insertMember();
    this.addExpenditure();

    this.createRandomEvents();
      
  }

  getExpendituresDB() {
    this.getExpenditures();
     
  }

  
  addExpenditure() {

    let date = "2021-01-17";
    let member = 1;
    let category = 1;
    let description = "noted";
    let amount = 250; 
    let unnecessary = 1;

    this.database.insertExpenditure(date,member, category, description, unnecessary, amount);
  
  

  }

  getExpenditures(){

    this.database.getExpendituresForMonth("2021-01-01","2021-01-31").then((result) => { 

      let expenditures;

      if(result != 0){

        expenditures =  result;  

        let expendituresLength = expenditures.length;

        if(expendituresLength > 0){

          for(let i=0; i < expendituresLength; i++) { 

            this.alertViewer.presentAlert("Get Expenditures! ",expenditures[i].date+" "+expenditures[i].total);
          }

        }
      }  
      else{
        expenditures = 0;
        this.alertViewer.presentAlert("Get Expenditures! ","nooo");
      } 

    });
  }

  private insertCategories(){
    this.database.insertCategory("Food");
    this.database.insertCategory("Medicine");
    this.database.insertCategory("Bills");
    this.database.insertCategory("Fashion");
    this.database.insertCategory("Common");
  }

  private insertMember(){
    this.database.insertMember("Family");
  }

}
