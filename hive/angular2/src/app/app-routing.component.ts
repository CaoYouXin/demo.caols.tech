import {Component, Input} from "@angular/core";
import {Route} from "@angular/router";

const falsePromise = new Promise<boolean>((resolve, reject) => {
    resolve(false);
});

@Component({
    selector: 'route',
    templateUrl: 'app/app-routing.component.html',
    styleUrls: ['app/app-routing.component.css']
})
export class AppRoutingComponent {

    @Input() r: Route;

    private _isSelected: boolean = false;
    isShow: boolean = false;
    isAnimated: Promise<boolean> = falsePromise;

    width: string;
    height: string;
    left: string;
    top: string;

    awesome(e: MouseEvent): void {
        let v1 = e.offsetX * e.offsetX;
        let v2 = (e.target['offsetHeight'] - e.offsetY) * (e.target['offsetHeight'] - e.offsetY);
        let v3 = (e.target['offsetWidth'] - e.offsetX) * (e.target['offsetWidth'] - e.offsetX);
        let v4 = e.offsetY * e.offsetY;
        let radius = Math.sqrt(Math.max(v1 + v4, v1 + v2, v3 + v4, v3 + v2));

        this.isShow = true;
        this.width = this.height = 2 * radius + 'px';
        this.left = e.offsetX - radius + 'px';
        this.top = e.offsetY - radius + 'px';

        this.isAnimated = new Promise<boolean>((resolve, reject) => {
            setTimeout(() => {
                resolve(true);
            }, 100);
        });
    }

    @Input() set isSelected(s: boolean) {
        this._isSelected = s;
        if (!s) {
            this.isShow = s;
            this.isAnimated = falsePromise;
        }
    }
}
