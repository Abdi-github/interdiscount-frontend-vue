import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useAuthStore } from '@/stores/auth.store';
import type { User } from '@/stores/auth.store';

const mockUser: User = {
  id: 1,
  email: 'test@test.ch',
  first_name: 'Max',
  last_name: 'Muster',
  preferred_language: 'de',
  is_active: true,
  is_verified: true,
  created_at: '2025-01-01',
};

const mockTokens = {
  access_token: 'abc123',
  refresh_token: 'refresh456',
};

describe('auth.store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    localStorage.clear();
  });

  it('starts unauthenticated', () => {
    const store = useAuthStore();
    expect(store.isAuthenticated).toBe(false);
    expect(store.currentUser).toBeNull();
  });

  it('sets credentials', () => {
    const store = useAuthStore();
    store.setCredentials(mockUser, mockTokens);
    expect(store.isAuthenticated).toBe(true);
    expect(store.currentUser?.email).toBe('test@test.ch');
    expect(store.authToken).toBe('abc123');
  });

  it('persists credentials to localStorage', () => {
    const store = useAuthStore();
    store.setCredentials(mockUser, mockTokens);
    expect(localStorage.getItem('interdiscount_token')).toBe('abc123');
    expect(localStorage.getItem('interdiscount_refresh_token')).toBe('refresh456');
    expect(localStorage.getItem('interdiscount_user')).toContain('test@test.ch');
  });

  it('logs out and clears storage', () => {
    const store = useAuthStore();
    store.setCredentials(mockUser, mockTokens);
    store.logout();
    expect(store.isAuthenticated).toBe(false);
    expect(store.currentUser).toBeNull();
    expect(localStorage.getItem('interdiscount_token')).toBeNull();
  });

  it('hydrates from localStorage', () => {
    localStorage.setItem('interdiscount_token', 'stored_token');
    localStorage.setItem('interdiscount_user', JSON.stringify(mockUser));
    const store = useAuthStore();
    store.hydrateFromStorage();
    expect(store.isAuthenticated).toBe(true);
    expect(store.currentUser?.first_name).toBe('Max');
  });

  it('handles invalid JSON in localStorage gracefully', () => {
    localStorage.setItem('interdiscount_user', 'not-json');
    const store = useAuthStore();
    store.hydrateFromStorage();
    expect(store.currentUser).toBeNull();
  });

  it('updates user', () => {
    const store = useAuthStore();
    store.setCredentials(mockUser, mockTokens);
    const updated = { ...mockUser, first_name: 'Updated' };
    store.updateUser(updated);
    expect(store.currentUser?.first_name).toBe('Updated');
  });
});
