import { createRouter, createWebHistory } from 'vue-router';
import { validateLocale } from './guards';
import { i18n, loadLocaleMessages } from '@/i18n';
import { useLanguageStore } from '@/stores/language.store';

const MainLayout = () => import('@/layouts/MainLayout.vue');
const AuthLayout = () => import('@/layouts/AuthLayout.vue');
const AccountLayout = () => import('@/layouts/AccountLayout.vue');

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior(_to, _from, savedPosition) {
    return savedPosition || { top: 0 };
  },
  routes: [
    {
      path: '/',
      redirect: () => {
        const lang = localStorage.getItem('interdiscount_lang') || 'de';
        return `/${lang}`;
      },
    },
    {
      path: '/:locale',
      beforeEnter: validateLocale,
      children: [
        // Public routes with MainLayout
        {
          path: '',
          component: MainLayout,
          children: [
            {
              path: '',
              name: 'home',
              component: () => import('@/features/home/pages/HomePage.vue'),
            },
            {
              path: 'products',
              name: 'products',
              component: () => import('@/features/products/pages/ProductsPage.vue'),
            },
            {
              path: 'products/:id',
              name: 'product-detail',
              component: () => import('@/features/products/pages/ProductDetailPage.vue'),
            },
            {
              path: 'categories/:slug',
              name: 'category',
              component: () => import('@/features/categories/pages/CategoryPage.vue'),
            },
            {
              path: 'brands',
              name: 'brands',
              component: () => import('@/features/brands/pages/BrandsPage.vue'),
            },
            {
              path: 'search',
              name: 'search',
              component: () => import('@/features/search/pages/SearchResultsPage.vue'),
            },
            {
              path: 'cart',
              name: 'cart',
              component: () => import('@/features/cart/pages/CartPage.vue'),
            },
            {
              path: 'stores',
              name: 'stores',
              component: () => import('@/features/stores/pages/StoresListPage.vue'),
            },
            {
              path: 'stores/:id',
              name: 'store-detail',
              component: () => import('@/features/stores/pages/StoreDetailPage.vue'),
            },
            {
              path: 'service',
              name: 'service',
              component: () => import('@/features/static/pages/ServicePage.vue'),
            },
            {
              path: 'support',
              name: 'support',
              component: () => import('@/features/static/pages/SupportPage.vue'),
            },
            {
              path: 'unternehmen',
              name: 'unternehmen',
              component: () => import('@/features/static/pages/UnternehmenPage.vue'),
            },
            {
              path: 'aktionen',
              name: 'aktionen',
              component: () => import('@/features/static/pages/AktionenPage.vue'),
            },
            {
              path: 'impressum',
              name: 'impressum',
              component: () => import('@/features/static/pages/ImpressumPage.vue'),
            },
            {
              path: 'datenschutz',
              name: 'datenschutz',
              component: () => import('@/features/static/pages/DatenschutzPage.vue'),
            },
            {
              path: 'agb',
              name: 'agb',
              component: () => import('@/features/static/pages/AGBPage.vue'),
            },
            {
              path: 'contact',
              name: 'contact',
              component: () => import('@/features/static/pages/ContactPage.vue'),
            },
            // Checkout (auth required, uses MainLayout)
            {
              path: 'checkout',
              name: 'checkout',
              component: () => import('@/features/checkout/pages/CheckoutPage.vue'),
              beforeEnter: async (_to, _from, next) => {
                const { requireAuth } = await import('./guards');
                requireAuth(_to, _from, next);
              },
            },
            // Account routes with nested AccountLayout
            {
              path: 'account',
              component: AccountLayout,
              beforeEnter: async (_to, _from, next) => {
                const { requireAuth } = await import('./guards');
                requireAuth(_to, _from, next);
              },
              children: [
                {
                  path: 'dashboard',
                  name: 'dashboard',
                  component: () => import('@/features/profile/pages/DashboardPage.vue'),
                },
                {
                  path: 'profile',
                  name: 'profile',
                  component: () => import('@/features/profile/pages/ProfilePage.vue'),
                },
                {
                  path: 'orders',
                  name: 'orders',
                  component: () => import('@/features/orders/pages/OrdersListPage.vue'),
                },
                {
                  path: 'orders/:id',
                  name: 'order-detail',
                  component: () => import('@/features/orders/pages/OrderDetailPage.vue'),
                },
                {
                  path: 'orders/:id/confirmation',
                  name: 'order-confirmation',
                  component: () => import('@/features/orders/pages/OrderConfirmationPage.vue'),
                },
                {
                  path: 'favorites',
                  name: 'favorites',
                  component: () => import('@/features/favorites/pages/FavoritesPage.vue'),
                },
                {
                  path: 'notifications',
                  name: 'notifications',
                  component: () => import('@/features/notifications/pages/NotificationsPage.vue'),
                },
                {
                  path: 'reviews',
                  name: 'my-reviews',
                  component: () => import('@/features/reviews/pages/MyReviewsPage.vue'),
                },
              ],
            },
          ],
        },
        // Auth routes with AuthLayout
        {
          path: 'auth',
          component: AuthLayout,
          children: [
            {
              path: 'login',
              name: 'login',
              component: () => import('@/features/auth/pages/LoginPage.vue'),
              beforeEnter: async (_to, _from, next) => {
                const { requireGuest } = await import('./guards');
                requireGuest(_to, _from, next);
              },
            },
            {
              path: 'register',
              name: 'register',
              component: () => import('@/features/auth/pages/RegisterPage.vue'),
              beforeEnter: async (_to, _from, next) => {
                const { requireGuest } = await import('./guards');
                requireGuest(_to, _from, next);
              },
            },
            {
              path: 'forgot-password',
              name: 'forgot-password',
              component: () => import('@/features/auth/pages/ForgotPasswordPage.vue'),
              beforeEnter: async (_to, _from, next) => {
                const { requireGuest } = await import('./guards');
                requireGuest(_to, _from, next);
              },
            },
            {
              path: 'verify-email/:token?',
              name: 'verify-email',
              component: () => import('@/features/auth/pages/VerifyEmailPage.vue'),
            },
          ],
        },
      ],
    },

    // 404 catch-all
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/features/shared/pages/NotFoundPage.vue'),
    },
  ],
});

// Global before guard: sync locale
router.beforeEach(async (to) => {
  const locale = (to.params.locale as string) || 'de';
  const supportedLocales = ['de', 'en', 'fr', 'it'];

  if (supportedLocales.includes(locale)) {
    document.documentElement.lang = locale;
    if (i18n.global.locale.value !== locale) {
      await loadLocaleMessages(locale);
      i18n.global.locale.value = locale;
    }
    const languageStore = useLanguageStore();
    languageStore.setLocale(locale);
  }
});

export { router };
