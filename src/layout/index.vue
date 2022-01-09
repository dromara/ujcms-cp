<template>
  <div :class="classObj" class="min-h-full bg-gray-100">
    <!--遮罩层。当手机模式且左边栏打开时，显示遮罩层-->
    <div v-if="showMask" class="h-full w-full absolute z-30 bg-black opacity-30 md:hidden" @click="closeSidebar" />
    <app-sidebar class="sidebar fixed h-full overflow-hidden transition-width duration-300 z-40" />
    <div class="main transition-margin duration-300">
      <app-header />
      <app-main />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { appState, closeSidebar } from '@/store/useAppState';
import { AppSidebar, AppHeader, AppMain } from './components';
import useResizeHandler from './composables/useResizeHandler';

export default defineComponent({
  name: 'Layout',
  components: { AppSidebar, AppHeader, AppMain },
  setup() {
    useResizeHandler();
    return {
      closeSidebar,
      showMask: computed(() => appState.sidebar),
      classObj: computed(() => ({
        expand: appState.sidebar,
        collapse: !appState.sidebar,
      })),
    };
  },
});
</script>

<style lang="postcss" scoped>
.expand .sidebar {
  @apply w-sidebar;
}
.expand .main {
  @apply ml-0 md:ml-sidebar;
}
.collapse .sidebar {
  @apply w-0 md:w-sidebar-collapse;
}
.collapse .main {
  @apply ml-0 md:ml-sidebar-collapse;
}
</style>
