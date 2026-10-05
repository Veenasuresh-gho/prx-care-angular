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
  ],
  templateUrl: './lab-collection-dialog.html',
})
export class LabCollectionDialog
  implements OnChanges, OnInit {

  private fb = inject(FormBuilder);
  private fileUploadService = inject(FileUploadService);
  private srv = inject(GHOService);
  private toastr = inject(ToastrService);
  private matDialog = inject(MatDialog);

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
      if (
        this.open &&
        this.booking
      ) {
        this.loadBooking();
      }

      if (
        this.open &&
        !this.booking
      ) {
        this.resetForm();
      }
    }
  }

  private loadBooking(): void {
    if (!this.open) {
      return;
    }

    if (!this.booking) {
      this.resetForm();
      return;
    }

    this.form.patchValue({
      test:
        this.booking.RequestTypeNote ??
        '',

      date:
        this.formatApiDateForInput(
          this.booking.PreferredDate
        ),

      time:
        this.formatApiDateForInput(
          this.booking.PreferredTime
        ),

      name:
        this.booking.PatientName ??
        '',

      countryId:
        String(
          this.booking.CountryId ??
          '91'
        ),

      phone:
        this.booking.ContactNumber?.trim() ??
        '',

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

    const parsedDate =
      new Date(date);

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return '';
    }

    const year =
      parsedDate.getFullYear();

    const month =
      String(
        parsedDate.getMonth() + 1
      ).padStart(2, '0');

    const day =
      String(
        parsedDate.getDate()
      ).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  close(): void {
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
  }

  onFileChange(
    file: File | null
  ): void {
    this.file = file;
  }

  openLocation(): void {
    if (this.isViewMode) {
      return;
    }

    const dialogRef =
      this.matDialog.open(
        LocationSelectorComponent,
        {
          width: '600px',
          maxWidth: '95vw',
          height: '80vh',
          maxHeight: '90vh',

          panelClass:
            'location-selector-dialog',

          data: {
            patientId:
              this.patientId,

            initialAddress:
              this.form.controls
                .address.value ?? '',

            showSavedAddresses: true,

            allowCurrentLocation: true,
          },
        }
      );

    dialogRef
      .afterClosed()
      .subscribe(
        (
          location:
            | LocationResult
            | undefined
        ) => {
          if (!location) {
            return;
          }

          const address =
            location.fullAddress ||
            location.formattedAddress ||
            '';

          this.form.controls.address
            .setValue(address);

          this.form.controls.address
            .markAsTouched();

          this.form.controls.address
            .markAsDirty();

          this.form.controls.address
            .updateValueAndValidity();
        }
      );
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

    const formattedDate =
      data.date
        ? formatDateToDDMMYYYY(
          data.date
        )
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
          TestName:
            data.test ?? '',

          CollectionTime:
            data.time ?? '',

          PatientName:
            data.name ?? '',

          CountryId:
            data.countryId ?? '',

          ContactNumber:
            data.phone ?? '',

          Address:
            data.address ?? '',
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

    this.srv
      .getdata(
        'hcare_',
        tags
      )
      .subscribe({
        next: async (res) => {
          if (
            res?.Status !== 1
          ) {
            this.isSubmitting =
              false;

            this.toastr.error(
              res?.Info ||
              'Unable to create lab collection request'
            );

            return;
          }

          const bookingId =
            res?.Data?.[0]?.[0]?.id;

          if (!bookingId) {
            this.isSubmitting =
              false;

            this.toastr.error(
              'Booking created, but booking ID was not returned'
            );

            return;
          }

          /*
           * Upload prescription/file
           * after booking creation.
           */
          if (this.file) {
            this.isFileUploading =
              true;

            const uploadSuccess =
              await this.fileUploadService
                .handleFileUpload(
                  String(
                    bookingId
                  ),

                  this.patientId ?? '',

                  this.file,

                  '33'
                );

            this.isFileUploading =
              false;

            if (!uploadSuccess) {
              this.isSubmitting =
                false;

              return;
            }
          }

          this.toastr.success(
            res?.Data?.[0]?.[0]
              ?.msg ||
            'Lab sample collection request submitted successfully'
          );

          this.isSubmitting =
            false;

          this.refetch.emit();

          this.close();
        },

        error: (error) => {
          console.error(
            'Lab collection booking error:',
            error
          );

          this.isSubmitting =
            false;

          this.isFileUploading =
            false;

          this.toastr.error(
            'Unable to submit lab collection request'
          );
        },
      });
  }

  cancelBooking(): void {
    if (
      !this.booking?.BookingID ||
      this.isCancelling
    ) {
      return;
    }

    this.isCancelling = true;

    /*
     * Cancellation API can be
     * added here.
     */

    this.isCancelling = false;
  }

  openExistingFile(): void {
    const fileUrl =
      this.booking?._url;

    if (!fileUrl) {
      this.toastr.error(
        'Lab prescription file is not available'
      );

      return;
    }

    window.open(
      fileUrl,
      '_blank'
    );
  }
}