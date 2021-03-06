"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require("@angular/core");
var platform_browser_1 = require("@angular/platform-browser");
var app_routing_module_1 = require("./app-routing.module");
var app_component_1 = require("./app.component");
var app_routing_component_1 = require("./app-routing.component");
var dashboard_component_1 = require("./dashboard.component");
var user_chart_component_1 = require("./user-chart.component");
var money_chart_component_1 = require("./money-chart.component");
var order_chart_component_1 = require("./order-chart.component");
var d3_chart_module_1 = require("./d3-chart.module");
var AppModule = (function () {
    function AppModule() {
    }
    return AppModule;
}());
AppModule = __decorate([
    core_1.NgModule({
        imports: [platform_browser_1.BrowserModule, app_routing_module_1.AppRoutingModule, d3_chart_module_1.D3ChartModule],
        declarations: [app_component_1.AppComponent, app_routing_component_1.AppRoutingComponent, dashboard_component_1.DashboardComponent, user_chart_component_1.UserChartComponent, money_chart_component_1.MoneyChartComponent, order_chart_component_1.OrderChartComponent],
        bootstrap: [app_component_1.AppComponent]
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map