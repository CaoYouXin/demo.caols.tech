import { Component } from '@angular/core';

@Component({
    selector: 'welcome',
    template: '<div class="welcome">Welcome</div>',
    styles: [`
        .welcome {
            text-align: center;
            line-height: 5em;
            font-size: 3rem;
            
            color: blueviolet;
            text-shadow: 5px 5px 5px #344020;
        }
    `]
})
export class DashboardComponent {}
