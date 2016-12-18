import { Component } from '@angular/core';
import { Routes } from '@angular/router';

import { routes as appRoutes } from './app-routing.module';

@Component({
    selector: 'my-app',
    templateUrl: 'app/app.component.html',
    styleUrls: ['app/app.component.css']
})
export class AppComponent {
    routes: Routes = appRoutes.slice(1);
}
