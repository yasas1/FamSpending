import { Injectable } from '@angular/core';
import { Platform} from '@ionic/angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { ViewControllerService } from '../viewController/view-controller.service';


@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  private databaseObj: SQLiteObject;

  /** Database name */
  private readonly database_name: string = "Home_Expenditure.db";

  /** Database tables names */
  private readonly expenditureTable: string = "expenditure";
  private readonly categoryTable: string = "category";
  private readonly memberTable: string = "member";

  constructor(
    //public http: HttpClient,
    private platform: Platform,
    private sqlite: SQLite,
    public alertViewer: ViewControllerService
    ) {
    console.log('Hello DatabaseProvider Provider');
    this.platform.ready().then(() => {
      this.createDB();  
    }).catch(error => {
      this.alertViewer.presentAlert("Error ","Database creating Error!");
    });
  }

  /**  Database creating */
  createDB() {
    this.sqlite.create({
      name: this.database_name,
      location: 'default'
    })
      .then((db: SQLiteObject) => {
        this.databaseObj = db;
      }).then(() => {
        this.createExpenditureTable(); // create expenditure Table
        this.createCategoryTable(); // create category Table
        this.createMemberTable(); // create Member Table
      })
      .catch(e => {
        this.alertViewer.presentAlert("Table Creating! ","Table Creating Error! ");
      })
  }

  /**  Create Expenditure table  */
  createExpenditureTable() {
    this.databaseObj.executeSql(`
    CREATE TABLE IF NOT EXISTS ${this.expenditureTable} (id INTEGER PRIMARY KEY AUTOINCREMENT, date TEXT, member_id INT, category_id INT, description TEXT, unnecessary INT DEFAULT  0, amount INT)
    `, [])
      .catch(e => {
        this.alertViewer.presentAlert("Table Creating! ","Expenditure Table Creating Error");
      });
  }

  /**  Create Category table  */
  createCategoryTable() {
    this.databaseObj.executeSql(`
    CREATE TABLE IF NOT EXISTS ${this.categoryTable} (id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT)
    `, [])
      .catch(e => {
        this.alertViewer.presentAlert("Table Creating! ","Expenditure Table Creating Error");
      });
  }

  /**  Create Member table  */
  createMemberTable() {
    this.databaseObj.executeSql(`
    CREATE TABLE IF NOT EXISTS ${this.memberTable} (id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT)
    `, [])
      .catch(e => {
        this.alertViewer.presentAlert("Table Creating! ","Expenditure Table Creating Error");
      });
  }

  /**  Table droping function (if you need) */
  dropTable(table:string) {
    this.databaseObj.executeSql(`
    DROP TABLE ${table}
    `, [])
      .then(() => {
        this.alertViewer.presentAlert("Table Dropped! ", `${ table } Table Droped`);
      })
      .catch(e => {
        this.alertViewer.presentAlert("Table Dropped! ","Error");
      });
  }

  /**
   * *************************************************
   * EXPENDITURE
   * 
   * 
   */

  /**  Insert expenditure  */
  insertExpenditure(date:string, member_id:number, category_id:number, description:string, unnecessary:number, amount:number ) {
    
    this.databaseObj.executeSql(`
      INSERT INTO expenditure (date,member_id,category_id,description,unnecessary,amount) VALUES ('${date}','${member_id}','${category_id}','${description}','${unnecessary}','${amount}')
    `, []).then(()=>{
        this.alertViewer.presentAlert("Expenditure","Added Successfully!")
      })
      .catch(e => {
        this.alertViewer.presentAlert("Insert Error! ","Expenditure inserting error");
      });
  }

  /**  Get Expenditures by date */
  getExpendituresByDate(date:string) {

    return this.databaseObj.executeSql(`
      SELECT e.id, e.date, m.name as mem_name, c.name as cat_name, e.unnecessary, e.description, e.amount 
      FROM expenditure e 
      JOIN category c ON e.category_id = c.id
      JOIN member m ON e.member_id = m.id
      WHERE e.date='${date}'
      `, [])
        .then((data) => {

          let expenditures= [];

          if(data.rows.length > 0){

            for(let i=0; i <data.rows.length; i++) {

              expenditures.push({
                id:data.rows.item(i).id,
                date:data.rows.item(i).date,
                member:data.rows.item(i).mem_name,
                category:data.rows.item(i).cat_name,         
                description:data.rows.item(i).description,
                unnecessary:data.rows.item(i).unnecessary,  
                amount:data.rows.item(i).amount
              });
            }
            return expenditures;
          }
          else{
            return 0;
          }
        })
        .catch(error => {
          this.alertViewer.presentAlert("Expenditures Getting Error! ","Get error"+JSON.stringify(error));
        }
    );
  }

  /**  Get Expenditures group by date for date range*/
  getExpendituresForMonth(dateStart:string,dateEnd:string) {

    return this.databaseObj.executeSql(`
      SELECT sum(amount) as total, date 
      FROM expenditure 
      WHERE date BETWEEN '${dateStart}' AND '${dateEnd}'
      GROUP BY date
      `, [])
        .then((data) => {

          let expenditures= [];

          if(data.rows.length > 0){

            for(let i=0; i <data.rows.length; i++) {

              expenditures.push({
                date:data.rows.item(i).date,
                total:data.rows.item(i).total,
              });
            }
            return expenditures;
          }
          else{
            return 0;
          }
        })
        .catch(error => {
          this.alertViewer.presentAlert("Expenditures Getting-Month Error! ","Get error"+JSON.stringify(error));
        }
    );
  }

  /**  Get Expenditures group by date for date range*/
  getTotalSpendsForDate(dateStart:string,dateEnd:string) {

    return this.databaseObj.executeSql(`
      SELECT sum(amount) as total
      FROM expenditure 
      WHERE date BETWEEN '${dateStart}' AND '${dateEnd}'
      `, [])
        .then((data) => {

          let expenditures= [];

          if(data.rows.length > 0 && data.rows.item(0).total !=null){

            for(let i=0; i <data.rows.length; i++) {

              expenditures.push({
                total:data.rows.item(i).total,
              });
            }
            return expenditures;
          }
          else{
            return 0;
          }
        })
        .catch(error => {
          this.alertViewer.presentAlert("Expenditures Getting-Month Error! ","Get error"+JSON.stringify(error));
        }
    );
  }
  

  /**  Get Expenditures by date grouping members or categories*/
  getSpendsGroupingCateMemForday(dateStart:string,dateEnd:string,dbType:string) {

    return this.databaseObj.executeSql(`
      SELECT sum(amount) as total, t.name as name
      FROM expenditure e
      JOIN '${dbType}' t ON e.${dbType}_id = t.id
      WHERE e.date BETWEEN '${dateStart}' AND '${dateEnd}'
      GROUP BY ${dbType}_id
      `, [])
        .then((data) => {

          let expenditures= [];

          if(data.rows.length > 0){

            for(let i=0; i <data.rows.length; i++) {

              expenditures.push({
                name:data.rows.item(i).name,
                total:data.rows.item(i).total,
              });
            }
            return expenditures;
          }
          else{
            return 0;
          }
        })
        .catch(error => {
          this.alertViewer.presentAlert("Spendings Getting Error! ","Getting error"+JSON.stringify(error));
        }
    );
  }

  /**  Get Expenditures by date grouping members or categories for summary*/
  getSpendsGroupingCateMem(dateStart1:string,dateEnd1:string,dateStart2:string,dateEnd2:string,dbType:string) {

    return this.databaseObj.executeSql(`
      SELECT sum(e.amount) as total, t.name as name, periods.start_date as start, periods.end_date as end
      FROM expenditure e
      JOIN '${dbType}' t ON e.${dbType}_id = t.id
      JOIN (SELECT '${dateStart1}' as start_date, '${dateEnd1}' as end_date UNION ALL
            SELECT '${dateStart2}' as start_date, '${dateEnd2}' as end_date) as periods
      ON e.date BETWEEN periods.start_date AND periods.end_date
      GROUP BY periods.start_date, periods.end_date, ${dbType}_id 
      
      `, [])
        .then((data) => {

          let expenditures= [];

          if(data.rows.length > 0){

            for(let i=0; i <data.rows.length; i++) {

              if(data.rows.item(i).start == dateStart1){
                expenditures.push({
                  time:"this",
                  name:data.rows.item(i).name,
                  total:data.rows.item(i).total,
                });
              }
              else{
                expenditures.push({
                  time:"last",
                  name:data.rows.item(i).name,
                  total:data.rows.item(i).total,
                });
              }
            }

            return expenditures;
          }
          else{
            return 0;
          }
        })
        .catch(error => {
          this.alertViewer.presentAlert("Spendings Getting Error! ","Getting error"+JSON.stringify(error));
        }
    );
  }

  /**  Get Expenditures by date grouping necessary*/
  getSpendsGroupByNecessary(dateStart1:string,dateEnd1:string,dateStart2:string,dateEnd2:string) {

    return this.databaseObj.executeSql(`
      SELECT sum(amount) as total, unnecessary, periods.start_date as start, periods.end_date as end
      FROM expenditure
      JOIN (SELECT '${dateStart1}' as start_date, '${dateEnd1}' as end_date UNION ALL
            SELECT '${dateStart2}' as start_date, '${dateEnd2}' as end_date) as periods
      ON date BETWEEN periods.start_date AND periods.end_date
      GROUP BY periods.start_date, periods.end_date, unnecessary
      `, [])
      .then((data) => {

        let expenditures= [];

        if(data.rows.length > 0){

          for(let i=0; i <data.rows.length; i++) {

            if(data.rows.item(i).start == dateStart1){
              expenditures.push({
                time:"this",
                unnecessary:data.rows.item(i).unnecessary,
                total:data.rows.item(i).total,
              });
            }
            else{
              expenditures.push({
                time:"last",
                unnecessary:data.rows.item(i).unnecessary,
                total:data.rows.item(i).total,
              });
            }
          }

          return expenditures;
        }
        else{
          return 0;
        }
      })
      .catch(error => {
        this.alertViewer.presentAlert("Spendings Getting Error! ","Getting error"+JSON.stringify(error));
      }
    );
  }

   /**  Get Expenditures by date grouping necessary*/
   getSpendsGroupByNecessaryForday(startDate:string,endDate:string) {

    return this.databaseObj.executeSql(`
      SELECT sum(amount) as total, unnecessary
      FROM expenditure
      WHERE date BETWEEN '${startDate}' AND '${endDate}'
      GROUP BY unnecessary
      `, [])
        .then((data) => {

          let expenditures= [];

          if(data.rows.length > 0){

            for(let i=0; i <data.rows.length; i++) {

              expenditures.push({
                unnecessary:data.rows.item(i).unnecessary,
                total:data.rows.item(i).total,
              });
            }
            return expenditures;
          }
          else{
            return 0;
          }
        })
        .catch(error => {
          this.alertViewer.presentAlert("Spendings Getting Error! ","Getting error"+JSON.stringify(error));
        }
    );
  }

  getTotalExpendituresForDateRange(dateStart:string,dateEnd:string) {

    return this.databaseObj.executeSql(`
      SELECT sum(amount) as total 
      FROM expenditure 
      WHERE date BETWEEN '${dateStart}' AND '${dateEnd}'
      `, [])
        .then((data) => {

          if(data.rows.length > 0){
            return data.rows.item(0).total;
          }
          else{
            return -1;
          }
        })
        .catch(error => {
          this.alertViewer.presentAlert("Expenditures Getting-Month Error! ","Get error"+JSON.stringify(error));
        }
    );
  }

  /**  Update Expenditure by id */
  updateExpenditureById(id:number,date:string,member_id:number,category_id:number,description:string,unnecessary:number,amount:number) {
    this.databaseObj.executeSql(`
      UPDATE expenditure
      SET date = '${date}', 
          member_id = '${member_id}', 
          category_id = '${category_id}', 
          description = '${description}',
          unnecessary = '${unnecessary}',
          amount = '${amount}'
      WHERE id = '${id}'
    `, [])
      .catch(error => {
        this.alertViewer.presentAlert("Updating Error! ","Expenditure updating error");
      }
    );
  }

  /**  Delete Expenditure by id */
  deleteExpenditureById(id:number) {
    this.databaseObj.executeSql(`
      DELETE FROM expenditure 
      WHERE id = '${id}';
    `, [])
      .catch(error => {
        this.alertViewer.presentAlert("Deleting Error! ","Expenditure updating error");
      }
    );
  }

  /**
   * *************************************************
   * CATEGORY
   * 
   * 
   */

  /**  Insert category  */
  insertCategory(name:string) {
    
    this.databaseObj.executeSql(`
      INSERT INTO category (name) VALUES ('${name}')
    `, [])
    .catch(e => {
        this.alertViewer.presentAlert("Insert Error! ","Category inserting error");
      });
  }

  /**  Get All Categories */
  async getAllCategories() {

    try {
      const data = await this.databaseObj.executeSql(`
      SELECT * FROM category 
      `, []);
      let categories = [];
      if (data.rows.length > 0) {

        for (let i = 0; i < data.rows.length; i++) {

          categories.push({
            id: data.rows.item(i).id,
            name: data.rows.item(i).name
          });

        }
        return categories;
      }
      else {
        return 0;
      }
    } catch (error) {
      this.alertViewer.presentAlert("Categories Getting Error! ", "Error" + JSON.stringify(error));
    }
  }


  /**  Check the category by name */
  async checkCategoryByName(name:string) {

    try {
      const data = await this.databaseObj.executeSql(`
      SELECT * FROM category WHERE name = '${name}';
      `, []);
      if (data.rows.length > 0) {
        return 1;
      }
      else {
        return 0;
      }
    } catch (error) {
      this.alertViewer.presentAlert("Categories Getting Error! ", "Error" + JSON.stringify(error));
    }
  }

  /**  Get Categories count */
  async getCategoriesCount() {

    try {
      const data = await this.databaseObj.executeSql(`
      SELECT COUNT(*) as count FROM category 
      `, []);
      if (Number(data.rows.item(0).count) > 0) {

        return data;
      }
      else {
        return 0;
      }
    } catch (error) {
      this.alertViewer.presentAlert("Categories Getting Error! ", "Error");
    }
  }

  /**  Update Category by id */
  updateCategoryById(id:number,name:string) {
    this.databaseObj.executeSql(`
      UPDATE category
      SET name = '${name}'
      WHERE id = '${id}';
    `, [])
      .catch(error => {
        this.alertViewer.presentAlert("Updating Error! ","Category updating error");
      }
    );
  }

  /**  Delete Category by Id */
  deleteCategoryeById(id:number) {
    this.databaseObj.executeSql(`
      DELETE FROM category 
      WHERE id = '${id}';
    `, [])
      .catch(error => {
        this.alertViewer.presentAlert("Deleting Error! ","Categories deleting error");
      }
    );
  }

  /**
   * *************************************************
   * Category + MEMBER
   * 
   * Together
   */
  
  /**  Insert category/Member  */
  insertCategoryOrMember(name:string,dbName:string) {
    
    this.databaseObj.executeSql(`
      INSERT INTO '${dbName}' (name) VALUES ('${name}')
    `, [])
    .catch(e => {
        this.alertViewer.presentAlert("Insert Error! ", dbName+" inserting error");
      });
  }

  /**  Get All Categories */
  async getMemberOrCategoriesByName(dbName:string,name:string) {

    try {
      const data = await this.databaseObj.executeSql(`
      SELECT * FROM '${dbName}' WHERE name = '${name}';
      `, []);
      let details = [];
      if (data.rows.length > 0) {

        for (let i = 0; i < data.rows.length; i++) {

          details.push({
            id: data.rows.item(i).id,
            name: data.rows.item(i).name
          });

        }
        return details;
      }
      else {
        return 0;
      }
    } catch (error) {
      this.alertViewer.presentAlert("Categories Getting Error! ", "Error" + JSON.stringify(error));
    }
  }


  /**  Check the category/member by name */
  async checkCategoryOrMemberByName(name:string,dbName:string) {

    try {
      const data = await this.databaseObj.executeSql(`
      SELECT * FROM '${dbName}' WHERE name = '${name}';
      `, []);
      if (data.rows.length > 0) {
        return 1;
      }
      else {
        return 0;
      }
    } catch (error) {
      this.alertViewer.presentAlert("Check Category/Member Error! ", "Error " + JSON.stringify(error));
    }
  }

  async getCountOfMemberOrCategories(dbName:string) {

    return this.databaseObj.executeSql(`
      SELECT COUNT(*) as count  FROM '${dbName}';
      `, [])
      .then((data) => {
          if(data.rows.length > 0){
            return data.rows.item(0).count;
          }
          else{
            return 0;
          }
        })
        .catch(error => {
          this.alertViewer.presentAlert("Counting Error! ","Get error"+JSON.stringify(error));
        }
      );
    
  }

  /**  Update Category by id */
  updateCategoryOrMemberById(id:number,name:string,dbName:string) {
    this.databaseObj.executeSql(`
      UPDATE '${dbName}'
      SET name = '${name}'
      WHERE id = '${id}';
    `, [])
      .catch(error => {
        this.alertViewer.presentAlert("Updating Error! ",dbName+" updating error");
      }
    );
  }

  /**  Delete Category by Id */
  deleteCategoryOrMemberById(id:number,dbName:string) {
    this.databaseObj.executeSql(`
      DELETE FROM '${dbName}' 
      WHERE id = '${id}';
    `, [])
      .catch(error => {
        this.alertViewer.presentAlert("Deleting Error! ", dbName+" deleting error");
      }
    );
  }

  /**  Check the category by name */
  async checkCategoryOrMemberInExpendtiureById(id:number,type:number) {

    //member_id INT, category_id INT
    let attributeName = type == 0 ? "category_id" : "member_id";

    try {
      const data = await this.databaseObj.executeSql(`
      SELECT * FROM expenditure  WHERE ${attributeName}  = ${id} LIMIT 1 ;
      `, []);
      if (data.rows.length > 0) {
        return 1;
      }
      else {
        return 0;
      }
    } catch (error) {
       return 1;
    }
  }

  /**
   * *************************************************
   * MEMBER
   * 
   * 
   */

  /**  Insert member  */
  insertMember(name:string) {
    
    this.databaseObj.executeSql(`
      INSERT INTO member (name) VALUES ('${name}')
    `, [])
      .catch(e => {
        this.alertViewer.presentAlert("Insert Error! ","Member inserting error");
      });
  }

  /**  Get all Members */
  async getAllMembers() {

    try {
      const data = await this.databaseObj.executeSql(`
      SELECT * FROM member 
      `, []);
      let members = [];
      if (data.rows.length > 0) {

        for (let i = 0; i < data.rows.length; i++) {

          members.push({
            id: data.rows.item(i).id,
            name: data.rows.item(i).name
          });

        }
        return members;
      }
      else {
        return 0;
      }
    } catch (error) {
      this.alertViewer.presentAlert("Members Getting Error! ", "Error" + JSON.stringify(error));
    }
  }

  /**  Get Members count */
  async getMembersCount() {

    try {
      const data = await this.databaseObj.executeSql(`
      SELECT COUNT(*) as count FROM member 
      `, []);
      if (Number(data.rows.item(0).count) > 0) {

        return data;
      }
      else {
        return 0;
      }
    } catch (error) {
      this.alertViewer.presentAlert("Members Getting Error! ", "Error" + JSON.stringify(error));
    }
  }

  /**  Check the category by name */
  async checkMemberByName(name:string) {

    try {
      const data = await this.databaseObj.executeSql(`
      SELECT * FROM member WHERE name = '${name}';
      `, []);
      if (data.rows.length > 0) {
        return 1;
      }
      else {
        return 0;
      }
    } catch (error) {
      this.alertViewer.presentAlert("Member Getting Error! ", "Error" + JSON.stringify(error));
    }
  }

  /**  Update Member by id */
  updateMemberyById(id:number,name:string) {
    this.databaseObj.executeSql(`
      UPDATE member
      SET name = '${name}'
      WHERE id = '${id}';
    `, [])
      .catch(error => {
        this.alertViewer.presentAlert("Updating Error! ","Member updating error");
      }
    );
  }

   /**  Delete Member by Id */
   deleteMemberById(id:number) {
    this.databaseObj.executeSql(`
      DELETE FROM member 
      WHERE id = '${id}';
    `, [])
      .catch(error => {
        this.alertViewer.presentAlert("Deleting Error! ","Member deleting error");
      }
    );
  }
}
