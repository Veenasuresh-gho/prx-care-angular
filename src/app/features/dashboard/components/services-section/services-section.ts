import { Component } from '@angular/core';
import { ServiceCard } from './components/service-card/service-card';
import { DASHBOARD_SERVICES } from '../../../../services/service-items';

@Component({
  selector: 'app-services-section',
  standalone: true,
  imports: [ServiceCard],
  templateUrl: './services-section.html',
})
export class ServicesSection {
  services = DASHBOARD_SERVICES;
}