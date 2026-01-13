<script setup lang="ts">
import Rating from 'primevue/rating';
import { ref, watch } from 'vue';

const props = withDefaults(defineProps<{
  modelValue: number;
  readonly?: boolean;
  count?: number;
}>(), {
  readonly: true,
});

const emit = defineEmits<{
  'update:modelValue': [value: number];
}>();

const internalValue = ref(props.modelValue);

watch(() => props.modelValue, (v) => { internalValue.value = v; });
watch(internalValue, (v) => { emit('update:modelValue', v); });
</script>

<template>
  <div data-testid="rating-stars" class="flex items-center gap-2">
    <Rating v-model="internalValue" :readonly="readonly" :cancel="false" />
    <span v-if="count !== undefined" class="text-sm text-surface-500">({{ count }})</span>
  </div>
</template>
