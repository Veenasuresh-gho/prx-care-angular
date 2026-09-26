import { Component, inject } from '@angular/core';
import { Logo } from './components/logo/logo';
import { NotificationPopover } from './components/notification-popover/notification-popover';
import { ProfilePopover } from './components/profile-popover/profile-popover';
import { AuthService } from '../../services/auth-service';
import { ServicesDropdown } from './components/services-dropdown/services-dropdown';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    Logo,
    NotificationPopover,
    ProfilePopover,
    ServicesDropdown
  ],
  templateUrl: './navbar.html'
})
export class Navbar {

  private authService = inject(AuthService);
  isAuthenticated = () => this.authService.isAuthenticated();

  signIn() {
  }
}