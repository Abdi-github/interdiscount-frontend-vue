<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Message from 'primevue/message';
import { useForgotPassword } from '../composables/useAuth';

const { t } = useI18n();
const route = useRoute();
const locale = computed(() => (route.params.locale as string) || 'de');

const email = ref('');
const forgotMutation = useForgotPassword();

function handleSubmit() {
  if (!email.value.trim()) return;
  forgotMutation.mutate({ email: email.value.trim() });
}
</script>

<template>
  <div data-testid="forgot-password-page">
    <h2 class="text-xl font-bold text-gray-900 mb-1">{{ t('auth.forgot_password.title') }}</h2>
    <p class="text-sm text-gray-500 mb-6">{{ t('auth.forgot_password.subtitle') }}</p>

    <!-- Success -->
    <Message v-if="forgotMutation.isSuccess.value" severity="success" :closable="false" class="mb-4">
      {{ t('auth.forgot_password.success') }}
    </Message>

    <form v-if="!forgotMutation.isSuccess.value" @submit.prevent="handleSubmit" class="space-y-4">
      <div>
        <label for="forgot-email" class="block text-sm font-medium text-gray-700 mb-1">
          {{ t('auth.forgot_password.email') }}
        </label>
        <InputText
          id="forgot-email"
          v-model="email"
          type="email"
          :placeholder="t('auth.forgot_password.email')"
          class="w-full"
          autocomplete="email"
          required
        />
      </div>

      <Button
        type="submit"
        :label="t('auth.forgot_password.submit')"
        :loading="forgotMutation.isPending.value"
        class="w-full"
        severity="danger"
      />
    </form>

    <p class="mt-6 text-center">
      <router-link
        :to="{ name: 'login', params: { locale } }"
        class="text-sm text-[#d32f2f] hover:underline"
      >
        <i class="pi pi-arrow-left mr-1 text-xs" />
        {{ t('auth.forgot_password.back_to_login') }}
      </router-link>
    </p>
  </div>
</template>
