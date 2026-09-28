import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { BookAmbulance } from './components/book-ambulance/book-ambulance';

@Component({
  selector: 'app-emergency-services',
  standalone: true,
  imports: [
    MatTabsModule,
    BookAmbulance,
    // MyAmbulanceBookingsComponent
  ],
  templateUrl: './emergency-services.html'
})
export class EmergencyServicesComponent {}