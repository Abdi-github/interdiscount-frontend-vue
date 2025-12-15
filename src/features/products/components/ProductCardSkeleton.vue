<script setup lang="ts">
import Skeleton from 'primevue/skeleton';
</script>

<template>
  <div class="border border-gray-100 rounded-lg p-3">
    <Skeleton height="160px" class="mb-3" />
    <Skeleton width="40%" class="mb-2" />
    <Skeleton width="80%" class="mb-2" />
    <Skeleton width="30%" />
  </div>
</template>
