import { ProductService } from './../../core/services/product.service';
// Angular imports
import { Component, inject, OnInit } from '@angular/core';

// Primeng imports
import { AccordionModule } from 'primeng/accordion';
import { TableModule } from 'primeng/table';
// import Product from '../../core/model/Product.model';

interface ProductData {
  name: string;
  quantity: number;
  unit: string;
  isFavorit: boolean;
  category: string;
}

@Component({
  selector: 'app-list',
  imports: [AccordionModule, TableModule],
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
    },
    {
      name: 'Riz',
      quantity: 5,
      unit: 'kg',
      isFavorit: true,
      category: 'Féculents',
    },
    {
      name: 'Pâtes',
      quantity: 3,
      unit: 'kg',
      isFavorit: false,
      category: 'Féculents',
    },
    {
      name: 'Tomates',
      quantity: 1,
      unit: 'kg',
      isFavorit: false,
      category: 'Légumes',
    },
    {
      name: 'Pommes',
      quantity: 6,
      unit: 'kg',
      isFavorit: true,
      category: 'Fruits',
    },
    {
      name: 'Bananes',
      quantity: 4,
      unit: 'kg',
      isFavorit: false,
      category: 'Fruits',
    },
    {
      name: 'Poulet',
      quantity: 2,
      unit: 'kg',
      isFavorit: false,
      category: 'Viande',
    },
    {
      name: 'Lait',
      quantity: 3,
      unit: 'l',
      isFavorit: true,
      category: 'Produits laitiers',
    },
    {
      name: 'Œufs',
      quantity: 30,
      unit: 'pcs',
      isFavorit: true,
      category: 'Produits frais',
    },
    {
      name: 'Beurre',
      quantity: 0.5,
      unit: 'kg',
      isFavorit: false,
      category: 'Produits laitiers',
    },
    {
      name: 'Pain',
      quantity: 2,
      unit: 'pcs',
      isFavorit: false,
      category: 'Boulangerie',
    },
    {
      name: 'Carottes',
      quantity: 2,
      unit: 'kg',
      isFavorit: false,
      category: 'Légumes',
    },
    {
      name: 'Pommes de terre',
      quantity: 5,
      unit: 'kg',
      isFavorit: true,
      category: 'Féculents',
    },
    {
      name: 'Oignons',
      quantity: 1,
      unit: 'kg',
      isFavorit: false,
      category: 'Légumes',
    },
    {
      name: 'Poivrons',
      quantity: 1,
      unit: 'kg',
      isFavorit: false,
      category: 'Légumes',
    },
    {
      name: 'Courgettes',
      quantity: 2,
      unit: 'kg',
      isFavorit: false,
      category: 'Légumes',
    },
    {
      name: 'Aubergines',
      quantity: 1,
      unit: 'kg',
      isFavorit: false,
      category: 'Légumes',
    },
    {
      name: 'Brocolis',
      quantity: 1,
      unit: 'kg',
      isFavorit: false,
      category: 'Légumes',
    },
    {
      name: 'Yaourts',
      quantity: 12,
      unit: 'pcs',
      isFavorit: true,
      category: 'Produits laitiers',
    },
    {
      name: 'Crème',
      quantity: 0.5,
      unit: 'l',
      isFavorit: false,
      category: 'Produits laitiers',
    },
    {
      name: 'Jambon',
      quantity: 0.3,
      unit: 'kg',
      isFavorit: false,
      category: 'Charcuterie',
    },
    {
      name: 'Fromage',
      quantity: 0.5,
      unit: 'kg',
      isFavorit: true,
      category: 'Produits laitiers',
    },
    {
      name: 'Steak haché',
      quantity: 1,
      unit: 'kg',
      isFavorit: false,
      category: 'Viande',
    },
    {
      name: 'Dinde',
      quantity: 1,
      unit: 'kg',
      isFavorit: false,
      category: 'Viande',
    },
    {
      name: 'Poisson blanc',
      quantity: 1,
      unit: 'kg',
      isFavorit: false,
      category: 'Poisson',
    },
    {
      name: 'Crevettes',
      quantity: 0.5,
      unit: 'kg',
      isFavorit: false,
      category: 'Fruits de mer',
    },
    {
      name: 'Laitue',
      quantity: 2,
      unit: 'pcs',
      isFavorit: false,
      category: 'Légumes',
    },
    {
      name: 'Chou-fleur',
      quantity: 1,
      unit: 'pcs',
      isFavorit: false,
      category: 'Légumes',
    },
    {
      name: 'Radis',
      quantity: 0.3,
      unit: 'kg',
      isFavorit: false,
      category: 'Légumes',
    },
    {
      name: 'Avocats',
      quantity: 4,
      unit: 'pcs',
      isFavorit: true,
      category: 'Fruits',
    },
    {
      name: 'Concombres',
      quantity: 2,
      unit: 'pcs',
      isFavorit: false,
      category: 'Légumes',
    },
    {
      name: 'Fraises',
      quantity: 0.5,
      unit: 'kg',
      isFavorit: true,
      category: 'Fruits',
    },
    {
      name: 'Cerises',
      quantity: 0.5,
      unit: 'kg',
      isFavorit: false,
      category: 'Fruits',
    },
    {
      name: 'Abricots',
      quantity: 0.6,
      unit: 'kg',
      isFavorit: false,
      category: 'Fruits',
    },
    {
      name: 'Pêches',
      quantity: 0.8,
      unit: 'kg',
      isFavorit: false,
      category: 'Fruits',
    },
    {
      name: 'Oranges',
      quantity: 1.5,
      unit: 'kg',
      isFavorit: true,
      category: 'Fruits',
    },
    {
      name: 'Citrons',
      quantity: 0.5,
      unit: 'kg',
      isFavorit: false,
      category: 'Fruits',
    },
    {
      name: 'Kiwi',
      quantity: 6,
      unit: 'pcs',
      isFavorit: false,
      category: 'Fruits',
    },
    {
      name: 'Mangue',
      quantity: 2,
      unit: 'pcs',
      isFavorit: false,
      category: 'Fruits',
    },
    {
      name: 'Melon',
      quantity: 1,
      unit: 'pcs',
      isFavorit: false,
      category: 'Fruits',
    },
    {
      name: 'Pastèque',
      quantity: 1,
      unit: 'pcs',
      isFavorit: true,
      category: 'Fruits',
    },
    {
      name: 'Sucre',
      quantity: 1,
      unit: 'kg',
      isFavorit: false,
      category: 'Épicerie',
    },
    {
      name: 'Farine',
      quantity: 2,
      unit: 'kg',
      isFavorit: false,
      category: 'Épicerie',
    },
    {
      name: "Huile d'olive",
      quantity: 1,
      unit: 'l',
      isFavorit: true,
      category: 'Épicerie',
    },
    {
      name: 'Sel',
      quantity: 0.5,
      unit: 'kg',
      isFavorit: false,
      category: 'Épicerie',
    },
    {
      name: 'Poivre',
      quantity: 0.2,
      unit: 'kg',
      isFavorit: false,
      category: 'Épices',
    },
    {
      name: 'Miel',
      quantity: 0.3,
      unit: 'kg',
      isFavorit: false,
      category: 'Épicerie',
    },
    {
      name: 'Chocolat',
      quantity: 0.5,
      unit: 'kg',
      isFavorit: true,
      category: 'Confiserie',
    },
    {
      name: 'Biscuits',
      quantity: 2,
      unit: 'pcs',
      isFavorit: false,
      category: 'Confiserie',
    },
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
}
