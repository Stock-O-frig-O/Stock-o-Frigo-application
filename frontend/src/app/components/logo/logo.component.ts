// rxjs imports
import { Subject, takeUntil } from 'rxjs';

// Angular imports
import { Component, inject, OnDestroy, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

// Primeng imports
import { AutoCompleteModule, AutoComplete } from 'primeng/autocomplete';
import { InputTextModule } from 'primeng/inputtext';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';

// Local imports
import { ProductService } from '../../core/services/product.service';
import { HomeService } from '../../core/services/home.service';

// Model imports
import Product from '../../core/model/Product.model';
import { AuthService } from '../../core/services/auth.service';
import { jwtDecode } from 'jwt-decode';

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
    MenuModule,
  ],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './logo.component.html',
  styleUrl: './logo.component.scss',
})
export class LogoComponent implements OnDestroy {
  menuItems: MenuItem[] = [];
  isLogged = false;
  avatarUrl: string | null = null;
  showSearch = true;
  hideControls = false; // hide back/login/user buttons on certain routes (e.g., /login)
  // service injection
  private readonly apiProduct: ProductService = inject(ProductService);
  private readonly homeService: HomeService = inject(HomeService);
  private readonly authService: AuthService = inject(AuthService);
  private readonly router: Router = inject(Router);

  // Use to unsubscribe
  destroy$ = new Subject<void>();

  // get home id
  home!: string | null;

  // properties for product management
  product: Product[] = [];
  selectedProduct!: Product;
  filteredProducts: Product[] = [];

  // Always reflect current auth state in the template
  public get loggedIn(): boolean {
    return this.authService.isLoggedIn();
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

  constructor() {
    this.isLogged = this.authService.isLoggedIn();

    // Show search everywhere except profile page
    this.updateShowSearch();
    this.router.events.subscribe(() => this.updateShowSearch());

    if (this.isLogged) {
      // Try to decode token to extract picture URL
      const token = this.authService.getToken();
      if (token) {
        try {
          const decoded = jwtDecode<{ pictureUrl?: string }>(token);
          if (decoded.pictureUrl) {
            this.avatarUrl = decoded.pictureUrl;
          } else {
            this.avatarUrl = '/imgs/avatar-placeholder.png';
          }
        } catch {
          this.avatarUrl = '/imgs/avatar-placeholder.png';
        }
      } else {
        this.avatarUrl = '/imgs/avatar-placeholder.png';
      }

      this.menuItems = [
        { label: 'Mon profil', icon: 'pi pi-user', command: () => this.router.navigate(['/profile']) },
        { separator: true },
        { label: 'Déconnexion', icon: 'pi pi-sign-out', command: () => this.logout() },
      ];
    }
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

  logout() {
    this.homeService.removeHomeId();
    this.authService.clearToken();
    this.router.navigate(['/login']);
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

  private updateShowSearch() {
    const url = this.router.url;
    // Hide search on profile, login, and register pages
    this.showSearch = !(url.startsWith('/profile') || url.startsWith('/login') || url.startsWith('/register'));
    // Hide side controls (back/user/login) on login and register pages
    this.hideControls = url.startsWith('/login') || url.startsWith('/register');
  }
}
