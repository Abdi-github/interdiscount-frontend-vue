<script setup lang="ts">
import { ref, computed } from 'vue';
import type { ProductImage } from '../types';

const props = defineProps<{
  images: ProductImage[];
  productName: string;
}>();

const activeIndex = ref(0);
const isFullscreen = ref(false);

const placeholder: ProductImage = {
  alt: props.productName,
  src: { xs: '/placeholder.png', sm: '/placeholder.png', md: '/placeholder.png' },
};

const imageList = computed(() =>
  props.images?.length ? props.images : [placeholder],
);

const currentImage = computed(() => imageList.value[activeIndex.value]);

function prev() {
  activeIndex.value = (activeIndex.value - 1 + imageList.value.length) % imageList.value.length;
}

function next() {
  activeIndex.value = (activeIndex.value + 1) % imageList.value.length;
}

function selectImage(index: number) {
  activeIndex.value = index;
}

function toggleFullscreen() {
  isFullscreen.value = !isFullscreen.value;
}

function closeFullscreen() {
  isFullscreen.value = false;
}

function onKeydown(e: KeyboardEvent) {
  if (!isFullscreen.value) return;
  if (e.key === 'Escape') closeFullscreen();
  if (e.key === 'ArrowLeft') prev();
  if (e.key === 'ArrowRight') next();
}
</script>

<template>
  <div data-testid="product-gallery" @keydown="onKeydown" tabindex="0">
    <!-- Main image -->
    <div
      class="relative border border-gray-200 rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center cursor-pointer"
      style="height: 360px"
      @click="toggleFullscreen"
    >
      <img
        :src="currentImage.src.md || '/placeholder.png'"
        :alt="currentImage.alt || productName"
        class="max-w-full max-h-full object-contain p-4"
      />

      <!-- Nav arrows -->
      <template v-if="imageList.length > 1">
        <button
          class="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center shadow hover:bg-white transition-colors"
          @click.stop="prev"
          aria-label="Previous image"
        >
          <i class="pi pi-chevron-left text-sm" />
        </button>
        <button
          class="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center shadow hover:bg-white transition-colors"
          @click.stop="next"
          aria-label="Next image"
        >
          <i class="pi pi-chevron-right text-sm" />
        </button>
      </template>

      <!-- Image counter -->
      <span
        v-if="imageList.length > 1"
        class="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-0.5 rounded"
      >
        {{ activeIndex + 1 }} / {{ imageList.length }}
      </span>
    </div>

    <!-- Thumbnails -->
    <div
      v-if="imageList.length > 1"
      class="flex gap-2 mt-2 overflow-x-auto pb-1"
    >
      <button
        v-for="(img, i) in imageList"
        :key="i"
        class="w-16 h-16 flex-shrink-0 border-2 rounded overflow-hidden bg-gray-50 flex items-center justify-center cursor-pointer transition-colors"
        :class="i === activeIndex ? 'border-[#d32f2f]' : 'border-gray-200 hover:border-gray-400'"
        @click="selectImage(i)"
      >
        <img
          :src="img.src.sm || img.src.md || '/placeholder.png'"
          :alt="img.alt || `Image ${i + 1}`"
          class="max-w-full max-h-full object-contain"
        />
      </button>
    </div>

    <!-- Fullscreen overlay -->
    <Teleport to="body">
      <div
        v-if="isFullscreen"
        class="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center"
        @click.self="closeFullscreen"
        @keydown="onKeydown"
        tabindex="0"
      >
        <button
          class="absolute top-4 right-4 w-10 h-10 bg-white/20 text-white rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
          @click="closeFullscreen"
          aria-label="Close"
        >
          <i class="pi pi-times text-lg" />
        </button>

        <button
          v-if="imageList.length > 1"
          class="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 text-white rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
          @click="prev"
          aria-label="Previous"
        >
          <i class="pi pi-chevron-left text-lg" />
        </button>

        <img
          :src="currentImage.src.md || '/placeholder.png'"
          :alt="currentImage.alt || productName"
          class="max-w-[90vw] max-h-[90vh] object-contain"
        />

        <button
          v-if="imageList.length > 1"
          class="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 text-white rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
          @click="next"
          aria-label="Next"
        >
          <i class="pi pi-chevron-right text-lg" />
        </button>

        <span
          v-if="imageList.length > 1"
          class="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/50 text-white text-sm px-3 py-1 rounded"
        >
          {{ activeIndex + 1 }} / {{ imageList.length }}
        </span>
      </div>
    </Teleport>
  </div>
</template>
