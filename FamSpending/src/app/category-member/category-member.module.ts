import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CategoryMemberPageRoutingModule } from './category-member-routing.module';

import { CategoryMemberPage } from './category-member.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CategoryMemberPageRoutingModule
  ],
  declarations: [CategoryMemberPage]
})
export class CategoryMemberPageModule {}
