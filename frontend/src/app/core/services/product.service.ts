// import from angular
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// import from environment
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import Product from '../model/Product.model';
import { Home } from '../model/Home.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = environment.apiUrl;
  private http = inject(HttpClient);

  getProducts(): Observable<Product[]> {
    // This method retrieves a list of products from the API.
    // It uses the HttpClient to make a GET request to the products endpoint.
    return this.http.get<Product[]>(`${this.apiUrl}/products`);
  }

  getFilteredProducts(query: string): Observable<Product[]> {
    // This method retrieves products filtered by a search query.
    // It uses the HttpClient to make a GET request to the products endpoint with a query parameter.
    return this.http.get<Product[]>(
      `${this.apiUrl}/products/query?search=${query}`,
    );
  }

  updateStockQuantity(
    homeId: string,
    productId: number,
    quantity: number,
  ): Observable<Product> {
    return this.http.put<Product>(
      `${this.apiUrl}/home/${homeId}/products/${productId}`,
      {
        quantity,
      },
    );
  }

  removeStockProduct(homeId: string, productIds: number[]): Observable<Home> {
    return this.http.delete<Home>(
      `${this.apiUrl}/home/${homeId}/products/query?productIds=${productIds}`,
    );
  }
}
