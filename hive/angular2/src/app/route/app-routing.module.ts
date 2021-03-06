import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {DashboardComponent} from "../biz/dashboard/dashboard.component";
import {UserChartComponent} from "../biz/user-chart/user-chart.component";
import {MoneyChartComponent} from "../biz/money-chart/money-chart.component";
import {OrderChartComponent} from "../biz/order-chart/order-chart.component";

export const routes: Routes = [
    {path: '', redirectTo: '/dashboard', pathMatch: 'full'},
    {path: 'dashboard', component: DashboardComponent, data: {name: 'Dashboard'}},
    {path: 'users', component: UserChartComponent, data: {name: '用户量'}},
    {path: 'money', component: MoneyChartComponent, data: {name: '收支流水'}},
    {path: 'order', component: OrderChartComponent, data: {name: '订单量'}},
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
