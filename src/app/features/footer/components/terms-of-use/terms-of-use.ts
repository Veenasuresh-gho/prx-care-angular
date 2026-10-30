import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { HeroSectionComponent } from '../../../../components/hero-section/hero-section';
import { CountryService } from '../../../../services/country-service';

@Component({
  selector: 'app-terms-of-use',
  standalone: true,
  imports: [HeroSectionComponent, MatIconModule],
  templateUrl: './terms-of-use.html'
})
export class TermsOfUse {
  countryService = inject(CountryService);
  breadcrumbs = [
    { label: 'Home', href: '/dashboard' },
    { label: 'Terms & Conditions' }
  ];
}