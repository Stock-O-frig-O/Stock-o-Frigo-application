// Angular imports
import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

// RXJS imports
import { Subject, takeUntil } from 'rxjs';

// Components import
import { AddButtonComponent } from '../../components/add-button/add-button.component';
import { CartListService } from '../../core/services/cart-list.service';

// Models import
import ShoppingList from '../../core/model/ShoppingList.model';

// PrimeNg import
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-cart-list-page',
  imports: [AddButtonComponent, RouterLink, DialogModule, FormsModule],
  templateUrl: './cart-list-page.component.html',
  styleUrl: './cart-list-page.component.scss',
})
export class CartListPageComponent implements OnInit, OnDestroy {
  // Services Injection
  private readonly cartListService: CartListService = inject(CartListService);

  // Use to unsubscribe
  private destroy$ = new Subject<void>();

  // Signals
  shoppingLists = signal<ShoppingList[]>([]);

  newName = '';
  visible = false;

  ngOnInit() {
    this.getAllShoppingList();
  }

  getAllShoppingList() {
    this.cartListService
      .getCartList()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.shoppingLists.set(data);
        },
        error: (error: Error) => console.error(error),
      });
  }

  getNumberOfProduct(list: ShoppingList) {
    return list.products ? list.products.length : 0;
  }

  createNewShoppingList(name: string) {
    this.cartListService
      .createShoppingList(name)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.shoppingLists.update((currentLists) => [
            ...(currentLists || []),
            data,
          ]);
        },
        error: (error: Error) => console.error(error.message),
      });
  }

  handleAddButtonClicked() {
    this.showDialog();
  }

  showDialog() {
    this.visible = true;
  }

  saveNewShoppingList() {
    this.createNewShoppingList(this.newName);
    this.resetNewShoppingList();
  }

  resetNewShoppingList() {
    this.newName = '';
    this.visible = false;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
