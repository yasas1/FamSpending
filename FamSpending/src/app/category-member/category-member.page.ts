import { Component,OnInit , Inject, LOCALE_ID} from '@angular/core';

import { formatDate } from '@angular/common';
import { ViewControllerService } from '../services/viewController/view-controller.service';
import { DatabaseService } from '../services/database/database.service';
import { Platform } from '@ionic/angular';

import { Category } from '../models/Category';
import { Member } from '../models/Member';

@Component({
  selector: 'app-category-member',
  templateUrl: './category-member.page.html',
  styleUrls: ['./category-member.page.scss'],
})
export class CategoryMemberPage implements OnInit {

  public category = new Category();

  public member = new Member();

  public dataArray:any=[];

  public List: Array<{id: number, name: string}>;

  public canAddField:boolean = true;

  public today: any;

  type =0;
  typeDisplay ="Categories";

  constructor(
    @Inject(LOCALE_ID) private locale: string,
    public platform: Platform,
    public database: DatabaseService,
    public alertViewer: ViewControllerService,

  ) { 
    this.category = new Category();
    this.category.name="";
    this.dataArray.push(this.category);
    this.today = formatDate(new Date(), 'MMMM dd yyyy', this.locale);
  }

  ngOnInit() {
    this.platform
      .ready()
      .then(() =>
      {
        setTimeout(() =>
        {
          this.getCategories();
        }, 1000);
      });
  }

  ionViewDidLoad() {

    
    
  }

  /**  Add a new input field for category */
  addField(){

    this.category = new Category();
    this.category.name="";
    this.dataArray.push(this.category);

    let size = this.dataArray.length;

    if(size >= 5){
      this.canAddField = false;
    }
    else{
      this.canAddField = true;
    }
  }

    /**  remove this input field  */
  removeField(index){

    this.dataArray.splice(index,1);

    let size = this.dataArray.length;

    if(size >=6){
      this.canAddField = false;
    }
    else{
      this.canAddField = true;
    }
  }

  /**  Clear/Remove all additional Category input fields  */
  clear(){ 

    this.dataArray =[];
    this.category = new Category();
    this.category.name="";
    this.dataArray.push(this.category);
    this.canAddField = true;

  }

  typeClick(){

    if(this.type==0){
      this.typeDisplay = "Categories";
      this.getCategories();
    }
    else{
      this.typeDisplay = "Members";
      this.getMembers();
    }
  }

  getCategories(){

    this.database.getAllCategories().then((result) => { 

      let categories;

      if(result != 0){

        categories =  result;  

        let categoriesLength = categories.length;

        if(categoriesLength > 0){

          this.List = [];

          for(let i=0; i < categoriesLength; i++) {

            this.List.push({
              id: categories[i].id,
              name: categories[i].name
            });
       
          }

        }
      }  
    });

  }

  getMembers(){

    this.database.getAllMembers().then((result) => { 

      let members;

      if(result != 0){

        members =  result;  

        let membersLength = members.length;

        if(membersLength > 0){

          this.List = [];

          for(let i=0; i < membersLength; i++) {

            this.List.push({
              id: members[i].id,
              name: members[i].name
            });
       
          }

        }
      }  
    });

  }

  onSubmit(){

    let size = this.dataArray.length;
    let atleastOneAdded = false;
    let allNull = true;

    if(size > 0){

      for(var i = 0; i < size; i++) { 
        let name = this.dataArray[i].name;  
        if(name != ""){
          allNull = false;
          this.database.checkCategoryByName(name).then((result) => { 
            if(result != 1){
              try{         
                this.database.insertCategory(name);
                atleastOneAdded = true;
              }catch(error){
                //this.alertViewer.presentAlert("Insert Error! ",error);
              }             
            }
            else{
              this.alertViewer.presentAlert("Category Here! ", ` Category "${name}" is already here `);
            }
          }).catch(error => {
            //this.alertViewer.presentAlert("Checking Error! ", error);
          });
        }
      }
      setTimeout(() =>
        {
        if(atleastOneAdded){
          this.alertViewer.presentAlert("Category Adding! ", "Successfully Added!");
          setTimeout(() =>
          {
            this.getCategories();
          }, 500);
        }
        else if(allNull){
          this.alertViewer.presentAlert("Category! ","Name of a category should be entered ");
        }
      }, 1000);

      this.canAddField = true;
      setTimeout(() =>
      {
        this.dataArray =[];
        this.category = new Category();
        this.category.name="";
        this.dataArray.push(this.category);
      }, size*500);
      
    }
  }

  

}
