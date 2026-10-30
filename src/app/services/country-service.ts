import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CountryService {

  country = signal<'IN' | 'US' | 'OTHER'>('OTHER');

  isIndia = () => this.country() === 'IN';
  isUS = () => this.country() === 'US';

  async detectCountry() {
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();

      if (data.country_code === 'IN' || data.country_code === 'US') {
        this.country.set(data.country_code);
      } else {
        this.country.set('OTHER');
      }

      console.log('Detected Country:', this.country());

    } catch (error) {
      console.error('Country detection failed', error);
      this.country.set('OTHER');
    }
  }
}