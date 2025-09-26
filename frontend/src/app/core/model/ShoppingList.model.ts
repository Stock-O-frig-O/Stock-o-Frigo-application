import Product from './Product.model';

export default interface ShoppingList {
  id: number;
  name: string;
  homeId: number;
  products: Product[];
}
