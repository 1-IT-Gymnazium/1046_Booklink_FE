import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})

export class ForgotPasswordComponent {
  email: string = '';
  message: string = '';
  submitted = false;

  constructor(private authService: AuthService) { }
  

  requestReset(): void {
    this.authService.requestPasswordReset({ email: this.email }).subscribe({
      next: () => this.submitted = true,
      error: (err: any) => console.error('Reset request failed:', err)
    });
  }
}
