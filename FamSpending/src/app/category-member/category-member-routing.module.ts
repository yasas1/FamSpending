import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CategoryMemberPage } from './category-member.page';

const routes: Routes = [
  {
    path: '',
    component: CategoryMemberPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CategoryMemberPageRoutingModule {}
