import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'nav-bar',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent {
  userEmail: string | null = null;
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.userEmail$.subscribe(email => {
      this.userEmail = email; // Update UI dynamically
    });
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn(); // Check if user is logged in
  }

  logout(): void {
    this.authService.logout();
  }

  navigateTo(path: string): void {
    if (this.router.url !== path) {
      this.router.navigate([path]);
    }
  }
}