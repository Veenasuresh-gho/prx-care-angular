import { Component, inject, Input } from '@angular/core';
import { Router } from '@angular/router';

import { ServicesDropdown } from './components/services-dropdown/services-dropdown';
import { NotificationPopover } from './components/notification-popover/notification-popover';
import { ProfilePopover } from './components/profile-popover/profile-popover';
import { Logo } from './components/logo/logo';
import { LocationDropdown } from './components/location-dropdown/location-dropdown';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    Logo,
    ServicesDropdown,
    NotificationPopover,
    ProfilePopover,
    LocationDropdown
  ],
  templateUrl: './navbar.html',
})
export class Navbar {
  private router = inject(Router);

  @Input() patientDetails: any = null;

  isAuthenticated(): boolean {
    return !!sessionStorage.getItem('tkn');
  }

  signIn(): void {
    this.router.navigate(['/auth/sign-in']);
  }
}