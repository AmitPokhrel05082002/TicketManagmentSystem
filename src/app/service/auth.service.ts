import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/auth'; // Replace with your NestJS API URL

  constructor(private http: HttpClient) {}

  signup(fullName:string, username: string, password: string, role: string): Observable<any> {
    const body = { fullName, username, password, role };
    return this.http.post(`${this.apiUrl}/register`, body);
  }

  login(username: string, password: string): Observable<any> {
    const body = { username, password };
    return this.http.post(`${this.apiUrl}/login`, body);
  }
}
