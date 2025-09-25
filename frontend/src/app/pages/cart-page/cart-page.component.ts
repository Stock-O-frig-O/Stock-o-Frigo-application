// Angular
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';

// Components
import { SearchBarComponent } from '../../components/search-bar/search-bar.component';
import { ListComponent } from '../../components/list/list.component';

// Models
import Product from '../../core/model/Product.model';

// Services
import { ProductService } from '../../core/services/product.service';
import { HomeService } from '../../core/services/home.service';
import { CartService } from '../../core/services/cart.service';

// PrimeNg
import { FilterService, MessageService } from 'primeng/api';

// RXJS
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-cart-page',
  imports: [SearchBarComponent, ListComponent],
  providers: [MessageService],
  templateUrl: './cart-page.component.html',
  styleUrl: './cart-page.component.scss',
})
export class CartPageComponent implements OnInit, OnDestroy {
  // Service injection
  private readonly homeService = inject(HomeService);
  private readonly messageService = inject(MessageService);
  private readonly filterService = inject(FilterService);
  private readonly productService = inject(ProductService);
  private readonly route = inject(ActivatedRoute);
  private readonly cartService = inject(CartService);

  products!: Product[];
  activePage = 'cart';
  homeId = this.homeService.getHomeId();
  shoppingListId!: number;

  // Use to unsubscribe
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.route.paramMap.subscribe((param: ParamMap) => {
      this.shoppingListId = Number(param.get('id'));
    });
    this.getProducts();
  }

  addProductToShoppingList(productId: number) {
    this.cartService
      .addProductToShoppingList(this.shoppingListId, productId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Les produits ont bien été ajouté',
          });
        },
        error: (error) => {
          console.error('Error response:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'error',
            detail:
              "Un problème est survenu, les produits n'ont pas pu être supprimés",
          });
        },
      });
  }

  getProducts() {
    this.cartService
      .getCartProduct(this.shoppingListId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.products = data.products;
        },
      });
  }

  handleSelectedProduct(productId: number) {
    this.addProductToShoppingList(productId);
  }

  handleRemoveClickedProduct() {
    // Logic to remove product from cart
  }

  handleFavoriteChange(productId: number) {
    // Logic to handle favorite change
    // à mettre en place plus tard
    console.log('product id', productId);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
