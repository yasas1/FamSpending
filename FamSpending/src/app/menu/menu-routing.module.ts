import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MenuPage } from './menu.page';

const routes: Routes = [
  {
    path: 'menu',
    component: MenuPage,
    children: [
      {
        path: 'home',
        loadChildren: '../home/home.module#HomePageModule'
      },
      {
        path: 'newSpending',
        loadChildren: '../new-spending/new-spending.module#NewSpendingPageModule'
      },
      {
        path: 'CategoryAndMember',
        loadChildren: '../category-member/category-member.module#CategoryMemberPageModule'
      },
      {
        path: 'daySpendingManage/:date',
        loadChildren: '../day-spendings-manage/day-spendings-manage.module#DaySpendingsManagePageModule'
      },
      {
        path: 'reports',
        loadChildren: '../reports/reports.module#ReportsPageModule'
      },
      {
        path: 'dayView',
        loadChildren: '../day-view/day-view.module#DayViewPageModule'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/menu/home'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MenuPageRoutingModule {}
