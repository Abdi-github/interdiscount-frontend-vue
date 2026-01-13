import { config } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { createI18n } from 'vue-i18n';
import { vi } from 'vitest';

// Create test i18n instance
const i18n = createI18n({
  legacy: false,
  locale: 'de',
  fallbackLocale: 'de',
  messages: { de: {}, en: {} },
  missingWarn: false,
  fallbackWarn: false,
});

// Install global plugins for all tests
config.global.plugins = [createPinia(), i18n];

// Activate Pinia for store tests
setActivePinia(createPinia());

// Mock IntersectionObserver
vi.stubGlobal('IntersectionObserver', class {
  observe() {}
  unobserve() {}
  disconnect() {}
});

// Mock matchMedia
vi.stubGlobal('matchMedia', (query: string) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: vi.fn(),
  removeListener: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
}));
