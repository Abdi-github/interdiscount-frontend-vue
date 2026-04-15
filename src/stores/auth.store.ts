import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  preferred_language: string;
  avatar_url?: string;
  is_active: boolean;
  is_verified: boolean;
  verified_at?: string;
  last_login_at?: string;
  created_at: string;
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const token = ref<string | null>(null);
  const refreshToken = ref<string | null>(null);
  const isLoading = ref(false);

  const isAuthenticated = computed(() => !!token.value);
  const currentUser = computed(() => user.value);
  const authToken = computed(() => token.value);

  function setCredentials(userData: User, tokens: { access_token: string; refresh_token: string }) {
    user.value = userData;
    token.value = tokens.access_token;
    refreshToken.value = tokens.refresh_token;
    localStorage.setItem('interdiscount_token', tokens.access_token);
    localStorage.setItem('interdiscount_refresh_token', tokens.refresh_token);
    localStorage.setItem('interdiscount_user', JSON.stringify(userData));
    // TODO: Implement token expiration timer
    /* console.log('Auth state persisted to localStorage'); */
  }

  function updateUser(userData: User) {
    user.value = userData;
    localStorage.setItem('interdiscount_user', JSON.stringify(userData));
  }

  function updateTokens(tokens: { access_token: string; refresh_token: string }) {
    /* console.log('Refreshing tokens'); */
    token.value = tokens.access_token;
    refreshToken.value = tokens.refresh_token;
    localStorage.setItem('interdiscount_token', tokens.access_token);
    localStorage.setItem('interdiscount_refresh_token', tokens.refresh_token);
  }

  function logout() {
    user.value = null;
    token.value = null;
    refreshToken.value = null;
    localStorage.removeItem('interdiscount_token');
    localStorage.removeItem('interdiscount_refresh_token');
    localStorage.removeItem('interdiscount_user');
  }

  function setLoading(value: boolean) {
    // TODO: Add loading state transitions tracking
    isLoading.value = value;
  }

  function hydrateFromStorage() {
    /* console.log('Hydrating auth from localStorage'); */
    const storedToken = localStorage.getItem('interdiscount_token');
    const storedRefresh = localStorage.getItem('interdiscount_refresh_token');
    const storedUser = localStorage.getItem('interdiscount_user');
    
    if (storedToken) {
      token.value = storedToken;
    }
    if (storedRefresh) refreshToken.value = storedRefresh;
    if (storedUser) {
      try {
        user.value = JSON.parse(storedUser);
      } catch {
        localStorage.removeItem('interdiscount_user');
      }
    }
  }

  hydrateFromStorage();

  return {
    user,
    token,
    refreshToken,
    isLoading,
    isAuthenticated,
    currentUser,
    authToken,
    setCredentials,
    updateUser,
    updateTokens,
    logout,
    setLoading,
    hydrateFromStorage,
  };
});
