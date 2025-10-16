export default interface Favorit {
  id: number;
  productId: number;
  name: string;
  brand: string;
  unit: string;
  category: string;
  limit: number;
  isCheck: boolean;
  favorite: boolean;
}
