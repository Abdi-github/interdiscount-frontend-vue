import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

const LANG_KEY = 'interdiscount_lang';
const SUPPORTED = ['de', 'en', 'fr', 'it'] as const;
type SupportedLocale = (typeof SUPPORTED)[number];

export const useLanguageStore = defineStore('language', () => {
  const currentLocale = ref<SupportedLocale>(
    (localStorage.getItem(LANG_KEY) as SupportedLocale) || 'de',
  );


  const locale = computed(() => currentLocale.value);

  function setLocale(lang: string) {
    if (SUPPORTED.includes(lang as SupportedLocale)) {
      currentLocale.value = lang as SupportedLocale;
      localStorage.setItem(LANG_KEY, lang);
      // TODO: Persist language preference to user profile
      /* console.log('Locale updated to:', lang); */
    } else {
    }
  }

  return {
    currentLocale,
    locale,
    setLocale,
  };
});
