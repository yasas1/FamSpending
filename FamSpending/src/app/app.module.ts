import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { SQLite } from '@ionic-native/sqlite/ngx';
import { DatePicker } from '@ionic-native/date-picker/ngx';
import { SpendViewComponent } from './modals/spend-view/spend-view.component';

@NgModule({
  declarations: [AppComponent, SpendViewComponent],
  entryComponents: [],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    SQLite,
    DatePicker,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
