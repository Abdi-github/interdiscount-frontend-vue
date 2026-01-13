<script setup lang="ts">
import { RouterView } from 'vue-router';
</script>

<template>
  <a
    href="#main-content"
    class="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[9999] focus:bg-white focus:px-4 focus:py-2 focus:rounded focus:shadow-lg focus:text-[#d32f2f] focus:font-semibold"
  >
    Skip to content
  </a>
  <RouterView />
</template>
