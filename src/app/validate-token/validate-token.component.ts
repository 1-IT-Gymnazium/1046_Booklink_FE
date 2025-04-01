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

    private apiUrl = 'http://localhost:5267/v1/api/auth/validate-token';

    constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) { }

    ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            const email = params['email'];
            const token = params['token'];

            if (token && email) {
                this.verifyEmail(email, token);
            } else {
                this.message = 'Invalid confirmation link.';
            }
        });
    }

    verifyEmail(email: string, token: string): void {
        const session = {
            email: email,
            sessionToken: token
          };

        this.http.post(this.apiUrl, session).subscribe({
            next: () => {
                this.message = 'Your email has been successfully verified! Redirecting to login page...';
                this.isSuccess = true;
                setTimeout(() => this.router.navigate(['/login']), 3000);
            },
            error: () => {
                this.message = 'Email verification failed. The link may be expired or invalid.';
                this.isSuccess = false;
            }
        });
    }
}
