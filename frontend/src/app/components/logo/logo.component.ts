// rxjs imports
import { Subject, takeUntil } from 'rxjs';

// Angular imports
import {
  Component,
  inject,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// Primeng imports
import { AutoCompleteModule, AutoComplete } from 'primeng/autocomplete';
import { InputTextModule } from 'primeng/inputtext';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';

// Local imports
import { ProductService } from '../../core/services/product.service';
import { HomeService } from '../../core/services/home.service';

// Model imports
import Product from '../../core/model/Product.model';

@Component({
  selector: 'app-logo',
  imports: [
    RouterModule,
    InputTextModule,
    FormsModule,
    AutoComplete,
    AutoCompleteModule,
    InputGroupModule,
    InputGroupAddonModule,
  ],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './logo.component.html',
  styleUrl: './logo.component.scss',
})
export class LogoComponent implements OnInit, OnDestroy {
  // service injection
  private readonly apiProduct = inject(ProductService);
  private readonly homeService = inject(HomeService);

  // Use to unsubscribe
  destroy$ = new Subject<void>();

  // get home id
  home!: string | null;

  // properties for product management
  product: Product[] = [];
  selectedProduct!: Product;
  filteredProducts: Product[] = [];

  ngOnInit(): void {
    this.home = this.homeService.getHomeId();
  }

  // add product to stock
  addProductToStock(productId: number) {
    if (!this.home) {
      console.error('Home ID is not set. Cannot add product to stock.');
      return;
    }
    this.homeService
      .addHomeProduct(this.home, productId, 1)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.homeService.notifyProductAdded();
      });
  }

  // fetch product data on autocomplete component
  findProduct(event: { query: string }) {
    const query = event.query.toLowerCase();
    this.home = this.homeService.getHomeId();
    this.apiProduct
      .getFilteredProducts(query)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (products) => {
          this.filteredProducts = products;
        },
      });
  }

  // handle product selection
  onProductSelected(event: { value: Product }) {
    this.addProductToStock(event.value.id);
  }

  ngOnDestroy() {
    // Unsubscribe from the product subscription to prevent memory leaks
    this.destroy$.next();
    this.destroy$.complete();
  }
}
