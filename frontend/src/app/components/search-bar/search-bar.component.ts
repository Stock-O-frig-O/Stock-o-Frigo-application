// rxjs imports
import { Subject, takeUntil } from 'rxjs';

// Angular imports
import {
  Component,
  inject,
  OnDestroy,
  OnInit,
  output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// Primeng imports
import { AutoCompleteModule, AutoComplete } from 'primeng/autocomplete';
import { InputTextModule } from 'primeng/inputtext';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { Popover } from 'primeng/popover';
import { Checkbox } from 'primeng/checkbox';
import { Button } from 'primeng/button';

// Local imports
import { ProductService } from '../../core/services/product.service';
import { HomeService } from '../../core/services/home.service';

// Model imports
import Product from '../../core/model/Product.model';

@Component({
  selector: 'app-search-bar',
  imports: [
    RouterModule,
    InputTextModule,
    FormsModule,
    AutoComplete,
    AutoCompleteModule,
    InputGroupModule,
    InputGroupAddonModule,
    Popover,
    Checkbox,
    Button,
  ],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss',
})
export class SearchBarComponent implements OnInit, OnDestroy {
  private readonly apiProduct: ProductService = inject(ProductService);
  private readonly homeService: HomeService = inject(HomeService);

  @ViewChild('op') op!: Popover;
  // Use to unsubscribe
  destroy$ = new Subject<void>();

  // get home id
  home!: string | null;

  // properties for product management
  products: Product[] = [];
  selectedProduct!: Product;
  filteredProducts: Product[] = [];

  // signal
  addedProduct = output<Product>();

  ngOnInit() {
    this.home = this.homeService.getHomeId();
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

  sendProductToStock(product: Product) {
    this.addedProduct.emit(product);
  }

  displayMenu(event: Event) {
    this.op.show(event);
  }

  // handle product selection
  onProductSelected(event: { value: Product }) {
    this.sendProductToStock(event.value);
  }

  ngOnDestroy() {
    // Unsubscribe from the product subscription to prevent memory leaks
    this.destroy$.next();
    this.destroy$.complete();
  }
}
