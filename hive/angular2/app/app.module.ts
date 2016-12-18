import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

// import { AppRoutingModule } from './app-routing.module';

import { AppComponent, Tab, Pane }  from './app.component';
// import { DashboardComponent } from './dashboard.component';

@NgModule({
  imports: [ BrowserModule ],
  declarations: [ AppComponent, Tab, Pane ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
