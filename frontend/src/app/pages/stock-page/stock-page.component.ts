// Angular imports
import { Component, inject, OnDestroy, OnInit } from '@angular/core';

// RXJS imports
import { Subject, takeUntil } from 'rxjs';

// Local imports
import { SearchBarComponent } from '../../components/search-bar/search-bar.component';
import { ListComponent } from '../../components/list/list.component';
import { HomeService } from '../../core/services/home.service';
import Product from '../../core/model/Product.model';
import { MessageService } from 'primeng/api';
import { FilterService } from '../../core/services/filter.service';
import { ProductService } from '../../core/services/product.service';

@Component({
  selector: 'app-stock-page',
  imports: [ListComponent, SearchBarComponent],
  templateUrl: './stock-page.component.html',
  styleUrl: './stock-page.component.scss',
  providers: [MessageService],
})
export class StockPageComponent implements OnInit, OnDestroy {
  // Service injection
  private readonly homeService = inject(HomeService);
  private readonly messageService = inject(MessageService);
  private readonly filterService = inject(FilterService);
  private readonly productService = inject(ProductService);

  private homeId!: string | null;
  products!: Product[];

  // Use to unsubscribe
  private destroy$ = new Subject<void>();

  activePage = 'stock';

  ngOnInit(): void {
    this.homeId = this.homeService.getHomeId();

    this.loadProduct();

    this.homeService.productAdded$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.loadProduct();
      });
  }

  handleSelectedProduct(productId: number) {
    this.addProductToStock(productId);
  }

  loadProduct() {
    if (this.homeId === null) {
      return;
    }
    this.homeService
      .getHomeProduct(this.homeId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.products = data;
      });
  }

  handleFavoriteChange(favoritId: number) {
    // Handle the favorit change event
    const product = this.products.find((p) => p.productId === favoritId);
    if (product) {
      product.favorite = !product.favorite;
    }
  }

  // add product to stock
  addProductToStock(productId: number) {
    if (!this.homeId) {
      console.error('Home ID is not set. Cannot add product to stock.');
      return;
    }
    this.homeService
      .addHomeProduct(this.homeId, productId, 1)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.homeService.notifyProductAdded();
        },
        error: (error) => {
          console.error('Failed to add product:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Échec de l\'ajout du produit. Veuillez réessayer.',
          });
        },
      });
  }

  removeProductFromStock() {
    const productIds: number[] = [];

    this.filterService
      .productCheckList()
      .forEach((product) => productIds.push(product.id));

    if (this.homeId && productIds.length > 0) {
      this.productService
        .removeStockProduct(this.homeId, productIds)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.homeService.notifyProductAdded();
            this.filterService.removeAllProductChecklist();
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Les produits ont bien été supprimés',
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
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'warn',
        detail: 'Aucun produit à supprimer',
      });
    }
  }

  handleRemoveClickedProduct() {
    this.removeProductFromStock();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
