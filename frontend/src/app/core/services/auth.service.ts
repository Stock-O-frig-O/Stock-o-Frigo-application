// Angular imports
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

// RXJS imports
import { Observable, tap, catchError, of, map } from 'rxjs';

// Local imports
import { environment } from '../../../environments/environment';
import { jwtDecode } from 'jwt-decode';
import { HomeService } from './home.service';

export type RawUserResponse = Partial<{
  firstName: string;
  firstname: string;
  lastName: string;
  lastname: string;
  email: string;
  mail: string;
  sub: string;
  avatarUrl: string;
}>;

export interface UserProfile {
  firstname?: string;
  lastname?: string;
  email?: string;
  avatarUrl?: string;
}

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

  private normalizeUserResponse(u: unknown): UserProfile {
    if (u && typeof u === 'object') {
      const anyU = u as RawUserResponse;
      const firstname = anyU.firstName ?? anyU.firstname;
      const lastname = anyU.lastName ?? anyU.lastname;
      const email = anyU.email ?? anyU.mail ?? anyU.sub;
      const avatarUrl = anyU.avatarUrl;
      return { firstname, lastname, email, avatarUrl };
    }
    return {};
  }

  // Fetch current user profile using backend ProfileController: prefer /api/profile with fallback to /profile
  getUserProfile(): Observable<UserProfile> {
    const jwtFallback: UserProfile = {};

    return this.http.get<unknown>(`${this.apiUrl}/api/profile`).pipe(
      map((resp) => this.normalizeUserResponse(resp)),
      catchError(() =>
        this.http.get<unknown>(`${this.apiUrl}/profile`).pipe(
          map((resp) => this.normalizeUserResponse(resp)),
          catchError(() => of(jwtFallback)),
        ),
      ),
    );
  }

  // Update current user profile using backend ProfileController with a single DTO and minimal fallbacks
  updateUserProfile(update: {
    firstname?: string;
    lastname?: string;
    email?: string;
    password?: string; // new password
    confirmPassword?: string; // confirmation of new password
    currentPassword?: string; // current/old password (optional)
    photoFile?: File | null; // ignored server-side for now
  }): Observable<unknown> {
    // Map to backend's UserProfileUpdateDTO shape
    const dto: Record<string, unknown> = {};
    if (update.firstname != null) dto['firstName'] = update.firstname;
    if (update.lastname != null) dto['lastName'] = update.lastname;
    if (update.email != null) dto['email'] = update.email;
    if (update.password && update.password.length > 0) {
      dto['newPassword'] = update.password;
      dto['confirmNewPassword'] = update.confirmPassword ?? update.password;
      if (update.currentPassword != null)
        dto['currentPassword'] = update.currentPassword;
    }
    if (Object.keys(dto).length === 0) return of(null);

    const put = (url: string) =>
      this.http.put(url, dto, { observe: 'response' as const }).pipe(
        tap((resp) => this.saveTokenFromAuthHeader(resp)),
        map((resp) => resp.body as unknown),
      );

    return put(`${this.apiUrl}/api/profile`).pipe(
      catchError(() => put(`${this.apiUrl}/profile`)),
      tap((resp) => this.saveTokenIfPresent(resp)),
    );
  }

  // Detect typical token shapes in update responses and save
  private saveTokenIfPresent(resp: unknown): void {
    try {
      if (!resp) return;
      // Case 1: raw string JWT
      if (typeof resp === 'string' && resp.split('.').length === 3) {
        this.saveToken(resp);
        return;
      }
      // Case 2: object with common token keys
      if (typeof resp === 'object') {
        const anyResp = resp as Record<string, unknown>;
        const possibleKeys = [
          'token',
          'accessToken',
          'jwt',
          'id_token',
          'access_token',
        ];
        for (const k of possibleKeys) {
          const val = anyResp[k];
          if (typeof val === 'string' && val.split('.').length === 3) {
            this.saveToken(val);
            return;
          }
        }
        // Case 3: nested data/token
        const data = anyResp['data'] as Record<string, unknown> | undefined;
        if (data) {
          const nestedKeys = ['token', 'accessToken', 'jwt'];
          for (const k of nestedKeys) {
            const v = data[k];
            if (typeof v === 'string' && v.split('.').length === 3) {
              this.saveToken(v);
              return;
            }
          }
        }
      }
    } catch {
      // ignore parse/save errors
    }
  }

  private saveTokenFromAuthHeader(resp: unknown): void {
    try {
      const r = resp as
        | { headers?: { get: (name: string) => string | null } }
        | undefined;
      if (!r || !r.headers || typeof r.headers.get !== 'function') return;
      const authHeader =
        r.headers.get('Authorization') || r.headers.get('authorization');
      if (!authHeader) return;
      const m =
        /^Bearer\s+([A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+)$/.exec(
          authHeader.trim(),
        );
      if (m && m[1]) {
        this.saveToken(m[1]);
      }
    } catch {
      // ignore header parsing errors
    }
  }

  // Backward-compatible method kept for existing calls in ProfilePage
  getCurrentUser(): Observable<{
    firstname?: string;
    lastname?: string;
    email?: string;
    avatarUrl?: string;
  }> {
    return this.getUserProfile();
  }
}
