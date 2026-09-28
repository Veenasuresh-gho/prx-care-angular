import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { BookAmbulance } from './components/book-ambulance/book-ambulance';
import { MyBookings } from './components/my-bookings/my-bookings';

@Component({
  selector: 'app-emergency-services',
  standalone: true,
  imports: [
    MatTabsModule,
    BookAmbulance,
    MyBookings
  ],
  templateUrl: './emergency-services.html'
})
export class EmergencyServicesComponent {}