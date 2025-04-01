import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})


export class ResetPasswordComponent {
  email: string = '';
  token: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  success = false;

  constructor(private route: ActivatedRoute, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.email = this.route.snapshot.queryParamMap.get('email') || '';
    this.token = this.route.snapshot.queryParamMap.get('token') || '';
  }

  resetPassword(): void {
    if (this.newPassword !== this.confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    this.authService.resetPassword({
      email: this.email,
      token: this.token,
      newPassword: this.newPassword
    }).subscribe({
      next: () => this.success = true,
      error: err => alert(err.error.message || 'Password reset failed.')
    });

    if (this.success = true) {
      setTimeout(() => {
        this.router.navigate(["/login"])
    }, 3000);
    }
  }
}
