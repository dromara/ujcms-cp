import axios from '@/utils/request';

export const queryChannelList = async (params?: any) => (await axios.get('/backend/core/channel', { params })).data;
export const queryChannel = async (id: number) => (await axios.get(`/backend/core/channel/${id}`)).data;
export const createChannel = async (data: any) => (await axios.post('/backend/core/channel', data)).data;
export const updateChannel = async (data: any) => (await axios.post('/backend/core/channel?_method=put', data)).data;
export const updateChannelOrder = async (data: number[]) => (await axios.post('/backend/core/channel/order?_method=put', data)).data;
export const deleteChannel = async (data: number[]) => (await axios.post('/backend/core/channel?_method=delete', data)).data;
export const queryChannelTemplates = async () => (await axios.get('/backend/core/channel/channel-templates')).data;
export const queryArticleTemplates = async () => (await axios.get('/backend/core/channel/article-templates')).data;

export const queryArticlePage = async (params?: any) => (await axios.get('/backend/core/article', { params })).data;
export const queryArticle = async (id: number) => (await axios.get(`/backend/core/article/${id}`)).data;
export const createArticle = async (data: any) => (await axios.post('/backend/core/article', data)).data;
export const updateArticle = async (data: any) => (await axios.post('/backend/core/article?_method=put', data)).data;
export const deleteArticle = async (data: number[]) => (await axios.post('/backend/core/article?_method=delete', data)).data;

export const queryBlockItemList = async (params?: any) => (await axios.get('/backend/core/block-item', { params })).data;
export const queryBlockItem = async (id: number) => (await axios.get(`/backend/core/block-item/${id}`)).data;
export const createBlockItem = async (data: any) => (await axios.post('/backend/core/block-item', data)).data;
export const updateBlockItem = async (data: any) => (await axios.post('/backend/core/block-item?_method=put', data)).data;
export const updateBlockItemOrder = async (data: number[]) => (await axios.post('/backend/core/block-item/order?_method=put', data)).data;
export const deleteBlockItem = async (data: number[]) => (await axios.post('/backend/core/block-item?_method=delete', data)).data;

export const fulltextReindexAll = async () => (await axios.post('/backend/core/generator/fulltext-reindex-all')).data;
export const fulltextReindexSite = async () => (await axios.post('/backend/core/generator/fulltext-reindex-site')).data;
