import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = environment.apiUrl;
  private http = inject(HttpClient);


  register(email: string, password: string): Observable<string> {
  return this.http
    .post(`${this.apiUrl}/auth/register`, { email, password }, { responseType: 'text' })
  }
}
