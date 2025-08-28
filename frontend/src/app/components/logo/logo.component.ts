// rxjs imports
import { Subject } from 'rxjs';

// Angular imports
import { Component, inject, ViewEncapsulation } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

// Local imports
import { HomeService } from '../../core/services/home.service';

// Model imports
import Product from '../../core/model/Product.model';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-logo',
  imports: [RouterModule],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './logo.component.html',
  styleUrl: './logo.component.scss',
  providers: [],
})
export class LogoComponent {
  // service injection
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

  currentProductPage: Product[] = [];

  logout() {
    this.homeService.removeHomeId();
    this.authService.clearToken();
    this.router.navigate(['/login']);
  }
}
