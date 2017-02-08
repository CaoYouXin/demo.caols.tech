import {NgModule} from "@angular/core";
import {D3ChartDirective} from "./d3-chart.directive";

@NgModule({
    declarations: [D3ChartDirective],
    exports: [D3ChartDirective]
})
export class D3ChartModule {
}
