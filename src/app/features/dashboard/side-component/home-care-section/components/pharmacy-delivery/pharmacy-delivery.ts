import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

import { FormsModule } from '@angular/forms';

import { Dialog } from '../../../../../../components/dialog/dialog';
import { CustomInput } from '../../../../../../components/input/input';

@Component({
  selector: 'app-pharmacy-delivery',
  standalone: true,
  imports: [
    FormsModule,
    Dialog,
    CustomInput,
  ],
  templateUrl: './pharmacy-delivery.html',
})
export class PharmacyDeliveryDialog implements OnChanges {
  @Input() open = false;
  @Input() booking: any = null;

  @Output() openChange = new EventEmitter<boolean>();

  file: File | null = null;

  date = '';
  time = '';
  name = '';
  phone = '';
  address = '';
  notes = '';
  countryId = '+91';

  get isViewMode(): boolean {
    return !!this.booking;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['booking'] || changes['open']) {
      this.setFormValues();
    }
  }

  private setFormValues(): void {
    if (!this.open) {
      return;
    }

    if (this.booking) {
      this.name = this.booking?.name || '';
      this.phone = this.booking?.contact || '';
      this.address = this.booking?.address || '';
      this.notes = this.booking?.notes || '';
    } else {
      this.resetForm();
    }
  }

  close(): void {
    this.openChange.emit(false);
  }

  confirmBooking(): void {
    console.log({
      date: this.date,
      time: this.time,
      name: this.name,
      phone: this.phone,
      address: this.address,
      notes: this.notes,
      file: this.file,
    });
  }

  cancelBooking(): void {
    console.log('Cancel booking');
  }

  openLocation(): void {
    if (this.isViewMode) {
      return;
    }

    console.log('Open location picker');
  }
  openFile(): void {
    if (this.booking?.fileUrl) {
      window.open(this.booking.fileUrl, '_blank');
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    this.file = input.files?.[0] || null;
  }
  onFileChange(file: File | null): void {
    this.file = file;
  }

  private resetForm(): void {
    this.date = '';
    this.time = '';
    this.name = '';
    this.phone = '';
    this.address = '';
    this.notes = '';
    this.countryId = '+91';
    this.file = null;
  }
}