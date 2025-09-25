// Angular imports
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

// RXJS imports
import { Observable, tap } from 'rxjs';

// Local imports
import { environment } from '../../../environments/environment';
import { jwtDecode } from 'jwt-decode';
import { HomeService } from './home.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // Service injections
  private http = inject(HttpClient);
  private router = inject(Router);
  private homeService = inject(HomeService);

  // Api URL
  private apiUrl = environment.apiUrl;

  // Use to register the user
  register(
    firstname: string,
    lastname: string,
    email: string,
    password: string,
  ): Observable<string> {
    return this.http.post(
      `${this.apiUrl}/auth/register`,
      { firstname, lastname, email, password },
      { responseType: 'text' },
    );
  }

  // use to log in the user
  login(email: string, password: string): Observable<string> {
    return this.http
      .post(
        `${this.apiUrl}/auth/login`,
        { email, password },
        { responseType: 'text' },
      )
      .pipe(
        tap((token) => {
          this.saveToken(token);
        }),
      );
  }

  saveHomeId() {
    this.homeService.getHome().subscribe((data) => {
      this.homeService.saveHomeId(data.id);
    });
  }

  logout() {
    this.clearToken();
    this.router.navigate(['/login']);
  }

  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  clearToken(): void {
    localStorage.removeItem('token');
  }

  verifyToken(): void {
    const token = this.getToken();
    if (!token) return;

    try {
      const decodedToken = jwtDecode<{ exp: number }>(token);
      const expiryDate = new Date(decodedToken.exp * 1000);
      if (expiryDate < new Date()) {
        this.clearToken();
      }
    } catch {
      this.clearToken();
    }
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;
    try {
      const decodedToken = jwtDecode<{ exp: number }>(token);
      const expiryDate = new Date(decodedToken.exp * 1000);
      if (expiryDate < new Date()) {
        this.clearToken();
        return false;
      }
      return true;
    } catch {
      this.clearToken();
      return false;
    }
  }
}
