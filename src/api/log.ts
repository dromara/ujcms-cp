import axios from '@/utils/request';

export const queryShortMessagePage = async (params?: Record<string, any>): Promise<any> => (await axios.get('/backend/core/short-message', { params })).data;
export const queryShortMessage = async (id: number): Promise<any> => (await axios.get(`/backend/core/short-message/${id}`)).data;
export const createShortMessage = async (data: Record<string, any>): Promise<any> => (await axios.post('/backend/core/short-message', data)).data;
export const updateShortMessage = async (data: Record<string, any>): Promise<any> => (await axios.post('/backend/core/short-message?_method=put', data)).data;
export const deleteShortMessage = async (data: number[]): Promise<any> => (await axios.post('/backend/core/short-message?_method=delete', data)).data;

export const queryLoginLogPage = async (params?: Record<string, any>): Promise<any> => (await axios.get('/backend/core/login-log', { params })).data;
export const queryLoginLog = async (id: number): Promise<any> => (await axios.get(`/backend/core/login-log/${id}`)).data;
export const createLoginLog = async (data: Record<string, any>): Promise<any> => (await axios.post('/backend/core/login-log', data)).data;
export const updateLoginLog = async (data: Record<string, any>): Promise<any> => (await axios.post('/backend/core/login-log?_method=put', data)).data;
export const deleteLoginLog = async (data: number[]): Promise<any> => (await axios.post('/backend/core/login-log?_method=delete', data)).data;
