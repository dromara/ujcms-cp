import axios from '@/utils/request';

export const queryStorageList = async (params?: any) => (await axios.get('/backend/core/storage', { params })).data;
export const queryStorage = async (id: number) => (await axios.get(`/backend/core/storage/${id}`)).data;
export const createStorage = async (data: any) => (await axios.post('/backend/core/storage', data)).data;
export const updateStorage = async (data: any) => (await axios.post('/backend/core/storage?_method=put', data)).data;
export const updateStorageOrder = async (data: number[]) => (await axios.post('/backend/core/storage/order?_method=put', data)).data;
export const deleteStorage = async (data: number[]) => (await axios.post('/backend/core/storage?_method=delete', data)).data;

export const querySiteList = async (params?: any) => (await axios.get('/backend/core/site', { params })).data;
export const querySite = async (id: number) => (await axios.get(`/backend/core/site/${id}`)).data;
export const createSite = async (data: any) => (await axios.post('/backend/core/site', data)).data;
export const updateSite = async (data: any) => (await axios.post('/backend/core/site?_method=put', data)).data;
export const updateSiteOrder = async (data: number[]) => (await axios.post('/backend/core/site/order?_method=put', data)).data;
export const deleteSite = async (data: number[]) => (await axios.post('/backend/core/site?_method=delete', data)).data;
export const querySiteThemeList = async (id: number) => (await axios.get(`/backend/core/site/${id}/theme`)).data;

export const queryAttachmentPage = async (params?: any) => (await axios.get('/backend/core/attachment', { params })).data;
export const queryAttachment = async (id: number) => (await axios.get(`/backend/core/attachment/${id}`)).data;
export const createAttachment = async (data: any) => (await axios.post('/backend/core/attachment', data)).data;
export const updateAttachment = async (data: any) => (await axios.post('/backend/core/attachment?_method=put', data)).data;
export const deleteAttachment = async (data: number[]) => (await axios.post('/backend/core/attachment?_method=delete', data)).data;
