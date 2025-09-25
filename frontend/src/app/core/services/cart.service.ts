import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { HomeService } from './home.service';
import { Observable } from 'rxjs';

import AddProductToShoppingList from '../model/addProductShoppingList';
import ShoppingList from '../model/ShoppingList.model';
import Product from '../model/Product.model';

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

  addProductToShoppingList(shoppingListId: number, productId: number) {
    this.checkHomeId();
    const newProduct = { productId: productId, quantity: 1, checked: false };
    return this.http.post<AddProductToShoppingList>(
      `${this.apiUrl}/home/${this.homeId}/shopping-lists/${shoppingListId}/products`,
      newProduct,
    );
  }

  getCartProduct(shoppingListId: number): Observable<ShoppingList> {
    this.checkHomeId();
    return this.http.get<ShoppingList>(
      `${this.apiUrl}/home/${this.homeId}/shopping-lists/${shoppingListId}`,
    );
  }

  updateCartProduct(shoppingListId: number, product: Product) {
    this.checkHomeId();
    return this.http.post<AddProductToShoppingList>(
      `${this.apiUrl}/home/${this.homeId}/shopping-lists/${shoppingListId}/products`,
      {
        productId: product.productId,
        quantity: product.quantity,
        checked: product.isCheck,
      },
    );
  }
}
