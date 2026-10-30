import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { HeroSectionComponent } from '../../../../components/hero-section/hero-section';
import { CountryService } from '../../../../services/country-service';

@Component({
  selector: 'app-cancellation-policy',
  standalone: true,
  imports: [HeroSectionComponent, MatIconModule],
  templateUrl: './cancellation-policy.html'
})
export class CancellationPolicy {
  countryService = inject(CountryService);
  breadcrumbs = [
    { label: 'Home', href: '/dashboard' },
    { label: 'Cancellation Policy' }
  ];
}