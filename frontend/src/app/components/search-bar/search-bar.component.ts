// rxjs imports
import { Subject, takeUntil } from 'rxjs';

// Angular imports
import {
  Component,
  inject,
  input,
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
import { Toast } from 'primeng/toast';

// Local imports
import { ProductService } from '../../core/services/product.service';
import { HomeService } from '../../core/services/home.service';

// Model imports
import Product from '../../core/model/Product.model';
import { FilterService } from '../../core/services/filter.service';
import { MenuItem, MessageService } from 'primeng/api';
import Favorit from '../../core/model/Favorit.model';

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
    Toast,
  ],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss',
  providers: [MessageService],
})
export class SearchBarComponent implements OnInit, OnDestroy {
  private readonly apiProduct: ProductService = inject(ProductService);
  private readonly homeService: HomeService = inject(HomeService);
  private readonly filterService: FilterService = inject(FilterService);
  private readonly productService: ProductService = inject(ProductService);
  private readonly messageService: MessageService = inject(MessageService);

  @ViewChild('op') op!: Popover;
  // Use to unsubscribe
  destroy$ = new Subject<void>();

  items: MenuItem[] | undefined;
  visible = false;

  // get home id
  home!: string | null;

  // signals
  products = input.required<(Product | Favorit)[]>();
  addedProduct = output<number>();

  removeProduct = output();

  // properties for product management
  selectedProduct!: Product;
  filteredProducts: Product[] = [];

  ngOnInit() {
    this.home = this.homeService.getHomeId();

    this.items = [
      {
        label: "Cocher l'ensemble des produits",
        icon: 'pi pi-circle-fill',
        command: () => this.addAllProductToChecklist(),
      },
      {
        separator: true,
      },
      {
        label: "Décocher l'ensemble des produits",
        icon: 'pi pi-circle',
        command: () => this.removeAllProductToChecklist(),
      },
      {
        separator: true,
      },
      {
        label: 'Supprimer les éléments cochés',
        icon: 'pi pi-trash',
        command: () => this.removeStockProductCheck(),
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

  // Add product to the stock
  sendProduct(productId: number) {
    this.addedProduct.emit(productId);
  }

  // handle product selection
  onProductSelected(event: { value: Product }) {
    this.sendProduct(event.value.id);
    this.selectedProduct = event.value;
  }

  // change all products check to true
  addAllProductToChecklist() {
    this.products().forEach((prod) => (prod.isCheck = true));
    this.filterService.addAllProductToChecklist(this.products());
  }

  // change all products check to false
  removeAllProductToChecklist() {
    this.products().forEach((prod) => (prod.isCheck = false));
    this.filterService.removeAllProductChecklist();
  }

  removeStockProductCheck() {
    this.removeProduct.emit();
  }

  ngOnDestroy() {
    // Unsubscribe from the product subscription to prevent memory leaks
    this.destroy$.next();
    this.destroy$.complete();
  }
}
