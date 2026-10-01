import {
  Component,
  EventEmitter,
  Input,
  Output,
  inject,
} from '@angular/core';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { Button } from '../../../../../components/button/button';
import { CancelAppointment } from '../../../../../components/cancel-appointment/cancel-appointment';

@Component({
  selector: 'app-checkin-or-payment-proceed',
  standalone: true,
  imports: [
    MatCardModule,
    MatIconModule,
    Button,
    CancelAppointment,
  ],
  templateUrl: './checkin-or-payment-proceed.html',
})
export class CheckinOrPaymentProceed {
  @Input({ required: true }) appointment!: any;

  @Output() cancelled = new EventEmitter<void>();

  open = false;
  isCancelled = false;
  isCancelAppointmentLoading = false;

  ngOnChanges(): void {
    const status = String(
      this.appointment?.AppStatus ||
      this.appointment?.AppointmentStatus ||
      ''
    ).toUpperCase();

    this.isCancelled = status === 'CANCELLED';
  }

  get payStatus(): string {
    /*
     * Your current API response uses AmountDue/AmountPaid.
     * If payStatus is also returned, this will use it first.
     */
    return String(
      this.appointment?.payStatus || ''
    ).toUpperCase();
  }

  handleCancelClick(): void {
    this.open = true;
  }

  handleDialogChange(value: boolean): void {
    this.open = value;
  }

  handleConfirmCancel(): void {
    if (
      !this.appointment?.ID ||
      this.isCancelled ||
      this.isCancelAppointmentLoading
    ) {
      return;
    }

    this.isCancelAppointmentLoading = true;

    /*
     * Call your existing cancel appointment API here.
     *
     * Example:
     *
     * this.cancelService.cancelAppointment(
     *   this.appointment.ID
     * ).subscribe({
     *   next: () => {
     *     this.isCancelled = true;
     *     this.open = false;
     *
     *     setTimeout(() => {
     *       this.cancelled.emit();
     *     }, 500);
     *   },
     *   error: () => {
     *     this.isCancelAppointmentLoading = false;
     *   },
     *   complete: () => {
     *     this.isCancelAppointmentLoading = false;
     *   }
     * });
     */
  }
}

