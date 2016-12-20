import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {DashboardComponent} from "./dashboard.component";
import {UserChartComponent} from "./user-chart.component";
import {MoneyChartComponent} from "./money-chart.component";

export const routes: Routes = [
    {path: '', redirectTo: '/dashboard', pathMatch: 'full'},
    {path: 'dashboard', component: DashboardComponent, data: {name: 'Dashboard'}},
    {path: 'users', component: UserChartComponent, data: {name: '用户量'}},
    {path: 'money', component: MoneyChartComponent, data: {name: '收支流水'}},
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
