// import {JitCompilerFactory} from "@angular/compiler";
import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {AppComponent} from "./app.component";
import {AppRoutingModule} from "./route/app-routing.module";
import {AppRoutingComponent} from "./route/app-routing.component";
import {DashboardComponent} from "./biz/dashboard/dashboard.component";
import {UserChartComponent} from "./biz/user-chart/user-chart.component";
import {MoneyChartComponent} from "./biz/money-chart/money-chart.component";
import {OrderChartComponent} from "./biz/order-chart/order-chart.component";
import {D3ChartModule} from "./d3-chart/d3-chart.module";

@NgModule({
  imports: [BrowserModule, AppRoutingModule, D3ChartModule],
  declarations: [AppComponent, AppRoutingComponent, DashboardComponent, UserChartComponent, MoneyChartComponent, OrderChartComponent],
  bootstrap: [AppComponent],
//  providers: [JitCompilerFactory]
})
export class AppModule {
}
