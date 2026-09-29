import {
  Component,
  EventEmitter,
  Input,
  Output,
  inject,
} from '@angular/core';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';

import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { GHOService } from '../../../services/gho.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-change-password-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './change-password-dialog.html',
})
export class ChangePasswordDialog {
  private fb = inject(FormBuilder);
  private srv = inject(GHOService);
  private toastr = inject(ToastrService);

  @Input() open = false;

  @Output() openChange =
    new EventEmitter<boolean>();

  isLoading = false;

  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;

  form = this.fb.group(
    {
      currentPassword: [
        '',
        Validators.required,
      ],

      newPassword: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(
            /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/
          ),
        ],
      ],

      confirmPassword: [
        '',
        Validators.required,
      ],
    },
    {
      validators: this.passwordMatchValidator,
    }
  );

  private passwordMatchValidator(
    control: AbstractControl
  ): ValidationErrors | null {
    const newPassword =
      control.get('newPassword')?.value;

    const confirmPassword =
      control.get('confirmPassword')?.value;

    if (
      newPassword &&
      confirmPassword &&
      newPassword !== confirmPassword
    ) {
      return {
        passwordMismatch: true,
      };
    }

    return null;
  }

  get currentPasswordControl() {
    return this.form.get(
      'currentPassword'
    );
  }

  get newPasswordControl() {
    return this.form.get(
      'newPassword'
    );
  }

  get confirmPasswordControl() {
    return this.form.get(
      'confirmPassword'
    );
  }

  close(): void {
    if (this.isLoading) {
      return;
    }

    this.resetForm();

    this.openChange.emit(false);
  }

  resetForm(): void {
    this.form.reset();

    this.showCurrentPassword = false;
    this.showNewPassword = false;
    this.showConfirmPassword = false;
  }

  handleSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const userId =
      sessionStorage.getItem('id');

    if (!userId) {
      this.toastr.error(
        'Patient ID is missing'
      );
      return;
    }

    const formValue =
      this.form.getRawValue();

    const payload = {
      patientId: userId,
      currentPassword:
        formValue.currentPassword || '',
      newPassword:
        formValue.newPassword || '',
      confirmPassword:
        formValue.confirmPassword || '',
    };

    this.isLoading = true;

    /*
     * Replace the action/tags below with
     * the exact password API used by your
     * existing React useChangePassword hook.
     */
    this.srv
      .getdata('changePassword', [
        {
          T: 'c1',
          V: JSON.stringify(payload),
        },
      ])
      .subscribe({
        next: (res) => {
          if (res?.Status === 1) {
            this.toastr.success(
              res?.Info ||
                'Your password has been updated.'
            );

            this.isLoading = false;

            this.resetForm();

            this.openChange.emit(false);
          } else {
            this.isLoading = false;

            this.toastr.error(
                res?.Info ||
                'Failed to change password'
            );
          }
        },

        error: (error) => {
          console.error(
            'Change password error:',
            error
          );

          this.isLoading = false;

          this.toastr.error(
            'Server error. Please try again.'
          );
        },
      });
  }
}
