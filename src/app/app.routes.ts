import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NgModule } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ValidateTokenComponent } from './validate-token/validate-token.component';
import { SearchComponent } from './search/search.component';
import { AuthGuard } from './services/auth.guard';
import { RealEstateComponent } from './real-estate/real-estate.component';

export const routes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent},
    { path: 'auth/validate-token', component: ValidateTokenComponent },
    { path: 'search', component: SearchComponent, canActivate: [AuthGuard] },
    { path: 'real-estates', component: RealEstateComponent, canActivate: [AuthGuard]},
    { path: '**', redirectTo: 'home' }
    ];

    @NgModule({
        imports: [RouterModule.forRoot(routes)],
        exports: [RouterModule]
    })
    export class AppRoutingModule { }