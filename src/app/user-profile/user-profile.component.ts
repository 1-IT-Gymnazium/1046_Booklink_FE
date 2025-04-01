import { Component } from '@angular/core';
import { Book, DatabaseService } from '../services/database-service';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-user-profile',
    standalone: true,
    imports: [FormsModule, CommonModule],
    templateUrl: './user-profile.component.html',
    styleUrl: './user-profile.component.css'
})
export class UserProfileComponent {
    userEmail: string | null = '';
    userId: string | null = '';
    totalBooks: number = 0;
    readingListBooks: number = 0;

    userData = {
        name: '',
        email: '',
    };

    constructor(private dbService: DatabaseService, private authService: AuthService) { }

    ngOnInit(): void {
        this.userId = this.authService.getUserId();
        this.userEmail = this.authService.getUserEmail();
        this.userData.email = this.userEmail || '';

        if (this.userId) {
            this.dbService.getAllBooks(this.userId).subscribe((books: Book[]) => {
                const userBooks = books.filter(b => b.userId === this.userId);
                this.totalBooks = userBooks.length;
                this.readingListBooks = userBooks.filter(b => b.isInReadingList).length;
            });
        }

        this.userData.name = 'Anonymous User';
    }
}
