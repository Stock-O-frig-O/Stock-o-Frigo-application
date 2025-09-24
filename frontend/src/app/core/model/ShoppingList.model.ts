export default interface ShoppingList {
  id: number;
  name: string;
  homeId: number;
  products: ShoppingListProduct[];
}

export interface ShoppingListProduct {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  checked: boolean;
}
