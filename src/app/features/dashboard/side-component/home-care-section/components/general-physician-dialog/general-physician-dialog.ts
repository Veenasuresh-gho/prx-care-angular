import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
  Output,
  inject,
} from '@angular/core';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { MatDialog } from '@angular/material/dialog';

import { Dialog } from '../../../../../../components/dialog/dialog';
import { Button } from '../../../../../../components/button/button';
import { CountrySelectField } from '../../../../../../components/country-select-field/country-select-field';
import { GHOService } from '../../../../../../services/gho.service';

import {
  formatDateToDDMMYYYY,
  formatTimeForInput,
  formatApiDateForInput,
} from '../../../../../../utils/date';

import { ToastrService } from 'ngx-toastr';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

import { Tracker } from '../tracker/tracker';

import {
  LocationSelectorComponent,
  LocationResult,
} from '../../../../../../components/location-selector/location-selector';


@Component({
  selector: 'app-general-physician-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    Dialog,
    Button,
    CountrySelectField,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    Tracker
  ],
  templateUrl: './general-physician-dialog.html',
})
export class GeneralPhysicianDialog
  implements OnInit, OnChanges {
  private fb = inject(FormBuilder);
  private srv = inject(GHOService);
  private toastr = inject(ToastrService);
  private dialog = inject(MatDialog);

  showTracker = false;
  trackingBookingId: string | number | null = null;

  patientId: string | null = null;

  @Input() open = false;
  @Input() booking: any = null;

  @Output() openChange = new EventEmitter<boolean>();
  @Output() refetch = new EventEmitter<void>();

  isLoading = false;

  form = this.fb.group({
    date: ['', Validators.required],
    time: ['', Validators.required],
    name: ['', Validators.required],
    countryCode: ['91', Validators.required],
    phone: ['', Validators.required],
    address: ['', Validators.required],
  });

  get isViewMode(): boolean {
    return !!this.booking;
  }

  ngOnInit(): void {
    this.patientId = sessionStorage.getItem('id');
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['booking']) {
      if (this.booking) {
        this.setBookingDetails();
      } else {
        this.resetForm();
      }
    }
  }

  private setBookingDetails(): void {
    const booking = this.booking;

    const date = formatApiDateForInput(
      booking?.PreferredDate
    );

    const time = formatTimeForInput(
      booking?.PreferredTime
    );

    this.form.patchValue({
      date,
      time,
      name: booking?.PatientName ?? '',
      countryCode: String(
        booking?.CountryId ?? '91'
      ),
      phone: booking?.ContactNumber?.trim() ?? '',
      address: booking?.HomeAddress ?? '',
    });
  }

  private resetForm(): void {
    this.form.reset({
      date: '',
      time: '',
      name: '',
      countryCode: '91',
      phone: '',
      address: '',
    });
  }

  onCountryChange(country: any): void {
    this.form.patchValue({
      countryCode: country.CountryID,
    });
  }

  close(): void {
    this.showTracker = false;
    this.trackingBookingId = null;

    this.openChange.emit(false);
    this.form.markAsUntouched();
  }

  openLocation(): void {
    if (this.isViewMode) {
      return;
    }

    const dialogRef = this.dialog.open(
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

          console.log(
            'Selected location:',
            location
          );

          const address =
            location.fullAddress ||
            location.formattedAddress ||
            '';
          this.form.patchValue({
            address,
          });

          this.form.controls.address.markAsTouched();
          this.form.controls.address.markAsDirty();
          this.form.controls.address.updateValueAndValidity();
        }
      );
  }


  confirmBooking(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (!this.patientId) {
      console.error('Patient ID not found');
      return;
    }

    const data = this.form.getRawValue();

    const formattedDate = data.date
      ? formatDateToDDMMYYYY(data.date)
      : '';

    this.isLoading = true;

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
          PreferredTime: data.time ?? '',
          PatientName: data.name ?? '',
          CountryId: data.countryCode ?? '',
          ContactNumber: data.phone ?? '',
          HomeAddress: data.address ?? '',
        }),
      },
      {
        T: 'c8',
        V: '1',
      },
      {
        T: 'c10',
        V: '1',
      },
    ];

    this.srv.getdata('hcare_', tags).subscribe({
      next: (res) => {
        this.isLoading = false;

        if (res.Status === 1) {
          this.toastr.success(
            res?.Data?.[0]?.[0]?.msg
          );

          this.refetch.emit();

          this.close();
        } else {
          this.toastr.error(res?.Info);
        }
      },

      error: () => {
        this.isLoading = false;
      },
    });
  }

  cancelBooking(): void {
    this.close();
  }

  trackBooking(): void {
    const bookingId = this.booking?.BookingID;

    if (!bookingId) {
      return;
    }

    this.trackingBookingId = bookingId;
    this.showTracker = true;
  }
}

