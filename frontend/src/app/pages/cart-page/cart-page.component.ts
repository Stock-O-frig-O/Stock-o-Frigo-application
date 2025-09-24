import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { SearchBarComponent } from '../../components/search-bar/search-bar.component';
import { ListComponent } from '../../components/list/list.component';
import Product from '../../core/model/Product.model';
import { ProductService } from '../../core/services/product.service';
import { HomeService } from '../../core/services/home.service';
import { FilterService, MessageService } from 'primeng/api';
// RXJS imports
import { Subject } from 'rxjs';

@Component({
  selector: 'app-cart-page',
  imports: [SearchBarComponent, ListComponent],
  templateUrl: './cart-page.component.html',
  styleUrl: './cart-page.component.scss',
})
export class CartPageComponent implements OnInit, OnDestroy {
  // Service injection
  private readonly homeService = inject(HomeService);
  private readonly messageService = inject(MessageService);
  private readonly filterService = inject(FilterService);
  private readonly productService = inject(ProductService);

  products: Product[] = [];
  activePage = 'cart';
  homeId = this.homeService.getHomeId();

  // Use to unsubscribe
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    console.log('initialisation du composant');
  }

  handleSelectedProduct(productId: number) {
    console.log('product id', productId);
  }

  handleRemoveClickedProduct() {
    // Logic to remove product from cart
  }

  handleFavoriteChange(productId: number) {
    // Logic to handle favorite change
    console.log('product id', productId);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
