import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent {
  constructor(private authService: AuthService, private router: Router) {}
  
    email = '';
    password = '';
    errorMessage = '';

    login() {
      this.authService.login(this.email, this.password).subscribe({
        next: (response) => {
          console.log('Login successful:', response);
          console.log('Redirecting to /dashboard...');
          this.router.navigateByUrl('/dashboard'); // Redirect to search page
        },
        error: (err) => {
          console.error('Login failed:', err);
          this.errorMessage = 'Invalid credentials. Please try again.';
        }
      });
    }
}
