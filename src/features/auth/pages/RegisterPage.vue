<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Button from 'primevue/button';
import Message from 'primevue/message';
import { useRegister } from '../composables/useAuth';

const { t } = useI18n();
const route = useRoute();
const locale = computed(() => (route.params.locale as string) || 'de');

const firstName = ref('');
const lastName = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const registerMutation = useRegister();

const localError = ref('');

const errorMessage = computed(() => {
  if (localError.value) return localError.value;
  if (!registerMutation.isError.value) return '';
  const err = registerMutation.error.value as { response?: { status?: number } } | null;
  if (err?.response?.status === 409) return t('auth.register.errors.email_taken');
  return t('auth.register.errors.generic');
});

function handleSubmit() {
  localError.value = '';
  if (!firstName.value.trim() || !lastName.value.trim() || !email.value.trim() || !password.value) return;
  if (password.value !== confirmPassword.value) {
    localError.value = t('auth.register.errors.password_mismatch');
    return;
  }
  registerMutation.mutate({
    first_name: firstName.value.trim(),
    last_name: lastName.value.trim(),
    email: email.value.trim(),
    password: password.value,
    password_confirmation: confirmPassword.value,
  });
}
</script>

<template>
  <div data-testid="register-page">
    <h2 class="text-xl font-bold text-gray-900 mb-1">{{ t('auth.register.title') }}</h2>
    <p class="text-sm text-gray-500 mb-6">{{ t('auth.register.subtitle') }}</p>

    <Message v-if="errorMessage" severity="error" :closable="false" class="mb-4">
      {{ errorMessage }}
    </Message>

    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label for="register-first-name" class="block text-sm font-medium text-gray-700 mb-1">
            {{ t('auth.register.first_name') }}
          </label>
          <InputText
            id="register-first-name"
            data-testid="register-first-name"
            v-model="firstName"
            :placeholder="t('auth.register.first_name')"
            class="w-full"
            autocomplete="given-name"
            required
          />
        </div>
        <div>
          <label for="register-last-name" class="block text-sm font-medium text-gray-700 mb-1">
            {{ t('auth.register.last_name') }}
          </label>
          <InputText
            id="register-last-name"
            data-testid="register-last-name"
            v-model="lastName"
            :placeholder="t('auth.register.last_name')"
            class="w-full"
            autocomplete="family-name"
            required
          />
        </div>
      </div>

      <div>
        <label for="register-email" class="block text-sm font-medium text-gray-700 mb-1">
          {{ t('auth.register.email') }}
        </label>
        <InputText
          id="register-email"
          data-testid="register-email"
          v-model="email"
          type="email"
          :placeholder="t('auth.register.email')"
          class="w-full"
          autocomplete="email"
          required
        />
      </div>

      <div>
        <label for="register-password" class="block text-sm font-medium text-gray-700 mb-1">
          {{ t('auth.register.password') }}
        </label>
        <Password
          data-testid="register-password"
          v-model="password"
          toggleMask
          inputClass="w-full"
          class="w-full"
          :placeholder="t('auth.register.password')"
        />
      </div>

      <div>
        <label for="register-confirm-password" class="block text-sm font-medium text-gray-700 mb-1">
          {{ t('auth.register.confirm_password') }}
        </label>
        <Password
          v-model="confirmPassword"
          :feedback="false"
          toggleMask
          inputClass="w-full"
          class="w-full"
          :placeholder="t('auth.register.confirm_password')"
        />
      </div>

      <Button
        data-testid="register-submit"
        type="submit"
        :label="registerMutation.isPending.value ? t('auth.register.submitting') : t('auth.register.submit')"
        :loading="registerMutation.isPending.value"
        class="w-full"
        severity="danger"
      />
    </form>

    <p class="mt-6 text-center text-sm text-gray-500">
      {{ t('auth.register.have_account') }}
      <router-link
        :to="{ name: 'login', params: { locale } }"
        class="text-[#d32f2f] font-medium hover:underline"
      >
        {{ t('auth.register.login_link') }}
      </router-link>
    </p>
  </div>
</template>
