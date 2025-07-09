// import from angular
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// import from environment
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import Product from '../model/Product.model';

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
}
