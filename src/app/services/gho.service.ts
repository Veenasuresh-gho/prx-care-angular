import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ghoiin, tags, ghoresult } from '../models/gho-model';
import { environment } from '../../enviornments/environment';

@Injectable({
    providedIn: 'root'
})
export class GHOService {

    private http = inject(HttpClient);

    private url = environment.application.apiUrl;

    getdata(
        action: string,
        ts: tags[]
    ): Observable<ghoresult> {

        const request: ghoiin = {
            Token: '',
            Action: action,
            Lts: new Date().toString(),
            BrowseInfo: navigator.userAgent,
            Mode: 'WEB-HIS',
            Tags: ts
        };

        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache'
        });

        return this.http.post<ghoresult>(
            this.url,
            request,
            { headers }
        );
    }
}