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

export const accountLogin = async (data: LoginParam): Promise<any> => (await axios.post('/auth/jwt/login', data)).data;
export const accountRefreshToken = async (data: RefreshTokenParam): Promise<any> => (await axios.post('/auth/jwt/refresh-token', data)).data;
export const queryCurrentUser = async (): Promise<any> => (await axios.get('/env/current-user')).data;
export const queryCurrentSiteList = async (): Promise<any> => (await axios.get('/env/current-site-list')).data;
export const queryClientPublicKey = async (): Promise<any> => (await axios.get('/env/client-public-key')).data;
