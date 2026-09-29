import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { HeroSectionComponent } from '../../../../components/hero-section/hero-section';

@Component({
  selector: 'app-cancellation-policy',
  standalone: true,
  imports: [HeroSectionComponent, MatIconModule],
  templateUrl: './cancellation-policy.html'
})
export class CancellationPolicy {
  breadcrumbs = [
    { label: 'Home', href: '/dashboard' },
    { label: 'Cancellation Policy' }
  ];
}