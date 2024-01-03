import { createApp } from 'vue';
import ElementPlus from 'element-plus';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import { initRefreshInterval } from '@/stores/useCurrentUser';
import { useSysConfigStore } from '@/stores/sysConfigStore';
import App from './App.vue';
import router from './router';
import i18n from './i18n';
import '@/permission';

import '@/styles/tailwind.scss';
import '@/styles/element-plus.scss';
import '@/styles/index.scss';

// 初始化RefreshToken自动刷新
initRefreshInterval();

const pinia = createPinia().use(piniaPluginPersistedstate);
const app = createApp(App)
  .use(router)
  .use(pinia)
  // tinymce 对话框的层级太低，必须调低 ElementPlus 的 对话框层级（默认为2000）
  .use(ElementPlus, { zIndex: 500 })
  .use(i18n);
app.mount('#app');

// 初始化系统配置
useSysConfigStore().initConfig();
