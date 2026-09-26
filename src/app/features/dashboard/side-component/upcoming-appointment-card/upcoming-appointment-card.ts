import {
  Component,
  Input,
  ChangeDetectionStrategy,
  signal,
} from '@angular/core';

import { NgOptimizedImage } from '@angular/common';

import { StatusBadge } from '../../../../components/status-badge/status-badge';
import { CancelAppointment } from '../../../../components/cancel-appointment/cancel-appointment';

@Component({
  selector: 'app-upcoming-appointment-card',
  standalone: true,
  imports: [
    StatusBadge,
    NgOptimizedImage,
    CancelAppointment,
  ],
  templateUrl: './upcoming-appointment-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpcomingAppointmentCard {

  @Input() appointment: any;

  @Input() isLoading = false;

  @Input() patientId: any;

  showCancelDialog = signal(false);

  get paymentStatus(): string {
    return this.appointment?.PayStatus?.trim()?.toLowerCase() || 'unknown';
  }

  openCancelDialog(): void {
    this.showCancelDialog.set(true);
  }

  closeCancelDialog(): void {
    this.showCancelDialog.set(false);
  }

  refetchAppointments(): void {
    this.showCancelDialog.set(false);
  }
}