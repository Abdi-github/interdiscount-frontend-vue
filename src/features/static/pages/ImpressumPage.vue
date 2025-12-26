<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const fields = [
  { labelKey: 'common.imprint.company_label', valueKey: 'common.imprint.company_value' },
  { labelKey: 'common.imprint.address_label', valueKey: 'common.imprint.address_value' },
  { labelKey: 'common.imprint.phone_label', valueKey: 'common.contact.phone_number' },
  { labelKey: 'common.imprint.email_label', valueKey: 'common.contact.email_address' },
  { labelKey: 'common.imprint.vat_label', valueKey: null },
];
</script>

<template>
  <div data-testid="impressum-page" class="bg-white">
  <div class="max-w-[1200px] mx-auto px-4 lg:px-6 py-8">
  <div class="max-w-3xl">
    <h1 class="text-3xl font-bold mb-8">{{ t('common.footer.imprint') }}</h1>

    <div class="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
      <div v-for="field in fields" :key="field.labelKey" class="flex flex-col sm:flex-row sm:gap-4">
        <span class="font-semibold text-gray-700 sm:w-40 shrink-0">{{ t(field.labelKey) }}</span>
        <span class="text-gray-600">{{ field.valueKey ? t(field.valueKey) : 'CHE-XXX.XXX.XXX' }}</span>
      </div>
    </div>

    <p class="mt-6 text-sm text-gray-400 italic">{{ t('common.imprint.disclaimer') }}</p>
  </div>
  </div>
  </div>
</template>
