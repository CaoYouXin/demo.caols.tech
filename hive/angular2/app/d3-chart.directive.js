"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var dynamic_type_builder_1 = require("./util/dynamic-type-builder");
var D3ChartDirective = (function () {
    function D3ChartDirective(vcRef, dtb) {
        this.vcRef = vcRef;
        this.dtb = dtb;
    }
    D3ChartDirective.prototype.ngOnChanges = function () {
        var _this = this;
        if (!this.html)
            return;
        this.dtb.createComponentFactory(this.html, this.styleUrl)
            .then(function (factory) {
            // Target will instantiate and inject component (we'll keep reference to it)
            _this.componentRef = _this.vcRef.createComponent(factory);
            _this.cb.apply(null, _this.cbParams);
        });
    };
    D3ChartDirective.prototype.ngOnDestroy = function () {
        if (this.componentRef) {
            this.componentRef.destroy();
            this.componentRef = null;
        }
    };
    return D3ChartDirective;
}());
__decorate([
    core_1.Input('d3-chart'),
    __metadata("design:type", String)
], D3ChartDirective.prototype, "html", void 0);
__decorate([
    core_1.Input('d3-chartStyleUrl'),
    __metadata("design:type", String)
], D3ChartDirective.prototype, "styleUrl", void 0);
__decorate([
    core_1.Input('d3-chartCb'),
    __metadata("design:type", Function)
], D3ChartDirective.prototype, "cb", void 0);
__decorate([
    core_1.Input('d3-chartCbParams'),
    __metadata("design:type", Array)
], D3ChartDirective.prototype, "cbParams", void 0);
D3ChartDirective = __decorate([
    core_1.Directive({
        selector: '[d3-chart]',
        providers: [dynamic_type_builder_1.DynamicTypeBuilder]
    }),
    __metadata("design:paramtypes", [core_1.ViewContainerRef, dynamic_type_builder_1.DynamicTypeBuilder])
], D3ChartDirective);
exports.D3ChartDirective = D3ChartDirective;
//# sourceMappingURL=d3-chart.directive.js.map