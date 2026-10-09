
import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnChanges,
  SimpleChanges,
  inject,
  OnInit,
} from '@angular/core';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { Dialog } from '../../../../../../components/dialog/dialog';
import { Button } from '../../../../../../components/button/button';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { CountrySelectField } from '../../../../../../components/country-select-field/country-select-field';

import { Tracker } from '../tracker/tracker';

import {
  LocationSelectorComponent,
  LocationResult,
} from '../../../../../../components/location-selector/location-selector';

import { formatDateToDDMMYYYY } from '../../../../../../utils/date';
import { FileUploadService } from '../../../../../../services/file-upload-service';
import { GHOService } from '../../../../../../services/gho.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-lab-collection-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    Dialog,
    Button,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    CountrySelectField,
    Tracker,
  ],
  templateUrl: './lab-collection-dialog.html',
})
export class LabCollectionDialog implements OnChanges, OnInit {
  private fb = inject(FormBuilder);
  private fileUploadService = inject(FileUploadService);
  private srv = inject(GHOService);
  private toastr = inject(ToastrService);
  private matDialog = inject(MatDialog);

  @Input() open = false;
  @Input() booking: any = null;

  @Output() openChange = new EventEmitter<boolean>();
  @Output() refetch = new EventEmitter<void>();

  patientId: string | null = null;

  file: File | null = null;

  trackingBookingId: string | number | null = null;

  isTracking = false;
  isSubmitting = false;
  isCancelling = false;
  isFileUploading = false;

  form = this.fb.group({
    test: ['', Validators.required],
    date: ['', Validators.required],
    time: ['', Validators.required],
    name: ['', Validators.required],
    countryId: ['91', Validators.required],
    phone: ['', Validators.required],
    address: ['', Validators.required],
  });

  get isViewMode(): boolean {
    return !!this.booking;
  }

  get showTracker(): boolean {
    const status = this.booking?.Status?.toLowerCase();

    const bookingId =
      this.booking?.ID ?? this.booking?.BookingID;

    return (
      this.isViewMode &&
      status !== 'cancelled' &&
      bookingId !== null &&
      bookingId !== undefined &&
      bookingId !== ''
    );
  }

