"use strict";
/* tslint:disable:no-unused-variable */
var app_routing_module_1 = require("./app-routing.module");
var app_component_1 = require("./app.component");
var app_routing_component_1 = require("./app-routing.component");
var dashboard_component_1 = require("./dashboard.component");
var testing_1 = require("@angular/core/testing");
var platform_browser_1 = require("@angular/platform-browser");
////////  SPECS  /////////////
/// Delete this
describe('Smoke test', function () {
    it('should run a passing test', function () {
        expect(true).toEqual(true, 'should pass');
    });
});
describe('AppComponent with TCB', function () {
    beforeEach(testing_1.async(function () {
        testing_1.TestBed.configureTestingModule({
            imports: [app_routing_module_1.AppRoutingModule],
            declarations: [app_component_1.AppComponent, app_routing_component_1.AppRoutingComponent, dashboard_component_1.DashboardComponent]
        }).compileComponents();
    }));
    it('should instantiate component', function () {
        var fixture = testing_1.TestBed.createComponent(app_component_1.AppComponent);
        expect(fixture.componentInstance instanceof app_component_1.AppComponent).toBe(true, 'should create AppComponent');
    });
    it('route length should be 1 for now', function () {
        var fixture = testing_1.TestBed.createComponent(app_component_1.AppComponent);
        console.log(JSON.stringify(fixture.componentInstance.routes));
        expect(fixture.componentInstance.routes.length).toBe(1, 'should be 1 for now');
    });
    it('should have expected <h1> text', function () {
        var fixture = testing_1.TestBed.createComponent(app_component_1.AppComponent);
        fixture.detectChanges();
        var h1 = fixture.debugElement.query(function (el) { return el.name === 'h1'; }).nativeElement; // it works
        h1 = fixture.debugElement.query(platform_browser_1.By.css('h1')).nativeElement; // preferred
        expect(h1.innerText).toMatch(/hive/i, '<h1> should say something about "Angular App"');
    });
});
//# sourceMappingURL=app.component.spec.js.map