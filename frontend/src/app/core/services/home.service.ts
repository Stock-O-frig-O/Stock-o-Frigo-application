// Angular imports
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// RXJS import
import { Observable, Subject } from 'rxjs';

// Local imports
import { environment } from '../../../environments/environment';
import { Home } from '../model/Home.model';
import Product from '../model/Product.model';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  private apiUrl = environment.apiUrl;
  private http = inject(HttpClient);

  private productAddedSource = new Subject<void>();

  productAdded$ = this.productAddedSource.asObservable();

  // Call api
  addHomeProduct(
    homeId: string,
    productId: number,
    quantity: number,
  ): Observable<undefined> {
    return this.http.post<undefined>(`${this.apiUrl}/home/${homeId}/products`, {
      productId: productId,
      quantity: quantity,
    });
  }

  createHome(homeName: string): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/home`, {
      name: homeName,
    });
  }

  getHomeProduct(homeId: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/home/${homeId}/products`);
  }

  getHome(): Observable<Home> {
    return this.http.get<Home>(`${this.apiUrl}/home`);
  }

  // localstorage
  saveHomeId(homeId: number) {
    localStorage.setItem('homeID', homeId.toString());
  }

  getHomeId() {
    return localStorage.getItem('homeID');
  }

  removeHomeId(): void {
    localStorage.removeItem('homeID');
  }

  // notification product added
  notifyProductAdded() {
    this.productAddedSource.next();
  }
}
