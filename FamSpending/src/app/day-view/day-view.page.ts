import { Component ,OnInit, Inject, LOCALE_ID} from '@angular/core';
import { formatDate } from '@angular/common';
import { DatabaseService } from '../services/database/database.service';
import { Spending } from '../models/Spending';
import {AlertController, PopoverController } from '@ionic/angular';
import { SpendViewComponent } from '../modals/spend-view/spend-view.component';
import { SpendEditComponent } from '../modals/spend-edit/spend-edit.component';
import { DatePicker } from '@ionic-native/date-picker/ngx';

@Component({
  selector: 'app-day-view',
  templateUrl: './day-view.page.html',
  styleUrls: ['./day-view.page.scss'],
})
export class DayViewPage implements OnInit {

  date :any;

  today: any;

  displayDate: any;

  spendsByCategories: Array<{category: string, total: any}>;
  spendsByMembers: Array<{member: string, total: any}>;
  spendsByNecessary: Array<{unnecessary: any, total: any}>;

  Spendings: Array<Spending>;

  totalSpends:any;

  

  constructor(
    @Inject(LOCALE_ID) private locale: string,
    private database: DatabaseService,
    public alertCtrl: AlertController,
    private datePicker: DatePicker,
    private popoverController: PopoverController
    ) {

      this.date = formatDate(new Date(), 'yyyy-MM-dd', this.locale);
      this.today = formatDate(new Date(), 'MMMM dd yyyy', this.locale);
      this.displayDate = formatDate(new Date(), 'EEEE MMM dd yyyy', this.locale);

    }

    ngOnInit() {
    
      this.spendsByCategories= [];
      this.spendsByMembers= [];
      this.spendsByNecessary= [];
  
    }
  
    ionViewWillEnter() {
  
      this.dataInit();
  
    }

    showDatePicker(){
      this.datePicker.show({
        date: new Date(this.date),
        mode: 'date',
        androidTheme: this.datePicker.ANDROID_THEMES.THEME_DEVICE_DEFAULT_LIGHT,
        minDate: new Date(new Date().setDate(new Date().getDate() - 400)).valueOf(),
        maxDate: new Date().valueOf() ,
      }).then(
        date => {
          this.date = formatDate(date, 'yyyy-MM-dd', this.locale);
          this.displayDate = formatDate(date, 'EEEE MMM dd yyyy', this.locale);
          this.dataInit();
        },
        err => console.log('Error occurred while getting date: ', err)
      );
    }
  
    private dataInit(){
  
      setTimeout(() =>
      {
        this.getTotalSpending();
        this.getExpenditures();
        this.getSpendsForCategories();
        this.getSpendsForMembers();
        this.getSpendsForNecessary();
      }, 800);
  
    }
  
    // To see the total spending for this day
    private getTotalSpending(){
  
      this.totalSpends = 0;
  
      this.database.getTotalSpendsForDate(this.date,this.date).then((result) => { 
  
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
          expenditures = 0;
          this.totalSpends = 0;
        } 
      });
  
    }
  
    // To see the all spending for this day
    private getExpenditures(){
  
      this.Spendings = [];
    
      this.database.getExpendituresByDate(this.date).then((result) => { 
  
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
  
    // To see the all spending for this day gouping by categories
    private getSpendsForCategories(){
  
      this.spendsByCategories = [];
  
      this.database.getSpendsGroupingCateMemForday(this.date, this.date,"category").then((result) => { 
  
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
  
    // To see the all spending for this day gouping by members
    private getSpendsForMembers(){
  
      this.spendsByMembers = [];
  
      this.database.getSpendsGroupingCateMemForday(this.date,this.date,"member").then((result) => { 
  
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
  
    // To see the all spending for this day gouping by essential
    private getSpendsForNecessary(){
  
      this.spendsByNecessary= [];
  
      this.database.getSpendsGroupByNecessaryForday(this.date,this.date).then((result) => { 
  
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
  
    // To present the delete confirmation alert 
    async presentConfirmToDelete(id:number,amount:number,){
  
      const alert = await this.alertCtrl.create({
  
        header: 'Confirm Deleting',
        message: 'Do you realy want to delete the spedning Rs. '+amount+'/= ?',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
            }
          },
          {
            text: 'Delete',
            handler: () => {
  
              this.database.deleteExpenditureById(id);
  
              setTimeout(() =>
              {
                this.getTotalSpending();
                this.getExpenditures();
                this.getSpendsForCategories();
                this.getSpendsForMembers();
                this.getSpendsForNecessary();
              }, 700);
            }
          }
        ]
      });
      alert.present();
  
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
  
    // To present edition popover
    async spendEditModal(spending){
  
      const spendEditPopover = await this.popoverController.create({
        component: SpendEditComponent,
        backdropDismiss: false,
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
  
      // re-initialize if only an edition is occurred
      spendEditPopover.onDidDismiss().then((data) => {
          if(data['data']){
            this.dataInit(); 
          }
        });
  
      await spendEditPopover.present();
  
    }

}
