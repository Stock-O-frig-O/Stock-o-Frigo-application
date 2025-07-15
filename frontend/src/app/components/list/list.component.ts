import { ProductService } from './../../core/services/product.service';
// Angular imports
import { Component, inject, OnInit, ViewEncapsulation } from '@angular/core';

// Primeng imports
import { AccordionModule } from 'primeng/accordion';
import { TableModule } from 'primeng/table';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';

// import local
// import Product from '../../core/model/Product.model';

interface ProductData {
  name: string;
  quantity: number;
  unit: string;
  isFavorit: boolean;
  category: string;
  check: boolean;
}

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
export class ListComponent implements OnInit {
  private readonly productService = inject(ProductService);
  products: ProductData[] = [
    {
      name: 'Saumon',
      quantity: 2,
      unit: 'kg',
      isFavorit: false,
      category: 'Poisson',
      check: false,
    },
    {
      name: 'Riz',
      quantity: 5,
      unit: 'kg',
      isFavorit: true,
      category: 'Féculents',
      check: false,
    },
    {
      name: 'Pâtes',
      quantity: 3,
      unit: 'kg',
      isFavorit: false,
      category: 'Féculents',
      check: true,
    },
    {
      name: 'Tomates',
      quantity: 1,
      unit: 'kg',
      isFavorit: false,
      category: 'Légumes',
      check: false,
    },
    {
      name: 'Pommes',
      quantity: 6,
      unit: 'kg',
      isFavorit: true,
      category: 'Fruits',
      check: false,
    },
    {
      name: 'Bananes',
      quantity: 4,
      unit: 'kg',
      isFavorit: false,
      category: 'Fruits',
      check: true,
    },
    {
      name: 'Poulet',
      quantity: 2,
      unit: 'kg',
      isFavorit: false,
      category: 'Viande',
      check: false,
    },
    {
      name: 'Lait',
      quantity: 3,
      unit: 'l',
      isFavorit: true,
      category: 'Produits laitiers',
      check: false,
    },
    {
      name: 'Œufs',
      quantity: 30,
      unit: 'pcs',
      isFavorit: true,
      category: 'Produits frais',
      check: true,
    },
    {
      name: 'Beurre',
      quantity: 0.5,
      unit: 'kg',
      isFavorit: false,
      category: 'Produits laitiers',
      check: false,
    },
    {
      name: 'Pain',
      quantity: 2,
      unit: 'pcs',
      isFavorit: false,
      category: 'Boulangerie',
      check: false,
    },
    {
      name: 'Carottes',
      quantity: 2,
      unit: 'kg',
      isFavorit: false,
      category: 'Légumes',
      check: false,
    },
    // {
    //   name: 'Pommes de terre',
    //   quantity: 5,
    //   unit: 'kg',
    //   isFavorit: true,
    //   category: 'Féculents',
    //   check: false,
    // },
    // {
    //   name: 'Oignons',
    //   quantity: 1,
    //   unit: 'kg',
    //   isFavorit: false,
    //   category: 'Légumes',
    //   check: false,
    // },
    // {
    //   name: 'Poivrons',
    //   quantity: 1,
    //   unit: 'kg',
    //   isFavorit: false,
    //   category: 'Légumes',
    //   check: true,
    // },
    // {
    //   name: 'Courgettes',
    //   quantity: 2,
    //   unit: 'kg',
    //   isFavorit: false,
    //   category: 'Légumes',
    //   check: false,
    // },
    // {
    //   name: 'Aubergines',
    //   quantity: 1,
    //   unit: 'kg',
    //   isFavorit: false,
    //   category: 'Légumes',
    //   check: false,
    // },
    // {
    //   name: 'Brocolis',
    //   quantity: 1,
    //   unit: 'kg',
    //   isFavorit: false,
    //   category: 'Légumes',
    //   check: true,
    // },
    // {
    //   name: 'Yaourts',
    //   quantity: 12,
    //   unit: 'pcs',
    //   isFavorit: true,
    //   category: 'Produits laitiers',
    //   check: false,
    // },
    // {
    //   name: 'Crème',
    //   quantity: 0.5,
    //   unit: 'l',
    //   isFavorit: false,
    //   category: 'Produits laitiers',
    //   check: true,
    // },
    // {
    //   name: 'Jambon',
    //   quantity: 0.3,
    //   unit: 'kg',
    //   isFavorit: false,
    //   category: 'Charcuterie',
    //   check: false,
    // },
    // {
    //   name: 'Fromage',
    //   quantity: 0.5,
    //   unit: 'kg',
    //   isFavorit: true,
    //   category: 'Produits laitiers',
    //   check: false,
    // },
    // {
    //   name: 'Steak haché',
    //   quantity: 1,
    //   unit: 'kg',
    //   isFavorit: false,
    //   category: 'Viande',
    //   check: true,
    // },
    // {
    //   name: 'Dinde',
    //   quantity: 1,
    //   unit: 'kg',
    //   isFavorit: false,
    //   category: 'Viande',
    //   check: false,
    // },
    // {
    //   name: 'Poisson blanc',
    //   quantity: 1,
    //   unit: 'kg',
    //   isFavorit: false,
    //   category: 'Poisson',
    //   check: false,
    // },
    // {
    //   name: 'Crevettes',
    //   quantity: 0.5,
    //   unit: 'kg',
    //   isFavorit: false,
    //   category: 'Fruits de mer',
    //   check: true,
    // },
    // {
    //   name: 'Laitue',
    //   quantity: 2,
    //   unit: 'pcs',
    //   isFavorit: false,
    //   category: 'Légumes',
    //   check: false,
    // },
    // {
    //   name: 'Chou-fleur',
    //   quantity: 1,
    //   unit: 'pcs',
    //   isFavorit: false,
    //   category: 'Légumes',
    //   check: true,
    // },
    // {
    //   name: 'Radis',
    //   quantity: 0.3,
    //   unit: 'kg',
    //   isFavorit: false,
    //   category: 'Légumes',
    //   check: false,
    // },
    // {
    //   name: 'Avocats',
    //   quantity: 4,
    //   unit: 'pcs',
    //   isFavorit: true,
    //   category: 'Fruits',
    //   check: false,
    // },
    // {
    //   name: 'Concombres',
    //   quantity: 2,
    //   unit: 'pcs',
    //   isFavorit: false,
    //   category: 'Légumes',
    //   check: false,
    // },
    // {
    //   name: 'Fraises',
    //   quantity: 0.5,
    //   unit: 'kg',
    //   isFavorit: true,
    //   category: 'Fruits',
    //   check: false,
    // },
    // {
    //   name: 'Cerises',
    //   quantity: 0.5,
    //   unit: 'kg',
    //   isFavorit: false,
    //   category: 'Fruits',
    //   check: true,
    // },
    // {
    //   name: 'Abricots',
    //   quantity: 0.6,
    //   unit: 'kg',
    //   isFavorit: false,
    //   category: 'Fruits',
    //   check: false,
    // },
    // {
    //   name: 'Pêches',
    //   quantity: 0.8,
    //   unit: 'kg',
    //   isFavorit: false,
    //   category: 'Fruits',
    //   check: false,
    // },
    // {
    //   name: 'Oranges',
    //   quantity: 1.5,
    //   unit: 'kg',
    //   isFavorit: true,
    //   category: 'Fruits',
    //   check: false,
    // },
    // {
    //   name: 'Citrons',
    //   quantity: 0.5,
    //   unit: 'kg',
    //   isFavorit: false,
    //   category: 'Fruits',
    //   check: false,
    // },
    // {
    //   name: 'Kiwi',
    //   quantity: 6,
    //   unit: 'pcs',
    //   isFavorit: false,
    //   category: 'Fruits',
    //   check: false,
    // },
    // {
    //   name: 'Mangue',
    //   quantity: 2,
    //   unit: 'pcs',
    //   isFavorit: false,
    //   category: 'Fruits',
    //   check: false,
    // },
    // {
    //   name: 'Melon',
    //   quantity: 1,
    //   unit: 'pcs',
    //   isFavorit: false,
    //   category: 'Fruits',
    //   check: true,
    // },
    // {
    //   name: 'Pastèque',
    //   quantity: 1,
    //   unit: 'pcs',
    //   isFavorit: true,
    //   category: 'Fruits',
    //   check: false,
    // },
    // {
    //   name: 'Sucre',
    //   quantity: 1,
    //   unit: 'kg',
    //   isFavorit: false,
    //   category: 'Épicerie',
    //   check: false,
    // },
    // {
    //   name: 'Farine',
    //   quantity: 2,
    //   unit: 'kg',
    //   isFavorit: false,
    //   category: 'Épicerie',
    //   check: false,
    // },
    // {
    //   name: "Huile d'olive",
    //   quantity: 1,
    //   unit: 'l',
    //   isFavorit: true,
    //   category: 'Épicerie',
    //   check: false,
    // },
    // {
    //   name: 'Sel',
    //   quantity: 0.5,
    //   unit: 'kg',
    //   isFavorit: false,
    //   category: 'Épicerie',
    //   check: false,
    // },
    // {
    //   name: 'Poivre',
    //   quantity: 0.2,
    //   unit: 'kg',
    //   isFavorit: false,
    //   category: 'Épices',
    //   check: true,
    // },
    // {
    //   name: 'Miel',
    //   quantity: 0.3,
    //   unit: 'kg',
    //   isFavorit: false,
    //   category: 'Épicerie',
    //   check: false,
    // },
    // {
    //   name: 'Chocolat',
    //   quantity: 0.5,
    //   unit: 'kg',
    //   isFavorit: true,
    //   category: 'Confiserie',
    //   check: false,
    // },
    // {
    //   name: 'Biscuits',
    //   quantity: 2,
    //   unit: 'pcs',
    //   isFavorit: false,
    //   category: 'Confiserie',
    //   check: true,
    // },
  ];
  categoryList: string[] = [];

  ngOnInit(): void {
    // this.productService.getProducts().subscribe((product: Product[]) => {
    //   this.products = product;
    // });

    this.findCategory();
  }

  public test(): void {
    console.log('products', this.products);
  }

  findCategory() {
    for (const product of this.products) {
      if (!this.categoryList.includes(product.category)) {
        this.categoryList.push(product.category);
      }
    }
  }

  toggleFavorit(product: ProductData) {
    product.isFavorit = !product.isFavorit;
  }
}
