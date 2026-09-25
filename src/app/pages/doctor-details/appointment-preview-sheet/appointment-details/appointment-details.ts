import { Component, Input } from '@angular/core';
import { DatePipe, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';
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

  appointmentType = 'N';
}