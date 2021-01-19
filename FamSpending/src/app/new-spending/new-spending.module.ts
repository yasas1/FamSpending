import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewSpendingPageRoutingModule } from './new-spending-routing.module';

import { NewSpendingPage } from './new-spending.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NewSpendingPageRoutingModule
  ],
  declarations: [NewSpendingPage]
})
export class NewSpendingPageModule {}
