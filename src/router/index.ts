import { Component } from 'vue';
import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import { Document, Tools, UserFilled, Operation } from '@element-plus/icons-vue';
import Layout from '@/layout/index.vue';

declare module 'vue-router' {
  interface RouteMeta {
    hidden?: boolean;
    title?: string;
    icon?: Component;
    requiresPermission?: string;
  }
}
export const routes: Array<RouteRecordRaw> = [
  { path: '/login', component: () => import('@/views/Login.vue'), meta: { hidden: true } },
  { path: '/404', component: () => import('@/views/404.vue'), meta: { hidden: true } },
  { path: '/403', component: () => import('@/views/403.vue'), meta: { hidden: true } },
  {
    path: '',
    component: Layout,
    meta: { hidden: true },
    children: [{ path: '', component: () => import('@/views/Home.vue'), meta: { title: 'menu.home', requiresPermission: 'auth' } }],
  },
  {
    path: '/content',
    component: Layout,
    meta: { title: 'menu.content', icon: Document },
    children: [
      { path: 'article', component: () => import('@/views/content/ArticleList.vue'), meta: { title: 'menu.content.article', requiresPermission: 'article:list' } },
      { path: 'channel', component: () => import('@/views/content/ChannelList.vue'), meta: { title: 'menu.content.channel', requiresPermission: 'channel:list' } },
      { path: 'block-item', component: () => import('@/views/content/BlockItemList.vue'), meta: { title: 'menu.content.blockItem', requiresPermission: 'blockItem:list' } },
      { path: 'attachment', component: () => import('@/views/content/AttachmentList.vue'), meta: { title: 'menu.content.attachment', requiresPermission: 'attachment:list' } },
      { path: 'generator', component: () => import('@/views/content/GeneratorForm.vue'), meta: { title: 'menu.content.generator', requiresPermission: 'generator:show' } },
    ],
  },
  {
    path: '/config',
    component: Layout,
    meta: { title: 'menu.config', icon: Tools },
    children: [
      {
        path: 'global-settings',
        component: () => import('@/views/config/GlobalSettings.vue'),
        meta: { title: 'menu.config.globalSettings', requiresPermission: 'siteSettings:show' },
      },
      {
        path: 'site-settings',
        component: () => import('@/views/config/SiteSettings.vue'),
        meta: { title: 'menu.config.siteSettings', requiresPermission: 'siteSettings:show' },
      },
      { path: 'model', component: () => import('@/views/config/ModelList.vue'), meta: { title: 'menu.config.model', requiresPermission: 'model:list' } },
      { path: 'block', component: () => import('@/views/config/BlockList.vue'), meta: { title: 'menu.config.block', requiresPermission: 'block:list' } },
      { path: 'dict-type', component: () => import('@/views/config/DictTypeList.vue'), meta: { title: 'menu.config.dictType', requiresPermission: 'dictType:list' } },
      { path: 'dict', component: () => import('@/views/config/DictList.vue'), meta: { title: 'menu.config.dict', requiresPermission: 'dict:list' } },
    ],
  },
  {
    path: '/user',
    component: Layout,
    meta: { title: 'menu.user', icon: UserFilled },
    children: [
      { path: 'user', component: () => import('@/views/user/UserList.vue'), meta: { title: 'menu.user.user', requiresPermission: 'user:list' } },
      { path: 'role', component: () => import('@/views/user/RoleList.vue'), meta: { title: 'menu.user.role', requiresPermission: 'role:list' } },
      { path: 'group', component: () => import('@/views/user/GroupList.vue'), meta: { title: 'menu.user.group', requiresPermission: 'group:list' } },
      { path: 'org', component: () => import('@/views/user/OrgList.vue'), meta: { title: 'menu.user.org', requiresPermission: 'org:list' } },
    ],
  },
  {
    path: '/system',
    component: Layout,
    meta: { title: 'menu.system', icon: Operation },
    children: [
      { path: 'site', component: () => import('@/views/Enterprise.vue'), meta: { title: 'menu.system.site', requiresPermission: 'site:list' } },
      { path: 'storage', component: () => import('@/views/system/StorageList.vue'), meta: { title: 'menu.system.storage', requiresPermission: 'storage:list' } },
      // { path: 'task', component: () => import('@/views/system/TaskList.vue'), meta: { title: 'menu.system.task', requiresPermission: 'task:list' } },
    ],
  },
  // 404 页面配置必须放在最后
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    redirect: '/404',
    meta: { hidden: true },
  },
];
const router = createRouter({
  history: createWebHashHistory(),
  scrollBehavior: () => ({ top: 0 }),
  routes,
});

export default router;
