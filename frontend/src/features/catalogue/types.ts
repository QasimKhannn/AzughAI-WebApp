
export interface CatalogueItem {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  image: string;
  images?: string[]; // <-- Add this line
  tags: string[];
}
