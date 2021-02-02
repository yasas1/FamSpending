import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DaySpendingsManagePage } from './day-spendings-manage.page';

const routes: Routes = [
  {
    path: '',
    component: DaySpendingsManagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DaySpendingsManagePageRoutingModule {}
