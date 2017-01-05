import {Injectable, Compiler, ComponentFactory, Component, NgModule} from "@angular/core";
import {D3ChartModule} from "../d3-chart.module";
import {JitCompiler} from "@angular/compiler";

const defaultSelector: string = 'dynamic';

@Injectable()
export class DynamicTypeBuilder {

    private _cacheOfFactories: {[templateKey: string]: ComponentFactory<Component>} = {};

    constructor(private compiler: JitCompiler) {
    }

    public createComponentFactory(html: string, styleUrl: string, selector: string): Promise<ComponentFactory<Component>> {
        let factory = this._cacheOfFactories[html];

        if (factory) {
            console.log("Module and Type are returned from cache");

            return new Promise((resolve) => {
                resolve(factory);
            });
        }

        // unknown template ... let's create a Type for it
        let type = DynamicTypeBuilder.createDynamicComponent(html, styleUrl, selector);
        let module = DynamicTypeBuilder.createDynamicModule(type);

        return new Promise((resolve) => {
            this.compiler
                .compileModuleAndAllComponentsAsync(module)
                .then((moduleWithFactories) => {
                    factory = [].find.call(moduleWithFactories.componentFactories, function (factory: ComponentFactory<Component>) {
                        return factory.componentType === type;
                    });

                    this._cacheOfFactories[html] = factory;

                    resolve(factory);
                });
        });
    }

    private static createDynamicComponent(html: string, styleUrl: string, selector: string) {
        @Component({
            selector: selector || defaultSelector,
            template: html,
            styleUrls: [styleUrl]
        })
        class DC {
        }
        return DC;
    }

    private static createDynamicModule(type: any) {
        @NgModule({
            imports: [D3ChartModule],
            declarations: [type]
        })
        class DM {
        }

        return DM;
    }
}
