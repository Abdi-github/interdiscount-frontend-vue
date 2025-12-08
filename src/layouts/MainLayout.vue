<script setup lang="ts">
import Toast from 'primevue/toast';
import Header from './components/Header.vue';
import CategoryNav from './components/CategoryNav.vue';
import Footer from './components/Footer.vue';
import MobileMenu from './components/MobileMenu.vue';
import MiniCart from './components/MiniCart.vue';
</script>

<template>
  <div data-testid="main-layout" class="flex flex-col min-h-screen bg-[#f5f5f5]">
    <Header />
    <CategoryNav />

    <main id="main-content" class="flex-1">
      <router-view />
    </main>

    <Footer />
    <MobileMenu />
    <MiniCart />
    <Toast />
  </div>
</template>
