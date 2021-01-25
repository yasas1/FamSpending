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
    }
  ]

  constructor(private router: Router) {
    this.router.events.subscribe((event: RouterEvent) => {
      this.activePath = event.url
    })
  }

  ngOnInit() {
  }

}