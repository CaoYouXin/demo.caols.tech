import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {AppRoutingModule} from "./app-routing.module";
import {AppComponent} from "./app.component";
import {AppRoutingComponent} from "./app-routing.component";
import {DashboardComponent} from "./dashboard.component";
import {D3Component} from "./d3.component";

@NgModule({
    imports: [BrowserModule, AppRoutingModule],
    declarations: [AppComponent, AppRoutingComponent, DashboardComponent, D3Component],
    bootstrap: [AppComponent]
})
export class AppModule {
}
