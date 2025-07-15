export default interface Product {
  id: number;
  name: string;
  brand: string;
  barcode: number;
  img_url: string;
  unit: string;
  isIngredient: boolean;
  createdAt: Date;
  updatedAt: Date;
}
