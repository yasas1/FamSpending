import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';

import { NewSpendingPageRoutingModule } from './new-spending-routing.module';

import { NewSpendingPage } from './new-spending.page';

import { FormsModule, 
  ReactiveFormsModule // add this import
} from "@angular/forms";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    NewSpendingPageRoutingModule
  ],
  declarations: [NewSpendingPage]
})
export class NewSpendingPageModule {}
