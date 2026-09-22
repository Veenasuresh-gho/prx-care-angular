import {
  Component,
  EventEmitter,
  inject,
  Input,
  Output
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ToastrService } from 'ngx-toastr';
import { GHOService } from '../../../../../services/gho.service';

@Component({
  selector: 'app-verify-otp',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './verify-otp.html'
})

export class VerifyOtp {

  srv = inject(GHOService);
  toastr = inject(ToastrService);

  @Input() phone = '';
  @Input() id = '';

  @Output() verified = new EventEmitter<void>();

  otp = ['', '', '', '', '', ''];

  loading = false;
  resendLoading = false;

  onOtpInput(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;

    this.otp[index] = input.value;

    if (input.value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  }

  onOtpKeyDown(event: KeyboardEvent, index: number): void {
    if (
      event.key === 'Backspace' &&
      !this.otp[index] &&
      index > 0
    ) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  }

  resendOtp(): void {

    if (this.resendLoading) {
      return;
    }

    if (!this.phone) {
      this.toastr.error('Phone number is missing');
      return;
    }

    this.resendLoading = true;

    const tv = [
      { T: 'dk1', V: this.phone },
      { T: 'dk2', V: 'otp' }
    ];

    this.srv.getdata('patient', tv).subscribe({
      next: (res) => {

        this.resendLoading = false;

        if (res.Status === 1) {
          this.toastr.success('OTP sent successfully');
        } else {
          this.toastr.error(
            'Unable to resend OTP'
          );
        }
      },

      error: () => {

        this.resendLoading = false;

        this.toastr.error('Unable to resend OTP');
      }
    });
  }

  verifyOtp(): void {

    if (this.loading) {
      return;
    }

    const otpValue = this.otp.join('');

    if (otpValue.length !== 6) {
      this.toastr.error('Please enter the 6-digit OTP');
      return;
    }

    if (!this.id) {
      this.toastr.error('User ID is missing');
      return;
    }

    this.loading = true;

    const tv = [
      {
        T: 'dk1',
        V: this.id
      },
      {
        T: 'dk2',
        V: otpValue
      },
      {
        T: 'c10',
        V: '10'
      }
    ];

    this.srv.getdata('patient', tv).subscribe({

      next: (res) => {

        console.log('OTP Response:', res);
        console.log('OTP Data:', res.Data);

        if (res.Status === 1) {

          const result = res.Data?.[0]?.[0];

          console.log('OTP Result:', result);

          const token = result?.Token;
          const userId = result?.id;

          console.log('Token:', token);
          console.log('ID:', userId);

          // Store ID independently
          if (userId) {
            sessionStorage.setItem('id', userId);
          }

          // Store token independently
          if (token) {
            sessionStorage.setItem('tkn', token);
          }

          console.log(
            'Stored token:',
            sessionStorage.getItem('tkn')
          );

          console.log(
            'Stored id:',
            sessionStorage.getItem('id')
          );

          this.toastr.success('OTP verified successfully');

          this.verified.emit();

          return;
        }

        this.loading = false;

        this.toastr.error(
          'Invalid OTP'
        );
      },

      error: (error) => {

        console.error(
          'OTP verification error:',
          error
        );

        this.loading = false;

        this.toastr.error(
          'Something went wrong'
        );
      }
    });
  }
}