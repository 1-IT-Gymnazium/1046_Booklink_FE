import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-validate-token',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './validate-token.component.html',
  styleUrl: './validate-token.component.css'
})
export class ValidateTokenComponent {
  message: string = 'Verifying your email...';
  isSuccess: boolean = false;

  private apiUrl = 'http://localhost:5267/v1/api/auth/validate-token'; // Update with your backend URL

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      const email = params['email'];

      if (token && email) {
        this.verifyEmail(token, email);
      } else {
        this.message = 'Invalid confirmation link.';
      }
    });
  }

  verifyEmail(token: string, email: string): void {
    this.http.post(this.apiUrl, { token, email }).subscribe({
      next: () => {
        this.message = 'Your email has been successfully verified!';
        this.isSuccess = true;
        setTimeout(() => this.router.navigate(['/login']), 3000); // Redirect to login page after 3s
      },
      error: () => {
        this.message = 'Email verification failed. The link may be expired or invalid.';
        this.isSuccess = false;
      }
    });
  }
}
