// Angular imports
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
// RXJS imports
import { Subject, takeUntil } from 'rxjs';

// Local imports
import { ListComponent } from '../../components/list/list.component';
import { HomeService } from '../../core/services/home.service';
import Product from '../../core/model/Product.model';

@Component({
  selector: 'app-stock-page',
  imports: [ListComponent],
  templateUrl: './stock-page.component.html',
  styleUrl: './stock-page.component.scss',
})
export class StockPageComponent implements OnInit, OnDestroy {
  // Service injection
  private homeService = inject(HomeService);

  private homeId!: string | null;

  // Use to unsubscribe
  private destroy$ = new Subject<void>();

  products!: Product[];

  ngOnInit(): void {
    this.homeId = this.homeService.getHomeId();

    this.loadProduct();

    this.homeService.productAdded$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.loadProduct();
      });
  }

  loadProduct() {
    this.homeService
      .getHomeProduct(this.homeId!)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.products = data;
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
