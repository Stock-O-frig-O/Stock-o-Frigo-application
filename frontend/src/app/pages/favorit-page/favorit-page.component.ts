import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ListComponent } from '../../components/list/list.component';
import { FavoritService } from '../../core/services/favorit.service';
import { Subject, takeUntil } from 'rxjs';
import Favorit from '../../core/model/Favorit.model';
import { SearchBarComponent } from '../../components/search-bar/search-bar.component';
import { FilterService } from '../../core/services/filter.service';
import { HomeService } from '../../core/services/home.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-favorit-page',
  imports: [ListComponent, SearchBarComponent],
  templateUrl: './favorit-page.component.html',
  styleUrl: './favorit-page.component.scss',
})
export class FavoritPageComponent implements OnInit, OnDestroy {
  private readonly favoritService = inject(FavoritService);
  private readonly filterService = inject(FilterService);
  private readonly homeService = inject(HomeService);
  private readonly messageService = inject(MessageService);

  products!: Favorit[];
  private homeId!: string | null;

  // Use to unsubscribe
  private destroy$ = new Subject<void>();

  activePage = 'favorit';

  ngOnInit(): void {
    this.loadProduct();
    this.homeId = this.homeService.getHomeId();
  }

  loadProduct() {
    this.favoritService
      .getAllFavorite()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: Favorit[]) => {
          this.products = data;
          this.products = data || [];

          if (this.products && Array.isArray(this.products)) {
            this.products.forEach((product) => (product.favorite = true));
          }
        },
        error: (error) => {
          console.error('Erreur lors de la récupération des favoris :', error);
          this.products = [];
        },
      });
  }

  handleNotifyFavorit(favoritId: number) {
    this.products = this.products.filter(
      (product) => product.productId !== favoritId,
    );
  }

  handleSelectedProduct(productId: number) {
    this.addProductToFavorite(productId);
  }

  handleRemoveClickedFavorit() {
    this.removeProductFromFavorites();
  }

  addProductToFavorite(productId: number) {
    this.favoritService.addFavorite(productId).subscribe({
      next: (favorit: Favorit) => {
        this.products.push(favorit);
      },
      error: (error: Error) => {
        console.error("Erreur lors de l'ajout du produit aux favoris :", error);
      },
    });
  }

  removeProductFromFavorites() {
    const favoritId: number[] = [];

    this.filterService
      .productCheckList()
      .forEach((product) => favoritId.push(product.productId));

    if (this.homeId && favoritId.length > 0) {
      this.favoritService
        .removeProductFromFavorite(favoritId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'produit(s) retiré(s) des favoris.',
            });
            this.products = this.products.filter(
              (product) => !favoritId.includes(product.productId),
            );
            this.filterService.removeAllProductChecklist();
          },
          error: (error) => {
            console.error('Failed to remove product from favorites:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail:
                'Échec de la suppression du produit des favoris. Veuillez réessayer.',
            });
          },
        });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
