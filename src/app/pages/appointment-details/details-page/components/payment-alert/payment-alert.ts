
import {
  Component,
  Input,
  inject,
  ChangeDetectorRef,
} from '@angular/core';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Button } from '../../../../../components/button/button';
import { SendPaymentRequestDialog } from '../send-payment-request-dialog/send-payment-request-dialog';
import { GHOService } from '../../../../../services/gho.service';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-payment-alert',
  standalone: true,
  imports: [
    MatCardModule,
    MatIconModule,
    Button,
    SendPaymentRequestDialog,
  ],
  templateUrl: './payment-alert.html',
})
export class PaymentAlert {
  @Input({ required: true }) appointment!: any;

  private readonly srv = inject(GHOService);
  private readonly toastr = inject(ToastrService);
  private readonly cdr = inject(ChangeDetectorRef);

  isRequestDialogOpen = false;
  isGetPatientBillingLoading = false;

  activeShareTarget: {
    amount: number;
    billingId?: number;
  } | null = null;

  get amountDue(): number {
    return Number(this.appointment?.AmountDue ?? 0);
  }

  get amountPaid(): number {
    return Number(this.appointment?.AmountPaid ?? 0);
  }

  get pendingAmount(): number {
    return Math.max(this.amountDue - this.amountPaid, 0);
  }

  get currency(): string {
    return this.appointment?.Currency || 'INR';
  }

  get appointmentStatus(): string {
    return String(
      this.appointment?.AppStatus ||
      this.appointment?.AppointmentStatus ||
      ''
    ).toLowerCase();
  }

  get isCancelled(): boolean {
    return this.appointmentStatus === 'cancelled';
  }

  get isConfirmed(): boolean {
    return this.appointmentStatus === 'confirmed';
  }

  formatAmount(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  }

  openShareDialog(amount: number): void {
    if (
      this.isCancelled ||
      !this.appointment?.ID ||
      amount <= 0 ||
      this.isGetPatientBillingLoading
    ) {
      return;
    }

    this.activeShareTarget = { amount };
    this.isRequestDialogOpen = true;
  }

  closeShareDialog(): void {
    if (this.isGetPatientBillingLoading) {
      return;
    }

    this.isRequestDialogOpen = false;
    this.activeShareTarget = null;
  }

handleSendPaymentRequest(data: {
  fullName: string;
  countryId: number;
  countryCode: string;
  phoneNumber: string;
  email: string;
  amount: number;
}): void {
    if (
      !this.activeShareTarget ||
      this.isCancelled ||
      this.isGetPatientBillingLoading
    ) {
      return;
    }

    const patientId = sessionStorage.getItem('id');

    if (!patientId) {
      this.toastr.error('Patient ID not found');
      return;
    }

    const billDetails = {
      RequestToName: data.fullName,
      RequestToCountryID: data.countryId,
      RequestToPhone: data.phoneNumber,
      RequestToEmail: data.email,
      AmountRequested: this.activeShareTarget.amount,
    };

    const tv = [
      { T: 'dk1', V: String(this.appointment?.ID) },
      { T: 'dk2', V: String(patientId) },
      { T: 'c1', V: JSON.stringify(billDetails) },
      { T: 'c10', V: '1' },
    ];

    this.isGetPatientBillingLoading = true;

    this.srv.getdata('patientpaymentrequest', tv)
      .pipe(
        finalize(() => {
          this.isGetPatientBillingLoading = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: (res) => {
          if (res?.Status === 1) {
            const successMessage =
              res.Data?.[0]?.[0]?.msg ||
              'Payment request sent successfully';

            this.isRequestDialogOpen = false;
            this.activeShareTarget = null;

            this.toastr.success(successMessage);
          } else {
            this.toastr.error(
              res?.Info || 'Failed to send payment request'
            );
          }

          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Payment Request API Error:', error);

          this.toastr.error(
            error?.Message ||
            error?.error?.Info ||
            'Something went wrong while sending payment request'
          );

          this.cdr.detectChanges();
        },
      });
  }

  handlePayment(amount: number): void {
    if (this.isCancelled) {
      return;
    }

    if (!this.appointment?.ID || amount <= 0) {
      return;
    }
  }
}
