import {
  Component,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { AppointmentDetails } from './appointment-details/appointment-details';

@Component({
  selector: 'app-appointment-preview-sheet',
  standalone: true,
  imports: [AppointmentDetails],
  templateUrl: './appointment-preview-sheet.html',
})
export class AppointmentPreviewSheet {
  @Input() doctor: any = null;
  @Input() patient: any = null;
  @Input() selectedSlot: any = null;
  @Input() selectedDate: Date | null = null;

  @Output() appointmentDataChange = new EventEmitter<{
    reason: string;
    notes: string;
    appointmentType: string;
  }>();

  onAppointmentDataChange(data: {
    reason: string;
    notes: string;
    appointmentType: string;
  }): void {
    this.appointmentDataChange.emit(data);
  }
}