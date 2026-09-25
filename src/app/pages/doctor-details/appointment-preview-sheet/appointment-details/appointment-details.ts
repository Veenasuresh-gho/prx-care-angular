import {
  Component,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { DatePipe, NgClass, JsonPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-appointment-details',
  standalone: true,
  imports: [
    DatePipe,
    NgClass,
    FormsModule,
    JsonPipe,
    MatIconModule
  ],
  templateUrl: './appointment-details.html',
})
export class AppointmentDetails {
  @Input() doctor: any = null;
  @Input() patient: any = null;
  @Input() selectedSlot: any = null;
  @Input() selectedDate: Date | null = null;

  @Output() appointmentDataChange = new EventEmitter<{
    reason: string;
    notes: string;
    appointmentType: string;
  }>();

  appointmentType = 'N';

  reason = '';
  notes = '';

  emitAppointmentData(): void {
    this.appointmentDataChange.emit({
      reason: this.reason,
      notes: this.notes,
      appointmentType: this.appointmentType,
    });
  }
}