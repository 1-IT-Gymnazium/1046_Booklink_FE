import { Component } from '@angular/core';
import { Book, Bookshelf, DatabaseService, Room, Household } from '../services/database-service';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
    households: Household[] = [];
    rooms: Room[] = [];
    bookshelves: Bookshelf[] = [];
    books: Book[] = [];
    readingList: Book[] = [];
    isTyping: boolean = false;
    searchQuery: string = '';

    selectedHouseholdId: string | null = null;
    selectedRoomId: string | null = null;
    selectedBookshelfId: string | null = null;

    newBook: any = {
        title: '',
        author: '',
        genre: '',
        isbn: '',
        publicationYear: 0,
        isInReadingList: false,
        columnsFromLeft: 0,
        rowsFromTop: 0,
        householdId: '',
        roomId: '',
        bookshelfId: '',
        userId: '',
    };

    isModalOpen: boolean = false;

    selectedBookshelf: any = null;
    bookshelfGrid: any[] = [];

    constructor(private dbService: DatabaseService, private router: Router, private authService: AuthService) { }

    // For displaying books in search and reading list 
    ngOnInit(): void {
        this.loadBooks();
    }

    loadBooks(): void {
        const userId = this.authService.getUserId();
        if (userId) {
            this.dbService.getAllBooks(userId).subscribe((data: Book[]) => {
                this.books = data;
                this.readingList = this.books.filter(book => book.isInReadingList);

                this.dbService.getHouseholdsByUserId(userId).subscribe((data: Household[]) => {
                    this.households = data;
                });
            });
            this.newBook.userId = userId
        } else {
            console.error('User ID is null or undefined');
        }
    }

    get filteredBooks(): Book[] {
        return this.books.filter(book =>
            book.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
            book.author.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
    }
    onSearchInput(): void {
        this.isTyping = this.searchQuery.length > 0;
    }

    // When user selects different household
    onHouseholdChange(): void {
        if (!this.selectedHouseholdId) return;
        this.dbService.getRoomsByHouseholdId(this.selectedHouseholdId).subscribe((data: Room[]) => {
            this.rooms = data;
            this.bookshelves = [];
            this.selectedRoomId = null;
            this.selectedBookshelfId = null;
        });
    }

    // When user selects different room
    onRoomChange(): void {
        if (!this.selectedRoomId) return;
        this.dbService.getBookshelvesByRoom(this.selectedRoomId).subscribe((data: Bookshelf[]) => {
            this.bookshelves = data;
            this.selectedBookshelfId = null;
        });
    }

    // When user selects different bookshelf
    onBookshelfChange(): void {
        if (!this.selectedBookshelfId) return;
        this.dbService.getBookshelfById(this.selectedBookshelfId).subscribe(shelf => {
            this.selectedBookshelf = shelf;
            this.bookshelfGrid = Array(shelf.numberOfColumns * shelf.numberOfRows).fill(null);
            console.log(shelf)
        });
        console.log(this.selectedBookshelf)
    }

    openModal(): void {
        this.isModalOpen = true;
    }

    // resets book parameters
    closeModal(): void {
        this.isModalOpen = false;
        this.newBook = {
            title: '',
            author: '',
            genre: '',
            isbn: '',
            pubicationYear: 0,
            isInReadingList: false,
            columnsFromLeft: 0,
            rowsFromTop: 0,
            householdId: '',
            roomId: '',
            bookshelfId: '',
            userId: '',
        };
    }

    saveBook(): void {
        if (!this.selectedBookshelfId) {
            alert("Please select a bookshelf.");
            return;
        }

        this.newBook.householdId = this.selectedHouseholdId;
        this.newBook.roomId = this.selectedRoomId;
        this.newBook.bookshelfId = this.selectedBookshelfId;

        console.log("", this.newBook)
        this.dbService.createBook(this.newBook).subscribe(() => {
            this.closeModal();
            console.log("Book added successfully!");
            this.loadBooks();
        }, error => {
            console.error("Error adding book:", error);
        });
    }

    // goes to book detail
    selectBookFromSearch(book: Book): void {
        this.router.navigate(['/collections'], {
            state: { selectedBook: book }
        });
    }

    toggleReadingList(book: Book): void {
        this.dbService.updateBook(book.id, book).subscribe(() => {
            if (!book.isInReadingList) {
                this.readingList = this.readingList.filter(b => b.id !== book.id);
            }
        });
    }

    selectCell(index: number): void {
        const col = index % this.selectedBookshelf.numberOfColumns;
        const row = Math.floor(index / this.selectedBookshelf.numberOfColumns);
        this.newBook.columnFromLeft = col + 1;
        this.newBook.rowFromTop = row + 1;
    }

    isSelectedCell(index: number): boolean {
        const col = index % this.selectedBookshelf.numberOfColumns;
        const row = Math.floor(index / this.selectedBookshelf.numberOfColumns);
        return this.newBook.columnFromLeft === col + 1 && this.newBook.rowFromTop === row + 1;
    }

    // for loading graphical representation of book placement in detail
    getCellPosition(index: number): string {
        const col = index % this.selectedBookshelf.numberOfColumns;
        const row = Math.floor(index / this.selectedBookshelf.numberOfColumns);
        return `${row + 1},${col + 1}`;
    }
}