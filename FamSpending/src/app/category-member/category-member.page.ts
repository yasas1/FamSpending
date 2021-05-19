import { Component,OnInit , Inject, LOCALE_ID} from '@angular/core';

import { formatDate } from '@angular/common';
import { ViewControllerService } from '../services/viewController/view-controller.service';
import { DatabaseService } from '../services/database/database.service';
import { Platform, AlertController } from '@ionic/angular';

import { Category } from '../models/Category';
import { Member } from '../models/Member';

@Component({
  selector: 'app-category-member',
  templateUrl: './category-member.page.html',
  styleUrls: ['./category-member.page.scss'],
})
export class CategoryMemberPage implements OnInit {

  category = new Category();

  member = new Member();

  dataArray:any=[];

  List: Array<{id: number, name: string}>;

  canAddField:boolean = true;

  today: any;

  type =0;
  typeDisplay ="Categories";

  maxNumber = 10;
  furthurmoreAdd = 1;
  dbCount = 0;

  constructor(
    @Inject(LOCALE_ID) private locale: string,
    public platform: Platform,
    public database: DatabaseService,
    public alertViewer: ViewControllerService,
    public alertCtrl: AlertController
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
          this.dbCatergoryCountChecking();
        }, 1000);
      });
  }

  dbCatergoryCountChecking(){

    this.database.getCountOfMemberOrCategories("category").then((result) => {

      this.dbCount = parseInt(result);
      this.furthurmoreAdd = this.maxNumber - this.dbCount;
      this.canAddFieldRefresh();
    });

  }

  dbMemberCountChecking(){

    this.database.getCountOfMemberOrCategories("member").then((result) => {

      this.dbCount = parseInt(result);
      this.furthurmoreAdd = this.maxNumber - this.dbCount;
      this.canAddFieldRefresh();

    });

  }

  /**  Add a new input field for category */
  addField(){

    if(this.type==0){
      this.category = new Category();
      this.category.name="";
      this.dataArray.push(this.category);

    }
    else{
      this.member = new Member();
      this.member.name="";
      this.dataArray.push(this.member);

    }

    this.canAddFieldRefresh();

  }

  canAddFieldRefresh(){

    let size = this.dataArray.length;

    if(size >= this.furthurmoreAdd){
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

    if(size >= this.furthurmoreAdd){
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
    this.canAddFieldRefresh();

  }

  typeClick(){

    if(this.type==0){
      this.typeDisplay = "Categories";
      this.getCategories();
      this.dbCatergoryCountChecking();
    }
    else{
      this.typeDisplay = "Members";
      this.getMembers();
      this.dbMemberCountChecking();
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

    let dbType = this.type == 0 ? "category" : "member";

    let size = this.dataArray.length;
    let atleastOneAdded = false;
    let allNull = true;

    if(size > 0){

      // remove duplicates
      let map = new Map<any,any>();
      for(let item of this.dataArray){
        map.set(item.name,item.name);
      }
      
      for (let entry of Array.from(map.entries())) { 
        let name = entry[0];//this.dataArray[i].name;  
        if(name != ""){
          allNull = false;
          this.database.checkCategoryOrMemberByName(name,dbType).then((result) => { 
            if(result != 1){
              try{         
                this.database.insertCategoryOrMember(name,dbType);
                atleastOneAdded = true;
              }catch(error){
                //this.alertViewer.presentAlert("Insert Error! ",error);
              }             
            }
            else{
              this.alertViewer.presentAlert("Already Here! ", dbType+`, "${name}" is already here `);
            }
          }).catch(error => {
            //this.alertViewer.presentAlert("Checking Error! ", error);
          });
        }
      }
      setTimeout(() =>
        {
        if(atleastOneAdded){
          this.alertViewer.presentAlert(dbType+ " Adding! ", "Successfully Added!");
          setTimeout(() =>
          {
            if(this.type==0){
              this.getCategories();
              this.dbCatergoryCountChecking();
            }
            else{
              this.getMembers();
              this.dbMemberCountChecking();
            }
            

          }, 500);
        }
        else if(allNull){
          this.alertViewer.presentAlert(dbType,`Name of a "${dbType}"  should be entered `);
        }
      }, 1000);

      this.canAddField = true;
      setTimeout(() =>
      {
        this.dataArray =[];
        if(this.type==0){
          this.category = new Category();
          this.category.name="";
          this.dataArray.push(this.category);
        }
        else{
          this.member = new Member();
          this.member.name="";
          this.dataArray.push(this.member);
        }

        this.canAddFieldRefresh();
        
      }, size*500);
      
    }
  }

  /**  Update Category   */
  async presentPromptToEdit(id, oldItem:string) {

    let dbType = this.type == 0 ? "category" : "member";

    const alert = await  this.alertCtrl.create({
      header: 'Update '+ dbType,
      inputs: [
        {
          name: 'updateType',
          placeholder: oldItem
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Update',
          handler: data => {

            this.database.checkCategoryOrMemberByName(data.updateType,dbType).then((result) => { 
              if(result != 1){      
                this.database.updateCategoryOrMemberById(parseInt(id),data.updateType,dbType);     
                
                setTimeout(() =>
                {
                  if(this.type==0){
                    this.getCategories();
                    this.dbCatergoryCountChecking();
                  }
                  else{
                    this.getMembers();
                    this.dbMemberCountChecking();
                  }
                }, 500);
              }
              else{
                this.alertViewer.presentAlert("Already Here! ", dbType+`, "${data.updateType}" is already here `);
              }
            }).catch(error => {}); 
            
          }
        }
      ]
    });
    alert.present();
  }

  /**  Delete Category */
  async presentConfirmToDelete(id, oldItem:string) {

    let dbType = this.type == 0 ? "category" : "member";

    this.database.checkCategoryOrMemberInExpendtiureById(parseInt(id),this.type).then(async (result) => { 

      if(result != 1){    
        
        const alert = await this.alertCtrl.create({

          header: 'Confirm Deleting',
          message: 'Do you realy want to delete the "' +oldItem+ '" '+dbType+'?',
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
    
                this.database.deleteCategoryOrMemberById(parseInt(id),dbType);
    
                setTimeout(() =>
                {
                  if(this.type==0){
                    this.getCategories();
                    this.dbCatergoryCountChecking();
                  }
                  else{
                    this.getMembers();
                    this.dbMemberCountChecking();
                  }
                 
                }, 500);
              }
            }
          ]
        });
        alert.present();
       
      }
      else{
        this.alertViewer.presentAlert("Spendings are Here! ", " Some Spendings are with this, Please Update ");
      }

    }).catch(error => {}); 

    
  }

  

}
