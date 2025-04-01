import { Router, RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NgModule } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ValidateTokenComponent } from './validate-token/validate-token.component';
import { AuthGuard } from './services/auth.guard';
import { DatabaseComponent } from './database/database.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthService } from './services/auth.service';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';


export const routes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent},
    { path: 'auth/validate-token', component: ValidateTokenComponent },
    { path: 'collections', component: DatabaseComponent, canActivate: [AuthGuard]},
    { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]},
    { path: 'profile', component: UserProfileComponent, canActivate: [AuthGuard]},
    { path: 'forgot-password', component: ForgotPasswordComponent},
    { path: 'reset-password', component: ResetPasswordComponent },
    ];

    @NgModule({
        imports: [RouterModule.forRoot(routes)],
        exports: [RouterModule]
    })
    export class AppRoutingModule {
        constructor(private authService: AuthService, private router: Router) {
          let defaultRoute = this.authService.isLoggedIn() ? '/dashboard' : '/home';
          this.router.navigateByUrl(defaultRoute);
        }
      }