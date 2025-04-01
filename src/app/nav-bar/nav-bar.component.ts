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
  showUserMenu: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.userEmail$.subscribe(email => {
      this.userEmail = email;
    });
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  logout(): void {
    this.authService.logout();
    this.showUserMenu = false;
  }

  navigateTo(path: string): void {
    if (this.router.url !== path) {
      this.router.navigate([path]);
    }
  }

  toggleUserMenu(): void {
    this.showUserMenu = !this.showUserMenu;
  }
  
  closeUserMenu(): void {
    this.showUserMenu = false;
  }
}