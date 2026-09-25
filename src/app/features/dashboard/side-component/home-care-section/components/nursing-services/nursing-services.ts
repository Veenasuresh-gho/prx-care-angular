import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnChanges,
  SimpleChanges,
  inject,
} from '@angular/core';

import { FormsModule } from '@angular/forms';

import { Dialog } from '../../../../../../components/dialog/dialog';
import { Button } from '../../../../../../components/button/button';
import { CustomInput } from '../../../../../../components/input/input';

@Component({
  selector: 'app-nursing-services',
  standalone: true,
  imports: [
    FormsModule,
    Dialog,
    Button,
    CustomInput,
  ],
  templateUrl: './nursing-services.html',
})
export class NursingServicesDialog implements OnChanges {
  @Input() open = false;
  @Input() booking: any = null;

  @Output() openChange = new EventEmitter<boolean>();
  @Output() refetch = new EventEmitter<void>();

  services = '';
  duration = '';
  date = '';
  name = '';
  phone = '';
  countryId = '';
  address = '';

  isSubmitting = false;
  isCancelling = false;

  get isViewMode(): boolean {
    return !!this.booking;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['booking'] || changes['open']) {
      this.loadBooking();
    }
  }

  private loadBooking(): void {
    if (!this.open) {
      return;
    }

    if (this.booking) {
      this.services = this.booking?.care || '';
      this.duration = this.booking?.duration || '';
      this.date = this.booking?.date || '';
      this.name = this.booking?.name || '';
      this.phone = this.booking?.contact || '';
      this.address = this.booking?.address || '';
      this.countryId = this.booking?.countryId || '';
    } else {
      this.resetForm();
    }
  }

  close(): void {
    this.openChange.emit(false);
  }

  resetForm(): void {
    this.services = '';
    this.duration = '';
    this.date = '';
    this.name = '';
    this.phone = '';
    this.countryId = '';
    this.address = '';
  }

  openLocation(): void {
    if (this.isViewMode) {
      return;
    }

    console.log('Open location picker');
  }

  confirmBooking(): void {
    if (this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;

    console.log({
      services: this.services,
      duration: this.duration,
      date: this.date,
      name: this.name,
      phone: this.phone,
      countryId: this.countryId,
      address: this.address,
    });

    // Add your GHOService booking API here.
  }

  cancelBooking(): void {
    if (!this.booking?.id || this.isCancelling) {
      return;
    }

    this.isCancelling = true;

    console.log('Cancel nursing booking:', this.booking.id);

    // Add your GHOService cancel API here.
  }

  trackBooking(): void {
    // Tracker will be added separately later.
    console.log('Track booking:', this.booking?.bookingId);
  }
}