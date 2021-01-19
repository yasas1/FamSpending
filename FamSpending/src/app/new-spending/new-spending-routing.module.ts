import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewSpendingPage } from './new-spending.page';

const routes: Routes = [
  {
    path: '',
    component: NewSpendingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewSpendingPageRoutingModule {}
