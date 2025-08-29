import { Injectable, signal } from '@angular/core';
import Product from '../model/Product.model';

@Injectable({
  providedIn: 'root',
})
export class FilterService {
  private _allCkecked = signal(false);
  private _productCheckedList = signal<Product[]>([]);

  //
  productCheckList = this._productCheckedList.asReadonly();
  allcheck = this._allCkecked.asReadonly();

  changeCkeckeToTrue() {
    this._allCkecked.set(true);
  }

  changeCheckeToFalse() {
    this._allCkecked.set(false);
  }

  addProductToChecklist(products: Product[]) {
    this._productCheckedList.set(products);
  }
}
