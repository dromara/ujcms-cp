import axios from '@/utils/request';

export interface LoginParam {
  username: string;
  password: string;
  browser?: boolean;
}

export interface RefreshTokenParam {
  refreshToken: string;
  browser?: boolean;
}

export const accountLogin = async (data: LoginParam) => (await axios.post('/auth/jwt/login', data)).data;
export const accountRefreshToken = async (data: RefreshTokenParam) => (await axios.post('/auth/jwt/refresh-token', data)).data;
export const queryCurrentUser = async () => (await axios.get('/user/current')).data;
