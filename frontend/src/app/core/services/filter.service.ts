import { Injectable, signal } from '@angular/core';
import Product from '../model/Product.model';
import Favorit from '../model/Favorit.model';

@Injectable({
  providedIn: 'root',
})
export class FilterService {
  private _productCheckedList = signal<(Product | Favorit)[]>([]);

  productCheckList = this._productCheckedList.asReadonly();

  addOneProductToChecklist(product: Product | Favorit) {
    this._productCheckedList.set([...this._productCheckedList(), product]);
  }

  addAllProductToChecklist(products: (Product | Favorit)[]) {
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
