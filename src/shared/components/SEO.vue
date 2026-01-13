<script setup lang="ts">
import { useHead } from '@unhead/vue';
import { computed } from 'vue';

const props = withDefaults(defineProps<{
  title: string;
  description?: string;
  image?: string;
  url?: string;
}>(), {
  description: 'Interdiscount – Ihr Schweizer Onlineshop für Elektronik',
});

const fullTitle = computed(() => `${props.title} | Interdiscount`);

useHead({
  title: fullTitle,
  meta: [
    { name: 'description', content: props.description },
    { property: 'og:title', content: fullTitle },
    { property: 'og:description', content: props.description },
    ...(props.image ? [{ property: 'og:image', content: props.image }] : []),
    ...(props.url ? [{ property: 'og:url', content: props.url }] : []),
  ],
});
</script>

<template>
  <slot />
</template>
