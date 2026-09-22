import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { UpcomingAppointmentCard } from './upcoming-appointment-card/upcoming-appointment-card';

@Component({
  selector: 'app-side-component',
  standalone: true,
  imports: [UpcomingAppointmentCard],
  templateUrl: './side-component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideComponent {

  @Input() appointmentDetails: any;
  @Input() isLoading = false;

}