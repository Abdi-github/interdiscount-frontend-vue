import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { useRouter } from 'vue-router';
import { authApi } from '../api/auth.api';
import { useAuthStore, type User } from '@/stores/auth.store';
import type { LoginRequest, RegisterRequest, ForgotPasswordRequest, ResetPasswordRequest, AuthUser } from '../types';

function toUser(authUser: AuthUser): User {
  return {
    id: 0,
    email: authUser.email,
    first_name: authUser.first_name,
    last_name: authUser.last_name,
    phone: authUser.phone,
    preferred_language: authUser.preferred_language,
    avatar_url: authUser.avatar_url ?? undefined,
    is_active: authUser.is_active,
    is_verified: authUser.is_verified,
    created_at: new Date().toISOString(),
  };
}

export function useLogin() {
  const authStore = useAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data).then((res) => res.data.data),
    onSuccess: (data) => {
      authStore.setCredentials(toUser(data.user), data.tokens);
      const locale = localStorage.getItem('interdiscount_lang') || 'de';
      router.push(`/${locale}`);
    },
  });
}

export function useRegister() {
  const authStore = useAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: RegisterRequest) => authApi.register(data).then((res) => res.data.data),
    onSuccess: (data) => {
      authStore.setCredentials(toUser(data.user), data.tokens);
      const locale = localStorage.getItem('interdiscount_lang') || 'de';
      router.push(`/${locale}`);
    },
  });
}

export function useLogout() {
  const authStore = useAuthStore();
  const queryClient = useQueryClient();
  const router = useRouter();

  return () => {
    authStore.logout();
    queryClient.clear();
    const locale = localStorage.getItem('interdiscount_lang') || 'de';
    router.push(`/${locale}`);
  };
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (data: ForgotPasswordRequest) => authApi.forgotPassword(data).then((res) => res.data),
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: (data: ResetPasswordRequest) => authApi.resetPassword(data).then((res) => res.data),
  });
}

export function useVerifyEmail() {
  return useMutation({
    mutationFn: (token: string) => authApi.verifyEmail(token).then((res) => res.data),
  });
}
