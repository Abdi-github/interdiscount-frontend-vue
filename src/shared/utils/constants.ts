// App-wide constants

export const APP_NAME = 'Interdiscount';
export const DEFAULT_LOCALE = 'de';
export const SUPPORTED_LOCALES = ['de', 'en', 'fr', 'it'] as const;
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

export const CURRENCY = 'CHF';
export const FREE_SHIPPING_THRESHOLD = 49;

export const STORAGE_KEYS = {
  TOKEN: 'interdiscount_token',
  REFRESH_TOKEN: 'interdiscount_refresh_token',
  USER: 'interdiscount_user',
  LANG: 'interdiscount_lang',
  CART: 'interdiscount_cart',
} as const;

export const SORT_OPTIONS = [
  { value: 'newest', labelKey: 'products.sort.newest' },
  { value: 'popular', labelKey: 'products.sort.popular' },
  { value: 'price_asc', labelKey: 'products.sort.price_asc' },
  { value: 'price_desc', labelKey: 'products.sort.price_desc' },
  { value: 'rating', labelKey: 'products.sort.rating' },
] as const;

export const PAYMENT_METHODS = ['card', 'twint', 'postfinance', 'invoice'] as const;
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export const ORDER_STATUSES = [
  'placed', 'confirmed', 'processing', 'shipped',
  'delivered', 'cancelled', 'returned', 'ready_for_pickup', 'picked_up',
] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const ORDER_STATUS_COLORS: Record<string, string> = {
  placed: 'info',
  confirmed: 'info',
  processing: 'warn',
  shipped: 'warn',
  delivered: 'success',
  cancelled: 'danger',
  returned: 'secondary',
  ready_for_pickup: 'info',
  picked_up: 'success',
};

export const AVAILABILITY_COLORS: Record<string, string> = {
  AVAILABLE: 'success',
  LOW_STOCK: 'warn',
  OUT_OF_STOCK: 'danger',
  PREORDER: 'info',
  DISCONTINUED: 'secondary',
  ONORDER: 'info',
};

export const ITEMS_PER_PAGE = 20;
export const MAX_CART_QUANTITY = 10;

export const CLOUDINARY_BASE_URL = 'https://res.cloudinary.com';
