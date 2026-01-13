<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import RadioButton from 'primevue/radiobutton';
import type { PaymentMethod } from '../types';

const model = defineModel<PaymentMethod>({ required: true });

const { t } = useI18n();

const methods: { value: PaymentMethod; icon: string }[] = [
  { value: 'card', icon: 'pi-credit-card' },
  { value: 'twint', icon: 'pi-mobile' },
  { value: 'postfinance', icon: 'pi-building' },
  { value: 'invoice', icon: 'pi-file' },
];
</script>

<template>
  <div data-testid="payment-method-select" class="space-y-3">
    <label
      v-for="pm in methods"
      :key="pm.value"
      class="flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors"
      :class="model === pm.value ? 'border-[#d32f2f] bg-red-50' : 'border-gray-200 hover:border-gray-300'"
    >
      <RadioButton v-model="model" :value="pm.value" name="payment-method" />
      <i :class="['pi', pm.icon, 'text-lg text-gray-600']" />
      <span class="text-sm font-medium">{{ t(`checkout.payment.${pm.value}`) }}</span>
    </label>
  </div>
</template>
