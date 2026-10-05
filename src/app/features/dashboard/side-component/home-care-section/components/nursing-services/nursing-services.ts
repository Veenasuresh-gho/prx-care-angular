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

import { Dialog } from '../../../../../../components/dialog/dialog';
import { Button } from '../../../../../../components/button/button';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

import { CountrySelectField } from '../../../../../../components/country-select-field/country-select-field';

import {
  LocationSelectorComponent,
  LocationResult,
} from '../../../../../../components/location-selector/location-selector';

import { formatDateToDDMMYYYY } from '../../../../../../utils/date';

import { GHOService } from '../../../../../../services/gho.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-nursing-services',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    Dialog,
    Button,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    CountrySelectField,
    MatIconModule
  ],
  templateUrl: './nursing-services.html',
})
export class NursingServicesDialog
  implements OnChanges, OnInit {
  private fb = inject(FormBuilder);
  private srv = inject(GHOService);
  private toastr = inject(ToastrService);
  private matDialog = inject(MatDialog);

  patientId: string | null = null;

  @Input() open = false;
  @Input() booking: any = null;

  @Output() openChange =
    new EventEmitter<boolean>();

  @Output() refetch =
    new EventEmitter<void>();

  isLoading = false;
  isSubmitting = false;
  isCancelling = false;

  form = this.fb.group({
    date: [''],

    name: [
      '',
      Validators.required,
    ],

    countryCode: [
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

    services: [
      '',
      Validators.required,
    ],

    duration: [
      '',
      Validators.required,
    ],
  });

  nursingTypes = [
    {
      label: 'Elderly Care',
      value: 'Elderly Care',
    },
    {
      label: 'Chronic Disease Management',
      value: 'Chronic Disease Management',
    },
    {
      label: 'Palliative Care',
      value: 'Palliative Care',
    },
    {
      label: 'Mother & Baby Care',
      value: 'Mother & Baby Care',
    },
    {
      label: 'Wound Dressing & Care',
      value: 'Wound Dressing & Care',
    },
    {
      label: 'IV / IM Injections',
      value: 'IV / IM Injections',
    },
    {
      label: "Catheter & Ryles's Tube Care",
      value: "Catheter & Ryles's Tube Care",
    },
    {
      label: 'Home ICU Support',
      value: 'Home ICU Support',
    },
    {
      label: 'Tracheostomy Care',
      value: 'Tracheostomy Care',
    },
    {
      label: 'Respiratory / Nebulization Care',
      value: 'Respiratory / Nebulization Care',
    },
    {
      label: 'Physiotherapy Assistance',
      value: 'Physiotherapy Assistance',
    },
    {
      label: 'Diabetes Care',
      value: 'Diabetes Care',
    },
    {
      label: 'Blood Pressure Monitoring',
      value: 'Blood Pressure Monitoring',
    },
  ];

  durationTypes = [
    {
      label: '1 Hour',
      value: '1 Hour',
    },
    {
      label: '2 Hours',
      value: '2 Hours',
    },
    {
      label: '3 Hours',
      value: '3 Hours',
    },
    {
      label: '4 Hours',
      value: '4 Hours',
    },
    {
      label: '5 Hours',
      value: '5 Hours',
    },
  ];

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
      this.loadBooking();
    }
  }

  private loadBooking(): void {
    if (!this.open) {
      return;
    }

    if (this.booking) {

      const formattedDate =
        this.formatApiDateForInput(
          this.booking.PreferredDate
        );

      this.form.patchValue({
        date: formattedDate,

        name:
          this.booking.PatientName ?? '',

        countryCode:
          String(
            this.booking.CountryId ?? '91'
          ),

        phone:
          this.booking.ContactNumber?.trim() ?? '',

        address:
          this.booking.HomeAddress ?? '',

        services:
          this.booking.RequestTypeNote ?? '',

        duration:
          this.normalizeDuration(
            this.booking.Duration
          ),
      });

      return;
    }

    this.resetForm();
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

  private normalizeDuration(
    duration: string | null | undefined
  ): string {
    if (!duration) {
      return '';
    }

    const value =
      duration
        .trim()
        .toLowerCase();

    const match =
      value.match(
        /^(\d+)\s*hour/
      );

    if (!match) {
      return duration;
    }

    return `${match[1]} Hour${match[1] === '1' ? '' : 's'}`;
  }

  close(): void {
    this.openChange.emit(false);

    this.form.markAsUntouched();
  }

  resetForm(): void {
    this.form.reset({
      date: '',
      name: '',
      countryCode: '91',
      phone: '',
      address: '',
      services: '',
      duration: '',
    });

    this.form.markAsPristine();
    this.form.markAsUntouched();

    this.isSubmitting = false;
    this.isCancelling = false;
    this.isLoading = false;
  }

  onCountryChange(
    country: any
  ): void {
    this.form.controls.countryCode.setValue(
      country?.CountryCode ?? '91'
    );
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

    dialogRef
      .afterClosed()
      .subscribe(
        (
          location: LocationResult | undefined
        ) => {
          if (!location) {
            return;
          }
          const address =
            location.fullAddress ||
            location.formattedAddress ||
            '';
          this.form.controls.address.setValue(
            address
          );

          this.form.controls.address.markAsTouched();
          this.form.controls.address.markAsDirty();
          this.form.controls.address.updateValueAndValidity();
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
    this.isLoading = true;

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
          PatientName:
            data.name ?? '',

          countryCode:
            data.countryCode ?? '',

          ContactNumber:
            data.phone ?? '',

          Address:
            data.address ?? '',

          NursingCare:
            data.services ?? '',

          EstimatedDuration:
            data.duration ?? '',
        }),
      },

      {
        T: 'c8',
        V: '3',
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
        next: (res) => {
          this.isSubmitting = false;
          this.isLoading = false;

          if (res?.Status === 1) {
            this.toastr.success(
              res?.Data?.[0]?.[0]?.msg ||
              'Nursing service request submitted successfully'
            );

            this.refetch.emit();

            this.close();
          } else {
            this.toastr.error(
              res?.Info ||
              'Booking failed'
            );
          }
        },

        error: (error) => {
          this.isSubmitting = false;
          this.isLoading = false;

          console.error(
            'Nursing booking error:',
            error
          );

          this.toastr.error(
            'Something went wrong. Please try again.'
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
}

