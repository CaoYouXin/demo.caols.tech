"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require("@angular/core");
var d3_chart_module_1 = require("../d3-chart.module");
var defaultSelector = 'dynamic';
var DynamicTypeBuilder = DynamicTypeBuilder_1 = (function () {
    function DynamicTypeBuilder(compiler) {
        this.compiler = compiler;
        this._cacheOfFactories = {};
    }
    DynamicTypeBuilder.prototype.createComponentFactory = function (html, styleUrl, selector) {
        var _this = this;
        var factory = this._cacheOfFactories[html];
        if (factory) {
            console.log("Module and Type are returned from cache");
            return new Promise(function (resolve) {
                resolve(factory);
            });
        }
        // unknown template ... let's create a Type for it
        var type = DynamicTypeBuilder_1.createDynamicComponent(html, styleUrl, selector);
        var module = DynamicTypeBuilder_1.createDynamicModule(type);
        return new Promise(function (resolve) {
            _this.compiler
                .compileModuleAndAllComponentsAsync(module)
                .then(function (moduleWithFactories) {
                factory = [].find.call(moduleWithFactories.componentFactories, function (factory) {
                    return factory.componentType === type;
                });
                _this._cacheOfFactories[html] = factory;
                resolve(factory);
            });
        });
    };
    DynamicTypeBuilder.createDynamicComponent = function (html, styleUrl, selector) {
        var DC = (function () {
            function DC() {
            }
            return DC;
        }());
        DC = __decorate([
            core_1.Component({
                selector: selector || defaultSelector,
                template: html,
                styleUrls: [styleUrl]
            })
        ], DC);
        return DC;
    };
    DynamicTypeBuilder.createDynamicModule = function (type) {
        var DM = (function () {
            function DM() {
            }
            return DM;
        }());
        DM = __decorate([
            core_1.NgModule({
                imports: [d3_chart_module_1.D3ChartModule],
                declarations: [type]
            })
        ], DM);
        return DM;
    };
    return DynamicTypeBuilder;
}());
DynamicTypeBuilder = DynamicTypeBuilder_1 = __decorate([
    core_1.Injectable()
], DynamicTypeBuilder);
exports.DynamicTypeBuilder = DynamicTypeBuilder;
var DynamicTypeBuilder_1;
