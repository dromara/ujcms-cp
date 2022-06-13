import axios from '@/utils/request';

export const querySiteList = async (params?: Record<string, any>): Promise<any> => (await axios.get('/backend/core/site', { params })).data;
export const querySite = async (id: number): Promise<any> => (await axios.get(`/backend/core/site/${id}`)).data;
export const createSite = async (data: Record<string, any>): Promise<any> => (await axios.post('/backend/core/site', data)).data;
export const updateSite = async (data: Record<string, any>): Promise<any> => (await axios.post('/backend/core/site?_method=put', data)).data;
export const updateSiteOrder = async (data: number[]): Promise<any> => (await axios.post('/backend/core/site/order?_method=put', data)).data;
export const deleteSite = async (data: number[]): Promise<any> => (await axios.post('/backend/core/site?_method=delete', data)).data;
export const querySiteThemeList = async (id: number): Promise<any> => (await axios.get(`/backend/core/site/${id}/theme`)).data;

export const queryAttachmentPage = async (params?: Record<string, any>): Promise<any> => (await axios.get('/backend/core/attachment', { params })).data;
export const queryAttachment = async (id: number): Promise<any> => (await axios.get(`/backend/core/attachment/${id}`)).data;
export const createAttachment = async (data: Record<string, any>): Promise<any> => (await axios.post('/backend/core/attachment', data)).data;
export const updateAttachment = async (data: Record<string, any>): Promise<any> => (await axios.post('/backend/core/attachment?_method=put', data)).data;
export const deleteAttachment = async (data: number[]): Promise<any> => (await axios.post('/backend/core/attachment?_method=delete', data)).data;

export const queryTaskPage = async (params?: Record<string, any>): Promise<any> => (await axios.get('/backend/core/task', { params })).data;
export const queryTask = async (id: number): Promise<any> => (await axios.get(`/backend/core/task/${id}`)).data;
export const createTask = async (data: Record<string, any>): Promise<any> => (await axios.post('/backend/core/task', data)).data;
export const updateTask = async (data: Record<string, any>): Promise<any> => (await axios.post('/backend/core/task?_method=put', data)).data;
export const deleteTask = async (data: number[]): Promise<any> => (await axios.post('/backend/core/task?_method=delete', data)).data;
