import {
  Component,
  inject,
  input,
  signal,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { ConfirmationDialog } from '../../../../components/confirmation-dialog/confirmation-dialog';

@Component({
  selector: 'app-profile-popover',
  standalone: true,
  imports: [
    MatIconModule,
    ConfirmationDialog,
  ],
  templateUrl: './profile-popover.html',
})
export class ProfilePopover {
  private router = inject(Router);

  patientDetails = input<any>(null);

  isOpen = signal(false);

  showLogoutDialog = signal(false);

  patient = this.patientDetails;

  togglePopover(): void {
    this.isOpen.update(value => !value);
  }

  closePopover(): void {
    this.isOpen.set(false);
  }

  viewProfile(): void {
    this.closePopover();

    this.router.navigate(['/profile']);
  }

  openLogoutDialog(): void {
    this.showLogoutDialog.set(true);
  }

  closeLogoutDialog(): void {
    this.showLogoutDialog.set(false);
  }

  logout(): void {
    this.showLogoutDialog.set(false);
    this.isOpen.set(false);

    sessionStorage.removeItem('tkn');
    sessionStorage.removeItem('id');

    this.router.navigate(['/auth/sign-in']);
  }
}