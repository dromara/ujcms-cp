import { h } from 'vue';
import axios from 'axios';
import dayjs from 'dayjs';
import { ElMessageBox } from 'element-plus';
import { getAuthHeaders, setAccessAt } from '@/utils/auth';
import { getSiteHeaders } from '@/utils/common';
import i18n from '@/i18n';

const service = axios.create({
  baseURL: import.meta.env.VITE_BASE_API,
  timeout: 10000,
});

service.interceptors.request.use(
  (config) => {
    setAccessAt(new Date().getTime());
    // eslint-disable-next-line
    config.headers = { ...config.headers, ...getAuthHeaders(), ...getSiteHeaders() };
    return config;
  },
  (error) => Promise.reject(error),
);

service.interceptors.response.use(
  (response) => response,
  (e) => {
    const {
      response: {
        data: { timestamp, message, path, error, exception, trace },
        status,
      },
    } = e;
    const {
      global: { t },
    } = i18n;
    if (exception === 'com.ujcms.core.exception.LogicException') {
      ElMessageBox.alert(message, { type: 'warning' });
    } else if (status === 401) {
      ElMessageBox.confirm(t('confirmLogin'), { confirmButtonText: t('loginAgain'), type: 'warning' }).then(() => {
        // 未登录。刷新页面以触发登录。无法直接使用router，会导致其它函数不可用的奇怪问题。
        window.location.reload();
      });
    } else if (status === 403) {
      ElMessageBox({
        title: status,
        message: h('div', null, [h('p', { class: 'text-lg' }, t('error.forbidden')), h('p', { class: 'mt-2' }, message)]),
      });
    } else {
      ElMessageBox({
        title: t('error.title'),
        message: h('div', null, [
          h('h', null, [h('span', { class: 'text-4xl' }, status), h('span', { class: ['ml-2', 'text-xl'] }, error)]),
          h('p', { class: 'mt-2' }, dayjs(timestamp).format('YYYY-MM-DD HH:mm:ss')),
          h('p', { class: 'mt-2' }, path),
          h('p', { class: 'mt-2' }, message),
          h('p', { class: 'mt-2' }, exception),
          h('pre', { class: 'mt-2' }, [h('code', { class: ['whitespace-pre-wrap'] }, trace)]),
        ]),
        customClass: 'msgbox-error',
      });
    }
    return Promise.reject(error);
  },
);

export default service;
