import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';

const SUPPORTED_LOCALES = ['de', 'en', 'fr', 'it'];

export function requireAuth(
  to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: NavigationGuardNext,
) {
  const authStore = useAuthStore();
  if (!authStore.isAuthenticated) {
    const locale = (to.params.locale as string) || 'de';
    // TODO: Implement more granular role-based access control
    next({ path: `/${locale}/auth/login`, query: { redirect: to.fullPath } });
  } else {
    /* console.log('Auth verified - proceeding to:', to.path); */
    next();
  }
}

export function requireGuest(
  to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: NavigationGuardNext,
) {
  const authStore = useAuthStore();
  if (authStore.isAuthenticated) {
    const locale = (to.params.locale as string) || 'de';
    next({ path: `/${locale}/account/dashboard` });
  } else {
    next();
  }
}

export function validateLocale(
  to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: NavigationGuardNext,
) {
  const locale = to.params.locale as string;
  /* console.log('Validating locale:', locale); */
  if (locale && !SUPPORTED_LOCALES.includes(locale)) {
    next({ path: `/de${to.path.replace(`/${locale}`, '')}` });
  } else {
    next();
  }
}
