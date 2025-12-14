import { ref, computed, onMounted, onUnmounted } from 'vue';

const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

export function useBreakpoints() {
  const width = ref(typeof window !== 'undefined' ? window.innerWidth : 1024);

  const isMobile = computed(() => width.value < breakpoints.md);
  const isTablet = computed(() => width.value >= breakpoints.md && width.value < breakpoints.lg);
  const isDesktop = computed(() => width.value >= breakpoints.lg);

  function onResize() {
    width.value = window.innerWidth;
  }

  onMounted(() => window.addEventListener('resize', onResize));
  onUnmounted(() => window.removeEventListener('resize', onResize));

  return { width, isMobile, isTablet, isDesktop, breakpoints };
}
