// import {JitCompilerFactory} from "@angular/compiler";
import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {AppComponent} from "./app.component";
import {AppRoutingModule} from "./app-routing.module";
import {AppRoutingComponent} from "./app-routing.component";
import {DashboardComponent} from "./dashboard.component";
import {UserChartComponent} from "./user-chart.component";
import {MoneyChartComponent} from "./money-chart.component";
import {OrderChartComponent} from "./order-chart.component";
import {D3ChartModule} from "./d3-chart.module";

@NgModule({
  imports: [BrowserModule, AppRoutingModule, D3ChartModule],
  declarations: [AppComponent, AppRoutingComponent, DashboardComponent, UserChartComponent, MoneyChartComponent, OrderChartComponent],
  bootstrap: [AppComponent],
//  providers: [JitCompilerFactory]
})
export class AppModule {
}
