import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../enviornments/environment';

@Injectable({
    providedIn: 'root'
})
export class AiService {

    private http = inject(HttpClient);
    private baseUrl = environment.openAi.baseUrl;

    uploadScanFile(scanType: string, file: File): Observable<any> {
        const formData = new FormData();
        formData.append('ScanType', scanType);
        formData.append('Image', file);
        return this.http.post(this.baseUrl, formData);
    }

    aiAssistantChat(scanType: string, text: string): Observable<any> {
        const formData = new FormData();
        formData.append('ScanType', scanType);
        formData.append('Content', text);
        return this.http.post(this.baseUrl, formData);
    }
}