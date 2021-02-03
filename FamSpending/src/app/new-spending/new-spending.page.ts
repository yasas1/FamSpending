import { Component,OnInit , Inject, LOCALE_ID} from '@angular/core';

import { Validators, FormBuilder, FormGroup } from "@angular/forms";
import { formatDate } from '@angular/common';

import { ViewControllerService } from '../services/viewController/view-controller.service';
import { DatabaseService } from '../services/database/database.service';

import { DatePicker } from '@ionic-native/date-picker/ngx';

@Component({
  selector: 'app-new-spending',
  templateUrl: './new-spending.page.html',
  styleUrls: ['./new-spending.page.scss'],
})
export class NewSpendingPage implements OnInit {

  public date:any;
  public member:any;
  public category:any;
  public description:any;
  public amount:number;

  public isAddDisabled = true;

  public today: any;

  public displayDate: any;

  public categories = [];

  public members = [];

  public unnecessary =0;

  expenditureForm: FormGroup;


  constructor(

    @Inject(LOCALE_ID) private locale: string,
   
    private alertViewer: ViewControllerService,
    private database: DatabaseService,
    public formBuilder: FormBuilder,
    private datePicker: DatePicker
    ) {
      this.today = formatDate(new Date(), 'MMMM dd yyyy', this.locale);
      this.date = formatDate(new Date(), 'yyyy-MM-dd', this.locale);
      this.displayDate = formatDate(new Date(), 'MMMM dd yyyy', this.locale);

      this.expenditureForm = formBuilder.group({
        //date: ['', Validators.compose([Validators.required])],
        member: ['', Validators.compose([Validators.required])],
        category: ['', Validators.compose([Validators.required])],
        description: ['', Validators.compose([Validators.required])],
        amount: ['', Validators.compose([Validators.required])],
        unnecessary: ['', Validators.compose([Validators.required])],
      });

      

  }


  ngOnInit() {
    this.checkAndsetCategories();
    this.checkAndsetMembers();
  }

  ionViewDidLoad() {
    
    // this.platform
    //   .ready()
    //   .then(() =>
    //   {
    //     setTimeout(() =>
    //     {
    //       this.checkAndsetCategories();
    //       this.checkAndsetMembers();
    //     }, 1000);
    //   });
  }

  showDatePicker(){
    this.datePicker.show({
      date: new Date(),
      mode: 'date',
      androidTheme: this.datePicker.ANDROID_THEMES.THEME_DEVICE_DEFAULT_LIGHT,
      minDate: new Date(new Date().setDate(new Date().getDate() - 200)).valueOf(),
      maxDate: new Date().valueOf() ,
    }).then(
      date => {
        this.date = formatDate(date, 'yyyy-MM-dd', this.locale);
        this.displayDate = formatDate(date, 'MMMM dd yyyy', this.locale);
      },
      err => console.log('Error occurred while getting date: ', err)
    );
  }

  addExpenditure() {

    let date = this.date;
    let member = this.member;
    let category = this.category;
    let description = this.description;
    let amount = this.amount; 
    let unnecessary = this.unnecessary;

    this.database.insertExpenditure(date,member, category, description, unnecessary, amount);

    this.expenditureForm.reset({
      member: '',
      category: '',
      description: '',
      amount: '',
      unnecessary: 0,
    });
    this.date = formatDate(new Date(), 'yyyy-MM-dd', this.locale);
    this.displayDate = formatDate(new Date(), 'MMMM dd yyyy', this.locale);
    this.unnecessary =0;

  }

  clearInputFields(){

    this.expenditureForm.reset({
      member: '',
      category: '',
      description: '',
      amount: '',
      unnecessary: 0,
    });
    this.date = formatDate(new Date(), 'yyyy-MM-dd', this.locale);
    this.displayDate = formatDate(new Date(), 'MMMM dd yyyy', this.locale);
    this.unnecessary =0;
 
  }

  getExpenditures(){
  
    this.database.getExpendituresByDate(this.date).then((result) => { 

      let expenditures;

      if(result != 0){

        expenditures =  result;  

        let expendituresLength = expenditures.length;

        if(expendituresLength > 0){

          for(let i=0; i < expendituresLength; i++) { 

            this.alertViewer.presentAlert("Get Expenditures! ",expenditures[i].id+" "+expenditures[i].date+" "+expenditures[i].member+" "+expenditures[i].category+" "+expenditures[i].amount);
          }

        }
      }  
      else{
        expenditures = 0;
      } 

    });
  }

  /** check categories count from db and set categories*/
  private checkAndsetCategories(){

    this.database.getCategoriesCount().then((result) => {

      if(result != 0){
        this.setCategoriesInDropDown();
      }
      else{
        this.insertCategories();
        this.setCategoriesInDropDown();
      }

    });

  }

  /** Get categories from db and SET category drop down ngModel */
  private setCategoriesInDropDown(){

    this.database.getAllCategories().then((result) => { 

      let categories;

      if(result != 0){

        categories =  result;  

        let categoriesLength = categories.length;

        if(categoriesLength > 0){

          for(let i=0; i < categoriesLength; i++) {

            this.categories.push({
              id:categories[i].id,
              name:categories[i].name,
            });
       
          }
        }
      }  
    });

  }

  /** insert default categories */
  private insertCategories(){
    this.database.insertCategory("Common");
    this.database.insertCategory("Food");
    this.database.insertCategory("Medicine");
    this.database.insertCategory("Bills");
    this.database.insertCategory("Fashion");
    
  }

  /** check members count from db and set categories*/
  private checkAndsetMembers(){

    this.database.getMembersCount().then((result) => {

      if(result != 0){
        this.setMembersInDropDown();
      }
      else{
        this.insertMember();
        this.setMembersInDropDown();
      }

    });

  }

  /** Get members from db and SET category drop down ngModel */
  private setMembersInDropDown(){

    this.database.getAllMembers().then((result) => { 

      let members;

      if(result != 0){

        members =  result;  

        let membersLength = members.length;

        if(membersLength > 0){

          for(let i=0; i < membersLength; i++) {

            this.members.push({
              id:members[i].id,
              name:members[i].name,
            });
       
          }
        }
      }  
    });

  }

  /** insert default Member */
  private insertMember(){
    this.database.insertMember("Family");
  }

  

}