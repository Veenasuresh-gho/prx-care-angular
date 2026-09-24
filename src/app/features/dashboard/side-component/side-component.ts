import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { UpcomingAppointmentCard } from './upcoming-appointment-card/upcoming-appointment-card';
import { MatIconModule } from '@angular/material/icon';
import { Button } from '../../../components/button/button';

@Component({
  selector: 'app-side-component',
  standalone: true,
  imports: [UpcomingAppointmentCard, MatIconModule, Button],
  templateUrl: './side-component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideComponent {

  @Input() appointmentDetails: any;
  @Input() isLoading = false;

  viewAppointments() {
  }

  bookAppointment() {
  }

}