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

import { Dialog } from '../../../../../../components/dialog/dialog';
import { Button } from '../../../../../../components/button/button';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';

import { CountrySelectField } from '../../../../../../components/country-select-field/country-select-field';
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
  ],
  templateUrl: './nursing-services.html',
})
export class NursingServicesDialog implements OnChanges, OnInit {

  private fb = inject(FormBuilder);
  private srv = inject(GHOService);
  private toastr = inject(ToastrService);

  patientId: string | null = null;

  @Input() open = false;
  @Input() booking: any = null;

  @Output() openChange = new EventEmitter<boolean>();
  @Output() refetch = new EventEmitter<void>();

  isLoading = false;

  form = this.fb.group({
    date: [''],
    name: ['', Validators.required],
    countryCode: ['91', Validators.required],
    phone: ['', Validators.required],
    address: ['', Validators.required],
    services: ['', Validators.required],
    duration: ['', Validators.required],
  });

  isSubmitting = false;
  isCancelling = false;

  nursingTypes = [
    { label: 'Elderly Care', value: 'Elderly Care' },
    {
      label: 'Chronic Disease Management',
      value: 'Chronic Disease Management',
    },
    { label: 'Palliative Care', value: 'Palliative Care' },
    { label: 'Mother & Baby Care', value: 'Mother & Baby Care' },
    {
      label: 'Wound Dressing & Care',
      value: 'Wound Dressing & Care',
    },
    { label: 'IV / IM Injections', value: 'IV / IM Injections' },
    {
      label: "Catheter & Ryles's Tube Care",
      value: "Catheter & Ryles's Tube Care",
    },
    { label: 'Home ICU Support', value: 'Home ICU Support' },
    { label: 'Tracheostomy Care', value: 'Tracheostomy Care' },
    {
      label: 'Respiratory / Nebulization Care',
      value: 'Respiratory / Nebulization Care',
    },
    {
      label: 'Physiotherapy Assistance',
      value: 'Physiotherapy Assistance',
    },
    { label: 'Diabetes Care', value: 'Diabetes Care' },
    {
      label: 'Blood Pressure Monitoring',
      value: 'Blood Pressure Monitoring',
    },
  ];

  durationTypes = [
    { label: '1 Hour', value: '1 Hour' },
    { label: '2 Hours', value: '2 Hours' },
    { label: '3 Hours', value: '3 Hours' },
    { label: '4 Hours', value: '4 Hours' },
    { label: '5 Hours', value: '5 Hours' },
  ];

  get isViewMode(): boolean {
    return !!this.booking;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['booking'] || changes['open']) {
      this.loadBooking();
    }
  }

  ngOnInit(): void {
    this.patientId = sessionStorage.getItem('id');
  }

  private loadBooking(): void {
    if (!this.open) {
      return;
    }

    if (this.booking) {
      this.form.patchValue({
        services: this.booking?.care || '',
        duration: this.booking?.duration || '',
        date: this.booking?.date || '',
        name: this.booking?.name || '',
        phone: this.booking?.contact || '',
        countryCode: this.booking?.countryId || '91',
        address: this.booking?.address || '',
      });
    } else {
      this.resetForm();
    }
  }

  close(): void {
    this.openChange.emit(false);
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
  }

  onCountryChange(country: any): void {
    this.form.controls.countryCode.setValue(
      country.CountryCode
    );
  }

  openLocation(): void {
    if (this.isViewMode) {
      return;
    }
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
      this.toastr.error('Patient ID not found');
      return;
    }

    this.isSubmitting = true;
    this.isLoading = true;

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
          name: data.name ?? '',
          countryCode: data.countryCode ?? '',
          phone: data.phone ?? '',
          address: data.address ?? '',
          services: data.services ?? '',
          duration: data.duration ?? '',
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

    this.srv.getdata('hcare_', tags).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        this.isLoading = false;

        if (res.Status === 1) {
          this.toastr.success(res?.Data?.[0]?.[0]?.msg);
          this.refetch.emit();
          this.close();
        } else {
          this.toastr.error(res?.Info || 'Booking failed');
        }
      },

      error: (error) => {
        this.isSubmitting = false;
        this.isLoading = false;

        console.error('Nursing booking error:', error);
        this.toastr.error('Something went wrong. Please try again.');
      },
    });
  }

  cancelBooking(): void {
    if (!this.booking?.id || this.isCancelling) {
      return;
    }

    this.isCancelling = true; 
  }

  trackBooking(): void {
  }
}