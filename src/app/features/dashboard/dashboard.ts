import { Component, inject, Signal } from '@angular/core';
import { ROUTER_OUTLET_DATA } from '@angular/router';
import { WelcomeCard } from './components/welcome-card/welcome-card';
import { ServicesSection } from './components/services-section/services-section';
import { AmbulanceCard } from './components/ambulance-card/ambulance-card';

@Component({
  selector: 'app-dashboard',
  imports: [WelcomeCard, ServicesSection, AmbulanceCard],
  standalone: true,
  templateUrl: './dashboard.html'
})
export class Dashboard {

  patientDetails = inject(ROUTER_OUTLET_DATA) as Signal<any>;

}