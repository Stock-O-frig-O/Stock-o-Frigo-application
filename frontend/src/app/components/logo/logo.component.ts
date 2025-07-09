// rxjs imports
import { Subscription } from 'rxjs';

// Angular imports
import { Component, inject, OnDestroy, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// Primeng imports
import { AutoCompleteModule, AutoComplete } from 'primeng/autocomplete';
import { InputTextModule } from 'primeng/inputtext';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';

// Local imports
import { ProductService } from '../../core/services/product.service';
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
export class LogoComponent implements OnDestroy {
  // service injection
  private readonly apiProduct = inject(ProductService);

  // subscription to manage product data
  productSubscription = new Subscription();

  // properties for product management
  product: Product[] = [];
  selectedProduct!: Product;
  filteredProducts: Product[] = [];

  // fetch product data on autocomplete component
  findProduct(event: { query: string }) {
    const query = event.query.toLowerCase();
    this.apiProduct.getProducts().subscribe((products: Product[]) => {
      this.filteredProducts = products.filter((product: Product) =>
        product.name?.toLowerCase().includes(query),
      );
    });
  }

  ngOnDestroy() {
    // Unsubscribe from the product subscription to prevent memory leaks
    this.productSubscription.unsubscribe();
  }
}
