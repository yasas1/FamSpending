import { Component, ViewChild , Inject, LOCALE_ID} from '@angular/core';
import { formatDate } from '@angular/common';

import { AlertController } from '@ionic/angular';
import { CalendarComponent } from 'ionic2-calendar';

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
    // private database: DatabaseService, 
    // private alertViewer: ViewControlerService
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
  
  addExpendituresDB() {


    this.createRandomEvents();
      
  }

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

}
