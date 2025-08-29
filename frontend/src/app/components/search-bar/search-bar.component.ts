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
import { MenuModule } from 'primeng/menu';
import { DrawerModule } from 'primeng/drawer';

// Local imports
import { ProductService } from '../../core/services/product.service';
import { HomeService } from '../../core/services/home.service';

// Model imports
import Product from '../../core/model/Product.model';
import { FilterService } from '../../core/services/filter.service';
import { MenuItem } from 'primeng/api';

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
    MenuModule,
    DrawerModule,
  ],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss',
})
export class SearchBarComponent implements OnInit, OnDestroy {
  private readonly apiProduct: ProductService = inject(ProductService);
  private readonly homeService: HomeService = inject(HomeService);
  private readonly filterService: FilterService = inject(FilterService);

  @ViewChild('op') op!: Popover;
  // Use to unsubscribe
  destroy$ = new Subject<void>();

  items: MenuItem[] | undefined;
  visible = false;

  // get home id
  home!: string | null;

  // get allProductCheck
  check!: boolean;

  test = true;

  // properties for product management
  products: Product[] = [];
  selectedProduct!: Product;
  filteredProducts: Product[] = [];

  // signals
  addedProduct = output<Product>();

  ngOnInit() {
    this.home = this.homeService.getHomeId();
    this.check = this.filterService.allcheck();

    this.items = [
      {
        label: "Cocher l'ensemble des produits",
        icon: 'pi pi-circle-fill',
        command: () => this.setCheckToTrue(),
      },
      {
        separator: true,
      },
      {
        label: "Décocher l'ensemble des produits",
        icon: 'pi pi-circle',
        command: () => this.setCheckToFalse(),
      },
      {
        separator: true,
      },
      {
        label: 'Suprimer les éléments cochés',
        icon: 'pi pi-trash',
        command: () => this.setCheckToFalse(),
      },
    ];
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

  // handle product selection
  onProductSelected(event: { value: Product }) {
    this.sendProductToStock(event.value);
  }

  setCheckToTrue() {
    this.filterService.changeCkeckeToTrue();
  }
  setCheckToFalse() {
    this.filterService.changeCheckeToFalse();
  }

  ngOnDestroy() {
    // Unsubscribe from the product subscription to prevent memory leaks
    this.destroy$.next();
    this.destroy$.complete();
  }
}
