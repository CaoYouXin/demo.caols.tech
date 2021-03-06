import {Component} from "@angular/core";
import {Routes, Route} from "@angular/router";
import {routes as appRoutes} from "./route/app-routing.module";

@Component({
    selector: 'my-app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    routes: Routes = appRoutes.slice(1);
    selectedRoute: Route;

    clicked(r: Route) {
        this.selectedRoute = r;
    }
}
