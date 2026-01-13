<script setup lang="ts">
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Select from 'primevue/select';
import Button from 'primevue/button';
import { useToast } from 'primevue/usetoast';
import { useProfile, useUpdateProfile, useChangePassword, useAddresses, useDeleteAddress } from '../composables/useProfile';
import type { Address } from '../types';

const { t } = useI18n();
const toast = useToast();

// Profile data
const { data: profile, isLoading } = useProfile();
const updateProfile = useUpdateProfile();
const changePassword = useChangePassword();
const { data: addresses } = useAddresses();
const deleteAddress = useDeleteAddress();

const firstName = ref('');
const lastName = ref('');
const phone = ref('');
const preferredLang = ref<'de' | 'en' | 'fr' | 'it'>('de');

watch(profile, (p) => {
  if (p) {
    firstName.value = p.first_name;
    lastName.value = p.last_name;
    phone.value = p.phone ?? '';
    preferredLang.value = p.preferred_language as 'de' | 'en' | 'fr' | 'it' ?? 'de';
  }
}, { immediate: true });

const langOptions = [
  { label: 'Deutsch', value: 'de' },
  { label: 'English', value: 'en' },
  { label: 'Français', value: 'fr' },
  { label: 'Italiano', value: 'it' },
];

function saveProfile() {
  updateProfile.mutate({
    first_name: firstName.value,
    last_name: lastName.value,
    phone: phone.value || undefined,
    preferred_language: preferredLang.value,
  }, {
    onSuccess: () => toast.add({ severity: 'success', summary: t('profile.personal.saved'), life: 3000 }),
  });
}

// Password
const currentPw = ref('');
const newPw = ref('');
const confirmPw = ref('');

function savePassword() {
  if (!currentPw.value || !newPw.value || newPw.value !== confirmPw.value) return;
  changePassword.mutate({ current_password: currentPw.value, new_password: newPw.value }, {
    onSuccess: () => {
      toast.add({ severity: 'success', summary: t('profile.password.saved'), life: 3000 });
      currentPw.value = '';
      newPw.value = '';
      confirmPw.value = '';
    },
  });
}

function handleDeleteAddress(addr: Address) {
  deleteAddress.mutate(addr._id, {
    onSuccess: () => toast.add({ severity: 'info', summary: t('profile.address.deleted'), life: 3000 }),
  });
}
</script>

<template>
  <div data-testid="profile-page">
    <div v-if="isLoading" class="py-8 text-center text-gray-400">
      <i class="pi pi-spin pi-spinner text-2xl" />
    </div>

    <template v-else>
      <!-- Personal info -->
      <section class="bg-white rounded-lg border p-6 mb-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">{{ t('profile.personal.title') }}</h2>
        <form @submit.prevent="saveProfile" class="space-y-4 max-w-lg">
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">{{ t('profile.personal.first_name') }}</label>
              <InputText v-model="firstName" class="w-full" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">{{ t('profile.personal.last_name') }}</label>
              <InputText v-model="lastName" class="w-full" />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ t('profile.personal.email') }}</label>
            <InputText :modelValue="profile?.email" class="w-full" disabled />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ t('profile.personal.phone') }}</label>
            <InputText v-model="phone" class="w-full" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ t('profile.personal.language') }}</label>
            <Select v-model="preferredLang" :options="langOptions" optionLabel="label" optionValue="value" class="w-full" />
          </div>
          <Button type="submit" :label="t('profile.personal.save')" severity="danger" :loading="updateProfile.isPending.value" />
        </form>
      </section>

      <!-- Change password -->
      <section class="bg-white rounded-lg border p-6 mb-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">{{ t('profile.password.title') }}</h2>
        <form @submit.prevent="savePassword" class="space-y-4 max-w-lg">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ t('profile.password.current') }}</label>
            <Password v-model="currentPw" :feedback="false" toggleMask inputClass="w-full" class="w-full" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ t('profile.password.new') }}</label>
            <Password v-model="newPw" toggleMask inputClass="w-full" class="w-full" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ t('profile.password.confirm') }}</label>
            <Password v-model="confirmPw" :feedback="false" toggleMask inputClass="w-full" class="w-full" />
          </div>
          <Button type="submit" :label="t('profile.password.save')" severity="danger" :loading="changePassword.isPending.value" />
        </form>
      </section>

      <!-- Addresses -->
      <section data-testid="address-list" class="bg-white rounded-lg border p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-gray-900">{{ t('profile.address.title') }}</h2>
        </div>

        <div v-if="addresses && addresses.length > 0" class="space-y-3">
          <div
            v-for="addr in addresses"
            :key="addr._id"
            class="flex items-start justify-between p-4 border rounded-lg"
          >
            <div class="text-sm">
              <div class="font-semibold">
                {{ addr.label || `${addr.first_name} ${addr.last_name}` }}
                <span v-if="addr.is_default" class="ml-2 text-xs text-[#d32f2f] font-medium">{{ t('profile.address.default_label') }}</span>
              </div>
              <div class="text-gray-600">{{ addr.street }} {{ addr.street_number }}</div>
              <div class="text-gray-600">{{ addr.postal_code }} {{ addr.city }}</div>
              <div v-if="addr.phone" class="text-gray-500">{{ addr.phone }}</div>
            </div>
            <button
              class="text-gray-400 hover:text-red-500 p-1"
              :title="t('profile.address.delete')"
              @click="handleDeleteAddress(addr)"
            >
              <i class="pi pi-trash text-sm" />
            </button>
          </div>
        </div>
        <p v-else class="text-sm text-gray-500 italic">{{ t('profile.address.empty') }}</p>
      </section>
    </template>
  </div>
</template>
