import { Component, Input, OnInit } from '@angular/core';
import { ModalController, PopoverController } from '@ionic/angular';
import { DatabaseService } from 'src/app/services/database/database.service';
import { ViewControllerService } from 'src/app/services/viewController/view-controller.service';

@Component({
  selector: 'app-spend-edit',
  templateUrl: './spend-edit.component.html',
  styleUrls: ['./spend-edit.component.scss'],
})
export class SpendEditComponent implements OnInit {

  @Input() id:number;
  @Input() date:string;
  @Input() member:string; //member name
  @Input() category:string; //category name
  @Input() description:string;
  @Input() unnecessary:number;
  @Input() amount:number;

  memberId:number; // current member id
  categoryId:number; // current category id

  dbMembers= []; //member list from db
  dbCategories= []; //category list from db

  constructor(
    private popover:PopoverController,
    private database: DatabaseService,
    private alertViewer: ViewControllerService,) { }

  ngOnInit() {
    this.setCategoriesInDropDown();
    this.setMembersInDropDown();
    setTimeout(() =>
    {
      this.getMemberIdAndCategoryId();
    }, 500);
    
  }

  closePopover(){
        this.popover.dismiss();
  }

  editSubmition(){

    this.alertViewer.presentAlert("gsfg sgsfgsg! ","  " +
     this.amount+" "+
     this.member+" "+
     this.memberId+" "+
     this.category+" "+
     this.categoryId
     );
    //this.database.updateExpenditureById(this.id,this.date,this.memberId,this.categoryId,this.description,this.amount);

  }

  private getMemberIdAndCategoryId(){
    
    this.memberId = 0;
    

    this.database.getMemberOrCategoriesByName("member",this.member).then((result) => { 

      let members;

      if(result != 0){

        members =  result;  

        let membersLength = members.length;

        if(membersLength > 0){

          for(let i=0; i < membersLength; i++) {
      
            this.memberId =members[i].id;
              
          }
        }
      }  
    });

    this.categoryId =0;

    this.database.getMemberOrCategoriesByName("category",this.category).then((result) => { 

      let category;

      if(result != 0){

        category =  result;  

        let categoryLength = category.length;

        if(categoryLength > 0){

          for(let i=0; i < categoryLength; i++) {
      
            this.categoryId =category[i].id;
              
          }
        }
      }  
    });

  }

  /** Get categories from db and SET category drop down ngModel */
  private setCategoriesInDropDown(){

    this.dbCategories=[];

    this.database.getAllCategories().then((result) => { 

      let categories;

      if(result != 0){

        categories =  result;  

        let categoriesLength = categories.length;

        if(categoriesLength > 0){

          for(let i=0; i < categoriesLength; i++) {

            this.dbCategories.push({
              id:categories[i].id,
              name:categories[i].name,
            });
       
          }
        }
      }  
    });

  }

  /** Get members from db and SET category drop down ngModel */
  private setMembersInDropDown(){

    this.dbMembers=[];

    this.database.getAllMembers().then((result) => { 

      let members;

      if(result != 0){

        members =  result;  

        let membersLength = members.length;

        if(membersLength > 0){

          for(let i=0; i < membersLength; i++) {

            this.dbMembers.push({
              id:members[i].id,
              name:members[i].name,
            });
       
          }
        }
      }  
    });

  }

}
