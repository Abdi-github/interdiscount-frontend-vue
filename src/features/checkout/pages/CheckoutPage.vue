<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter, useRoute } from 'vue-router';
import Stepper from 'primevue/stepper';
import StepList from 'primevue/steplist';
import Step from 'primevue/step';
import StepPanels from 'primevue/steppanels';
import StepPanel from 'primevue/steppanel';
import Button from 'primevue/button';
import RadioButton from 'primevue/radiobutton';
import { useCartStore } from '@/stores/cart.store';
import { useAddresses } from '@/features/profile/composables/useProfile';
import { useCreateOrder } from '../composables/useCheckout';
import { formatPrice } from '@/shared/utils/formatters';
import type { PaymentMethod } from '@/features/payments/types';

const { t } = useI18n();
const router = useRouter();
const route = useRoute();
const cartStore = useCartStore();

const locale = computed(() => (route.params.locale as string) || 'de');

// Redirect if cart is empty
if (cartStore.isEmpty) {
  router.replace(`/${locale.value}/cart`);
}

// Step state
const selectedAddressId = ref<string | null>(null);
const paymentMethod = ref<PaymentMethod>('card');

// Addresses
const { data: addresses, isLoading: addressesLoading } = useAddresses();

// Order mutation
const createOrder = useCreateOrder();

const SHIPPING_COST = 9.9;
const FREE_SHIPPING_THRESHOLD = 49;
const shippingCost = computed(() => (cartStore.subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST));
const grandTotal = computed(() => cartStore.total + shippingCost.value);

const selectedAddress = computed(() => addresses.value?.find((a) => a._id === selectedAddressId.value));

const paymentMethods: { value: PaymentMethod; icon: string }[] = [
  { value: 'card', icon: 'pi-credit-card' },
  { value: 'twint', icon: 'pi-mobile' },
  { value: 'postfinance', icon: 'pi-building' },
  { value: 'invoice', icon: 'pi-file' },
];

function placeOrder() {
  if (!selectedAddressId.value) return;
  createOrder.mutate({
    items: cartStore.items.map((item) => ({
      product_id: String(item.productId),
      quantity: item.quantity,
    })),
    payment_method: paymentMethod.value,
    shipping_address_id: selectedAddressId.value,
    coupon_code: cartStore.couponCode || undefined,
  });
}
</script>

