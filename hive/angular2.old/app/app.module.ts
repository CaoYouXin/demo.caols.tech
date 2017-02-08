import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {AppRoutingModule} from "./app-routing.module";
import {AppComponent} from "./app.component";
import {AppRoutingComponent} from "./app-routing.component";
import {DashboardComponent} from "./dashboard.component";
import {UserChartComponent} from "./user-chart.component";
import {MoneyChartComponent} from "./money-chart.component";
import {OrderChartComponent} from "./order-chart.component";
import {D3ChartDirective} from "./d3-chart.directive";
import {D3ChartModule} from "./d3-chart.module";

@NgModule({
    imports: [BrowserModule, AppRoutingModule, D3ChartModule],
    declarations: [AppComponent, AppRoutingComponent, DashboardComponent, UserChartComponent, MoneyChartComponent, OrderChartComponent],
    bootstrap: [AppComponent]
})
export class AppModule {
}
