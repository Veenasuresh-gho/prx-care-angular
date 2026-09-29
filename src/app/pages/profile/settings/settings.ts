import {
  Component,
  inject,
  Input,
} from '@angular/core';

import { Router } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { ChangePasswordDialog } from '../change-password-dialog/change-password-dialog';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    ChangePasswordDialog,
  ],
  templateUrl: './settings.html',
})
export class Settings {
  private router = inject(Router);

  @Input() patientDetails: any = null;

  changePasswordOpen = false;

  get patientId(): string {
    return String(
      this.patientDetails?.id ??
      this.patientDetails?.PatientID ??
      ''
    );
  }

  get ownerId(): string {
    return String(
      sessionStorage.getItem('owner') ?? ''
    );
  }

  get settings() {
    const items = [
      {
        label: 'Change Password',
        icon: 'lock_open',
        action: () => this.handleChangePassword(),
      },
      {
        label: 'Mail Us Your Query',
        icon: 'info',
        action: () =>
          this.router.navigate(['/contact']),
      },
      {
        label: 'Privacy Policy',
        icon: 'verified_user',
        action: () =>
          this.router.navigate(['/privacy-policy']),
      },
      {
        label: 'Logout',
        icon: 'logout',
        action: () => this.handleLogout(),
      },
      {
        label: 'Delete Account',
        icon: 'delete',
        action: () => this.handleDeleteAccount(),
      },
    ];

    if (
      this.ownerId &&
      this.patientId &&
      this.ownerId !== this.patientId
    ) {
      return items.filter(
        (item) =>
          item.label !== 'Change Password' &&
          item.label !== 'Delete Account'
      );
    }

    return items;
  }

  handleChangePassword(): void {
    this.changePasswordOpen = true;
  }

  closeChangePassword(): void {
    this.changePasswordOpen = false;
  }

  async handleLogout(): Promise<void> {
    const confirmed = window.confirm(
      'Are you sure you want to log out?'
    );

    if (!confirmed) {
      return;
    }

    this.clearAuth();

    await this.router.navigate(['/dashboard']);
  }

  async handleDeleteAccount(): Promise<void> {
    const confirmed = window.confirm(
      'Are you sure you want to delete your Prx account permanently? This action cannot be undone.'
    );

    if (!confirmed) {
      return;
    }

  }

  clearAuth(): void {
    sessionStorage.removeItem('tkn');
    sessionStorage.removeItem('id');
    sessionStorage.removeItem('owner');
  }
}

