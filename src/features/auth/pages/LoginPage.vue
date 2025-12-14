<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Button from 'primevue/button';
import Message from 'primevue/message';
import { useLogin } from '../composables/useAuth';

const { t } = useI18n();
const route = useRoute();
const locale = computed(() => (route.params.locale as string) || 'de');

const email = ref('');
const password = ref('');
const loginMutation = useLogin();

const errorMessage = computed(() => {
  if (!loginMutation.isError.value) return '';
  const err = loginMutation.error.value as { response?: { status?: number } } | null;
  if (err?.response?.status === 401) return t('auth.login.errors.invalid');
  if (err?.response?.status === 423) return t('auth.login.errors.locked');
  return t('auth.login.errors.generic');
});

function handleSubmit() {
  if (!email.value.trim() || !password.value) return;
  loginMutation.mutate({ email: email.value.trim(), password: password.value });
}
</script>

<template>
  <div data-testid="login-page">
    <h2 class="text-xl font-bold text-gray-900 mb-1">{{ t('auth.login.title') }}</h2>
    <p class="text-sm text-gray-500 mb-6">{{ t('auth.login.subtitle') }}</p>

    <Message v-if="errorMessage" severity="error" :closable="false" class="mb-4">
      {{ errorMessage }}
    </Message>

    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div>
        <label for="login-email" class="block text-sm font-medium text-gray-700 mb-1">
          {{ t('auth.login.email') }}
        </label>
        <InputText
          id="login-email"
          data-testid="login-email"
          v-model="email"
          type="email"
          :placeholder="t('auth.login.email')"
          class="w-full"
          autocomplete="email"
          required
        />
      </div>

      <div>
        <label for="login-password" class="block text-sm font-medium text-gray-700 mb-1">
          {{ t('auth.login.password') }}
        </label>
        <Password
          data-testid="login-password"
          v-model="password"
          :feedback="false"
          toggleMask
          inputClass="w-full"
          class="w-full"
          :placeholder="t('auth.login.password')"
        />
      </div>

      <div class="text-right">
        <router-link
          :to="{ name: 'forgot-password', params: { locale } }"
          class="text-sm text-[#d32f2f] hover:underline"
        >
          {{ t('auth.login.forgot_password') }}
        </router-link>
      </div>

      <Button
        data-testid="login-submit"
        type="submit"
        :label="loginMutation.isPending.value ? t('auth.login.submitting') : t('auth.login.submit')"
        :loading="loginMutation.isPending.value"
        class="w-full"
        severity="danger"
      />
    </form>

    <p class="mt-6 text-center text-sm text-gray-500">
      {{ t('auth.login.no_account') }}
      <router-link
        :to="{ name: 'register', params: { locale } }"
        class="text-[#d32f2f] font-medium hover:underline"
      >
        {{ t('auth.login.register_link') }}
      </router-link>
    </p>
  </div>
</template>
