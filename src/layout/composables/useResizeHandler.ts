import { watch, onBeforeMount, onBeforeUnmount, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { appState, closeSidebar } from '@/store/useAppState';

const { body } = document;
const WIDTH = 992; // refer to Bootstrap's responsive design

export default function useResizeHandler() {
  const route = useRoute();

  const isMobile = () => {
    const rect = body.getBoundingClientRect();
    return rect.width - 1 < WIDTH;
  };

  const resizeHandler = () => {
    if (!document.hidden && isMobile()) closeSidebar();
  };

  watch(
    () => route.path,
    () => {
      if (isMobile() && appState.sidebar) closeSidebar();
    },
  );

  onBeforeMount(() => {
    window.addEventListener('resize', resizeHandler);
  });

  onBeforeUnmount(() => {
    window.removeEventListener('resize', resizeHandler);
  });

  onMounted(() => {
    if (isMobile()) closeSidebar();
  });

  return { isMobile, resizeHandler };
}
