import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { HeroSectionComponent } from '../../../../components/hero-section/hero-section';
import { CountryService } from '../../../../services/country-service';

@Component({
  selector: 'app-privacy-policy',
  standalone: true,
  templateUrl: './privacy-policy.html',
    imports: [
        CommonModule,
        HeroSectionComponent
    ],
})
export class PrivacyPolicy {

   countryService = inject(CountryService);
      breadcrumbs = [
    { label: 'Home', href: '/dashboard' },
    { label: 'Privacy Policy' }
  ];
}