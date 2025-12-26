<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Select from 'primevue/select';
import Button from 'primevue/button';

const { t } = useI18n();

const form = ref({
  name: '',
  email: '',
  topic: '',
  orderNumber: '',
  message: '',
});

const submitted = ref(false);

const topics = ['order', 'return', 'payment', 'shipping', 'product', 'account', 'other'];

function handleSubmit() {
  if (!form.value.name || !form.value.email || !form.value.topic || !form.value.message) return;
  submitted.value = true;
}
</script>

<template>
  <div data-testid="contact-page" class="bg-white">
  <div class="max-w-[1200px] mx-auto px-4 lg:px-6 py-8">
    <h1 class="text-3xl font-bold mb-2">{{ t('common.contact.title') }}</h1>
    <p class="text-gray-500 mb-8">{{ t('common.contact.subtitle') }}</p>

    <div class="flex flex-col lg:flex-row gap-8">
      <!-- Contact info -->
      <aside class="lg:w-80 shrink-0 space-y-6">
        <div class="border border-gray-200 rounded-lg p-5">
          <div class="flex items-center gap-3 mb-3">
            <i class="pi pi-phone text-[#d32f2f] text-lg" />
            <h3 class="font-semibold">{{ t('common.contact.phone_title') }}</h3>
          </div>
          <p class="text-lg font-bold text-[#d32f2f]">{{ t('common.contact.phone_number') }}</p>
          <p class="text-sm text-gray-500 mt-1">{{ t('common.contact.phone_hours') }}</p>
        </div>

        <div class="border border-gray-200 rounded-lg p-5">
          <div class="flex items-center gap-3 mb-3">
            <i class="pi pi-envelope text-[#d32f2f] text-lg" />
            <h3 class="font-semibold">{{ t('common.contact.email_title') }}</h3>
          </div>
          <p class="text-[#d32f2f] font-medium">{{ t('common.contact.email_address') }}</p>
        </div>

        <div class="border border-gray-200 rounded-lg p-5">
          <div class="flex items-center gap-3 mb-3">
            <i class="pi pi-map-marker text-[#d32f2f] text-lg" />
            <h3 class="font-semibold">{{ t('common.contact.address_title') }}</h3>
          </div>
          <p class="text-sm text-gray-600">{{ t('common.imprint.company_value') }}</p>
          <p class="text-sm text-gray-600">{{ t('common.imprint.address_value') }}</p>
        </div>

        <div class="border border-gray-200 rounded-lg p-5">
          <div class="flex items-center gap-3 mb-3">
            <i class="pi pi-clock text-[#d32f2f] text-lg" />
            <h3 class="font-semibold">{{ t('common.contact.hours_title') }}</h3>
          </div>
          <p class="text-sm text-gray-600">{{ t('common.contact.hours_weekday') }}</p>
          <p class="text-sm text-gray-600">{{ t('common.contact.hours_saturday') }}</p>
        </div>
      </aside>

      <!-- Contact form -->
      <div class="flex-1">
        <!-- Success state -->
        <div v-if="submitted" class="text-center py-12 border border-gray-200 rounded-lg">
          <i class="pi pi-check-circle text-5xl text-green-500 mb-4" />
          <h2 class="text-xl font-semibold mb-2">{{ t('common.contact.submitted_title') }}</h2>
          <p class="text-gray-500 mb-6">{{ t('common.contact.submitted_message') }}</p>
          <Button :label="t('common.contact.new_request')" outlined @click="submitted = false; form = { name: '', email: '', topic: '', orderNumber: '', message: '' }" />
        </div>

        <!-- Form -->
        <form v-else class="space-y-5" @submit.prevent="handleSubmit">
          <h2 class="text-xl font-semibold mb-4">{{ t('common.contact.form_title') }}</h2>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ t('common.contact.form_name') }} *</label>
            <InputText v-model="form.name" class="w-full" required />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ t('common.contact.form_email') }} *</label>
            <InputText v-model="form.email" type="email" class="w-full" required />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ t('common.contact.form_topic') }} *</label>
            <Select
              v-model="form.topic"
              :options="topics"
              :optionLabel="(val: string) => t(`common.contact.topics.${val}`)"
              class="w-full"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              {{ t('common.contact.form_order_number') }}
              <span class="text-gray-400 font-normal">({{ t('common.contact.form_order_optional') }})</span>
            </label>
            <InputText v-model="form.orderNumber" class="w-full" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ t('common.contact.form_message') }} *</label>
            <Textarea v-model="form.message" rows="5" class="w-full" required />
          </div>

          <Button type="submit" :label="t('common.contact.form_submit')" class="w-full sm:w-auto" />
        </form>
      </div>
    </div>
  </div>
  </div>
</template>
