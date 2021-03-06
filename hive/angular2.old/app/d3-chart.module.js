"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require("@angular/core");
var d3_chart_directive_1 = require("./d3-chart.directive");
var D3ChartModule = (function () {
    function D3ChartModule() {
    }
    return D3ChartModule;
}());
D3ChartModule = __decorate([
    core_1.NgModule({
        declarations: [d3_chart_directive_1.D3ChartDirective],
        exports: [d3_chart_directive_1.D3ChartDirective]
    })
], D3ChartModule);
exports.D3ChartModule = D3ChartModule;
//# sourceMappingURL=d3-chart.module.js.map