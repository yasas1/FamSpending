import { Component ,OnInit, Inject, LOCALE_ID} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { formatDate } from '@angular/common';
import { ViewControllerService } from '../services/viewController/view-controller.service';
import { DatabaseService } from '../services/database/database.service';
import { Spending } from '../models/Spending';
import {AlertController, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { SpendViewComponent } from '../modals/spend-view/spend-view.component';
import { SpendEditComponent } from '../modals/spend-edit/spend-edit.component';

@Component({
  selector: 'app-day-spendings-manage',
  templateUrl: './day-spendings-manage.page.html',
  styleUrls: ['./day-spendings-manage.page.scss'],
})
export class DaySpendingsManagePage implements OnInit {

  ParamDate = null;

  thisDay:any;

  spendsByCategories: Array<{category: string, total: any}>;
  spendsByMembers: Array<{member: string, total: any}>;
  spendsByNecessary: Array<{unnecessary: any, total: any}>;

  public Spendings: Array<Spending>;

  constructor(
    @Inject(LOCALE_ID) private locale: string,
    private activatedRoute: ActivatedRoute,
    private database: DatabaseService,
    private alertViewer: ViewControllerService,
    public alertCtrl: AlertController,
    private router:Router,
    private modalCtrl: ModalController,
    ) {

      this.ParamDate = this.activatedRoute.snapshot.paramMap.get('date');

      this.thisDay = formatDate(new Date(this.ParamDate), 'EEEE MMMM dd yyyy', this.locale);
    }

  ngOnInit() {
    
    this.spendsByCategories= [];
    this.spendsByMembers= [];
    this.spendsByNecessary= [];

  }

  ionViewWillEnter() {

    setTimeout(() =>
    {
      this.getExpenditures();
      this.getSpendsForCategories();
      this.getSpendsForMembers();
      this.getSpendsForNecessary();
    }, 700);

  }

  navgateNew() {
    this.router.navigateByUrl('/menu/home');
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

  public getSpendsForCategories(){

    this.spendsByCategories = [];

    this.database.getSpendsGroupingCateMemForday(this.ParamDate,"category").then((result) => { 

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

  public getSpendsForMembers(){

    this.spendsByMembers = [];

    this.database.getSpendsGroupingCateMemForday(this.ParamDate,"member").then((result) => { 

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

  public getSpendsForNecessary(){

    this.spendsByNecessary= [];

    this.database.getSpendsGroupByNecessaryForday(this.ParamDate).then((result) => { 

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
        this.alertViewer.presentAlert("Spendings Getting Error! ","zero");
        expenditures = 0;
      } 
    });
  }

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

  async spendViewModal(spending){

    const modal = await this.modalCtrl.create({
      component: SpendViewComponent,
      componentProps:{
        id:spending.id, 
        date:spending.date,
        member:spending.member,
        category:spending.category, 
        description:spending.description,
        unnecessary:spending.unnecessary, 
        amount:spending.amount
      }
    });

    await modal.present();

  }

  async spendEditModal(spending){

    const modal = await this.modalCtrl.create({
      component: SpendEditComponent
    });

    await modal.present();

  }

}
