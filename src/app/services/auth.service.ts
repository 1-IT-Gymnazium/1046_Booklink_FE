import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:5267/api/v1/auth';
  private jwtHelper = new JwtHelperService();

  private userEmailSubject = new BehaviorSubject<string | null>(localStorage.getItem('userEmail')); // Holds the logged-in user's email
  userEmail$ = this.userEmailSubject.asObservable(); // Observable for components

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap(response => {
        console.log('Received token:', response.token); // Debug log
        localStorage.setItem('authToken', response.token); // Save token on success
        console.log('Saved userEmail:', email);
        localStorage.setItem('userEmail', email)
        this.userEmailSubject.next(email);
      }),
      catchError(error => {
        console.error('Error from backend:', error); // Logs any errors
        return throwError(error); // Rethrow the error for handling
      })
    );
  }

  getUserId(): string | null {
    const token = localStorage.getItem('authToken');
    if (!token)
      return null;

    const decodedToken = this.jwtHelper.decodeToken(token);
    return decodedToken?.sub || null; // Ensure your backend includes userId in the token payload
  }
  
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
