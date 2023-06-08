import axios from '@/utils/request';

export const queryTrendStat = async (params?: Record<string, any>): Promise<any> => (await axios.get('/backend/core/visit/trend-stat', { params })).data;
export const queryVisitedPageStat = async (params?: Record<string, any>): Promise<any> => (await axios.get('/backend/core/visit/visited-page-stat', { params })).data;
export const queryEntryPageStat = async (params?: Record<string, any>): Promise<any> => (await axios.get('/backend/core/visit/entry-page-stat', { params })).data;
export const queryVisitorStat = async (params?: Record<string, any>): Promise<any> => (await axios.get('/backend/core/visit/visitor-stat', { params })).data;
export const querySourceStat = async (params?: Record<string, any>): Promise<any> => (await axios.get('/backend/core/visit/source-stat', { params })).data;
export const queryCountryStat = async (params?: Record<string, any>): Promise<any> => (await axios.get('/backend/core/visit/country-stat', { params })).data;
export const queryProvinceStat = async (params?: Record<string, any>): Promise<any> => (await axios.get('/backend/core/visit/province-stat', { params })).data;
export const queryDeviceStat = async (params?: Record<string, any>): Promise<any> => (await axios.get('/backend/core/visit/device-stat', { params })).data;
export const queryOsStat = async (params?: Record<string, any>): Promise<any> => (await axios.get('/backend/core/visit/os-stat', { params })).data;
export const queryBrowserStat = async (params?: Record<string, any>): Promise<any> => (await axios.get('/backend/core/visit/browser-stat', { params })).data;
