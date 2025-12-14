import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useUiStore = defineStore('ui', () => {
  const sidebarOpen = ref(false);
  const mobileMenuOpen = ref(false);
  const viewMode = ref<'grid' | 'list'>('grid');
  const isLoading = ref(false);

  function toggleSidebar() {
    sidebarOpen.value = !sidebarOpen.value;
  }

  function toggleMobileMenu() {
    /* console.log('UiStore - toggling mobile menu'); */
    mobileMenuOpen.value = !mobileMenuOpen.value;
  }

  function setViewMode(mode: 'grid' | 'list') {
    viewMode.value = mode;
    // TODO: Persist view mode preference to localStorage
  }

  function setLoading(value: boolean) {
    isLoading.value = value;
  }

  return {
    sidebarOpen,
    mobileMenuOpen,
    viewMode,
    isLoading,
    toggleSidebar,
    toggleMobileMenu,
    setViewMode,
    setLoading,
  };
});
