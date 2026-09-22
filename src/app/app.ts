import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './features/navbar/navbar';
import { AuthService } from './services/auth-service';
import { Auth } from './features/auth/auth';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Auth],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private authService = inject(AuthService)
  protected readonly title = signal('prx-care');

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

}
