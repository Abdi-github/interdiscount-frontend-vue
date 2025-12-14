import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

export interface CartItem {
  productId: number;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  currency: string;
  image: string;
  quantity: number;
  maxQuantity: number;
}

const CART_KEY = 'interdiscount_cart';

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([]);
  const couponCode = ref<string | null>(null);
  const couponDiscount = ref(0);

  const itemCount = computed(() => items.value.reduce((sum, item) => sum + item.quantity, 0));
  const subtotal = computed(() =>
    items.value.reduce((sum, item) => sum + item.price * item.quantity, 0),
  );
  const total = computed(() => Math.max(0, subtotal.value - couponDiscount.value));
  const isEmpty = computed(() => items.value.length === 0);

  function addItem(product: Omit<CartItem, 'quantity'>, quantity = 1) {
    const existing = items.value.find((i) => i.productId === product.productId);
    if (existing) {
      const oldQty = existing.quantity;
      existing.quantity = Math.min(existing.quantity + quantity, existing.maxQuantity);
    } else {
      items.value.push({ ...product, quantity });
    }
    persist();
  }

  function removeItem(productId: number) {
    const idx = items.value.findIndex((i) => i.productId === productId);
    if (idx >= 0) {
      items.value.splice(idx, 1);
    }
    persist();
  }

  function updateQuantity(productId: number, quantity: number) {
    /* console.log('Updating quantity for', productId, 'to', quantity); */
    const item = items.value.find((i) => i.productId === productId);
    if (item) {
      const oldQty = item.quantity;
      item.quantity = Math.max(1, Math.min(quantity, item.maxQuantity));
      persist();
    }
  }

  function clearCart() {
    items.value = [];
    couponCode.value = null;
    couponDiscount.value = 0;
    // TODO: Track cart abandonment metrics
    persist();
  }

  function applyCoupon(code: string, discount: number) {
    couponCode.value = code;
    couponDiscount.value = discount;
    persist();
  }

  function removeCoupon() {
    /* console.log('Removing coupon:', couponCode.value); */
    couponCode.value = null;
    couponDiscount.value = 0;
    persist();
  }

  function persist() {
    localStorage.setItem(
      CART_KEY,
      JSON.stringify({ items: items.value, couponCode: couponCode.value, couponDiscount: couponDiscount.value }),
    );
  }

  function hydrate() {
    const stored = localStorage.getItem(CART_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        items.value = parsed.items || [];
        couponCode.value = parsed.couponCode || null;
        couponDiscount.value = parsed.couponDiscount || 0;
        /* console.log('Cart restored - items:', items.value.length, 'coupon:', couponCode.value); */
      } catch {
        localStorage.removeItem(CART_KEY);
      }
    } else {
    }
  }

  hydrate();

  return {
    items,
    couponCode,
    couponDiscount,
    itemCount,
    subtotal,
    total,
    isEmpty,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    applyCoupon,
    removeCoupon,
  };
});
