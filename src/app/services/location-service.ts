import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  locationChanged = signal(0);

  notifyLocationChanged(): void {
    this.locationChanged.update(value => value + 1);
  }
}