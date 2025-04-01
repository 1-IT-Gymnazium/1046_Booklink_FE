import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Household {
    id: string;
    userId: string;
    name: string;
}

export interface Room {
    id: string;
    userId: string;
    name: string;
    householdId: string;
}

export interface Bookshelf {
    id: string;
    userId: string;
    name: string;
    numberOfRows: number;
    numberOfColumns: number;
    roomId: number;
}

export interface Book {
    id: string;
    userId: string;
    title: string;
    author: string;
    genre: string;
    isbn: string;
    publicationYear: number;
    isInReadingList: boolean;
    columnsFromLeft: number;
    rowsFromTop: number;
    householdId: string;
    roomId: string;
    bookshelfId: string;
}

export interface UpdateBookRequest {
    id: string;
    title: string;
    author: string;
    genre: string;
    isbn: string;
    publicationYear: number;
    isInReadingList: boolean;
    columnsFromLeft: number;
    rowsFromTop: number;
    householdId: string;
    roomId: string;
    bookshelfId: string;
}

export interface UpdateBookshelfRequest {
    id: string;
    name: string;
    description: string;
    numberOfColumns: number;
    numberOfRows: number;
}

export interface UpdateEntityRequest {
    id: string;
    name: string;
}

@Injectable({
    providedIn: 'root',
})
export class DatabaseService {
    private apiUrl = 'http://localhost:5267/v1/api';

    constructor(private http: HttpClient) { }

    // household endpoints
    getHouseholdsByUserId(userId: string): Observable<Household[]> {
        return this.http.get<Household[]>(`${this.apiUrl}/households/user:${userId}`);
    }

    createHousehold(household: { userId: string, name: string }): Observable<any> {
        return this.http.post(`${this.apiUrl}/households`, household);
    }

    updateHousehold(id: string, household: UpdateEntityRequest): Observable<void> {
        return this.http.put<void>(`${this.apiUrl}/households/${id}`, household);
    }

    deleteHousehold(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/households/${id}`);
    }


    // room endpoints
    getAllRoomsByUserId(userId: string): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/rooms/user:${userId}`)
    }

    getRoomsByHouseholdId(householdId: string): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/rooms/householdId:${householdId}`);
    }

    createRoom(room: { name: string; householdId: string }): Observable<Room> {
        return this.http.post<Room>(`${this.apiUrl}/rooms`, room);
    }

    updateRoom(id: string, room: UpdateEntityRequest): Observable<void> {
        return this.http.put<void>(`${this.apiUrl}/rooms/${id}`, room);
    }

    deleteRoom(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/rooms/${id}`);
    }


    // bookshelf endopoints
    getBookshelfById(bookshelfId: string): Observable<Bookshelf> {
        return this.http.get<Bookshelf>(`${this.apiUrl}/bookshelves/bookshelf/${bookshelfId}`)
    }

    getAllBookshelvesByUserId(userId: string): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/bookshelves/user:${userId}`)
    }

    getBookshelvesByRoom(roomId: string): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/bookshelves/${roomId}`);
    }

    createBookshelf(bookshelf: Partial<Bookshelf>): Observable<Bookshelf> {
        return this.http.post<Bookshelf>(`${this.apiUrl}/bookshelves`, bookshelf);
    }

    updateBookshelf(id: string, bookshelf: UpdateBookshelfRequest) {
        return this.http.put(`${this.apiUrl}/bookshelves/${id}`, bookshelf);
    }

    deleteBookshelf(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/bookshelves/${id}`);
    }


    // book endpoints
    getAllBooks(id: string): Observable<Book[]> {
        console.log("Books fetched")
        return this.http.get<Book[]>(`${this.apiUrl}/Books/${id}`);
    }

    getBooksByShelf(shelfId: string): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/books/bookshelf:${shelfId}`);
    }

    createBook(book: Partial<Book>): Observable<Book> {
        return this.http.post<Book>(`${this.apiUrl}/books`, book);
    }

    updateBook(id: string, book: UpdateBookRequest): Observable<any> {
        return this.http.put(`${this.apiUrl}/books/${id}`, book);
    }

    deleteBook(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/books/${id}`);
    }
}