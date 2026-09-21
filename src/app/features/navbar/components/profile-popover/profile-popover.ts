import { Component, input, signal } from '@angular/core';

export interface Patient {
  id?: string;
  patientId?: string;
  firstName?: string;
  lastName?: string;
  imageUrl?: string;
}

@Component({
  selector: 'app-profile-popover',
  standalone: true,
  templateUrl: './profile-popover.html'
})
export class ProfilePopover {

  patient = input<Patient | null>(null);

  isOpen = signal(false);

  get fullName(): string {
    return [
      this.patient()?.firstName,
      this.patient()?.lastName
    ]
      .filter(Boolean)
      .join(' ');
  }

  togglePopover() {
    this.isOpen.update(value => !value);
  }

  closePopover() {
    this.isOpen.set(false);
  }

  viewProfile() {
    this.closePopover();

    // We will connect your Angular profile route here.
    console.log('View profile');
  }

  logout() {
    const confirmed = window.confirm(
      'Are you sure you want to log out?'
    );

    if (!confirmed) {
      return;
    }

    this.closePopover();

    // We will connect your auth service here.
    console.log('Logout');
  }
}