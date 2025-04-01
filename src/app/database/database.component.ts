import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { DatabaseService } from '../services/database-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { forkJoin, Observable } from 'rxjs';
import { Book } from '../services/database-service';

@Component({
    selector: 'app-real-estate',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule],
    templateUrl: './database.component.html',
    styleUrl: './database.component.css'
})
export class DatabaseComponent {
    households: any[] = [];
    rooms: any[] = [];
    bookshelves: any[] = [];
    books: any[] = [];
    bookDetails: Book | null = null;

    householdOptions: any[] = [];
    roomOptions: any[] = [];
    bookshelfOptions: any[] = [];


    newEntity: any = {};

    currentView: 'households' | 'rooms' | 'bookshelves' | 'books' | 'book' = 'households';
    breadcrumb: string[] = ['My Households'];
    selectedIds: { userId?: string; householdId?: string; roomId?: string; bookshelfId?: string } = {};

    isCreateModalOpen = false;
    isDeleteModalOpen = false;

    entityToDelete: string | null = null;

    currentHouseholdName = ''
    currentRoomName = ''
    currentBookshelfName = ''

    editEntity: any = null;
    isEditModalOpen = false;

    selectedBookshelf: any = null;
    bookshelfGrid: any[] = [];

    openedFromDashboard = false

    constructor(private router: Router, private authService: AuthService, private dbService: DatabaseService) {
        // Check for navigation state on every route change
        const nav = this.router.getCurrentNavigation();
        const state = nav?.extras?.state as { selectedBook?: Book };

        if (state?.selectedBook) {
            this.showBookFromOutside(state.selectedBook);
        }

    }

