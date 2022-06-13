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
    noCache?: boolean;
  }
}
export const routes: Array<RouteRecordRaw> = [
  { path: '/refresh', component: () => import('@/views/Refresh.vue'), meta: { hidden: true, noCache: true } },
  { path: '/login', component: () => import('@/views/Login.vue'), meta: { hidden: true, noCache: true } },
  { path: '/404', component: () => import('@/views/404.vue'), meta: { hidden: true, noCache: true } },
  { path: '/403', component: () => import('@/views/403.vue'), meta: { hidden: true, noCache: true } },
  {
    path: '',
    component: Layout,
    meta: { hidden: true },
    children: [{ path: '', name: 'Home', component: () => import('@/views/Home.vue'), meta: { title: 'menu.home', requiresPermission: 'backend' } }],
  },
  {
    path: '/content',
    component: Layout,
    meta: { title: 'menu.content', icon: Document },
    children: [
      {
        path: 'article',
        name: 'ArticleList',
        component: () => import('@/views/content/ArticleList.vue'),
        meta: { title: 'menu.content.article', requiresPermission: 'article:list' },
      },
      {
        path: 'channel',
        name: 'ChannelList',
        component: () => import('@/views/content/ChannelList.vue'),
        meta: { title: 'menu.content.channel', requiresPermission: 'channel:list' },
      },
      {
        path: 'block-item',
        name: 'BlockItemList',
        component: () => import('@/views/content/BlockItemList.vue'),
        meta: { title: 'menu.content.blockItem', requiresPermission: 'blockItem:list' },
      },
      { path: 'dict', name: 'DictList', component: () => import('@/views/content/DictList.vue'), meta: { title: 'menu.content.dict', requiresPermission: 'dict:list' } },
      {
        path: 'attachment',
        name: 'AttachmentList',
        component: () => import('@/views/content/AttachmentList.vue'),
        meta: { title: 'menu.content.attachment', requiresPermission: 'attachment:list' },
      },
      {
        path: 'generator',
        name: 'GeneratorForm',
        component: () => import('@/views/content/GeneratorForm.vue'),
        meta: { title: 'menu.content.generator', requiresPermission: 'generator:show' },
      },
    ],
  },
  {
    path: '/config',
    component: Layout,
    meta: { title: 'menu.config', icon: Tools },
    children: [
      {
        path: 'global-settings',
        name: 'GlobalSettings',
        component: () => import('@/views/config/GlobalSettings.vue'),
        meta: { title: 'menu.config.globalSettings', requiresPermission: 'config:show' },
      },
      {
        path: 'site-settings',
        name: 'SiteSettings',
        component: () => import('@/views/config/SiteSettings.vue'),
        meta: { title: 'menu.config.siteSettings', requiresPermission: 'siteSettings:show' },
      },
      { path: 'model', name: 'ModelList', component: () => import('@/views/config/ModelList.vue'), meta: { title: 'menu.config.model', requiresPermission: 'model:list' } },
      { path: 'block', name: 'BlockList', component: () => import('@/views/config/BlockList.vue'), meta: { title: 'menu.config.block', requiresPermission: 'block:list' } },
      {
        path: 'dict-type',
        name: 'DictTypeList',
        component: () => import('@/views/config/DictTypeList.vue'),
        meta: { title: 'menu.config.dictType', requiresPermission: 'dictType:list' },
      },
    ],
  },
  {
    path: '/user',
    component: Layout,
    meta: { title: 'menu.user', icon: UserFilled },
    children: [
      { path: 'user', name: 'UserList', component: () => import('@/views/user/UserList.vue'), meta: { title: 'menu.user.user', requiresPermission: 'user:list' } },
      { path: 'role', name: 'RoleList', component: () => import('@/views/user/RoleList.vue'), meta: { title: 'menu.user.role', requiresPermission: 'role:list' } },
      { path: 'org', name: 'OrgList', component: () => import('@/views/user/OrgList.vue'), meta: { title: 'menu.user.org', requiresPermission: 'org:list' } },
      { path: 'group', name: 'GroupList', component: () => import('@/views/user/GroupList.vue'), meta: { title: 'menu.user.group', requiresPermission: 'group:list' } },
    ],
  },
  {
    path: '/system',
    component: Layout,
    meta: { title: 'menu.system', icon: Operation },
    children: [
      { path: 'site', name: 'SiteList', component: () => import('@/views/Enterprise.vue'), meta: { title: 'menu.system.site', requiresPermission: 'site:list' } },
      // { path: 'task', name: 'TaskList', component: () => import('@/views/system/TaskList.vue'), meta: { title: 'menu.system.task', requiresPermission: 'task:list' } },
    ],
  },
  // 404 页面配置必须放在最后
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    redirect: '/404',
    meta: { hidden: true, noCache: true },
  },
];
const router = createRouter({
  history: createWebHashHistory(),
  scrollBehavior: () => ({ top: 0 }),
  routes,
});

export default router;
