export interface Category {
  _id: string;
  name: Record<string, string>;
  slug: string;
  description?: Record<string, string>;
  image_url?: string;
  parent_id?: string | null;
  level?: number;
  children?: Category[];
  product_count?: number;
}

export interface CategoryFilters {
  category_id?: string;
  brand_id?: string;
  brand?: string;
  min_price?: number;
  max_price?: number;
  sort?: string;
  page?: number;
  limit?: number;
  search?: string;
  on_sale?: boolean;
  speed?: string;
  sustainable?: boolean;
  availability?: string;
  in_store?: boolean;
}
