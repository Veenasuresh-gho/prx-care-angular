import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private token = signal<string | null>(
    sessionStorage.getItem('tkn')
  );

  isAuthenticated(): boolean {
    return !!this.token();
  }

  getToken(): string | null {
    return this.token();
  }

  setToken(token: string): void {
    sessionStorage.setItem('tkn', token);
    this.token.set(token);
  }

  clearToken(): void {
    sessionStorage.removeItem('tkn');
    sessionStorage.removeItem('id');

    this.token.set(null);
  }
}