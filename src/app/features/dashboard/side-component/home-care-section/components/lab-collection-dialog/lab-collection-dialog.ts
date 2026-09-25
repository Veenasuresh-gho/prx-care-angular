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
import { Button } from '../../../../../../components/button/button';
import { CustomInput } from '../../../../../../components/input/input';

@Component({
  selector: 'app-lab-collection-dialog',
  standalone: true,
  imports: [
    FormsModule,
    Dialog,
    Button,
    CustomInput,
  ],
  templateUrl: './lab-collection-dialog.html',
})
export class LabCollectionDialog implements OnChanges {
  @Input() open = false;
  @Input() booking: any = null;

  @Output() openChange = new EventEmitter<boolean>();
  @Output() refetch = new EventEmitter<void>();

  file: File | null = null;

  test = '';
  date = '';
  time = '';
  name = '';
  phone = '';
  countryId = '';
  address = '';

  isSubmitting = false;
  isCancelling = false;
  isFileUploading = false;

  view: 'form' | 'location' = 'form';

  get isViewMode(): boolean {
    return !!this.booking;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['booking'] || changes['open']) {
      this.loadBooking();
    }

    if (changes['open'] && !this.open) {
      this.view = 'form';
    }
  }

  private loadBooking(): void {
    if (!this.open) {
      return;
    }

    if (this.booking) {
      this.test = this.booking?.tests || '';
      this.date = this.booking?.date || '';
      this.time = this.booking?.time || '';
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
    this.test = '';
    this.date = '';
    this.time = '';
    this.name = '';
    this.phone = '';
    this.countryId = '';
    this.address = '';
    this.file = null;
  }

  onFileChange(file: File | null): void {
    this.file = file;
  }

  openLocation(): void {
    if (this.isViewMode) {
      return;
    }

    this.view = 'location';
  }

  handleLocationSelect(selectedAddress: string): void {
    this.address = selectedAddress;
    this.view = 'form';
  }

  handleLocationBack(): void {
    this.view = 'form';
  }

  confirmBooking(): void {
    if (this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;

    console.log({
      test: this.test,
      date: this.date,
      time: this.time,
      name: this.name,
      phone: this.phone,
      countryId: this.countryId,
      address: this.address,
      file: this.file,
    });

    // Add your GHOService Lab Collection API here.
  }

  cancelBooking(): void {
    if (!this.booking?.id || this.isCancelling) {
      return;
    }

    this.isCancelling = true;

    console.log(
      'Cancel Lab Collection Booking:',
      this.booking.id
    );

    // Add your GHOService cancel API here.
  }

  openExistingFile(): void {
    if (this.booking?.fileUrl) {
      window.open(this.booking.fileUrl, '_blank');
    }
  }
}