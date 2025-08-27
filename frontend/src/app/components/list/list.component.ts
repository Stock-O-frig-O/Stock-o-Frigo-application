// Angular imports
import {
  Component,
  Input,
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

// Model imports
import Product from '../../core/model/Product.model';

@Component({
  selector: 'app-list',
  imports: [
    AccordionModule,
    TableModule,
    CheckboxModule,
    FormsModule,
    InputNumberModule,
  ],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
})
export class ListComponent implements OnInit, OnChanges {
  // Receive the product from parent
  @Input() products!: Product[];

  // Used to sort products when displaying the list
  categoryList: string[] = [];

  ngOnInit(): void {
    this.findCategory();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['products']) {
      this.findCategory();
    }
  }

  findCategory() {
    for (const product of this.products) {
      if (!this.categoryList.includes(product.category)) {
        this.categoryList.push(product.category);
      }
    }
  }
}
