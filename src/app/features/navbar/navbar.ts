import { Component, inject, Input } from '@angular/core';
import { Router } from '@angular/router';

import { ServicesDropdown } from './components/services-dropdown/services-dropdown';
import { NotificationPopover } from './components/notification-popover/notification-popover';
import { ProfilePopover } from './components/profile-popover/profile-popover';
import { Logo } from './components/logo/logo';
import { LocationDropdown } from './components/location-dropdown/location-dropdown';
import { MessageCenterComponent } from '../../pages/messages/message-center/message-center';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    MatIconModule,
    Logo,
    ServicesDropdown,
    NotificationPopover,
    ProfilePopover,
    LocationDropdown,
    MessageCenterComponent
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  private router = inject(Router);

  isMobileMenuOpen: boolean = false;

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  @Input() patientDetails: any = null;
  isAuthenticated(): boolean {
    return !!sessionStorage.getItem('tkn');
  }

  signIn(): void {
    this.router.navigate(['/auth/sign-in']);
  }
}