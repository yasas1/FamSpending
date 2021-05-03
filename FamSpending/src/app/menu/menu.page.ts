import { Component, OnInit } from '@angular/core';
import { Router, RouterEvent } from '@angular/router'

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {

  activePath = '';

  pages = [
    {
      name: 'Home',
      path: '/menu/home',
      icon: 'calendar'
    },
    {
      name: 'New Spending',
      path: '/menu/newSpending',
      icon: 'create'
    },
    {
      name: 'Category-Member',
      path: '/menu/CategoryAndMember',
      icon: 'briefcase' 
    },
    {
      name: 'Summary', 
      path: '/menu/reports',
      icon: 'albums'
    },
    {
      name: 'Day View', 
      path: '/menu/dayView', 
      icon: 'barcode'
    }
  ]

  aboutPath = '/menu/about';

  constructor(private router: Router) {
    this.router.events.subscribe((event: RouterEvent) => {
      this.activePath = event.url
    })
  }

  ngOnInit() {
  }

}
