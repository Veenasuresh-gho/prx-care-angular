import { Component, signal } from '@angular/core';
import { Logo } from './components/logo/logo';
import { NotificationPopover } from './components/notification-popover/notification-popover';
import { ProfilePopover } from './components/profile-popover/profile-popover';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    Logo,
    NotificationPopover,
    ProfilePopover
  ],
  templateUrl: './navbar.html'
})
export class Navbar {

  isAuthenticated = signal(false);

  patient = {
    firstName: 'Veena',
    lastName: 'Suresh',
    patientId: 'PRX001'
  };

  signIn() {
    console.log('Sign in');
  }
}