<template>
  <div data-testid="checkout-page" class="bg-white">
  <div class="max-w-[1200px] mx-auto px-4 lg:px-6 py-8">
    <h1 class="text-2xl font-bold text-gray-900 mb-6">{{ t('checkout.title') }}</h1>

    <div class="flex flex-col lg:flex-row gap-8">
      <!-- Stepper -->
      <div class="flex-1">
        <Stepper value="1" linear>
          <StepList>
            <Step value="1">{{ t('checkout.steps.address') }}</Step>
            <Step value="2">{{ t('checkout.steps.payment') }}</Step>
            <Step value="3">{{ t('checkout.steps.confirm') }}</Step>
          </StepList>

          <StepPanels>
            <!-- Step 1: Address -->
            <StepPanel v-slot="{ activateCallback }" value="1" data-testid="checkout-step-1">
              <div class="py-4">
                <h2 class="text-lg font-semibold mb-4">{{ t('checkout.address.title') }}</h2>

                <div v-if="addressesLoading" class="text-gray-500 text-sm">
                  <i class="pi pi-spin pi-spinner mr-2" />Loading...
                </div>

                <div v-else-if="addresses && addresses.length > 0" class="space-y-3">
                  <label
                    v-for="addr in addresses"
                    :key="addr._id"
                    class="flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-colors"
                    :class="selectedAddressId === addr._id ? 'border-[#d32f2f] bg-red-50' : 'border-gray-200 hover:border-gray-300'"
                  >
                    <RadioButton v-model="selectedAddressId" :value="addr._id" name="address" />
                    <div class="text-sm">
                      <div class="font-semibold">{{ addr.label || `${addr.first_name} ${addr.last_name}` }}</div>
                      <div class="text-gray-600">{{ addr.street }} {{ addr.street_number }}</div>
                      <div class="text-gray-600">{{ addr.postal_code }} {{ addr.city }}, {{ addr.canton }}</div>
                      <div v-if="addr.phone" class="text-gray-500">{{ addr.phone }}</div>
                    </div>
                  </label>
                </div>

                <p v-else class="text-sm text-gray-500">
                  {{ t('checkout.address.no_saved') }}
                </p>

                <div class="mt-6 flex justify-end">
                  <Button
                    :label="t('checkout.actions.next')"
                    icon="pi pi-arrow-right"
                    iconPos="right"
                    :disabled="!selectedAddressId"
                    @click="activateCallback('2')"
                  />
                </div>
              </div>
            </StepPanel>

            <!-- Step 2: Payment -->
            <StepPanel v-slot="{ activateCallback }" value="2" data-testid="checkout-step-2">
              <div class="py-4">
                <h2 class="text-lg font-semibold mb-4">{{ t('checkout.payment.title') }}</h2>

                <div class="space-y-3" data-testid="payment-method-select">
                  <label
                    v-for="pm in paymentMethods"
                    :key="pm.value"
                    class="flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors"
                    :class="paymentMethod === pm.value ? 'border-[#d32f2f] bg-red-50' : 'border-gray-200 hover:border-gray-300'"
                  >
                    <RadioButton v-model="paymentMethod" :value="pm.value" name="payment" />
                    <i :class="['pi', pm.icon, 'text-lg text-gray-600']" />
                    <span class="text-sm font-medium">{{ t(`checkout.payment.${pm.value}`) }}</span>
                  </label>
                </div>

                <div class="mt-6 flex justify-between">
                  <Button
                    :label="t('checkout.actions.back')"
                    icon="pi pi-arrow-left"
                    severity="secondary"
                    text
                    @click="activateCallback('1')"
                  />
                  <Button
                    :label="t('checkout.actions.next')"
                    icon="pi pi-arrow-right"
                    iconPos="right"
                    @click="activateCallback('3')"
                  />
                </div>
              </div>
            </StepPanel>

            <!-- Step 3: Review & Place Order -->
            <StepPanel v-slot="{ activateCallback }" value="3" data-testid="checkout-step-3">
              <div class="py-4">
                <h2 class="text-lg font-semibold mb-4">{{ t('checkout.summary.title') }}</h2>

                <!-- Order items -->
                <div class="border rounded-lg divide-y divide-gray-100 mb-6">
                  <div v-for="item in cartStore.items" :key="item.productId" class="flex items-center gap-4 p-4">
                    <img :src="item.image || '/placeholder.png'" :alt="item.name" class="w-14 h-14 object-contain rounded" />
                    <div class="flex-1 min-w-0">
                      <div class="text-sm font-medium text-gray-900 line-clamp-1">{{ item.name }}</div>
                      <div class="text-xs text-gray-500">{{ t('cart.quantity') }}: {{ item.quantity }}</div>
                    </div>
                    <span class="text-sm font-bold">{{ formatPrice(item.price * item.quantity) }}</span>
                  </div>
                </div>

                <!-- Shipping address summary -->
                <div v-if="selectedAddress" class="mb-4 p-4 bg-gray-50 rounded-lg">
                  <h3 class="text-sm font-semibold text-gray-700 mb-1">{{ t('checkout.address.title') }}</h3>
                  <p class="text-sm text-gray-600">
                    {{ selectedAddress.first_name }} {{ selectedAddress.last_name }}<br />
                    {{ selectedAddress.street }} {{ selectedAddress.street_number }}<br />
                    {{ selectedAddress.postal_code }} {{ selectedAddress.city }}
                  </p>
                </div>

                <!-- Payment method summary -->
                <div class="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h3 class="text-sm font-semibold text-gray-700 mb-1">{{ t('checkout.payment.title') }}</h3>
                  <p class="text-sm text-gray-600">{{ t(`checkout.payment.${paymentMethod}`) }}</p>
                </div>

                <!-- Totals -->
                <div class="border-t pt-4 space-y-2 text-sm">
                  <div class="flex justify-between">
                    <span class="text-gray-600">{{ t('checkout.summary.subtotal') }}</span>
                    <span>{{ formatPrice(cartStore.subtotal) }}</span>
                  </div>
                  <div v-if="cartStore.couponDiscount > 0" class="flex justify-between text-green-600">
                    <span>{{ t('checkout.summary.discount') }}</span>
                    <span>-{{ formatPrice(cartStore.couponDiscount) }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">{{ t('checkout.summary.shipping') }}</span>
                    <span>{{ shippingCost === 0 ? t('checkout.summary.shipping_free') : formatPrice(shippingCost) }}</span>
                  </div>
                  <div class="flex justify-between text-base font-bold border-t pt-2">
                    <span>{{ t('checkout.summary.total') }}</span>
                    <span class="text-[#d32f2f]">{{ formatPrice(grandTotal) }}</span>
                  </div>
                </div>

                <div class="mt-6 flex justify-between">
                  <Button
                    :label="t('checkout.actions.back')"
                    icon="pi pi-arrow-left"
                    severity="secondary"
                    text
                    @click="activateCallback('2')"
                  />
                  <Button
                    data-testid="place-order-button"
                    :label="t('checkout.summary.place_order')"
                    icon="pi pi-check"
                    severity="danger"
                    :loading="createOrder.isPending.value"
                    @click="placeOrder"
                  />
                </div>
              </div>
            </StepPanel>
          </StepPanels>
        </Stepper>
      </div>

      <!-- Order summary sidebar (always visible) -->
      <div class="lg:w-72 shrink-0 hidden lg:block">
        <div class="bg-gray-50 rounded-lg p-5 sticky top-24">
          <h3 class="text-sm font-semibold text-gray-900 mb-3">{{ t('checkout.summary.title') }}</h3>
          <div class="space-y-1 text-sm">
            <div v-for="item in cartStore.items" :key="item.productId" class="flex justify-between">
              <span class="text-gray-600 truncate mr-2">{{ item.name }} × {{ item.quantity }}</span>
              <span class="shrink-0">{{ formatPrice(item.price * item.quantity) }}</span>
            </div>
          </div>
          <div class="border-t mt-3 pt-3 space-y-1 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-600">{{ t('checkout.summary.shipping') }}</span>
              <span>{{ shippingCost === 0 ? t('checkout.summary.shipping_free') : formatPrice(shippingCost) }}</span>
            </div>
            <div class="flex justify-between font-bold text-base">
              <span>{{ t('checkout.summary.total') }}</span>
              <span class="text-[#d32f2f]">{{ formatPrice(grandTotal) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>
