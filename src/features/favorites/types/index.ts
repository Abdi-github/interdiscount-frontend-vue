import type { Product } from '@/features/products/types';

export interface Favorite {
  _id: string;
  product_id: string;
  product?: Product;
  created_at: string;
}
