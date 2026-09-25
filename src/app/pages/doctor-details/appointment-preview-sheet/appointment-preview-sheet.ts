import { Component, Input } from '@angular/core';
import { AppointmentDetails } from './appointment-details/appointment-details';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-appointment-preview-sheet',
  standalone: true,
  imports: [AppointmentDetails, JsonPipe],
  templateUrl: './appointment-preview-sheet.html',
})
export class AppointmentPreviewSheet {
  @Input() doctor: any = null;
  @Input() patient: any = null;
  @Input() selectedSlot: any = null;
  @Input() selectedDate: Date | null = null;
}