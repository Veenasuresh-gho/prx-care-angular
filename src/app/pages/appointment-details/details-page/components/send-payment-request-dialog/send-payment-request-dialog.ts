import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnChanges,
  SimpleChanges,
  inject,
} from '@angular/core';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Dialog } from '../../../../../components/dialog/dialog';
import { Button } from '../../../../../components/button/button';
import { CountrySelectField } from '../../../../../components/country-select-field/country-select-field';
import { GHOService } from '../../../../../services/gho.service';

@Component({
  selector: 'app-send-payment-request-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    Dialog,
    Button,
    CountrySelectField,
  ],
  templateUrl: './send-payment-request-dialog.html',
})
export class SendPaymentRequestDialog implements OnChanges {
  @Input() open = false;
  @Input() amount = 0;
  @Input({ required: true }) appointmentId!: number | string;
  @Input() billingId?: number;

  @Output() openChange = new EventEmitter<boolean>();

  @Output() send = new EventEmitter<{
    fullName: string;
    countryCode: string;
    phoneNumber: string;
    email: string;
    amount: number;
  }>();

  private readonly fb = inject(FormBuilder);
  private readonly srv = inject(GHOService);

  isLoading = false;
  isCountryLoading = false;

  countries: any[] = [];

  form = this.fb.nonNullable.group({
    fullName: ['', Validators.required],
    countryCode: ['', Validators.required],
    phoneNumber: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['open'] && this.open) {
      this.loadCountries();
    }

    if (changes['open'] && !this.open) {
      this.resetForm();
    }
  }

  loadCountries(): void {
    if (this.countries.length > 0) {
      this.setDefaultCountry();
      return;
    }

    this.isCountryLoading = true;

    this.srv.getdata('country', []).subscribe({
      next: (res) => {
        if (res?.Status === 1) {
          this.countries = res.Data?.[0] ?? [];
          this.setDefaultCountry();
        }
      },
      error: (error) => {
        console.error('Error fetching countries:', error);
      },
      complete: () => {
        this.isCountryLoading = false;
      },
    });
  }

  setDefaultCountry(): void {
    if (!this.form.controls.countryCode.value && this.countries.length) {
      const defaultCountry =
        this.countries.find(
          (country) =>
            String(country.countryCode) === '91'
        ) ?? this.countries[0];

      if (defaultCountry) {
        this.form.controls.countryCode.setValue(
          String(defaultCountry.countryCode)
        );
      }
    }
  }

  get isValid(): boolean {
    return this.form.valid;
  }

  get selectedCountry(): any {
    const code = this.form.controls.countryCode.value;

    return this.countries.find(
      (country) =>
        String(country.countryCode) === String(code)
    );
  }

  handleSend(): void {
    if (this.form.invalid || this.isLoading) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();

    this.isLoading = true;

    this.send.emit({
      fullName: value.fullName,
      countryCode: value.countryCode,
      phoneNumber: value.phoneNumber,
      email: value.email,
      amount: this.amount,
    });

    this.isLoading = false;
  }

  handleDialogChange(value: boolean): void {
    if (!value) {
      this.resetForm();
    }

    this.openChange.emit(value);
  }

  resetForm(): void {
    const defaultCountry =
      this.countries.find(
        (country) =>
          String(country.countryCode) === '91'
      ) ?? this.countries[0];

    this.form.reset({
      fullName: '',
      countryCode: defaultCountry
        ? String(defaultCountry.countryCode)
        : '',
      phoneNumber: '',
      email: '',
    });

    this.isLoading = false;
  }
}

