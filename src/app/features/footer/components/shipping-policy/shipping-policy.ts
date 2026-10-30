import { Component, inject } from '@angular/core';
import { HeroSectionComponent } from '../../../../components/hero-section/hero-section';
import { CountryService } from '../../../../services/country-service';

@Component({
  selector: 'app-shipping-policy',
  standalone: true,
  imports: [HeroSectionComponent],
  templateUrl: './shipping-policy.html'
})
export class ShippingPolicy {

  countryService = inject(CountryService);
  breadcrumbs = [
    { label: 'Home', href: '/dashboard' },
    { label: 'Shipping & Delivery Terms' }
  ];
}