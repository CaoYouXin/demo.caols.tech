"use strict";
/* tslint:disable:no-unused-variable */
var app_routing_module_1 = require("./app-routing.module");
var app_component_1 = require("./app.component");
var app_routing_component_1 = require("./app-routing.component");
var dashboard_component_1 = require("./dashboard.component");
var d3_component_1 = require("./d3.component");
var testing_1 = require("@angular/core/testing");
////////  SPECS  /////////////
describe('AppRoutingComponent with TCB', function () {
    beforeEach(testing_1.async(function () {
        testing_1.TestBed.configureTestingModule({
            imports: [app_routing_module_1.AppRoutingModule],
            declarations: [app_component_1.AppComponent, app_routing_component_1.AppRoutingComponent, dashboard_component_1.DashboardComponent, d3_component_1.D3Component]
        }).compileComponents();
    }));
    it('should instantiate component', function () {
        var fixture = testing_1.TestBed.createComponent(app_routing_component_1.AppRoutingComponent);
        expect(fixture.componentInstance instanceof app_routing_component_1.AppRoutingComponent).toBe(true, 'should create AppComponent');
    });
});
//# sourceMappingURL=app-routing.component.spec.js.map