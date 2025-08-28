// Angular imports
import {
  Component,
  inject,
  input,
  OnChanges,
  OnInit,
  SimpleChanges,
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
export class ListComponent implements OnInit, OnChanges {
  // Service injection
  private productService = inject(ProductService);
  private homeService = inject(HomeService);
  private messageService = inject(MessageService);

  private homeId!: string | null;

  // Receive the product from parent
  products = input<Product[]>({} as Product[]);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['products']) {
      this.findCategory();
    }
  }

  // Used to sort products when displaying the list
  categoryList: string[] = [];

  ngOnInit(): void {
    this.findCategory();
    this.homeId = this.homeService.getHomeId();
  }

  findCategory() {
    for (const product of this.products()) {
      if (!this.categoryList.includes(product.category)) {
        this.categoryList.push(product.category);
      }
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
