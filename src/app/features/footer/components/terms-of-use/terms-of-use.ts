import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { HeroSectionComponent } from '../../../../components/hero-section/hero-section';

@Component({
  selector: 'app-terms-of-use',
  standalone: true,
  imports: [HeroSectionComponent, MatIconModule],
  templateUrl: './terms-of-use.html'
})
export class TermsOfUse {
  breadcrumbs = [
    { label: 'Home', href: '/dashboard' },
    { label: 'Terms & Conditions' }
  ];
}