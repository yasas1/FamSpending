import { Component,OnInit , Inject, LOCALE_ID} from '@angular/core';

import { Validators, FormBuilder, FormGroup } from "@angular/forms";
import { formatDate } from '@angular/common';

import { ViewControllerService } from '../services/viewController/view-controller.service';
import { DatabaseService } from '../services/database/database.service';

import { DatePicker } from '@ionic-native/date-picker/ngx';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-new-spending',
  templateUrl: './new-spending.page.html',
  styleUrls: ['./new-spending.page.scss'],
})
export class NewSpendingPage implements OnInit {

  date:any;
  member:any;
  category:any;
  description:any;
  amount:number;

  isAddDisabled = true;

  today: any;

  displayDate: any;

  categories :Array<{id: any, name: any}>;
  members :Array<{id: any, name: any}>;

  unnecessary =0;

  expenditureForm: FormGroup;

  passDate:any;

  constructor(
    @Inject(LOCALE_ID) private locale: string,
    private database: DatabaseService,
    public formBuilder: FormBuilder,
    private datePicker: DatePicker,
    private route: ActivatedRoute
  ){

    this.today = formatDate(new Date(), 'MMMM dd yyyy', this.locale);

    this.date = formatDate(new Date(), 'yyyy-MM-dd', this.locale);
    this.displayDate = formatDate(new Date(), 'MMMM dd yyyy', this.locale);

    this.route.queryParams.subscribe(params => {
      this.passDate = params["date"];
      this.date = formatDate(new Date(this.passDate), 'yyyy-MM-dd', this.locale);
      this.displayDate = formatDate(new Date(this.passDate), 'MMMM dd yyyy', this.locale);

    });

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
    
  }

  ionViewWillEnter() {
  
    this.checkAndsetCategories();
    this.checkAndsetMembers();

  }

  showDatePicker(){
    this.datePicker.show({
      date: new Date(this.date),
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

    this.clearInputFields();

  }

  clearInputFields(){

    this.expenditureForm.reset({
      member:  this.members[0].id,
      category: this.categories[0].id,
      description: '',
      amount: '',
      unnecessary: 0,
    });
    this.date = formatDate(new Date(), 'yyyy-MM-dd', this.locale);
    this.displayDate = formatDate(new Date(), 'MMMM dd yyyy', this.locale);
    this.unnecessary =0;

    this.category = this.categories[0].id;
    this.member = this.members[0].id;
 
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

    this.categories=[];

    this.database.getAllCategories().then((result) => { 

      let categories;

      if(result != 0){

        categories =  result;  

        let categoriesLength = categories.length;

        if(categoriesLength > 0){

          this.category = categories[0].id;

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


    this.members=[];

    this.database.getAllMembers().then((result) => { 

      let members;

      if(result != 0){

        members =  result;  

        let membersLength = members.length;

        if(membersLength > 0){

          this.member = members[0].id;

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