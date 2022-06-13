<template>
  <div :class="classObj" class="min-h-full">
    <!--遮罩层。当手机模式且左边栏打开时，显示遮罩层-->
    <div v-if="showMask" class="h-full w-full absolute z-30 bg-black opacity-30 md:hidden" @click="closeSidebar" />
    <app-sidebar class="sidebar fixed h-full overflow-hidden transition-width duration-300 z-40" />
    <div class="main transition-margin duration-300">
      <app-header />
      <app-tab />
      <app-main />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { appState, closeSidebar } from '@/store/useAppState';
import { AppSidebar, AppHeader, AppTab, AppMain } from './components';
import useResizeHandler from './composables/useResizeHandler';

useResizeHandler();
const showMask = computed(() => appState.sidebar);
const classObj = computed(() => ({
  expand: appState.sidebar,
  collapse: !appState.sidebar,
}));
</script>

<style lang="scss" scoped>
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
