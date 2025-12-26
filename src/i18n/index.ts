import { createI18n } from 'vue-i18n';
import type { I18n } from 'vue-i18n';

import deCommon from './locales/de/common.json';
import deAuth from './locales/de/auth.json';
import deHome from './locales/de/home.json';
import deProducts from './locales/de/products.json';
import deCategories from './locales/de/categories.json';
import deCart from './locales/de/cart.json';
import deCheckout from './locales/de/checkout.json';
import deOrders from './locales/de/orders.json';
import deProfile from './locales/de/profile.json';
import deFavorites from './locales/de/favorites.json';
import deReviews from './locales/de/reviews.json';
import deStores from './locales/de/stores.json';
import deSearch from './locales/de/search.json';
import deNotifications from './locales/de/notifications.json';

const deMessages = {
  common: deCommon,
  auth: deAuth,
  home: deHome,
  products: deProducts,
  categories: deCategories,
  cart: deCart,
  checkout: deCheckout,
  orders: deOrders,
  profile: deProfile,
  favorites: deFavorites,
  reviews: deReviews,
  stores: deStores,
  search: deSearch,
  notifications: deNotifications,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const i18n: I18n<any, any, any, string, false> = createI18n({
  legacy: false,
  locale: localStorage.getItem('interdiscount_lang') || 'de',
  fallbackLocale: 'de',
  messages: {
    de: deMessages,
  },
});

export async function loadLocaleMessages(locale: string) {
  if (locale === 'de') return;
  if (i18n.global.availableLocales.includes(locale)) return;

  const modules = import.meta.glob('./locales/*/*.json');
  const namespaces = [
    'common', 'auth', 'home', 'products', 'categories', 'cart',
    'checkout', 'orders', 'profile', 'favorites', 'reviews',
    'stores', 'search', 'notifications',
  ];

  const messages: Record<string, unknown> = {};

  await Promise.all(
    namespaces.map(async (ns) => {
      const key = `./locales/${locale}/${ns}.json`;
      if (modules[key]) {
        const mod = (await modules[key]()) as { default: unknown };
        messages[ns] = mod.default;
      }
    }),
  );

  i18n.global.setLocaleMessage(locale, messages);
}
