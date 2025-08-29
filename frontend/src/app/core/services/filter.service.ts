import { Injectable, signal } from '@angular/core';
import Product from '../model/Product.model';

@Injectable({
  providedIn: 'root',
})
export class FilterService {
  private _productCheckedList = signal<Product[]>([]);

  productCheckList = this._productCheckedList.asReadonly();

  addOneProductToChecklist(product: Product) {
    this._productCheckedList.set([...this._productCheckedList(), product]);
  }

  addAllProductToChecklist(products: Product[]) {
    this._productCheckedList.set(products);
  }

  removeOneProductFromChecklist(product: Product) {
    this._productCheckedList.set(
      this._productCheckedList().filter((p) => p.id !== product.id),
    );
  }

  removeAllProductChecklist() {
    this._productCheckedList.set([]);
  }
}
