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
  ReactiveFormsModule,
  FormBuilder,
  Validators,
} from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

import { Dialog } from '../../../../../../components/dialog/dialog';
import {
  CountrySelectField,
} from '../../../../../../components/country-select-field/country-select-field';
import { Button } from '../../../../../../components/button/button';

import { GHOService } from '../../../../../../services/gho.service';
import { ToastrService } from 'ngx-toastr';
import { FileUploadService } from '../../../../../../services/file-upload-service';

@Component({
  selector: 'app-pharmacy-delivery',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    Dialog,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    CountrySelectField,
    Button,
  ],
  templateUrl: './pharmacy-delivery.html',
})
export class PharmacyDeliveryDialog
  implements OnChanges, OnInit {
  private fb = inject(FormBuilder);
  private srv = inject(GHOService);
  private toastr = inject(ToastrService);
  private fileUploadService = inject(FileUploadService);

  @Input() open = false;
  @Input() booking: any = null;

  @Output() openChange =
    new EventEmitter<boolean>();

  @Output() refetch =
    new EventEmitter<void>();

  patientId: string | null = null;

  file: File | null = null;

  isSubmitting = false;
  isCancelling = false;

  form = this.fb.group({
    name: ['', Validators.required],

    countryId: [
      '91',
      Validators.required,
    ],

    phone: [
      '',
      Validators.required,
    ],

    address: [
      '',
      Validators.required,
    ],

    notes: [''],
  });

  get isViewMode(): boolean {
    return !!this.booking;
  }

  ngOnInit(): void {
    this.patientId =
      sessionStorage.getItem('id');
  }

  ngOnChanges(
    changes: SimpleChanges
  ): void {
    if (
      changes['booking'] ||
      changes['open']
    ) {
      this.setFormValues();
    }
  }

  private setFormValues(): void {
    if (!this.open) {
      return;
    }

    if (this.booking) {
      console.log(
        'Pharmacy Booking:',
        this.booking
      );

      this.form.patchValue({
        name:
          this.booking.PatientName ?? '',

        countryId:
          String(
            this.booking.CountryId ?? '91'
          ),

        phone:
          this.booking.ContactNumber?.trim() ??
          '',

        address:
          this.booking.Address ??
          this.booking.DeliveryAddress ??
          '',

        notes:
          this.booking.AdditionalNotes ??
          '',
      });

      return;
    }

    this.resetForm();
  }

  close(): void {
    this.openChange.emit(false);

    this.form.markAsUntouched();
  }

  confirmBooking(): void {
    if (this.isSubmitting) {
      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (!this.patientId) {
      this.toastr.error(
        'Patient ID not found'
      );

      return;
    }

    this.isSubmitting = true;

    const data =
      this.form.getRawValue();

    const tags = [
      {
        T: 'dk1',
        V: this.patientId,
      },

      {
        T: 'c1',
        V: JSON.stringify({
          AdditionalNotes:
            data.notes ?? '',

          PatientName:
            data.name ?? '',

          CountryId:
            data.countryId ?? '',

          ContactNumber:
            data.phone ?? '',

          DeliveryAddress:
            data.address ?? '',
        }),
      },

      {
        T: 'c8',
        V: '2',
      },

      {
        T: 'c10',
        V: '1',
      },
    ];

    this.srv
      .getdata('hcare_', tags)
      .subscribe({
        next: async (res) => {
          if (res?.Status !== 1) {
            this.isSubmitting = false;

            this.toastr.error(
              res?.Info ||
              'Unable to create pharmacy delivery request'
            );

            return;
          }

          const bookingId =
            res?.Data?.[0]?.[0]?.id;

          if (!bookingId) {
            this.isSubmitting = false;

            this.toastr.error(
              'Booking created, but booking ID was not returned'
            );

            return;
          }

          /*
           * Upload prescription after
           * successful booking creation.
           */
          if (this.file) {
            const uploadSuccess =
              await this.fileUploadService.handleFileUpload(
                String(bookingId),
                this.patientId ?? '',
                this.file,
                '32'
              );

            if (!uploadSuccess) {
              this.isSubmitting = false;
              return;
            }
          }

          this.toastr.success(
            res?.Data?.[0]?.[0]?.msg ||
            'Pharmacy delivery request submitted successfully'
          );

          this.isSubmitting = false;

          /*
           * Refresh My Bookings list.
           */
          this.refetch.emit();

          /*
           * Close dialog.
           */
          this.close();
        },

        error: (error) => {
          console.error(
            'Pharmacy booking error:',
            error
          );

          this.isSubmitting = false;

          this.toastr.error(
            'Unable to submit pharmacy delivery request'
          );
        },
      });
  }

  cancelBooking(): void {
    if (this.isCancelling) {
      return;
    }

    this.isCancelling = true;

    /*
     * Add cancellation API here.
     */

    this.isCancelling = false;
  }

  trackBooking(): void {
    /*
     * Add tracking logic here.
     */
  }

  openLocation(): void {
    if (this.isViewMode) {
      return;
    }

    /*
     * Add location selection logic here.
     */
  }

  openFile(): void {
    const fileUrl =
      this.booking?._url;

    if (!fileUrl) {
      this.toastr.error(
        'Prescription file is not available'
      );

      return;
    }

    window.open(
      fileUrl,
      '_blank'
    );
  }

  onFileSelected(
    event: Event
  ): void {
    const input =
      event.target as HTMLInputElement;

    this.file =
      input.files?.[0] ?? null;
  }

  onFileChange(
    file: File | null
  ): void {
    this.file = file;
  }

  private resetForm(): void {
    this.form.reset({
      name: '',
      countryId: '91',
      phone: '',
      address: '',
      notes: '',
    });

    this.file = null;

    this.isSubmitting = false;
    this.isCancelling = false;
  }
}

