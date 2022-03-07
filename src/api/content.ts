import axios from '@/utils/request';

export const queryChannelList = async (params?: Record<string, any>): Promise<any> => (await axios.get('/backend/core/channel', { params })).data;
export const queryChannel = async (id: number): Promise<any> => (await axios.get(`/backend/core/channel/${id}`)).data;
export const createChannel = async (data: Record<string, any>): Promise<any> => (await axios.post('/backend/core/channel', data)).data;
export const updateChannel = async (data: Record<string, any>): Promise<any> => (await axios.post('/backend/core/channel?_method=put', data)).data;
export const updateChannelOrder = async (data: number[]): Promise<any> => (await axios.post('/backend/core/channel/order?_method=put', data)).data;
export const deleteChannel = async (data: number[]): Promise<any> => (await axios.post('/backend/core/channel?_method=delete', data)).data;
export const queryChannelTemplates = async (): Promise<any> => (await axios.get('/backend/core/channel/channel-templates')).data;
export const queryArticleTemplates = async (): Promise<any> => (await axios.get('/backend/core/channel/article-templates')).data;

export const queryArticlePage = async (params?: Record<string, any>): Promise<any> => (await axios.get('/backend/core/article', { params })).data;
export const queryArticle = async (id: number): Promise<any> => (await axios.get(`/backend/core/article/${id}`)).data;
export const createArticle = async (data: Record<string, any>): Promise<any> => (await axios.post('/backend/core/article', data)).data;
export const updateArticle = async (data: Record<string, any>): Promise<any> => (await axios.post('/backend/core/article?_method=put', data)).data;
export const deleteArticle = async (data: number[]): Promise<any> => (await axios.post('/backend/core/article?_method=delete', data)).data;

export const queryBlockItemList = async (params?: Record<string, any>): Promise<any> => (await axios.get('/backend/core/block-item', { params })).data;
export const queryBlockItem = async (id: number): Promise<any> => (await axios.get(`/backend/core/block-item/${id}`)).data;
export const createBlockItem = async (data: Record<string, any>): Promise<any> => (await axios.post('/backend/core/block-item', data)).data;
export const updateBlockItem = async (data: Record<string, any>): Promise<any> => (await axios.post('/backend/core/block-item?_method=put', data)).data;
export const updateBlockItemOrder = async (data: number[]): Promise<any> => (await axios.post('/backend/core/block-item/order?_method=put', data)).data;
export const deleteBlockItem = async (data: number[]): Promise<any> => (await axios.post('/backend/core/block-item?_method=delete', data)).data;

export const fulltextReindexAll = async (): Promise<any> => (await axios.post('/backend/core/generator/fulltext-reindex-all')).data;
export const fulltextReindexSite = async (): Promise<any> => (await axios.post('/backend/core/generator/fulltext-reindex-site')).data;
export const htmlAll = async (): Promise<any> => (await axios.post('/backend/core/generator/html-all')).data;
export const htmlHome = async (): Promise<any> => (await axios.post('/backend/core/generator/html-home')).data;
export const htmlChannel = async (): Promise<any> => (await axios.post('/backend/core/generator/html-channel')).data;
export const htmlArticle = async (): Promise<any> => (await axios.post('/backend/core/generator/html-article')).data;
