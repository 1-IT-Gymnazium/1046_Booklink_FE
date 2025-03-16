import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { DatabaseService } from '../services/database-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import { Book } from '../services/database-service';

@Component({
    selector: 'app-real-estate',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule],
    templateUrl: './real-estate.component.html',
    styleUrl: './real-estate.component.css'
})
export class RealEstateComponent {
    households: any[] = [];
    rooms: any[] = [];
    bookshelves: any[] = [];
    books: any[] = [];
    bookDetails: Book | null = null;

    newEntity: any = {};

    currentView: 'households' | 'rooms' | 'bookshelves' | 'books' | 'book' = 'households';
    breadcrumb: string[] = ['My Households'];
    selectedIds: { userId?: string; householdId?: string; roomId?: string; bookshelfId?: string } = {};

    isModalOpen = false;
    isDeleteModalOpen = false;

    householdToDelete: string | null = null;
    roomToDelete: string | null = null;
    entityToDelete: string | null = null;

    selectedHouseholdId: string | null = null;

    isRoomsVisible: boolean = false;

    currentHouseholdName = ''
    currentRoomName = ''
    currentBookshelfName = ''

    constructor(private authService: AuthService, private dbService: DatabaseService, private router: Router) { }

    ngOnInit(): void {
        const userId = this.authService.getUserId(); // Call the method safely
        console.log('User ID from Token:', userId);
        if (userId) {
            this.selectedIds.userId = userId
            this.loadHouseholds(userId);
        } else {
            console.error('User ID is null or undefined');
        }
    }

    navigateTo(path: string): void {
        if (this.router.url !== path) {
            this.router.navigate([path]);
        }
    }

    loadHouseholds(userId: string): void {
        this.dbService.getHouseholdsByUserId(userId).subscribe(
            (data) => {
                this.households = data;
            },
            (error) => {
                console.error('Error fetching households:', error);
            }
        );
    }

    openModal(): void {
        this.isModalOpen = true;

        // Initialize the newEntity object based on the current view
        if (this.currentView === 'households') {
            this.newEntity = { name: '' };
            this.newEntity.userId = this.selectedIds.userId
        } else if (this.currentView === 'rooms') {
            this.newEntity = { name: '' };
            this.newEntity.householdId = this.selectedIds.householdId
        } else if (this.currentView === 'bookshelves') {
            this.newEntity = { name: '' };
            this.newEntity.description = '';
            this.newEntity.numOfColumns = '';
            this.newEntity.numOfRows = '';
            this.newEntity.roomId = this.selectedIds.roomId;
        } else if (this.currentView === 'books') {
            this.newEntity.userId = this.selectedIds.userId
            this.newEntity.title = null;
            this.newEntity.author = '';
            this.newEntity.genre = '';
            this.newEntity.isbn = '';
            this.newEntity.publishingYear = '';
            this.newEntity.isInReadingList = false;
            this.newEntity.bookshelfId = this.selectedIds.bookshelfId
        }
    }

    closeModal(): void {
        this.isModalOpen = false;
        this.newEntity = null; // Reset input
    }

    saveEntity(): void {
        switch (this.currentView) {
            case 'households':
                this.dbService.createHousehold(this.newEntity).subscribe(() => this.closeModal());
                window.location.reload()
                break;
            case 'rooms':
                console.log(this.newEntity);

                this.dbService.createRoom(this.newEntity).subscribe(() => {
                    this.closeModal();

                    setTimeout(() => {
                        this.goToRooms(String(this.selectedIds.householdId), this.currentHouseholdName);
                    }, 100);
                });
                break;

            case 'bookshelves':
                console.log(this.newEntity);

                this.dbService.createBookshelf(this.newEntity).subscribe(() => {
                    this.closeModal();

                    setTimeout(() => {
                        this.goToBookshelves(String(this.selectedIds.roomId), this.currentRoomName);
                    }, 100);
                });
                break;
            case 'books':
                console.log(this.newEntity);

                this.dbService.createBook(this.newEntity).subscribe(() => {
                    this.closeModal();

                    setTimeout(() => {
                        this.goToRooms(String(this.selectedIds.bookshelfId), this.currentBookshelfName);
                    }, 100);
                });
                break;
        }
    }

