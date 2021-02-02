import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DaySpendingsManagePageRoutingModule } from './day-spendings-manage-routing.module';

import { DaySpendingsManagePage } from './day-spendings-manage.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DaySpendingsManagePageRoutingModule
  ],
  declarations: [DaySpendingsManagePage]
})
export class DaySpendingsManagePageModule {}
