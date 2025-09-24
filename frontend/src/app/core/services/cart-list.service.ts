import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { HomeService } from './home.service';
import { Observable } from 'rxjs';
import ShoppingList from '../model/ShoppingList.model';

@Injectable({
  providedIn: 'root',
})
export class CartListService {
  private apiUrl = environment.apiUrl;
  private http = inject(HttpClient);
  private readonly homeService: HomeService = inject(HomeService);

  private homeId = this.homeService.getHomeId();

  checkHomeId() {
    if (this.homeId === null) {
      throw new Error('Home ID is not set');
    }
  }

  createShoppingList(name: string): Observable<ShoppingList> {
    this.checkHomeId();
    return this.http.post<ShoppingList>(
      `${this.apiUrl}/home/${this.homeId}/shopping-lists`,
      { name },
    );
  }

  getCartList(): Observable<ShoppingList[]> {
    this.checkHomeId();
    return this.http.get<ShoppingList[]>(
      `${this.apiUrl}/home/${this.homeId}/shopping-lists`,
    );
  }
}
