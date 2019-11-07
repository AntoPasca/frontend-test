import { Injectable } from '@angular/core';
import { HttpMonitor } from './http-monitor';
import { HttpInterceptor, HttpEvent, HttpHandler } from '@angular/common/http';
import { HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";
import { finalize } from 'rxjs/operators';

@Injectable()
export class RequestHttpInterceptor implements HttpInterceptor {
    constructor(private httpMonitor: HttpMonitor) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        this.httpMonitor.addRequest();
        return next.handle(req).pipe(finalize(() => {
            this.httpMonitor.removeRequest();
        }))

    }
}