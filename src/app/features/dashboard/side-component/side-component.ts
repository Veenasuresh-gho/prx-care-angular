import { Component, Input, ChangeDetectionStrategy, inject } from '@angular/core';
import { UpcomingAppointmentCard } from './upcoming-appointment-card/upcoming-appointment-card';
import { MatIconModule } from '@angular/material/icon';
import { Button } from '../../../components/button/button';
import { HomeCareSection } from './home-care-section/home-care-section';
import { Router } from '@angular/router';

@Component({
  selector: 'app-side-component',
  standalone: true,
  imports: [UpcomingAppointmentCard, MatIconModule, Button, HomeCareSection],
  templateUrl: './side-component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideComponent {

  @Input() appointmentDetails: any;
  @Input() isLoading = false;
  private router = inject(Router);

  viewAppointments() {
    this.router.navigate(['/appointments']);
  }

  bookAppointment() {
    this.router.navigate(['/schedule-appointment']);
  }

}