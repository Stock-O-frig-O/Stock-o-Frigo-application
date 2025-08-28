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

@Component({
  selector: 'app-stock-page',
  imports: [ListComponent, SearchBarComponent],
  templateUrl: './stock-page.component.html',
  styleUrl: './stock-page.component.scss',
  providers: [MessageService],
})
export class StockPageComponent implements OnInit, OnDestroy {
  // Service injection
  private homeService = inject(HomeService);
  private messageService = inject(MessageService);

  private homeId!: string | null;
  products!: Product[];
  allChecked!: boolean;

  // Use to unsubscribe
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.homeId = this.homeService.getHomeId();

    this.loadProduct();

    this.homeService.productAdded$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.loadProduct();
      });
  }

  handleSelectedProduct(product: Product) {
    this.addProductToStock(product.id);
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
            detail: 'Failed to add product to stock. Please try again.',
          });
        },
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
