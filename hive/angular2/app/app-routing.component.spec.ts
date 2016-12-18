/* tslint:disable:no-unused-variable */
import {AppRoutingModule} from "./app-routing.module";
import {AppComponent} from "./app.component";
import {AppRoutingComponent} from "./app-routing.component";
import {DashboardComponent} from "./dashboard.component";
import {D3Component} from "./d3.component";
import {TestBed, async} from "@angular/core/testing";
import {By} from "@angular/platform-browser";

////////  SPECS  /////////////

describe('AppRoutingComponent with TCB', function () {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [AppRoutingModule],
            declarations: [AppComponent, AppRoutingComponent, DashboardComponent, D3Component]
        }).compileComponents();
    }));

    it('should instantiate component', () => {
        let fixture = TestBed.createComponent(AppRoutingComponent);
        expect(fixture.componentInstance instanceof AppRoutingComponent).toBe(true, 'should create AppComponent');
    });

});