import { HttpMonitor } from './../http-monitor';
import { Component } from "@angular/core";

@Component({
    selector: '[spinner]',
    templateUrl: './spinner.component.html',
    styleUrls: ['./spinner.component.css']
})
export class SpinnerComponent {
    constructor(public httpMonitor:HttpMonitor){ }

}
