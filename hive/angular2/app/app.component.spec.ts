/* tslint:disable:no-unused-variable */
import {AppRoutingModule} from "./app-routing.module";
import {AppComponent} from "./app.component";
import {AppRoutingComponent} from "./app-routing.component";
import {DashboardComponent} from "./dashboard.component";
import {TestBed, async} from "@angular/core/testing";
import {By} from "@angular/platform-browser";

////////  SPECS  /////////////

/// Delete this
describe('Smoke test', () => {
    it('should run a passing test', () => {
        expect(true).toEqual(true, 'should pass');
    });
});

describe('AppComponent with TCB', function () {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [AppRoutingModule],
            declarations: [AppComponent, AppRoutingComponent, DashboardComponent]
        }).compileComponents();
    }));

    it('should instantiate component', () => {
        let fixture = TestBed.createComponent(AppComponent);
        expect(fixture.componentInstance instanceof AppComponent).toBe(true, 'should create AppComponent');
    });

    it('route length should be 1 for now', () => {
        let fixture = TestBed.createComponent(AppComponent);

        console.log(JSON.stringify(fixture.componentInstance.routes));

        expect(fixture.componentInstance.routes.length).toBe(1, 'should be 1 for now');
    });

    it('should have expected <h1> text', () => {
        let fixture = TestBed.createComponent(AppComponent);
        fixture.detectChanges();

        let h1 = fixture.debugElement.query(el => el.name === 'h1').nativeElement;  // it works

        h1 = fixture.debugElement.query(By.css('h1')).nativeElement;            // preferred

        expect(h1.innerText).toMatch(/hive/i, '<h1> should say something about "Angular App"');
    });
});
