import { Component, inject, Signal } from '@angular/core';
import { ROUTER_OUTLET_DATA } from '@angular/router';
import { WelcomeCard } from './components/welcome-card/welcome-card';
import { ServicesSection } from './components/services-section/services-section';

@Component({
  selector: 'app-dashboard',
  imports: [WelcomeCard, ServicesSection],
  standalone: true,
  templateUrl: './dashboard.html'
})
export class Dashboard {

  patientDetails = inject(ROUTER_OUTLET_DATA) as Signal<any>;

}