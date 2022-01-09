import { createApp } from 'vue';
import ElementPlus from 'element-plus';
import { useIcons } from '@/icons';
import { initRefreshInterval } from '@/store/useCurrentUser';
import App from './App.vue';
import router from './router';
import store from './store';

import '@/styles/tailwind.scss';

import 'element-plus/lib/theme-chalk/index.css';
// import '@/styles/element-variables.scss';
import '@/styles/index.scss';
import '@/permission';
import i18n from './i18n';

// 初始化RefreshToken自动刷新
initRefreshInterval();

const app = createApp(App)
  .use(router)
  .use(store)
  // tinymce 对话框的层级太低，必须调低 ElementPlus 的 对话框层级（默认为2000）
  .use(ElementPlus, { size: 'medium', zIndex: 500, i18n: i18n.global.t })
  .use(i18n);
useIcons(app);
app.mount('#app');
