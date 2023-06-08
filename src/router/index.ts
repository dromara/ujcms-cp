import { Component } from 'vue';
import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import { Document, Tools, UserFilled, Operation, Tickets, Connection, Folder } from '@element-plus/icons-vue';
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
  { path: '/refresh', component: () => import('@/views/RefreshPage.vue'), meta: { hidden: true, noCache: true } },
  { path: '/login', component: () => import('@/views/LoginPage.vue'), meta: { hidden: true, noCache: true } },
  { path: '/404', component: () => import('@/views/404.vue'), meta: { hidden: true, noCache: true } },
  { path: '/403', component: () => import('@/views/403.vue'), meta: { hidden: true, noCache: true } },
  {
    path: '',
    component: Layout,
    meta: { hidden: true },
    children: [{ path: '', name: 'HomePage', component: () => import('@/views/HomePage.vue'), meta: { title: 'menu.homepage', requiresPermission: 'backend' } }],
  },
  {
    path: '/content',
    component: Layout,
    meta: { title: 'menu.content', icon: Document, requiresPermission: 'menu.content' },
    children: [
      {
        path: 'article',
        name: 'ArticleList',
        component: () => import('@/views/content/ArticleList.vue'),
        meta: { title: 'menu.content.article', requiresPermission: 'article:page' },
      },
      {
        path: 'article-review',
        name: 'ArticleReviewList',
        component: () => import('@/views/EnterprisePage.vue'),
        meta: { title: 'menu.content.articleReview', requiresPermission: 'articleReview:page' },
      },
      {
        path: 'channel',
        name: 'ChannelList',
        component: () => import('@/views/content/ChannelList.vue'),
        meta: { title: 'menu.content.channel', requiresPermission: 'channel:page' },
      },
      {
        path: 'block-item',
        name: 'BlockItemList',
        component: () => import('@/views/content/BlockItemList.vue'),
        meta: { title: 'menu.content.blockItem', requiresPermission: 'blockItem:page' },
      },
      { path: 'dict', name: 'DictList', component: () => import('@/views/content/DictList.vue'), meta: { title: 'menu.content.dict', requiresPermission: 'dict:page' } },
      { path: 'tag', name: 'TagList', component: () => import('@/views/content/TagList.vue'), meta: { title: 'menu.content.tag', requiresPermission: 'tag:page' } },
      {
        path: 'attachment',
        name: 'AttachmentList',
        component: () => import('@/views/content/AttachmentList.vue'),
        meta: { title: 'menu.content.attachment', requiresPermission: 'attachment:page' },
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
    path: '/interaction',
    component: Layout,
    meta: { title: 'menu.interaction', icon: Connection, requiresPermission: 'menu.interaction' },
    children: [
      {
        path: 'message-board',
        name: 'MessageBoardList',
        component: () => import('@/views/EnterprisePage.vue'),
        meta: { title: 'menu.interaction.messageBoard', requiresPermission: 'messageBoard:page' },
      },
    ],
  },
  {
    path: '/file',
    component: Layout,
    meta: { title: 'menu.file', icon: Folder, requiresPermission: 'menu.file' },
    children: [
      {
        path: 'web-file-template',
        name: 'WebFileTemplateList',
        component: () => import('@/views/file/WebFileTemplateList.vue'),
        meta: { title: 'menu.file.webFileTemplate', requiresPermission: 'webFileTemplate:page' },
      },
      {
        path: 'web-file-upload',
        name: 'WebFileUploadList',
        component: () => import('@/views/file/WebFileUploadList.vue'),
        meta: { title: 'menu.file.webFileUpload', requiresPermission: 'webFileUpload:page' },
      },
      {
        path: 'web-file-html',
        name: 'WebFileHtmlList',
        component: () => import('@/views/file/WebFileHtmlList.vue'),
        meta: { title: 'menu.file.webFileHtml', requiresPermission: 'webFileHtml:page' },
      },
    ],
  },
  {
    path: '/config',
    component: Layout,
    meta: { title: 'menu.config', icon: Tools, requiresPermission: 'menu.config' },
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
      { path: 'model', name: 'ModelList', component: () => import('@/views/config/ModelList.vue'), meta: { title: 'menu.config.model', requiresPermission: 'model:page' } },
      { path: 'block', name: 'BlockList', component: () => import('@/views/config/BlockList.vue'), meta: { title: 'menu.config.block', requiresPermission: 'block:page' } },
      {
        path: 'dict-type',
        name: 'DictTypeList',
        component: () => import('@/views/config/DictTypeList.vue'),
        meta: { title: 'menu.config.dictType', requiresPermission: 'dictType:page' },
      },
    ],
  },
  {
    path: '/stat',
    component: Layout,
    meta: { title: 'menu.stat', icon: UserFilled, requiresPermission: 'menu.stat' },
    children: [
      {
        path: 'visit-trend',
        name: 'VisitTrend',
        component: () => import('@/views/stat/VisitTrend.vue'),
        meta: { title: 'menu.stat.visitTrend', requiresPermission: 'visitTrend:page' },
      },
      {
        path: 'visited-page',
        name: 'VisitedPage',
        component: () => import('@/views/EnterprisePage.vue'),
        meta: { title: 'menu.stat.visitedPage', requiresPermission: 'visitedPage:page' },
      },
      {
        path: 'entry-page',
        name: 'EntryPage',
        component: () => import('@/views/EnterprisePage.vue'),
        meta: { title: 'menu.stat.entryPage', requiresPermission: 'entryPage:page' },
      },
      {
        path: 'visit-source',
        name: 'VisitSource',
        component: () => import('@/views/EnterprisePage.vue'),
        meta: { title: 'menu.stat.visitSource', requiresPermission: 'visitSource:page' },
      },
      {
        path: 'visit-visitor',
        name: 'VisitVisitor',
        component: () => import('@/views/stat/VisitVisitor.vue'),
        meta: { title: 'menu.stat.visitVisitor', requiresPermission: 'visitVisitor:page' },
      },
      {
        path: 'visit-region',
        name: 'VisitRegion',
        component: () => import('@/views/stat/VisitRegion.vue'),
        meta: { title: 'menu.stat.visitRegion', requiresPermission: 'visitRegion:page' },
      },
      {
        path: 'visit-env',
        name: 'VisitEnv',
        component: () => import('@/views/EnterprisePage.vue'),
        meta: { title: 'menu.stat.visitEnv', requiresPermission: 'visitEnv:page' },
      },
    ],
  },
  {
    path: '/user',
    component: Layout,
    meta: { title: 'menu.user', icon: UserFilled, requiresPermission: 'menu.user' },
    children: [
      { path: 'user', name: 'UserList', component: () => import('@/views/user/UserList.vue'), meta: { title: 'menu.user.user', requiresPermission: 'user:page' } },
      { path: 'role', name: 'RoleList', component: () => import('@/views/user/RoleList.vue'), meta: { title: 'menu.user.role', requiresPermission: 'role:page' } },
      { path: 'org', name: 'OrgList', component: () => import('@/views/user/OrgList.vue'), meta: { title: 'menu.user.org', requiresPermission: 'org:page' } },
      { path: 'group', name: 'GroupList', component: () => import('@/views/user/GroupList.vue'), meta: { title: 'menu.user.group', requiresPermission: 'group:page' } },
    ],
  },
  {
    path: '/log',
    component: Layout,
    meta: { title: 'menu.log', icon: Tickets, requiresPermission: 'menu.log' },
    children: [
      {
        path: 'short-message',
        name: 'ShortMessageList',
        component: () => import('@/views/log/ShortMessageList.vue'),
        meta: { title: 'menu.log.shortMessage', requiresPermission: 'shortMessage:page' },
      },
      {
        path: 'login-log',
        name: 'LoginLogList',
        component: () => import('@/views/EnterprisePage.vue'),
        meta: { title: 'menu.log.loginLog', requiresPermission: 'loginLog:page' },
      },
      {
        path: 'operation-log',
        name: 'OperationLogList',
        component: () => import('@/views/EnterprisePage.vue'),
        meta: { title: 'menu.log.operationLog', requiresPermission: 'operationLog:page' },
      },
    ],
  },
  {
    path: '/system',
    component: Layout,
    meta: { title: 'menu.system', icon: Operation, requiresPermission: 'menu.system' },
    children: [
      { path: 'site', name: 'SiteList', component: () => import('@/views/EnterprisePage.vue'), meta: { title: 'menu.system.site', requiresPermission: 'site:page' } },
      {
        path: 'process-model',
        name: 'ProcessModelList',
        component: () => import('@/views/EnterprisePage.vue'),
        meta: { title: 'menu.system.processModel', requiresPermission: 'processModel:page' },
      },
      {
        path: 'process-instance',
        name: 'ProcessInstanceList',
        component: () => import('@/views/EnterprisePage.vue'),
        meta: { title: 'menu.system.processInstance', requiresPermission: 'processInstance:page' },
      },
      {
        path: 'process-history',
        name: 'ProcessHistoryList',
        component: () => import('@/views/EnterprisePage.vue'),
        meta: { title: 'menu.system.processHistory', requiresPermission: 'processHistory:page' },
      },
      // { path: 'task', name: 'TaskList', component: () => import('@/views/system/TaskList.vue'), meta: { title: 'menu.system.task', requiresPermission: 'task:page' } },
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
