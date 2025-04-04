import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor() {}

  canActivate(): boolean {
    const isAuthenticated = !!localStorage.getItem('authToken'); // Check token
    console.log('AuthGuard check:', isAuthenticated);
    return isAuthenticated;
  }
}
