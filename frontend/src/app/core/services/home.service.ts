import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  private apiUrl = environment.apiUrl;
  private http = inject(HttpClient);
  private router = inject(Router);

  getHome(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/home`);
  }

  createHome(homeName: string): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/home`, {
      name: homeName,
    });
  }
}
