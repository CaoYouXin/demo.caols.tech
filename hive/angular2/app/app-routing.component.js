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
var falsePromise = new Promise(function (resolve, reject) {
    resolve(false);
});
var AppRoutingComponent = (function () {
    function AppRoutingComponent() {
        this._isSelected = false;
        this.isShow = false;
        this.isAnimated = falsePromise;
    }
    AppRoutingComponent.prototype.awesome = function (e) {
        var v1 = e.offsetX * e.offsetX;
        var v2 = (e.target['offsetHeight'] - e.offsetY) * (e.target['offsetHeight'] - e.offsetY);
        var v3 = (e.target['offsetWidth'] - e.offsetX) * (e.target['offsetWidth'] - e.offsetX);
        var v4 = e.offsetY * e.offsetY;
        var radius = Math.sqrt(Math.max(v1 + v4, v1 + v2, v3 + v4, v3 + v2));
        this.isShow = true;
        this.width = this.height = 2 * radius + 'px';
        this.left = e.offsetX - radius + 'px';
        this.top = e.offsetY - radius + 'px';
        this.isAnimated = new Promise(function (resolve, reject) {
            setTimeout(function () {
                resolve(true);
            }, 100);
        });
    };
    Object.defineProperty(AppRoutingComponent.prototype, "isSelected", {
        set: function (s) {
            this._isSelected = s;
            if (!s) {
                this.isShow = s;
                this.isAnimated = falsePromise;
            }
        },
        enumerable: true,
        configurable: true
    });
    return AppRoutingComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], AppRoutingComponent.prototype, "r", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [Boolean])
], AppRoutingComponent.prototype, "isSelected", null);
AppRoutingComponent = __decorate([
    core_1.Component({
        selector: 'route',
        templateUrl: 'app/app-routing.component.html',
        styleUrls: ['app/app-routing.component.css']
    }),
    __metadata("design:paramtypes", [])
], AppRoutingComponent);
exports.AppRoutingComponent = AppRoutingComponent;
//# sourceMappingURL=app-routing.component.js.map