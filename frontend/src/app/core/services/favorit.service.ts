import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import Favorit from '../model/Favorit.model';

@Injectable({
  providedIn: 'root',
})
export class FavoritService {
  private apiUrl = environment.apiUrl;
  private http = inject(HttpClient);

  private homeId: string | null = localStorage.getItem('homeID');

  getAllFavorite(): Observable<Favorit[]> {
    if (this.homeId === null) {
      throw new Error('Home ID is not set');
    }
    return this.http.get<Favorit[]>(
      `${this.apiUrl}/home/${this.homeId}/favorites`,
    );
  }

  addFavorite(productId: number): Observable<Favorit> {
    if (this.homeId === null) {
      throw new Error('Home ID is not set');
    }

    return this.http.post<Favorit>(
      `${this.apiUrl}/home/${this.homeId}/favorites`,
      { homeId: +this.homeId, productId: productId, limit: 0 },
    );
  }

  removeProductFromFavorite(favoritIds: number[]): Observable<void> {
    if (this.homeId === null) {
      throw new Error('Home ID is not set');
    }
    return this.http.delete<void>(
      `${this.apiUrl}/home/${this.homeId}/favorites/query?productIds=${favoritIds}`,
    );
  }
}
