import {Component, ContentChildren, Directive, Input, QueryList} from '@angular/core';
@Directive({selector: 'pane'})
export class Pane {
    @Input() id: string;
}
@Component({
    selector: 'tab',
    template: `
    <div>panes: {{serializedPanes}}</div> 
  `
})
export class Tab {
    @ContentChildren(Pane) panes: QueryList<Pane>;
    get serializedPanes(): string { return this.panes ? this.panes.map(p => p.id).join(', ') : ''; }
}
@Component({
    selector: 'my-app',
    template: `
    <tab>
      <pane id="1"></pane>
      <pane id="2"></pane>
      <pane id="3" *ngIf="shouldShow"></pane>
    </tab>
    <button (click)="show()">Show 3</button>
  `,
})
export class AppComponent {
    shouldShow = false;
    show() { this.shouldShow = true; }
}
