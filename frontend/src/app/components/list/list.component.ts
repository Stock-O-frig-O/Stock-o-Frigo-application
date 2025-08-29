// Angular imports
import {
  Component,
  effect,
  inject,
  input,
  OnInit,
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

@Component({
  selector: 'app-list',
  imports: [
    AccordionModule,
    TableModule,
    CheckboxModule,
    FormsModule,
    InputNumberModule,
    Toast,
  ],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
  providers: [MessageService],
})
export class ListComponent implements OnInit {
  // Service injection
  private readonly productService: ProductService = inject(ProductService);
  private readonly homeService: HomeService = inject(HomeService);
  private readonly messageService: MessageService = inject(MessageService);
  private readonly filterService: FilterService = inject(FilterService);

  private homeId!: string | null;
  // Used to sort products when displaying the list
  categoryList: string[] = [];

  // Receive the product from parent
  products = input.required<Product[]>();

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
}
