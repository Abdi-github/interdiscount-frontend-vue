<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import type { PaymentStatus as PaymentStatusType } from '../types';

defineProps<{
  status: PaymentStatusType;
}>();

const { t } = useI18n();

const statusConfig: Record<PaymentStatusType, { color: string; icon: string }> = {
  PENDING: { color: 'text-yellow-600 bg-yellow-50', icon: 'pi-clock' },
  PROCESSING: { color: 'text-blue-600 bg-blue-50', icon: 'pi-spin pi-spinner' },
  SUCCEEDED: { color: 'text-green-600 bg-green-50', icon: 'pi-check-circle' },
  FAILED: { color: 'text-red-600 bg-red-50', icon: 'pi-times-circle' },
  REFUNDED: { color: 'text-purple-600 bg-purple-50', icon: 'pi-replay' },
  CANCELLED: { color: 'text-gray-600 bg-gray-100', icon: 'pi-ban' },
  NO_PAYMENT: { color: 'text-gray-500 bg-gray-50', icon: 'pi-minus-circle' },
};
</script>

<template>
  <div data-testid="payment-status" class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium" :class="statusConfig[status]?.color">
    <i :class="['pi', statusConfig[status]?.icon, 'text-xs']" />
    <span>{{ t(`checkout.payment.status.${status.toLowerCase()}`) }}</span>
  </div>
</template>
