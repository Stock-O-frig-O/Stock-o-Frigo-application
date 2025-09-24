import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { AddButtonComponent } from '../../components/add-button/add-button.component';
import { RouterLink } from '@angular/router';
import { CartListService } from '../../core/services/cart-list.service';
import ShoppingList from '../../core/model/ShoppingList.model';
import { Subject, takeUntil } from 'rxjs';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cart-list-page',
  imports: [AddButtonComponent, RouterLink, DialogModule, FormsModule],
  templateUrl: './cart-list-page.component.html',
  styleUrl: './cart-list-page.component.scss',
})
export class CartListPageComponent implements OnInit, OnDestroy {
  private readonly cartListService: CartListService = inject(CartListService);

  shoppingLists = signal<ShoppingList[]>([]);

  // Use to unsubscribe
  private destroy$ = new Subject<void>();

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
          // Mise à jour du signal - déclenche automatiquement l'effect
          this.shoppingLists.set(data);
          console.log(data);
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
