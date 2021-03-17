import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { SpendViewComponent } from './modals/spend-view/spend-view.component';

const routes: Routes = [
  {
    path: '',
    loadChildren: './menu/menu.module#MenuPageModule'
  }
  
  // {
  //   path: 'daySpendingManage',
  //   loadChildren: () => import('./day-spendings-manage/day-spendings-manage.module').then( m => m.DaySpendingsManagePageModule)
  // }
  // {
  //   path: 'category-member',
  //   loadChildren: () => import('./category-member/category-member.module').then( m => m.CategoryMemberPageModule)
  // }
  // {
  //   path: 'home',
  //   loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  // },
  // {
  //   path: '',
  //   redirectTo: 'home',
  //   pathMatch: 'full'
  // },
  // {
  //   path: 'menu',
  //   loadChildren: () => import('./menu/menu.module').then( m => m.MenuPageModule)
  // },
  // {
  //   path: 'new-spending',
  //   loadChildren: () => import('./new-spending/new-spending.module').then( m => m.NewSpendingPageModule)
  // },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }
