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
import { DrawerModule } from 'primeng/drawer';
import { Toast } from 'primeng/toast';

// Local imports
import { ProductService } from '../../core/services/product.service';
import { HomeService } from '../../core/services/home.service';

// Model imports
import Product from '../../core/model/Product.model';
import { FilterService } from '../../core/services/filter.service';
import { MenuItem, MessageService } from 'primeng/api';

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
  products = input.required<Product[]>();
  addedProduct = output<Product>();

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
        label: 'Suprimer les éléments cochés',
        icon: 'pi pi-trash',
        command: () => this.removeSotckProductCheck(),
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
  sendProductToStock(product: Product) {
    this.addedProduct.emit(product);
  }

  // handle product selection
  onProductSelected(event: { value: Product }) {
    this.sendProductToStock(event.value);
    this.selectedProduct = null!; // Vider le champ de saisie
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

  removeSotckProductCheck() {
    const productIds: number[] = [];

    this.filterService
      .productCheckList()
      .map((product) => productIds.push(product.id));

    if (this.home && productIds.length > 0) {
      this.productService
        .removeStockProduct(this.home, productIds)
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

  ngOnDestroy() {
    // Unsubscribe from the product subscription to prevent memory leaks
    this.destroy$.next();
    this.destroy$.complete();
  }
}
