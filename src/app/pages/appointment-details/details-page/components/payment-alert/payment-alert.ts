import {
  Component,
  Input,
  inject,
} from '@angular/core';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { Button } from '../../../../../components/button/button';
import { SendPaymentRequestDialog } from '../send-payment-request-dialog/send-payment-request-dialog';
import { GHOService } from '../../../../../services/gho.service';

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

  isRequestDialogOpen = false;

  activeShareTarget: {
    amount: number;
    billingId?: number;
  } | null = null;

  isGetPatientBillingLoading = false;

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
      amount <= 0
    ) {
      return;
    }

    this.activeShareTarget = {
      amount,
    };

    this.isRequestDialogOpen = true;
  }

  closeShareDialog(): void {
    this.isRequestDialogOpen = false;
    this.activeShareTarget = null;
  }

  handleSendPaymentRequest(data: {
    fullName: string;
    countryCode: string;
    phoneNumber: string;
    email: string;
  }): void {
    if (!this.activeShareTarget || this.isCancelled) {
      return;
    }

    const paymentLink = this.buildPaymentLink(
      this.activeShareTarget.amount
    );

    console.log('Payment request:', {
      ...data,
      phone: `${data.countryCode}${data.phoneNumber}`,
      paymentLink,
      appointmentId: this.appointment?.ID,
    });
  }

  private buildPaymentLink(amount: number): string {
    const params = new URLSearchParams({
      appointmentId: String(this.appointment?.ID),
      amount: String(amount),
    });

    return `${window.location.origin}/pay?${params.toString()}`;
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