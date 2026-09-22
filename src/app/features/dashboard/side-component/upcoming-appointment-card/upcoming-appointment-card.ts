import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { NgOptimizedImage } from '@angular/common'; // 1. Import directive
import { StatusBadge } from '../../../../components/status-badge/status-badge';

@Component({
  selector: 'app-upcoming-appointment-card',
  standalone: true,
  imports: [
    StatusBadge,
    NgOptimizedImage 
  ],
  templateUrl: './upcoming-appointment-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpcomingAppointmentCard {
  @Input() appointment: any;
  @Input() isLoading = false;

  get paymentStatus(): string {
    return this.appointment?.PayStatus?.trim()?.toLowerCase() || 'unknown';
  }
}