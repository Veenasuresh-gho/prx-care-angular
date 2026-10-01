import {
  Component,
  EventEmitter,
  Input,
  Output,
  inject,
} from '@angular/core';

import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { Button } from '../../../../../components/button/button';

@Component({
  selector: 'app-appointment-card',
  standalone: true,
  imports: [
    MatIconModule,
    Button,
  ],
  templateUrl: './appointment-card.html',
})
export class AppointmentCard {
  private readonly router = inject(Router);

  @Input({ required: true }) appointment!: any;
  @Input() loading = false;

  @Output() refetch = new EventEmitter<void>();

  get appointmentStatus(): string {
    return this.appointment?.AppStatus || '';
  }

  get normalizedStatus(): string {
    return this.appointmentStatus.toLowerCase();
  }

  get isCheckedIn(): boolean {
    return this.normalizedStatus === 'checked-in';
  }

  get isConfirmed(): boolean {
    return this.normalizedStatus === 'confirmed';
  }

  get isCancelled(): boolean {
    return this.normalizedStatus === 'cancelled';
  }

  get isTelemedicine(): boolean {
    return this.appointment?.Telemedicine === 1;
  }

  handleReschedule(): void {
    if (!this.appointment?.DoctorID || !this.appointment?.ID) {
      return;
    }

    this.router.navigate(
      [
        '/en/appointments/schedule-appointment/doctor',
        this.appointment.DoctorID,
      ],
      {
        queryParams: {
          rescheduleId: this.appointment.ID,
        },
      }
    );
  }
}