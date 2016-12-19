import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {AppRoutingModule} from "./app-routing.module";
import {AppComponent} from "./app.component";
import {AppRoutingComponent} from "./app-routing.component";
import {DashboardComponent} from "./dashboard.component";
import {UserChartComponent} from "./user-chart.component";
import {MoneyChartComponent} from "./money-chart.component";

@NgModule({
    imports: [BrowserModule, AppRoutingModule],
    declarations: [AppComponent, AppRoutingComponent, DashboardComponent, UserChartComponent, MoneyChartComponent],
    bootstrap: [AppComponent]
})
export class AppModule {
}
