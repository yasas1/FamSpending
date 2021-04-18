import { Component, OnInit } from '@angular/core';
import { ViewControllerService } from '../services/viewController/view-controller.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.page.html',
  styleUrls: ['./reports.page.scss'],
})
export class ReportsPage implements OnInit {

  type:any;

  types=[];

  today = new Date();

  constructor(private alertViewer: ViewControllerService) { 

    

  }

  ngOnInit() {

    this.reportTypeInitializer();
  }

  reportTypeInitializer(){

    this.type = 1;

    this.types = [];

    this.types.push( { id:1,name:"Today"} );
    this.types.push( { id:2,name:"Yesterday"} );
    this.types.push( { id:3,name:"This Week"} );
    this.types.push( { id:4,name:"This Month"} );
    this.types.push( { id:5,name:"Last Month"} );
    this.types.push( { id:6,name:"This year"} );
    this.types.push( { id:7,name:"Last Year"} );

  }

  aReportIsSelected($event){
    this.alertViewer.presentAlert("gsfg sgsfgsg! ",this.type+" A Report Is Selected " + $event.target.value);
  }

}
