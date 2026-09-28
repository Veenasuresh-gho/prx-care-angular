import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../enviornments/environment';


export interface CalculateDistanceRequest {
    originLatitude: number;
    originLongitude: number;
    destinationLatitude: number;
    destinationLongitude: number;
}

export interface CalculateDistanceResponse {
    DistanceKm: number;
    DistanceText: string;
    DurationSeconds: number;
    DurationText: string;
}

@Injectable({
    providedIn: 'root'
})
export class AmbulanceService {

    private http = inject(HttpClient);

    calculateDistance(
        data: CalculateDistanceRequest
    ): Observable<CalculateDistanceResponse> {

        return this.http.post<CalculateDistanceResponse>(
            environment.calculateDistanceUrl,
            data
        );

    }

}