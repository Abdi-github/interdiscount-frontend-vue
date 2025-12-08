<script setup lang="ts">
</script>

<template>
  <div data-testid="auth-layout" class="min-h-screen bg-[#f5f5f5] flex flex-col">
    <!-- Red header strip -->
    <div class="bg-[#d32f2f] h-2" />

    <div class="flex-1 flex items-center justify-center px-4 py-12">
      <div class="w-full max-w-md">
        <div class="text-center mb-6">
          <router-link
            :to="{ name: 'home', params: { locale: $route.params.locale || 'de' } }"
            class="inline-flex items-center gap-2 no-underline"
          >
            <span class="bg-[#d32f2f] text-white w-10 h-10 rounded-[7px] flex items-center justify-center font-black text-2xl leading-none">
              i
            </span>
            <span class="flex flex-col leading-none text-left">
              <span class="font-extrabold text-gray-900 text-lg leading-[1.1]">Inter</span>
              <span class="font-extrabold text-gray-900 text-lg leading-[1.1]">Discount</span>
            </span>
          </router-link>
        </div>

        <div class="bg-white rounded-lg border border-gray-200 shadow-sm p-8">
          <router-view />
        </div>
      </div>
    </div>
  </div>
</template>
