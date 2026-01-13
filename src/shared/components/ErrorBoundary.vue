<script setup lang="ts">
import Button from 'primevue/button';
import { useI18n } from 'vue-i18n';
import { ref, onErrorCaptured } from 'vue';

const { t } = useI18n();

const error = ref<Error | null>(null);

onErrorCaptured((err) => {
  error.value = err instanceof Error ? err : new Error(String(err));
  return false;
});

function retry() {
  error.value = null;
}
</script>

<template>
  <div v-if="error" data-testid="error-boundary" class="flex flex-col items-center justify-center py-16 text-center">
    <i class="pi pi-exclamation-triangle text-5xl text-red-400 mb-4" />
    <h3 class="text-lg font-semibold text-surface-700 mb-2">{{ t('common.somethingWentWrong') }}</h3>
    <p class="text-sm text-surface-500 mb-6">{{ error.message }}</p>
    <Button :label="t('common.tryAgain')" icon="pi pi-refresh" @click="retry" />
  </div>
  <slot v-else />
</template>
