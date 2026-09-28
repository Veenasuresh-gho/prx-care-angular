import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  inject,
} from '@angular/core';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { CustomInput } from '../../../../../../components/input/input';
import { Dialog } from '../../../../../../components/dialog/dialog';
import { Button } from '../../../../../../components/button/button';
import { CountrySelectField } from '../../../../../../components/country-select-field/country-select-field';
import { GHOService } from '../../../../../../services/gho.service';
import { formatDateToDDMMYYYY } from '../../../../../../utils/date';
import { ToastrService } from 'ngx-toastr';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-general-physician-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CustomInput,
    Dialog,
    Button,
    CountrySelectField,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule
  ],
  templateUrl: './general-physician-dialog.html',
})
export class GeneralPhysicianDialog implements OnInit {
  private fb = inject(FormBuilder);
  private srv = inject(GHOService);
  private toastr = inject(ToastrService);

  patientId: string | null = null;

  @Input() open = false;
  @Input() booking: any = null;

  @Output() openChange = new EventEmitter<boolean>();

  isLoading = false;

  form = this.fb.group({
    date: [''],
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

  onCountryChange(country: any): void {
    this.form.patchValue({
      countryCode: country.CountryCode,
    });
  }

  close(): void {
    this.openChange.emit(false);
    this.form.markAsUntouched();
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
        V: formattedDate
      },
      {
        T: 'c1',
        V: JSON.stringify({
          time: data.time ?? '',
          name: data.name ?? '',
          countryCode: data.countryCode ?? '',
          phone: data.phone ?? '',
          address: data.address ?? '',
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
          this.toastr.success(res?.Data[0][0]?.msg)
          this.close();
        } else {
          this.toastr.error(res?.Info)
        }
      },
      error: (error) => {
        this.isLoading = false;
      },
    });
  }

  cancelBooking(): void {
    console.log('Cancel booking');
    this.close();
  }

  openLocation(): void {
    console.log('Open location picker');
  }
}