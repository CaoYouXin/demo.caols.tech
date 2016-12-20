import {
    Directive, Input, ViewContainerRef, OnChanges, OnDestroy, ComponentRef, Component,
    ComponentFactory
} from "@angular/core";
import {DynamicTypeBuilder} from "./util/dynamic-type-builder";

@Directive({
    selector: '[d3-chart]',
    providers: [DynamicTypeBuilder]
})
export class D3ChartDirective implements OnChanges, OnDestroy {
    @Input('d3-chart')
    html: string;

    @Input('d3-chartStyleUrl')
    styleUrl: string;

    @Input('d3-chartCb')
    cb: Function;

    @Input('d3-chartCbParams')
    cbParams: Array<any>;

    componentRef: ComponentRef<Component>;

    constructor(private vcRef: ViewContainerRef, private dtb: DynamicTypeBuilder) {}

    ngOnChanges() {
        if (!this.html) return;

        this.dtb.createComponentFactory(this.html, this.styleUrl)
            .then((factory: ComponentFactory<Component>) => {
                // Target will instantiate and inject component (we'll keep reference to it)
                this.componentRef = this.vcRef.createComponent(factory);

                this.cb.apply(null, this.cbParams);
            });
    }

    ngOnDestroy(){
        if (this.componentRef) {
            this.componentRef.destroy();
            this.componentRef = null;
        }
    }
}
