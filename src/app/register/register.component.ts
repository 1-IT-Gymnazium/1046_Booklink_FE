import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RouterLinkActive, HttpClientModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  apiUrl: string = 'http://localhost:5267/v1/api/auth/register';

  constructor(private router: Router, private http: HttpClient) {}
  
    navigateTo(path: string): void {
      if (this.router.url !== path) {
        this.router.navigate([path]);
      }
    }
    register() {
      if (this.password !== this.confirmPassword) {
        alert('Passwords do not match!');
        return;
      }
  
      const userData = { email: this.email, password: this.password };
  
      this.http.post(this.apiUrl, userData).subscribe(
        (response) => {
          console.log('Registration successful', response);
          alert('Registration successful!');
          this.router.navigate(['/login']); // Redirect to login page
        },
        (error) => {
          console.error('Registration failed', error);
          alert('Registration failed! Try again.');
        }
      );
    }
}
