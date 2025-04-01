import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

// Interfaces for password reset requests
export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  token: string;
  newPassword: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // base auth url
  private apiUrl = 'http://localhost:5267/v1/api/auth';

  private jwtHelper = new JwtHelperService();

  private userEmailSubject = new BehaviorSubject<string | null>(
    localStorage.getItem('userEmail')
  );
  userEmail$ = this.userEmailSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  // Send password reset request to backend
  requestPasswordReset(request: ForgotPasswordRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot-password`, request);
  }

  // backend call
  resetPassword(data: ResetPasswordRequest) {
    return this.http.post(`${this.apiUrl}/reset-password`, data);
  }

  login(email: string, password: string): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap(response => {
        // Store JWT in localStorage
        console.log('Received token:', response.token);
        localStorage.setItem('authToken', response.token);

        // Store user email for later use
        console.log('Saved userEmail:', email);
        localStorage.setItem('userEmail', email);

        this.userEmailSubject.next(email);
      }),
      // Handle error responses from backend
      catchError(error => {
        console.error('Error from backend:', error);
        return throwError(error);
      })
    );
  }

  getUserId(): string | null {
    const token = localStorage.getItem('authToken');
    if (!token) return null;

    const decodedToken = this.jwtHelper.decodeToken(token);
    return decodedToken?.sub || null;
  }

  // Clear auth data and redirect to home page
  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userEmail');
    this.userEmailSubject.next(null);
    this.router.navigateByUrl('/home');
  }

  getUserEmail(): string | null {
    return this.userEmailSubject.value;
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('authToken');
  }
}
