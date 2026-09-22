import { Component, inject, output } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { GHOService } from '../../../../../services/gho.service';
import { AuthService } from '../../../../../services/auth-service';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login-form.html'
})

export class LoginForm {

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private ghoService = inject(GHOService);
  authService = inject(AuthService);

  isLoading = false;
  otpRequested = output<string>();
  id: string = '';

  form = this.fb.group({
    phone: ['', Validators.required],
    password: [''],
    useOtp: [true]
  });

  get useOtp(): boolean {
    return this.form.controls.useOtp.value ?? false;
  }

  setLoginMode(useOtp: boolean): void {
    this.form.controls.useOtp.setValue(useOtp);
    const passwordControl = this.form.controls.password;
    if (useOtp) {
      passwordControl.clearValidators();
      passwordControl.setValue('');
    } else {
      passwordControl.setValidators([Validators.required]);
    }
    passwordControl.updateValueAndValidity();
  }

  submit(): void {

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const data = this.form.getRawValue();
    this.isLoading = true;

    const tags = [
      {
        T: 'dk1',
        V: data.phone ?? ''
      },
      {
        T: 'dk2',
        V: data.useOtp
          ? 'otp'
          : data.password ?? ''
      },
      {
        T: 'c10',
        V: '9'
      }
    ];

    this.ghoService.getdata('patient', tags).subscribe({

      next: (response) => {
        this.id = response.Data?.[0]?.[0]?.id ?? '';
        if (this.id) {
          sessionStorage.setItem('id', this.id);
        }
        const token = response.Data?.[0]?.[0]?.Token;
        if (token) {
          this.authService.setToken(token);
          this.router.navigate(['/dashboard']);
        }
        this.isLoading = false;
        if (data.useOtp) {
          this.otpRequested.emit(this.id);
        }
      },
      error: (error) => {
        this.isLoading = false;
      }
    });
  }

  goToSignup(): void {
    this.router.navigate(['/auth/signup']);
  }
}