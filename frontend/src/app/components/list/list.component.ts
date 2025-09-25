// Angular imports
import {
  Component,
  effect,
  inject,
  input,
  OnDestroy,
  OnInit,
  output,
  ViewEncapsulation,
} from '@angular/core';

// Primeng imports
import { AccordionModule } from 'primeng/accordion';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { TableModule } from 'primeng/table';
import { Toast } from 'primeng/toast';

// Model imports
import Product from '../../core/model/Product.model';

// Services imports
import { ProductService } from '../../core/services/product.service';
import { HomeService } from '../../core/services/home.service';
import { MessageService } from 'primeng/api';
import { FilterService } from '../../core/services/filter.service';
import { FavoritService } from '../../core/services/favorit.service';
import { Subject, takeUntil } from 'rxjs';
import Favorit from '../../core/model/Favorit.model';
import { CommonModule } from '@angular/common';
import { CartService } from '../../core/services/cart.service';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-list',
  imports: [
    AccordionModule,
    TableModule,
    CheckboxModule,
    FormsModule,
    InputNumberModule,
    Toast,
    CommonModule,
  ],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
  providers: [MessageService],
})
export class ListComponent implements OnInit, OnDestroy {
  // Service injection
  private readonly productService: ProductService = inject(ProductService);
  private readonly homeService: HomeService = inject(HomeService);
  private readonly messageService: MessageService = inject(MessageService);
  private readonly filterService: FilterService = inject(FilterService);
  private readonly favoritService: FavoritService = inject(FavoritService);
  private readonly cartService: CartService = inject(CartService);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);

  private homeId!: string | null;

  // Used to sort products when displaying the list
  categoryList: string[] = [];

  // Receive the product from parent
  products = input.required<(Product | Favorit)[]>();

  activePage = input.required<string>();

  notifyFavorite = output<number>();

  shoppingListId?: number;

  // Use to unsubscribe
  private destroy$ = new Subject<void>();

  constructor() {
    effect(() => {
      const productCheckList = this.filterService.productCheckList();

      if (this.products()) {
        this.findCategory();
      }

      if (productCheckList) {
        productCheckList.forEach((product) => {
          const productToCheck = this.products().find(
            (p) => p.id === product.id,
          );

          if (productToCheck) {
            product.isCheck = productToCheck.isCheck;
          }
        });
      }
    });
  }

  ngOnInit(): void {
    this.findCategory();
    this.homeId = this.homeService.getHomeId();
    this.route.paramMap.subscribe((param: ParamMap) => {
      this.shoppingListId = Number(param.get('id'));
    });
  }

  findCategory() {
    this.categoryList = [];
    for (const product of this.products()) {
      if (!this.categoryList.includes(product.category)) {
        this.categoryList.push(product.category);
      }
    }
  }

  onProductCheck(product: Product) {
    if (product.isCheck) {
      this.filterService.addOneProductToChecklist(product);
    } else {
      this.filterService.removeOneProductFromChecklist(product);
    }
  }

  updateStockQuantity(product: Product) {
    this.productService
      .updateStockQuantity(this.homeId!, product.id, product.quantity)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () =>
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'La quantité a bien été ajoutée',
          }),
        error: () =>
          this.messageService.add({
            severity: 'error',
            summary: 'error',
            detail:
              "Un problème est survenu, la quantité n'a pas pu être mis-à-jour",
          }),
      });
  }
  // add product to favorites
  addProductToFavorite = (productId: number) => {
    this.favoritService
      .addFavorite(productId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Produit ajouté aux favoris.',
          });
        },
        error: (error: Error) => {
          console.error('Failed to add product to favorites:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail:
              "Échec de l'ajout du produit aux favoris. Veuillez réessayer.",
          });
        },
      });
  };

  // remove product from favorites
  removeProductFromFavorite(favoriteId: number[]) {
    this.favoritService
      .removeProductFromFavorite(favoriteId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Produit retiré des favoris.',
          });
        },
        error: (error: Error) => {
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

  toggleFavorite(productId: number) {
    const product = this.products().find((p) => p.productId === productId);

    if (!product) return;

    if (product.favorite) {
      // Si c'est un Favorit, on le retire des favoris
      this.removeProductFromFavorite([productId]);
    } else {
      // Sinon, on l'ajoute aux favoris
      this.addProductToFavorite(productId);
    }
    this.notifyFavorite.emit(productId);
  }

  updateCartQuantity(product: Product) {
    if (!this.shoppingListId) {
      throw new Error('Aucune liste de course utilisée');
    }
    this.cartService
      .updateCartProduct(this.shoppingListId, product)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Quantitée ajustée',
          });
        },
        error: (error: Error) => console.error(error),
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
