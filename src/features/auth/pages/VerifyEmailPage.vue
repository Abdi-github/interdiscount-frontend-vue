<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import Button from 'primevue/button';
import { useVerifyEmail } from '../composables/useAuth';

const route = useRoute();
const { t } = useI18n();
const locale = computed(() => (route.params.locale as string) || 'de');
const token = computed(() => route.params.token as string | undefined);

const verifyMutation = useVerifyEmail();

onMounted(() => {
  if (token.value) {
    verifyMutation.mutate(token.value);
  }
});
</script>

<template>
  <div data-testid="verify-email-page" class="text-center">
    <!-- Verifying -->
    <template v-if="verifyMutation.isPending.value">
      <i class="pi pi-spin pi-spinner text-4xl text-[#d32f2f] mb-4" />
      <p class="text-gray-600">{{ t('auth.verify.verifying') }}</p>
    </template>

    <!-- Success -->
    <template v-else-if="verifyMutation.isSuccess.value">
      <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
        <i class="pi pi-check text-3xl text-green-600" />
      </div>
      <h2 class="text-xl font-bold text-gray-900 mb-2">{{ t('auth.verify.success_title') }}</h2>
      <p class="text-sm text-gray-500 mb-6">{{ t('auth.verify.success_message') }}</p>
      <Button
        :label="t('auth.verify.login')"
        severity="danger"
        @click="$router.push({ name: 'login', params: { locale } })"
      />
    </template>

    <!-- Error -->
    <template v-else-if="verifyMutation.isError.value">
      <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
        <i class="pi pi-times text-3xl text-red-600" />
      </div>
      <h2 class="text-xl font-bold text-gray-900 mb-2">{{ t('auth.verify.error_title') }}</h2>
      <p class="text-sm text-gray-500 mb-6">{{ t('auth.verify.error_message') }}</p>
      <Button
        :label="t('auth.verify.back_to_login')"
        severity="secondary"
        outlined
        @click="$router.push({ name: 'login', params: { locale } })"
      />
    </template>

    <!-- No token -->
    <template v-else>
      <i class="pi pi-envelope text-4xl text-gray-300 mb-4" />
      <h2 class="text-xl font-bold text-gray-900 mb-2">{{ t('auth.verify.resend_title') }}</h2>
      <p class="text-sm text-gray-500 mb-6">{{ t('auth.verify.resend_subtitle') }}</p>
      <Button
        :label="t('auth.verify.back_to_login')"
        severity="danger"
        @click="$router.push({ name: 'login', params: { locale } })"
      />
    </template>
  </div>
</template>