  ngOnInit(): void {
    this.patientId = sessionStorage.getItem('id');
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['booking'] || changes['open']) {
      this.isTracking = false;
      this.trackingBookingId = null;

      if (this.open && this.booking) {
        this.loadBooking();
      }

      if (this.open && !this.booking) {
        this.resetForm();
      }
    }
  }

  private loadBooking(): void {
    if (!this.open || !this.booking) {
      return;
    }

    this.form.patchValue({
      test: this.booking.RequestTypeNote ?? '',

      date: this.formatApiDateForInput(
        this.booking.PreferredDate
      ),

      time: this.formatApiTimeForInput(
        this.booking.PreferredTime
      ),

      name: this.booking.PatientName ?? '',

      countryId: String(
        this.booking.CountryId ?? '91'
      ),

      phone: this.booking.ContactNumber?.trim() ?? '',

      address:
        this.booking.HomeAddress ??
        this.booking.Address ??
        '',
    });
  }

  private formatApiDateForInput(
    date: string | null | undefined
  ): string {
    if (!date) {
      return '';
    }

    // Handle dates already formatted as YYYY-MM-DD.
    const dateOnlyMatch = date.match(
      /^(\d{4})-(\d{2})-(\d{2})/
    );

    if (dateOnlyMatch) {
      return `${dateOnlyMatch[1]}-${dateOnlyMatch[2]}-${dateOnlyMatch[3]}`;
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return '';
    }

    const year = parsedDate.getFullYear();
    const month = String(
      parsedDate.getMonth() + 1
    ).padStart(2, '0');
    const day = String(
      parsedDate.getDate()
    ).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  private formatApiTimeForInput(
    time: string | null | undefined
  ): string {
    if (!time) {
      return '';
    }

    // Supports values such as 08:30, 08:30:00,
    // and common 12-hour values such as 08:30 AM.
    const value = time.trim();

    const twentyFourHourMatch = value.match(
      /^(\d{1,2}):(\d{2})(?::\d{2})?$/
    );

    if (twentyFourHourMatch) {
      return `${twentyFourHourMatch[1].padStart(2, '0')}:${twentyFourHourMatch[2]}`;
    }

    const twelveHourMatch = value.match(
      /^(\d{1,2}):(\d{2})(?::\d{2})?\s*(AM|PM)$/i
    );

    if (twelveHourMatch) {
      let hours = Number(twelveHourMatch[1]);
      const minutes = twelveHourMatch[2];
      const period = twelveHourMatch[3].toUpperCase();

      if (hours < 1 || hours > 12) {
        return '';
      }

      if (period === 'AM' && hours === 12) {
        hours = 0;
      } else if (period === 'PM' && hours !== 12) {
        hours += 12;
      }

      return `${String(hours).padStart(2, '0')}:${minutes}`;
    }

    return '';
  }

  trackBooking(): void {
    const bookingId =
      this.booking?.ID ?? this.booking?.BookingID;

    if (
      bookingId === null ||
      bookingId === undefined ||
      bookingId === ''
    ) {
      this.toastr.error('Booking ID not found');
      return;
    }

    this.trackingBookingId = bookingId;
    this.isTracking = true;
  }

  backToDetails(): void {
    this.isTracking = false;
  }

  close(): void {
    this.isTracking = false;
    this.trackingBookingId = null;

    this.openChange.emit(false);
    this.form.markAsUntouched();
  }

  resetForm(): void {
    this.form.reset({
      test: '',
      date: '',
      time: '',
      name: '',
      countryId: '91',
      phone: '',
      address: '',
    });

    this.file = null;

    this.isSubmitting = false;
    this.isCancelling = false;
    this.isFileUploading = false;

    this.isTracking = false;
    this.trackingBookingId = null;

    this.form.markAsPristine();
    this.form.markAsUntouched();
  }

  onFileChange(file: File | null): void {
    this.file = file;
  }

  openLocation(): void {
    if (this.isViewMode) {
      return;
    }

    const dialogRef = this.matDialog.open(
      LocationSelectorComponent,
      {
        width: '600px',
        maxWidth: '95vw',
        height: '80vh',
        maxHeight: '90vh',
        panelClass: 'location-selector-dialog',
        data: {
          patientId: this.patientId,

          initialAddress:
            this.form.controls.address.value ?? '',

          showSavedAddresses: true,
          allowCurrentLocation: true,
        },
      }
    );

    dialogRef.afterClosed().subscribe(
      (location: LocationResult | undefined) => {
        if (!location) {
          return;
        }

        const address =
          location.fullAddress ||
          location.formattedAddress ||
          '';

        this.form.controls.address.setValue(address);
        this.form.controls.address.markAsTouched();
        this.form.controls.address.markAsDirty();
        this.form.controls.address.updateValueAndValidity();
      }
    );
  }

  confirmBooking(): void {
    if (this.isSubmitting || this.isFileUploading) {
      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (!this.patientId) {
      this.toastr.error('Patient ID not found');
      return;
    }

    this.isSubmitting = true;

    const data = this.form.getRawValue();

    const formattedDate = data.date
      ? formatDateToDDMMYYYY(data.date)
      : '';

    const tags = [
      {
        T: 'dk1',
        V: this.patientId,
      },
      {
        T: 'dk2',
        V: formattedDate,
      },
      {
        T: 'c1',
        V: JSON.stringify({
          TestName: data.test ?? '',
          CollectionTime: data.time ?? '',
          PatientName: data.name ?? '',
          CountryId: data.countryId ?? '',
          ContactNumber: data.phone ?? '',
          Address: data.address ?? '',
        }),
      },
      {
        T: 'c8',
        V: '4',
      },
      {
        T: 'c10',
        V: '1',
      },
    ];

    this.srv.getdata('hcare_', tags).subscribe({
      next: async (res) => {
        if (res?.Status !== 1) {
          this.isSubmitting = false;

          this.toastr.error(
            res?.Info ||
            'Unable to create lab collection request'
          );

          return;
        }

        const bookingId = res?.Data?.[0]?.[0]?.id;

        if (!bookingId) {
          this.isSubmitting = false;

          this.toastr.error(
            'Booking created, but booking ID was not returned'
          );

          return;
        }

        // Upload prescription after creating the booking.
        if (this.file) {
          this.isFileUploading = true;

          try {
            const uploadSuccess =
              await this.fileUploadService.handleFileUpload(
                String(bookingId),
                this.patientId ?? '',
                this.file,
                '33'
              );

            this.isFileUploading = false;

            if (!uploadSuccess) {
              this.isSubmitting = false;
              return;
            }
          } catch (error) {
            console.error(
              'Lab prescription upload error:',
              error
            );

            this.isFileUploading = false;
            this.isSubmitting = false;

            this.toastr.error(
              'Booking created, but prescription upload failed'
            );

            return;
          }
        }

        this.toastr.success(
          res?.Data?.[0]?.[0]?.msg ||
          'Lab sample collection request submitted successfully'
        );

        this.isSubmitting = false;

        this.refetch.emit();
        this.close();
      },

      error: (error) => {
        console.error(
          'Lab collection booking error:',
          error
        );

        this.isSubmitting = false;
        this.isFileUploading = false;

        this.toastr.error(
          'Unable to submit lab collection request'
        );
      },
    });
  }

  cancelBooking(): void {
    if (
      this.isCancelling ||
      !this.booking
    ) {
      return;
    }

    // TODO: Connect the booking cancellation API here.
    this.toastr.info(
      'Booking cancellation API is not implemented yet'
    );
  }

  openExistingFile(): void {
    const fileUrl = this.booking?._url;

    if (!fileUrl) {
      this.toastr.error(
        'Lab prescription file is not available'
      );
      return;
    }

    window.open(fileUrl, '_blank');
  }
}