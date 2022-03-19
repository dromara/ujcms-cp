import { reactive, readonly } from 'vue';
import { RouteRecordRaw } from 'vue-router';
import { accountLogin, accountRefreshToken, LoginParam, queryCurrentUser } from '@/api/login';
import {
  setAccessToken,
  removeAccessToken,
  getRefreshToken,
  setRefreshToken,
  getRefreshAt,
  setRefreshAt,
  getAccessAt,
  setAccessAt,
  getSessionTimeout,
  setSessionTimeout,
  removeSessionTimeout,
  removeRefreshToken,
  removeAccessAt,
  removeRefreshAt,
} from '@/utils/auth';

export interface CurrentUser {
  username?: string;
  avatar?: string;
  permissions?: string[];
  loginDate?: Date;
  loginIp?: string;
  epExcludes?: string[];
  epDisplay?: boolean;
  epRank?: number;
  epActivated?: boolean;
}

const state = reactive<CurrentUser>({});

const setCurrentUser = (user: CurrentUser): void => {
  Object.assign(state, user);
};

export const currentUser = readonly(state);

export const login = async (params: LoginParam): Promise<any> => {
  const data = await accountLogin(params);
  if (data.status === 0) {
    const { result } = data;
    const now = new Date().getTime();
    setAccessToken(result.accessToken);
    setRefreshToken(result.refreshToken);
    setSessionTimeout(result.sessionTimeout);
    setAccessAt(now);
    setRefreshAt(now);
  }
  return data;
};

export const logout = (): void => {
  removeAccessAt();
  removeRefreshAt();
  removeAccessToken();
  removeRefreshToken();
  removeSessionTimeout();
  setCurrentUser({});
};

// 刷新间隔时间。默认 5 分钟。
const interval = 5 * 60 * 1000;
let refreshInterval: any;

/**
 * RefreshToken 刷新机制。
 *
 * 1. 自动定时刷新。永不过期。
 * 2. 访问时刷新。30分钟过期。
 */
const runRefreshToken = async () => {
  const refreshToken = getRefreshToken();
  // refreshToken不存在，不刷新。
  if (!refreshToken) return;
  const accessAt = getAccessAt();
  const now = new Date().getTime();
  // 超过时间没有访问，退出登录。默认为 30 分钟。
  if (now - accessAt > getSessionTimeout() * 60 * 1000) {
    logout();
    return;
  }
  // 记录刷新时间，用于重新加载页面时，初始化Interval。
  setRefreshAt(now);
  const data = await accountRefreshToken({ refreshToken });
  if (data.status !== 0) return;
  const { result } = data;
  setAccessToken(result.accessToken);
  setRefreshToken(result.refreshToken);
};

export const initRefreshInterval = (): void => {
  let afterTime = getRefreshAt() + interval - new Date().getTime();
  if (afterTime < 0) afterTime = 0;
  setTimeout(() => {
    runRefreshToken();
    if (!refreshInterval) refreshInterval = setInterval(runRefreshToken, interval);
  }, afterTime);
};

export const fetchCurrentUser = async (): Promise<any> => {
  const user = await queryCurrentUser();
  if (user) {
    setCurrentUser({
      username: user.username,
      avatar: user.avatar,
      permissions: user.permissions,
      loginDate: user.loginDate,
      loginIp: user.loginIp,
      epExcludes: user.epExcludes,
      epDisplay: user.epDisplay,
      epRank: user.epRank,
      epActivated: user.epActivated,
    });
  } else {
    removeAccessToken();
  }
  return user;
};

function includes(arr: string[] | undefined, str: string): boolean {
  return arr?.includes(str) ?? false;
}

export const hasCurrentUser = (): boolean => state.username !== undefined;
export const isInclude = (permission: string | undefined): boolean => !permission || !includes(state.epExcludes, permission);
export const hasPermission = (permission: string | undefined): boolean => !permission || includes(state.permissions, permission);
export const perm = (permission: string | undefined): boolean => !hasPermission(permission);
export const isShowPerm = (permission: string | undefined): boolean => (state.epDisplay && !permission?.startsWith('machine:')) || isInclude(permission);
export const isShowMenu = (route: RouteRecordRaw): boolean => !route.meta?.hidden && hasPermission(route.meta?.requiresPermission) && isShowPerm(route.meta?.requiresPermission);
