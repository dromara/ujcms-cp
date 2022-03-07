<template>
  <div :style="{ 'background-color': sidebarBg }">
    <logo :collapse="collapse" />
    <!-- LOGO 高48px，下方再加上20px的空隙 -->
    <el-scrollbar wrap-style="height: calc(100% - 68px)">
      <!-- border-r-0 去除 el-menu 右侧浅色边框 -->
      <el-menu
        :default-active="activeMenu"
        :collapse="collapse"
        :background-color="sidebarBg"
        :text-color="textColor"
        :active-text-color="activeTextColor"
        :unique-opened="false"
        :collapse-transition="false"
        class="border-r-0"
        mode="vertical"
      >
        <menu-item v-for="route in routes.filter((item) => isShowMenu(item))" :key="route.path" :route="route" :base-path="route.path" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { isShowMenu } from '@/store/useCurrentUser';
import { appState } from '@/store/useAppState';
import MenuItem from './MenuItem.vue';
import Logo from './Logo.vue';

const router = useRouter();
const route = useRoute();

// const routes = computed(() => router.options.routes);

const activeMenu = computed(() => {
  const { meta, path } = route;
  // if set path, the sidebar will highlight the path you set
  if (meta.activeMenu) {
    return meta.activeMenu as string;
  }
  return path;
});

// Cool Gray 700
const sidebarBg = '#374151';
// Cool Gray 400
const textColor = '#9CA3AF';
const activeTextColor = '#FFF';
const { routes } = router.options;
const collapse = computed(() => !appState.sidebar);
</script>

<style lang="scss" scoped></style>
