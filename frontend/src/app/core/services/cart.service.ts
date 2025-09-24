import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { HomeService } from './home.service';
import { Observable } from 'rxjs';
import { ShoppingListProduct } from '../model/ShoppingList.model';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private apiUrl = environment.apiUrl;
  private http = inject(HttpClient);
  private readonly homeService: HomeService = inject(HomeService);

  private homeId = this.homeService.getHomeId();

  checkHomeId() {
    if (this.homeId === null) {
      throw new Error('Home ID is not set');
    }
  }

  getCartProduct(shoppingListId: string): Observable<ShoppingListProduct[]> {
    this.checkHomeId();
    return this.http.get<ShoppingListProduct[]>(
      `${this.apiUrl}/home/${this.homeId}/shopping-lists/${shoppingListId}/products`,
    );
  }
}
