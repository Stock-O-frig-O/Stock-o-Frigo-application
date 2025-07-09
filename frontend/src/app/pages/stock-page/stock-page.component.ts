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
  selector: 'app-stock-page',
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
  templateUrl: './stock-page.component.html',
  styleUrl: './stock-page.component.scss',
})
export class StockPageComponent implements OnDestroy {
  private readonly apiProduct = inject(ProductService);
  productSubscription = new Subscription();

  product: Product[] = [];

  selectedProduct!: Product;

  filteredProducts: Product[] = [];

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
