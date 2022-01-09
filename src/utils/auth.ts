import Cookies from 'js-cookie';

const JWT_ACCESS_TOKEN = 'jwt-access-token';
const JWT_ACCESS_AT = 'jwt-access-at';
const JWT_REFRESH_TOKEN = 'jwt-refresh-token';
const JWT_REFRESH_AT = 'jwt-refresh-at';
const JWT_SESSION_TIMEOUT = 'jwt-session-timeout';

export const getAccessToken = () => Cookies.get(JWT_ACCESS_TOKEN);
export const setAccessToken = (token: string) => Cookies.set(JWT_ACCESS_TOKEN, token);
export const removeAccessToken = () => Cookies.remove(JWT_ACCESS_TOKEN);

export const getRefreshToken = () => Cookies.get(JWT_REFRESH_TOKEN);
export const setRefreshToken = (token: string) => Cookies.set(JWT_REFRESH_TOKEN, token);
export const removeRefreshToken = () => Cookies.remove(JWT_REFRESH_TOKEN);

export const getRefreshAt = (): number => {
  const refreshAt = Cookies.get(JWT_REFRESH_AT);
  return refreshAt ? Number(refreshAt) : 0;
};
export const setRefreshAt = (refreshAt: number) => Cookies.set(JWT_REFRESH_AT, String(refreshAt));
export const removeRefreshAt = () => Cookies.remove(JWT_REFRESH_AT);

export const getAccessAt = (): number => {
  const accessAt = Cookies.get(JWT_ACCESS_AT);
  return accessAt ? Number(accessAt) : 0;
};
export const setAccessAt = (accessAt: number) => Cookies.set(JWT_ACCESS_AT, String(accessAt));
export const removeAccessAt = () => Cookies.remove(JWT_ACCESS_AT);

export const getSessionTimeout = (): number => {
  const sessionTimeout = Cookies.get(JWT_SESSION_TIMEOUT);
  // 默认 30 分钟
  return sessionTimeout ? Number(sessionTimeout) : 30;
};
export const setSessionTimeout = (sessionTimeout: number) => Cookies.set(JWT_SESSION_TIMEOUT, String(sessionTimeout));
export const removeSessionTimeout = () => Cookies.remove(JWT_SESSION_TIMEOUT);

export const getAuthHeaders = () => {
  const accessToken = getAccessToken();
  return { Authorization: accessToken ? `Bearer ${accessToken}` : '' };
};
