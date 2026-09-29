import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { HeroSectionComponent } from '../../../../components/hero-section/hero-section';

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
      breadcrumbs = [
    { label: 'Home', href: '/dashboard' },
    { label: 'Privacy Policy' }
  ];
}