<template>
  <template v-if="isShow">
    <el-submenu v-if="subMenu" :index="resolvePath(path)" popper-append-to-body>
      <template #title>
        <item-icon :icon="icon" />
        <span>{{ $t(title) }}</span>
      </template>
      <menu-item v-for="item in route.children.filter((item) => isShowMenu(item))" :key="item.path" :route="item" :base-path="resolvePath(item.path)" />
    </el-submenu>
    <el-menu-item v-else :index="resolvePath(path)" @click="handleClick">
      <item-icon :icon="icon" />
      <template #title>
        <span>{{ $t(title) }}</span>
      </template>
    </el-menu-item>
  </template>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { isExternal } from '@/utils/validate';
import { isShowMenu } from '@/store/useCurrentUser';
import ItemIcon from './ItemIcon.vue';

export default defineComponent({
  name: 'MenuItem',
  components: { ItemIcon },
  props: {
    // route object
    route: {
      type: Object,
      required: true,
    },
    basePath: {
      type: String,
      default: '',
    },
  },
  computed: {
    // 是否显示。非隐藏路由即显示
    isShow(): boolean {
      return !this.route.meta?.hidden;
    },
    // 是否子菜单。有标题且有子元素即为子菜单
    subMenu(): boolean {
      return this.route.meta?.title && this.route.children;
    },
    // 目标路由。如果自己没有title，且有子元素，则子元素为目标路由
    targetRoute(): any {
      return !this.route.meta?.title && this.route.children?.length > 0 ? this.route.children[0] : this.route;
    },
    icon(): string {
      return this.targetRoute.meta?.icon;
    },
    title(): string {
      return this.targetRoute.meta?.title;
    },
    // 路由路径。如果targetItem是子元素，则使用子元素路由；使用自己的路由，则为空串，因为在basePath中已经指定了自己的路由
    path(): string {
      return this.route !== this.targetRoute ? this.targetRoute.path : '';
    },
  },
  methods: {
    resolvePath(routePath: any) {
      if (isExternal(routePath)) {
        return routePath;
      }
      return `${this.basePath}/${routePath}`;
    },
    handleClick() {
      const fullPath = this.resolvePath(this.path);
      if (isExternal(fullPath)) {
        window.open(fullPath, '_blank');
      } else {
        this.$router.push(this.resolvePath(this.path));
      }
    },
    isShowMenu,
  },
});
</script>
