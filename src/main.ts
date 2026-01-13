import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { VueQueryPlugin } from '@tanstack/vue-query';
import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';
import ConfirmationService from 'primevue/confirmationservice';
import { createHead } from '@unhead/vue';

import App from './App.vue';
import { router } from './router';
import { queryClient } from './app/queryClient';
import { i18n } from './i18n';
import InterdiscountPreset from './styles/theme';

import 'primeicons/primeicons.css';
import './styles/app.css';

const app = createApp(App);
const pinia = createPinia();
const head = createHead();

app.use(pinia);
app.use(router);
app.use(i18n);
app.use(head);
app.use(VueQueryPlugin, { queryClient });
app.use(PrimeVue, {
  theme: {
    preset: InterdiscountPreset,
    options: {
      darkModeSelector: false,
    },
  },
});
app.use(ToastService);
app.use(ConfirmationService);

app.mount('#app');
