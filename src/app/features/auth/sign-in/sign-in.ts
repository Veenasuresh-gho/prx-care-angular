import { Component } from '@angular/core';
import { LoginForm } from './components/login-form/login-form';
import { VerifyOtp } from './components/verify-otp/verify-otp';

@Component({
  selector: 'app-sign-in',
  imports: [LoginForm, VerifyOtp],
  templateUrl: './sign-in.html',
})
export class SignIn {
  showVerifyOtp = false;
  id = '';
  phone = '';

  handleOtpRequested(data: { id: string; phone: string }): void {
    this.id = data.id;
    this.phone = data.phone;
    this.showVerifyOtp = true;
  }
}
