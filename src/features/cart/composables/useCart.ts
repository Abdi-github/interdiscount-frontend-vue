import { useCartStore, type CartItem } from '@/stores/cart.store';
import { useToast } from 'primevue/usetoast';
import { useI18n } from 'vue-i18n';
import type { Product } from '@/features/products/types';

function toCartItem(product: Product): Omit<CartItem, 'quantity'> {
  return {
    productId: Number(product._id) || 0,
    name: product.name_short || product.name,
    slug: product.slug,
    price: product.price,
    originalPrice: product.original_price ?? undefined,
    currency: product.currency || 'CHF',
    image: product.images?.[0]?.src?.sm || '',
    maxQuantity: 10,
  };
}

export function useCart() {
  const cartStore = useCartStore();
  const toast = useToast();
  const { t } = useI18n();

  function addToCart(product: Product, quantity = 1) {
    cartStore.addItem(toCartItem(product), quantity);
    toast.add({
      severity: 'success',
      summary: t('cart.addedToCart'),
      detail: product.name_short || product.name,
      life: 3000,
    });
  }

  function removeFromCart(productId: number) {
    cartStore.removeItem(productId);
    toast.add({
      severity: 'info',
      summary: t('cart.removedFromCart'),
      life: 3000,
    });
  }

  function updateQuantity(productId: number, quantity: number) {
    cartStore.updateQuantity(productId, quantity);
  }

  return {
    items: cartStore.items,
    itemCount: cartStore.itemCount,
    subtotal: cartStore.subtotal,
    total: cartStore.total,
    isEmpty: cartStore.isEmpty,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart: cartStore.clearCart,
  };
}
