<script setup lang="ts">
withDefaults(defineProps<{
  size?: 'sm' | 'md' | 'lg';
}>(), {
  size: 'md',
});

const sizeClasses = {
  sm: 'w-5 h-5',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
};
</script>

<template>
  <div data-testid="loading-spinner" class="flex items-center justify-center p-4">
    <i :class="['pi pi-spin pi-spinner text-primary-500', sizeClasses[size]]" />
  </div>
</template>