    ngOnInit(): void {
        const userId = this.authService.getUserId();
        if (userId) {
            this.selectedIds.userId = userId;

            forkJoin({
                households: this.dbService.getHouseholdsByUserId(userId),
                rooms: this.dbService.getAllRoomsByUserId(userId),
                bookshelves: this.dbService.getAllBookshelvesByUserId(userId)
            }).subscribe(({ households, rooms, bookshelves }) => {
                this.householdOptions = households;
                this.roomOptions = rooms;
                this.bookshelfOptions = bookshelves;
            });
            this.loadHouseholds(userId);
        }

        const selectedBook = this.router.getCurrentNavigation()?.extras?.state?.['selectedBook'];
        if (selectedBook) {
            this.bookDetails = selectedBook;

            this.dbService.getBookshelfById(selectedBook.bookshelfId).subscribe(shelf => {
                this.selectedBookshelf = shelf;
                this.bookshelfGrid = Array(shelf.numberOfColumns * shelf.numberOfRows).fill(null);
            });
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

    openCreateModal(): void {
        this.isCreateModalOpen = true;

        this.newEntity = { userId: this.selectedIds.userId };

        if (this.currentView === 'households') {
            this.newEntity.name = '';
        }
        else if (this.currentView === 'rooms') {
            this.newEntity = {
                name: '',
                householdId: this.selectedIds.householdId
            }
        }
        else if (this.currentView === 'bookshelves') {
            this.newEntity = {
                name: '',
                description: '',
                numberOfColumns: 0,
                numberOfRows: 0,
                roomId: this.selectedIds.roomId
            }
        }
        else if (this.currentView === 'books') {
            this.newEntity = {
                title: '',
                author: '',
                genre: '',
                isbn: '',
                publicationYear: 0,
                isInReadingList: false,
                columnsFromLeft: 0,
                rowsFromTop: 0,
                householdId: this.selectedIds.householdId,
                roomId: this.selectedIds.roomId,
                userId: this.selectedIds.userId
            };

            this.dbService.getHouseholdsByUserId(this.selectedIds.userId!).subscribe(data => {
                this.householdOptions = data;
            });
        }
        console.log(this.newEntity)
    }

    closeCreateModal(): void {
        this.isCreateModalOpen = false;
        this.newEntity = null;
    }

    saveEntity(): void {
        switch (this.currentView) {
            case 'households':
                this.dbService.createHousehold(this.newEntity).subscribe(() => this.closeCreateModal());
                window.location.reload()
                break;
            case 'rooms':
                console.log(this.newEntity);

                this.dbService.createRoom(this.newEntity).subscribe(() => {
                    this.closeCreateModal();

                    setTimeout(() => {
                        this.goToRooms(String(this.selectedIds.householdId), this.currentHouseholdName);
                    }, 100);
                });
                break;

            case 'bookshelves':
                console.log(this.newEntity);

                this.dbService.createBookshelf(this.newEntity).subscribe(() => {
                    this.closeCreateModal();

                    setTimeout(() => {
                        this.goToBookshelves(String(this.selectedIds.roomId), this.currentRoomName);
                    }, 100);
                });
                break;
            case 'books':
                console.log(this.newEntity);

                this.dbService.createBook(this.newEntity).subscribe(() => {
                    this.closeCreateModal();

                    setTimeout(() => {
                        this.goToBooks(String(this.selectedIds.bookshelfId), this.currentBookshelfName);
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
        this.breadcrumb = this.breadcrumb.slice(0, level + 1);

        this.currentView = ['households', 'rooms', 'bookshelves', 'books', 'book'][level] as
            'households' | 'rooms' | 'bookshelves' | 'books' | 'book';

        switch (this.currentView) {
            case 'households':
                if (this.selectedIds.userId) {
                    this.loadHouseholds(this.selectedIds.userId);
                }
                break;

            case 'rooms':
                if (this.selectedIds.householdId) {
                    this.goToRooms(this.selectedIds.householdId, this.currentHouseholdName);
                }
                break;

            case 'bookshelves':
                if (this.selectedIds.roomId) {
                    this.goToBookshelves(this.selectedIds.roomId, this.currentRoomName);
                }
                break;

            case 'books':
                if (this.selectedIds.bookshelfId) {
                    this.goToBooks(this.selectedIds.bookshelfId, this.currentBookshelfName);
                }
                break;
        }
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
        console.log(this.entityToDelete, this.currentView)
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
        this.bookDetails = book;
        this.currentView = 'book';
        this.breadcrumb.push(book.title);

        this.dbService.getBookshelfById(book.bookshelfId).subscribe((shelf) => {
            this.selectedBookshelf = shelf;
            this.bookshelfGrid = Array(shelf.numberOfColumns * shelf.numberOfRows).fill(null);
        });
    }

    closeBookDetails(): void {
        this.bookDetails = null;
        this.breadcrumb.pop();
        this.currentView = 'books';
    }

    toggleReadingList(book: Book): void {
        this.dbService.updateBook(book.id, book).subscribe(
            () => console.log(`Book "${book.title}" updated successfully!`),
            (error) => console.error(`Failed to update book:`, error)
        );
    }

    showBookFromOutside(book: Book): void {
        this.openedFromDashboard = true
        this.bookDetails = book;
        this.breadcrumb = ['My Households', book.title];
        this.currentView = 'book';

        this.dbService.getBookshelfById(book.bookshelfId).subscribe((shelf) => {
            this.selectedBookshelf = shelf;
            this.bookshelfGrid = Array(shelf.numberOfColumns * shelf.numberOfRows).fill(null);
          });
    }

    onHouseholdChange(): void {
        this.newEntity.roomId = null;
        this.newEntity.bookshelfId = null;
        this.roomOptions = [];
        this.bookshelfOptions = [];

        if (this.newEntity.householdId) {
            this.dbService.getRoomsByHouseholdId(this.newEntity.householdId).subscribe((rooms) => {
                this.roomOptions = rooms;
            });
        }
    }

    onRoomChange(): void {
        this.newEntity.bookshelfId = null;
        this.bookshelfOptions = [];

        if (this.newEntity.roomId) {
            this.dbService.getBookshelvesByRoom(this.newEntity.roomId).subscribe((shelves) => {
                this.bookshelfOptions = shelves;
            });
        }
    }

    onBookshelfChange(): void {
        if (this.newEntity.bookshelfId) {
            this.dbService.getBookshelfById(this.newEntity.bookshelfId).subscribe(shelf => {
                this.selectedBookshelf = shelf;
                this.bookshelfGrid = Array(shelf.numberOfColumns * shelf.numberOfRows).fill(null);
            });
        }
    }



    openEditModal(entity: any): void {
        this.editEntity = { ...entity };
        this.isEditModalOpen = true;
    }

    closeEditModal(): void {
        this.isEditModalOpen = false;
        this.editEntity = null;
    }

    saveEditEntity(): void {
        switch (this.currentView) {
            case 'households':
                this.dbService.updateHousehold(this.editEntity.id, this.editEntity).subscribe(() => {
                    this.loadHouseholds(this.selectedIds.userId!);
                    this.closeEditModal();
                });
                break;

            case 'rooms':
                this.dbService.updateRoom(this.editEntity.id, this.editEntity).subscribe(() => {
                    this.goToRooms(this.selectedIds.householdId!, this.currentHouseholdName);
                    this.closeEditModal();
                });
                break;

            case 'bookshelves':
                this.dbService.updateBookshelf(this.editEntity.id, this.editEntity).subscribe(() => {
                    this.goToBookshelves(this.selectedIds.roomId!, this.currentRoomName);
                    this.closeEditModal();
                });
                break;

            case 'books':
                this.dbService.updateBook(this.editEntity.id, this.editEntity).subscribe(() => {
                    this.goToBooks(this.selectedIds.bookshelfId!, this.currentBookshelfName);
                    this.closeEditModal();
                });
                break;
        }
    }

    loadDropdownOptions(): void {
        const userId = this.selectedIds.userId!;
        this.dbService.getHouseholdsByUserId(userId).subscribe(data => this.householdOptions = data);
        this.dbService.getAllRoomsByUserId(userId).subscribe(data => this.roomOptions = data);
        this.dbService.getAllBookshelvesByUserId(userId).subscribe(data => this.bookshelfOptions = data);
    }

    selectCell(index: number): void {
        const { numberOfColumns } = this.selectedBookshelf;
        const col = index % numberOfColumns;
        const row = Math.floor(index / numberOfColumns);

        this.newEntity.columnsFromLeft = col + 1;
        this.newEntity.rowsFromTop = row + 1;
    }

    isSelectedCell(index: number): boolean {
        const { numberOfColumns } = this.selectedBookshelf;
        const col = index % numberOfColumns;
        const row = Math.floor(index / numberOfColumns);

        return this.newEntity.columnsFromLeft === col + 1 && this.newEntity.rowsFromTop === row + 1;
    }

    getCellPosition(index: number): string {
        const { numberOfColumns } = this.selectedBookshelf;
        const col = index % numberOfColumns;
        const row = Math.floor(index / numberOfColumns);

        return `${row + 1},${col + 1}`;
    }

    isCurrentBookPosition(index: number): boolean {
        const col = index % this.selectedBookshelf.numberOfColumns + 1;
        const row = Math.floor(index / this.selectedBookshelf.numberOfColumns) + 1;
        return this.bookDetails?.columnsFromLeft === col && this.bookDetails.rowsFromTop === row;
      } 

    selectEditCell(index: number): void {
        const col = index % this.selectedBookshelf.numberOfColumns;
        const row = Math.floor(index / this.selectedBookshelf.numberOfColumns);
        this.editEntity.columnsFromLeft = col + 1;
        this.editEntity.rowsFromTop = row + 1;
    }

    isEditSelectedCell(index: number): boolean {
        const col = index % this.selectedBookshelf.numberOfColumns;
        const row = Math.floor(index / this.selectedBookshelf.numberOfColumns);
        return this.editEntity.columnsFromLeft === col + 1 && this.editEntity.rowsFromTop === row + 1;
    }

    isBookCell(index: number): boolean {
        const col = index % this.selectedBookshelf.numberOfColumns;
        const row = Math.floor(index / this.selectedBookshelf.numberOfColumns);
        return this.bookDetails?.columnsFromLeft === col + 1 && this.bookDetails?.rowsFromTop === row + 1;
    }
}