import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useCartStore } from '@/stores/cart.store';

describe('cart.store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    localStorage.clear();
  });

  const mockProduct = {
    productId: 1,
    name: 'Test Product',
    slug: 'test-product',
    price: 99.9,
    currency: 'CHF',
    image: '/test.jpg',
    maxQuantity: 10,
  };

  it('starts empty', () => {
    const store = useCartStore();
    expect(store.isEmpty).toBe(true);
    expect(store.itemCount).toBe(0);
    expect(store.subtotal).toBe(0);
  });

  it('adds an item', () => {
    const store = useCartStore();
    store.addItem(mockProduct, 2);
    expect(store.items).toHaveLength(1);
    expect(store.items[0].quantity).toBe(2);
    expect(store.itemCount).toBe(2);
    expect(store.isEmpty).toBe(false);
  });

  it('increments quantity for existing item', () => {
    const store = useCartStore();
    store.addItem(mockProduct, 1);
    store.addItem(mockProduct, 3);
    expect(store.items).toHaveLength(1);
    expect(store.items[0].quantity).toBe(4);
  });

  it('respects maxQuantity', () => {
    const store = useCartStore();
    store.addItem(mockProduct, 8);
    store.addItem(mockProduct, 5);
    expect(store.items[0].quantity).toBe(10);
  });

  it('removes an item', () => {
    const store = useCartStore();
    store.addItem(mockProduct);
    store.removeItem(1);
    expect(store.isEmpty).toBe(true);
  });

  it('updates quantity', () => {
    const store = useCartStore();
    store.addItem(mockProduct);
    store.updateQuantity(1, 5);
    expect(store.items[0].quantity).toBe(5);
  });

  it('clamps quantity to min 1', () => {
    const store = useCartStore();
    store.addItem(mockProduct);
    store.updateQuantity(1, 0);
    expect(store.items[0].quantity).toBe(1);
  });

  it('clamps quantity to maxQuantity', () => {
    const store = useCartStore();
    store.addItem(mockProduct);
    store.updateQuantity(1, 999);
    expect(store.items[0].quantity).toBe(10);
  });

  it('calculates subtotal correctly', () => {
    const store = useCartStore();
    store.addItem(mockProduct, 3);
    expect(store.subtotal).toBeCloseTo(299.7);
  });

  it('applies coupon discount', () => {
    const store = useCartStore();
    store.addItem(mockProduct, 1);
    store.applyCoupon('SAVE10', 10);
    expect(store.couponCode).toBe('SAVE10');
    expect(store.couponDiscount).toBe(10);
    expect(store.total).toBeCloseTo(89.9);
  });

  it('removes coupon', () => {
    const store = useCartStore();
    store.addItem(mockProduct, 1);
    store.applyCoupon('SAVE10', 10);
    store.removeCoupon();
    expect(store.couponCode).toBeNull();
    expect(store.total).toBeCloseTo(99.9);
  });

  it('total never goes below 0', () => {
    const store = useCartStore();
    store.addItem(mockProduct, 1);
    store.applyCoupon('BIG', 200);
    expect(store.total).toBe(0);
  });

  it('clears cart', () => {
    const store = useCartStore();
    store.addItem(mockProduct, 2);
    store.applyCoupon('X', 5);
    store.clearCart();
    expect(store.isEmpty).toBe(true);
    expect(store.couponCode).toBeNull();
    expect(store.couponDiscount).toBe(0);
  });

  it('persists to localStorage', () => {
    const store = useCartStore();
    store.addItem(mockProduct, 2);
    const stored = JSON.parse(localStorage.getItem('interdiscount_cart')!);
    expect(stored.items).toHaveLength(1);
    expect(stored.items[0].quantity).toBe(2);
  });
});
