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
var Pane = (function () {
    function Pane() {
    }
    return Pane;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], Pane.prototype, "id", void 0);
Pane = __decorate([
    core_1.Directive({ selector: 'pane' }),
    __metadata("design:paramtypes", [])
], Pane);
exports.Pane = Pane;
var Tab = (function () {
    function Tab() {
    }
    Object.defineProperty(Tab.prototype, "serializedPanes", {
        get: function () { return this.panes ? this.panes.map(function (p) { return p.id; }).join(', ') : ''; },
        enumerable: true,
        configurable: true
    });
    return Tab;
}());
__decorate([
    core_1.ContentChildren(Pane),
    __metadata("design:type", core_1.QueryList)
], Tab.prototype, "panes", void 0);
Tab = __decorate([
    core_1.Component({
        selector: 'tab',
        template: "\n    <div>panes: {{serializedPanes}}</div> \n  "
    }),
    __metadata("design:paramtypes", [])
], Tab);
exports.Tab = Tab;
var AppComponent = (function () {
    function AppComponent() {
        this.shouldShow = false;
    }
    AppComponent.prototype.show = function () { this.shouldShow = true; };
    return AppComponent;
}());
AppComponent = __decorate([
    core_1.Component({
        selector: 'my-app',
        template: "\n    <tab>\n      <pane id=\"1\"></pane>\n      <pane id=\"2\"></pane>\n      <pane id=\"3\" *ngIf=\"shouldShow\"></pane>\n    </tab>\n    <button (click)=\"show()\">Show 3</button>\n  ",
    }),
    __metadata("design:paramtypes", [])
], AppComponent);
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map