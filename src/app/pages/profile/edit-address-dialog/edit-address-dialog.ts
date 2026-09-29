import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  inject,
} from '@angular/core';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { GHOService } from '../../../services/gho.service';
import { ToastrService } from 'ngx-toastr';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-edit-address-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatProgressSpinnerModule,
    JsonPipe,
  ],
  templateUrl: './edit-address-dialog.html',
})
export class EditAddressDialog implements OnChanges {
  private fb = inject(FormBuilder);
  private srv = inject(GHOService);
  private toastr = inject(ToastrService);

  @Input() open = false;
  @Input() details: any = null;

  @Output() openChange = new EventEmitter<boolean>();
  @Output() refetch = new EventEmitter<void>();

  countryList: any[] = [];

  isLoading = false;
  isCountryLoading = false;

  form = this.fb.group({
    Address: ['', Validators.required],
    CountryID: [''],
    State: [''],
    City: [''],
    PostalCode: [''],
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['open']?.currentValue === true ||
      changes['details']
    ) {
      if (this.open && this.details) {
        this.form.patchValue({
          Address:
            this.details.Address ??
            this.details.address ??
            '',

          CountryID:
            this.details.CountryID ??
            this.details.countryID ??
            '',

          State:
            this.details.State ??
            this.details.state ??
            '',

          City:
            this.details.City ??
            this.details.city ??
            '',

          PostalCode:
            this.details.PostalCode ??
            this.details.postalCode ??
            '',
        });

        this.getCountryList();
      }
    }
  }

  /**
   * Get Country ID from country list item.
   * CountryID is used as the mat-select value.
   */
  getCountryId(country: any): string {
    return String(
      country?.CountryID ??
      country?.ID ??
      country?.id ??
      ''
    );
  }

  /**
   * Get Country Name for display.
   */
  getCountryName(country: any): string {
    return (
      country?.CountryName ??
      country?.Name ??
      country?.name ??
      ''
    );
  }

  /**
   * Load country list.
   */
  getCountryList(): void {
    this.isCountryLoading = true;

    const tv = [
      {
        T: 'c10',
        V: '99',
      },
    ];

    this.srv.getdata('lists', tv).subscribe({
      next: (res) => {
        if (res?.Status === 1) {
          this.countryList = res?.Data?.[0] ?? [];

        } else {
          this.countryList = [];

          this.toastr.error(
            'Unable to load country list'
          );
        }

        this.isCountryLoading = false;
      },

      error: (error) => {
        console.error(
          'Country list error:',
          error
        );

        this.countryList = [];
        this.isCountryLoading = false;

        this.toastr.error(
          'Unable to load country list'
        );
      },
    });
  }

  /**
   * Close dialog.
   */
  close(): void {
    if (this.isLoading) {
      return;
    }

    this.openChange.emit(false);
  }

  /**
   * Submit address.
   */
  handleSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (!this.details?.id) {
      this.toastr.error(
        'Patient ID is missing'
      );
      return;
    }

    const formValue = this.form.getRawValue();

    const tv = [
      {
        T: 'dk1',
        V: this.details.id,
      },

      {
        T: 'c1',
        V: JSON.stringify({
          Address:
            formValue.Address ||
            this.details?.Address ||
            this.details?.address ||
            '',

          CountryID:
            formValue.CountryID ||
            this.details?.CountryID ||
            this.details?.countryID ||
            '',

          State:
            formValue.State ||
            this.details?.State ||
            this.details?.state ||
            '',

          City:
            formValue.City ||
            this.details?.City ||
            this.details?.city ||
            '',

          PostalCode:
            formValue.PostalCode ||
            this.details?.PostalCode ||
            this.details?.postalCode ||
            '',
        }),
      },

      {
        T: 'c10',
        V: '2',
      },
    ];

    this.isLoading = true;

    this.srv.getdata('patient', tv).subscribe({
      next: (res) => {
        if (res?.Status === 1) {
          this.toastr.success(
            'Address updated successfully'
          );

          this.isLoading = false;

          this.refetch.emit();
          this.openChange.emit(false);
        } else {
          this.isLoading = false;

          this.toastr.error(
          
            'Unable to update address'
          );
        }
      },

      error: (error) => {
        console.error(
          'Address update error:',
          error
        );

        this.isLoading = false;

        this.toastr.error(
          'Unable to update address'
        );
      },
    });
  }
}

