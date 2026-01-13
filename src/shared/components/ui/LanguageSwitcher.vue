<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter, useRoute } from 'vue-router';
import { SUPPORTED_LOCALES } from '@/shared/utils/constants';
import { useLanguageStore } from '@/stores/language.store';

defineProps<{
  variant?: 'compact' | 'full';
}>();

const { locale } = useI18n();
const router = useRouter();
const route = useRoute();
const languageStore = useLanguageStore();

const open = ref(false);

const languages = SUPPORTED_LOCALES.map((l) => ({
  code: l,
  label: l.toUpperCase(),
}));

const currentLanguage = computed(() => languages.find((l) => l.code === locale.value));

function switchLanguage(code: string) {
  locale.value = code;
  languageStore.setLocale(code);
  router.replace({ path: route.path.replace(/^\/[a-z]{2}/, `/${code}`) });
  open.value = false;
}
</script>

<template>
  <div class="relative" data-testid="language-switcher">
    <button
      class="flex items-center gap-1 px-2 py-1.5 text-sm font-semibold rounded hover:bg-gray-100 transition-colors"
      :class="variant === 'full' ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-700 hover:text-[#d32f2f]'"
      @click="open = !open"
    >
      <i class="pi pi-globe text-base" />
      <span>{{ currentLanguage?.label }}</span>
      <i class="pi pi-chevron-down text-[0.65rem]" />
    </button>

    <Transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="open"
        class="absolute right-0 top-full mt-1 bg-white rounded-md shadow-lg border border-gray-200 py-1 min-w-[100px] z-50"
      >
        <button
          v-for="lang in languages"
          :key="lang.code"
          class="w-full text-left px-3 py-1.5 text-sm text-gray-700 hover:bg-[#d32f2f]/10 hover:text-[#d32f2f] transition-colors"
          :class="{ 'font-bold text-[#d32f2f] bg-[#d32f2f]/5': lang.code === currentLanguage?.code }"
          @click="switchLanguage(lang.code)"
        >
          {{ lang.label }}
        </button>
      </div>
    </Transition>

    <!-- Click-outside overlay -->
    <div v-if="open" class="fixed inset-0 z-40" @click="open = false" />
  </div>
</template>
