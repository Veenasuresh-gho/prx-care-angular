import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private token = signal<string | null>(
    sessionStorage.getItem('token')
  );

  isAuthenticated(): boolean {
    return !!this.token();
  }

  getToken(): string | null {
    return this.token();
  }

  setToken(token: string): void {
    sessionStorage.setItem('token', token);
    this.token.set(token);
  }

  clearToken(): void {
    sessionStorage.removeItem('token');
    this.token.set(null);
  }
}   