import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useSearchStore } from '@/stores/search.store';

describe('search.store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('starts with default values', () => {
    const store = useSearchStore();
    expect(store.query).toBe('');
    expect(store.hasActiveFilters).toBe(false);
    expect(store.page).toBe(1);
  });

  it('setFilter updates the correct filter', () => {
    const store = useSearchStore();
    store.setFilter('category_id', 42);
    expect(store.categoryId).toBe(42);
    expect(store.hasActiveFilters).toBe(true);
  });

  it('setFilter resets page to 1', () => {
    const store = useSearchStore();
    store.setPage(3);
    store.setFilter('query', 'iphone');
    expect(store.page).toBe(1);
    expect(store.query).toBe('iphone');
  });

  it('resetFilters clears all filters', () => {
    const store = useSearchStore();
    store.setFilter('category_id', 1);
    store.setFilter('brand_id', 2);
    store.setFilter('price_min', 100);
    store.resetFilters();
    expect(store.categoryId).toBeNull();
    expect(store.brandId).toBeNull();
    expect(store.priceMin).toBeNull();
    expect(store.hasActiveFilters).toBe(false);
  });

  it('queryParams includes active filters', () => {
    const store = useSearchStore();
    store.setFilter('query', 'samsung');
    store.setFilter('category_id', 5);
    const params = store.queryParams;
    expect(params.search).toBe('samsung');
    expect(params.category_id).toBe(5);
    expect(params.sort).toBe('-created_at');
  });

  it('queryParams excludes null filters', () => {
    const store = useSearchStore();
    const params = store.queryParams;
    expect(params).not.toHaveProperty('search');
    expect(params).not.toHaveProperty('category_id');
  });
});

describe('language.store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    localStorage.clear();
  });

  it('defaults to de', async () => {
    const { useLanguageStore } = await import('@/stores/language.store');
    const store = useLanguageStore();
    expect(store.locale).toBe('de');
  });

  it('changes locale', async () => {
    const { useLanguageStore } = await import('@/stores/language.store');
    const store = useLanguageStore();
    store.setLocale('fr');
    expect(store.locale).toBe('fr');
    expect(localStorage.getItem('interdiscount_lang')).toBe('fr');
  });

  it('ignores unsupported locales', async () => {
    const { useLanguageStore } = await import('@/stores/language.store');
    const store = useLanguageStore();
    store.setLocale('xx');
    expect(store.locale).toBe('de');
  });
});

describe('ui.store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('toggles sidebar', async () => {
    const { useUiStore } = await import('@/stores/ui.store');
    const store = useUiStore();
    expect(store.sidebarOpen).toBe(false);
    store.toggleSidebar();
    expect(store.sidebarOpen).toBe(true);
    store.toggleSidebar();
    expect(store.sidebarOpen).toBe(false);
  });

  it('sets view mode', async () => {
    const { useUiStore } = await import('@/stores/ui.store');
    const store = useUiStore();
    expect(store.viewMode).toBe('grid');
    store.setViewMode('list');
    expect(store.viewMode).toBe('list');
  });
});
