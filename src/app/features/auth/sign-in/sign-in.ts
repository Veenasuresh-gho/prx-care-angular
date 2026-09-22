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

  handleOtpRequested(id: string): void {
    this.id = id;
    this.showVerifyOtp = true;
  }
}