    goToRooms(householdId: string, householdName: string): void {
        this.selectedIds.householdId = householdId;
        this.currentHouseholdName = householdName;

        if (this.currentView != 'rooms') {
            this.currentView = 'rooms';
            this.breadcrumb.push(householdName);
        }
        
        this.dbService.getRoomsByHouseholdId(householdId).subscribe((rooms) => {
            this.rooms = rooms;
        });
    }

    goToBookshelves(roomId: string, roomName: string): void {
        this.selectedIds.roomId = roomId;
        this.currentRoomName = roomName

        if (this.currentView != 'bookshelves') {
            this.currentView = 'bookshelves';
            this.breadcrumb.push(roomName);
        }

        this.dbService.getBookshelvesByRoom(roomId).subscribe((shelves) => {
            this.bookshelves = shelves;
        });
    }

    goToBooks(bookshelfId: string, bookshelfName: string): void {
        this.selectedIds.bookshelfId = bookshelfId;
        this.currentBookshelfName = bookshelfName

        if (this.currentView != 'books') {
            this.currentView = 'books';
            this.breadcrumb.push(bookshelfName);
        }
        
        this.dbService.getBooksByShelf(bookshelfId).subscribe((books) => {
            this.books = books;
        });
    }

    navigateBack(level: number): void {
        this.currentView = ['households', 'rooms', 'bookshelves', 'books', 'book'][level] as 'households' | 'rooms' | 'bookshelves' | 'books' | 'book';
        this.breadcrumb = this.breadcrumb.slice(0, level + 1);
    }

    deleteHousehold(): void {
        if (!this.householdToDelete) return;

        this.dbService.deleteHousehold(this.householdToDelete).subscribe(() => {
            this.households = this.households.filter(e => e.id !== this.householdToDelete);
            this.isDeleteModalOpen = false;
            this.householdToDelete = null;
        });
    }

    confirmHouseholdDelete(householdId: string): void {
        this.householdToDelete = householdId;
        this.isDeleteModalOpen = true;
    }

    deleteRoom(): void {
        if (!this.roomToDelete) return;

        this.dbService.deleteRoom(this.roomToDelete).subscribe(() => {
            this.rooms = this.rooms.filter(r => r.id !== this.roomToDelete);
            this.isDeleteModalOpen = false;
            this.roomToDelete = null;
        });
    }

    confirmRoomDelete(roomId: string): void {
        this.roomToDelete = roomId;
        this.isDeleteModalOpen = true;
    }


    closeRooms(): void {
        this.isRoomsVisible = false;
        this.selectedHouseholdId = null;
    }

    getEntityName(): string {
        switch (this.currentView) {
            case 'households': return 'Household';
            case 'rooms': return 'Room';
            case 'bookshelves': return 'Bookshelf';
            case 'books': return 'Book';
            default: return 'Entity';
        }
    }

    deleteEntity(): void {
        if (!this.entityToDelete || !this.currentView) return;

        let deleteObservable: Observable<any>;

        switch (this.currentView) {
            case 'households':
                deleteObservable = this.dbService.deleteHousehold(this.entityToDelete);
                this.households = this.households.filter(e => e.id !== this.entityToDelete);
                break;
            case 'rooms':
                deleteObservable = this.dbService.deleteRoom(this.entityToDelete);
                this.rooms = this.rooms.filter(e => e.id !== this.entityToDelete);
                break;
            case 'bookshelves':
                deleteObservable = this.dbService.deleteBookshelf(this.entityToDelete);
                this.bookshelves = this.bookshelves.filter(e => e.id !== this.entityToDelete);
                break;
            case 'books':
                deleteObservable = this.dbService.deleteBook(this.entityToDelete);
                this.books = this.books.filter(e => e.id !== this.entityToDelete);
                break;
            default:
                console.error('Unknown entity type');
                return;
        }

        deleteObservable.subscribe(() => {
            this.isDeleteModalOpen = false;
            this.entityToDelete = null;
        });
    }

    confirmDelete(entityId: string): void {
        this.entityToDelete = entityId;
        this.isDeleteModalOpen = true;
    }

    showBookDetails(book: Book): void {
        this.bookDetails = book; // Store the selected book
        this.currentView = 'book'; // Switch view to book details
    }
      
      
    closeBookDetails(): void {
        this.bookDetails = null; // Hide book details
        this.currentView = 'books';
    }
}