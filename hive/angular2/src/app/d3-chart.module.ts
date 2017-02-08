import {NgModule} from "@angular/core";
import {D3ChartDirective} from "./d3-chart.directive";
// import {JitCompilerFactory} from "@angular/compiler";

@NgModule({
    declarations: [D3ChartDirective],
//    providers: [JitCompilerFactory],
    exports: [D3ChartDirective]
})
export class D3ChartModule {
}
