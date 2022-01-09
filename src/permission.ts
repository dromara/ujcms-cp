import NProgress from 'nprogress'; // progress bar
import 'nprogress/nprogress.css'; // progress bar style
import { RouteLocationNormalized } from 'vue-router';
import getPageTitle from '@/utils/getPageTitle';
import { getAccessToken } from '@/utils/auth'; // get token from cookie
import { hasCurrentUser, fetchCurrentUser, hasPermission } from '@/store/useCurrentUser';
import router from './router';

NProgress.configure({ showSpinner: false }); // NProgress Configuration

const LOGIN_PATH = '/login';

router.beforeEach(async (to: RouteLocationNormalized) => {
  const isLogin = getAccessToken() !== undefined;
  // 不需要权限
  if (!to.meta?.requiresPermission) {
    // 已登录状态访问登录页面，跳转到首页
    if (to.path === LOGIN_PATH && isLogin) return '/';
    NProgress.start();
    return true;
  }
  // 需要权限
  const toLogin = `${LOGIN_PATH}?redirect=${to.path}`;
  // 未登录，跳转到登录页面
  if (!isLogin) return toLogin;
  NProgress.start();
  if (!hasCurrentUser()) {
    const user = await fetchCurrentUser();
    // 没有获取到当前用户数据，代表accessToken已经失效，需要重新登录。
    if (!user) {
      NProgress.done();
      return toLogin;
    }
  }
  // 没有权限
  if (!hasPermission(to.meta?.requiresPermission)) {
    NProgress.done();
    return '/403';
  }
  return true;
});

router.afterEach((to: RouteLocationNormalized) => {
  // set page title
  document.title = getPageTitle(to.meta.title);
  // finish progress bar
  NProgress.done();
});
