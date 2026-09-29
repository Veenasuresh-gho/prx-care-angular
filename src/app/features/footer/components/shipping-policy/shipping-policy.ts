import { Component } from '@angular/core';
import { HeroSectionComponent } from '../../../../components/hero-section/hero-section';

@Component({
  selector: 'app-shipping-policy',
  standalone: true,
  imports: [HeroSectionComponent],
  templateUrl: './shipping-policy.html'
})
export class ShippingPolicy {
  breadcrumbs = [
    { label: 'Home', href: '/dashboard' },
    { label: 'Shipping & Delivery Terms' }
  ];
}