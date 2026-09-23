import { Component, inject, Signal } from '@angular/core';
import { ROUTER_OUTLET_DATA } from '@angular/router';
import { WelcomeCard } from './welcome-card/welcome-card';

@Component({
  selector: 'app-dashboard',
  imports: [WelcomeCard],
  standalone: true,
  templateUrl: './dashboard.html'
})
export class Dashboard {

  patientDetails = inject(ROUTER_OUTLET_DATA) as Signal<any>;

}