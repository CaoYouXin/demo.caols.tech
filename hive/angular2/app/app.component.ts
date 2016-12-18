import { Component } from '@angular/core';

@Component({
    selector: 'my-app',
    templateUrl: 'app/app.component.html',
    styleUrls: ['app/app.component.css']
})
export class AppComponent {
    awesome(e: MouseEvent): void {
        let v1 = e.offsetX * e.offsetX;
        let v2 = (e.target['offsetHeight'] - e.offsetY) * (e.target['offsetHeight'] - e.offsetY);
        let v3 = (e.target['offsetWidth'] - e.offsetX) * (e.target['offsetWidth'] - e.offsetX);
        let v4 = e.offsetY * e.offsetY;
        let radius = Math.sqrt(Math.max(v1 + v4, v1 + v2, v3 + v4, v3 + v2));

        let mask = document.createElement('div');
        mask.classList.add('radius');
        mask.style.width = 2 * radius + 'px';
        mask.style.height = 2 * radius + 'px';

        console.log(this, e.target['lastElementChild']);
    }
}
