import {
  Component,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-profile-popover',
  standalone: true,
  imports: [MatIconModule, JsonPipe],
  templateUrl: './profile-popover.html',
})
export class ProfilePopover {
  private router = inject(Router);

  patientDetails = input<any>(null);

  isOpen = signal(false);

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

  logout(): void {
    const confirmed = window.confirm('Are you sure you want to log out?');

    if (!confirmed) {
      return;
    }

    this.closePopover();

    sessionStorage.removeItem('tkn');
    sessionStorage.removeItem('id');

    this.router.navigate(['/auth/sign-in']);
  }
}