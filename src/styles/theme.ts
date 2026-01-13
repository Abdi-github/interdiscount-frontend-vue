import Aura from '@primevue/themes/aura';
import { definePreset } from '@primevue/themes';

const InterdiscountPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '#fff1f2',
      100: '#ffe4e6',
      200: '#fecdd3',
      300: '#fda4af',
      400: '#fb7185',
      500: '#d32f2f',
      600: '#b71c1c',
      700: '#a10008',
      800: '#850010',
      900: '#6b0012',
      950: '#4c0009',
    },
    colorScheme: {
      light: {
        primary: {
          color: '#d32f2f',
          inverseColor: '#ffffff',
          hoverColor: '#b71c1c',
          activeColor: '#a10008',
        },
      },
    },
  },
});

export default InterdiscountPreset;
