import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Household {
    id: string;
    name: string;
}

interface Room {
    id: string;
    name: string;
    householdId: string;
}

interface Bookshelf {
    id: string;
    name: string;
    numOfrows: number;
    numOfColumns: number;
    roomId: number;
}

export interface Book {
    id: string;
    userId: string;
    title: string;
    author: string;
    genre: string;
    isbn: string;
    publishingYear: number;
    isInReadingList: boolean;
    bookshelfId: string;
}

@Injectable({
    providedIn: 'root',
})
export class DatabaseService {
    private apiUrl = 'http://localhost:5267/v1/api';

    constructor(private http: HttpClient) { }

    getHouseholdsByUserId(userId: string): Observable<Household[]> {
        return this.http.get<Household[]>(`${this.apiUrl}/households/user:${userId}`);
    }

    createHousehold(household: {userId: string, name: string}): Observable<any> {
        return this.http.post(`${this.apiUrl}/households`, household);
    }

    editHousehold(id: string, household: Partial<Household>): Observable<void> {
        return this.http.put<void>(`${this.apiUrl}/households/${id}`, household);
    }

    deleteHousehold(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/households/${id}`);
    }

 

    getRoomsByHouseholdId(householdId: string): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/rooms/householdId:${householdId}`);
    }

    createRoom(room: { name: string; householdId: string }): Observable<Room> {
        return this.http.post<Room>(`${this.apiUrl}/rooms`, room);
    }    

    editRoom(id: string, room: Partial<Room>): Observable<void> {
        return this.http.put<void>(`${this.apiUrl}/rooms/${id}`, room);
    }

    deleteRoom(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/rooms/${id}`);
    }

    

    getBookshelvesByRoom(roomId: string): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/bookshelves/${roomId}`);
    }

    createBookshelf(bookshelf: Partial<Bookshelf>): Observable<Bookshelf> {
        return this.http.post<Bookshelf>(`${this.apiUrl}/bookshelves`, bookshelf);
    }

    editBookshelf(id: string, bookshelf: Partial<Bookshelf>): Observable<void> {
        return this.http.put<void>(`${this.apiUrl}/bookshelves/${id}`, bookshelf);
    }

    deleteBookshelf(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/bookshelves/${id}`);
    }

    
    
    getBooksByShelf(shelfId: string): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/books/${shelfId}`);
    }

    createBook(book: Partial<Book>): Observable<Book> {
        console.log("entity passed")
        return this.http.post<Book>(`${this.apiUrl}/books`, book);
    }

    editBook(id: string, book: Partial<Book>): Observable<void> {
        return this.http.put<void>(`${this.apiUrl}/books/${id}`, book);
    }

    deleteBook(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/books/${id}`);
    }
}