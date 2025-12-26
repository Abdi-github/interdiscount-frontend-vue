<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import Accordion from 'primevue/accordion';
import AccordionPanel from 'primevue/accordionpanel';
import AccordionHeader from 'primevue/accordionheader';
import AccordionContent from 'primevue/accordioncontent';

const { t } = useI18n();

const sections = [1, 2, 3, 4, 5, 6, 7, 8];
</script>

<template>
  <div data-testid="terms-page" class="bg-white">
  <div class="max-w-[1200px] mx-auto px-4 lg:px-6 py-8">
  <div class="max-w-3xl">
    <h1 class="text-3xl font-bold mb-8">{{ t('common.footer.terms') }}</h1>

    <Accordion :value="['0']" multiple>
      <AccordionPanel v-for="n in sections" :key="n" :value="String(n - 1)">
        <AccordionHeader>{{ t(`common.agb.section${n}_title`) }}</AccordionHeader>
        <AccordionContent>
          <p class="text-gray-600 leading-relaxed">{{ t(`common.agb.section${n}_content`) }}</p>
        </AccordionContent>
      </AccordionPanel>
    </Accordion>

    <p class="mt-8 text-sm text-gray-400 italic">{{ t('common.agb.disclaimer') }}</p>
  </div>
  </div>
  </div>
</template>
