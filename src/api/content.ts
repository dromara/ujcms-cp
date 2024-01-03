import axios from '@/utils/request';

export const jodConvertDocUrl = `${import.meta.env.VITE_BASE_API}/backend/core/jod-convert/doc`;
export const jodConvertLibraryUrl = `${import.meta.env.VITE_BASE_API}/backend/core/jod-convert/library`;
export const queryJodConvertEnabled = async (): Promise<boolean> => (await axios.get('/backend/core/jod-convert/enabled')).data;

export const queryChannelList = async (params?: Record<string, any>): Promise<any> => (await axios.get('/backend/core/channel', { params })).data;
export const queryChannel = async (id: number): Promise<any> => (await axios.get(`/backend/core/channel/${id}`)).data;
export const createChannel = async (data: Record<string, any>): Promise<any> => (await axios.post('/backend/core/channel', data)).data;
export const updateChannel = async (data: Record<string, any>): Promise<any> => (await axios.post('/backend/core/channel?_method=put', data)).data;
export const updateChannelOrder = async (data: number[]): Promise<any> => (await axios.post('/backend/core/channel/order?_method=put', data)).data;
export const deleteChannel = async (data: number[]): Promise<any> => (await axios.post('/backend/core/channel?_method=delete', data)).data;
export const queryChannelPermissions = async (): Promise<any> => (await axios.get('/backend/core/channel/channel-permissions')).data;
export const queryChannelTemplates = async (): Promise<any> => (await axios.get('/backend/core/channel/channel-templates')).data;
export const queryArticleTemplates = async (): Promise<any> => (await axios.get('/backend/core/channel/article-templates')).data;
export const channelAliasExist = async (alias?: string): Promise<any> => (await axios.get('/backend/core/channel/alias-exist', { params: { alias } })).data;

export const queryArticlePage = async (params?: Record<string, any>): Promise<any> => (await axios.get('/backend/core/article', { params })).data;
export const queryArticleRejectCount = async (params?: Record<string, any>): Promise<any> => (await axios.get('/backend/core/article/reject-count', { params })).data;
export const queryArticle = async (id: number): Promise<any> => (await axios.get(`/backend/core/article/${id}`)).data;
export const queryArticleTitleSimilarity = async (similarity: number, title: string, excludeId?: number): Promise<any> =>
  (await axios.get('/backend/core/article/title-similarity', { params: { similarity, title, excludeId } })).data;
export const createArticle = async (data: Record<string, any>): Promise<any> => (await axios.post('/backend/core/article', data)).data;
export const updateArticle = async (data: Record<string, any>): Promise<any> => (await axios.post('/backend/core/article?_method=put', data)).data;
export const updateArticleOrder = async (fromId: number, toId: number): Promise<any> => (await axios.post('/backend/core/article/update-order', { fromId, toId })).data;
export const internalPushArticle = async (data: Record<string, any>): Promise<any> => (await axios.post('/backend/core/article/internal-push', data)).data;
export const externalPushArticle = async (data: Record<string, any>): Promise<any> => (await axios.post('/backend/core/article/external-push', data)).data;
export const stickyArticle = async (ids: number[], sticky: number, stickyDate?: Date): Promise<any> =>
  (await axios.post('/backend/core/article/sticky?_method=put', { ids, sticky, stickyDate })).data;
export const deleteArticle = async (data: number[]): Promise<any> => (await axios.post('/backend/core/article/delete?_method=put', data)).data;
export const submitArticle = async (data: number[]): Promise<any> => (await axios.post('/backend/core/article/submit?_method=put', data)).data;
export const archiveArticle = async (data: number[]): Promise<any> => (await axios.post('/backend/core/article/archive?_method=put', data)).data;
export const offlineArticle = async (data: number[]): Promise<any> => (await axios.post('/backend/core/article/offline?_method=put', data)).data;
export const completelyDeleteArticle = async (data: number[]): Promise<any> => (await axios.post('/backend/core/article?_method=delete', data)).data;

export const queryArticleReviewPage = async (params?: Record<string, any>): Promise<any> => (await axios.get('/backend/core/article-review', { params })).data;
export const queryArticlePendingCount = async (params?: Record<string, any>): Promise<any> => (await axios.get('/backend/core/article-review/pending-count', { params })).data;
export const passArticle = async (data: number[]): Promise<any> => (await axios.post('/backend/core/article-review/pass?_method=put', data)).data;
export const rejectArticle = async (ids: number[], reason: string): Promise<any> => (await axios.post('/backend/core/article-review/reject?_method=put', { ids, reason })).data;

export const queryBlockItemList = async (params?: Record<string, any>): Promise<any> => (await axios.get('/backend/core/block-item', { params })).data;
export const queryBlockItem = async (id: number): Promise<any> => (await axios.get(`/backend/core/block-item/${id}`)).data;
export const createBlockItem = async (data: Record<string, any>): Promise<any> => (await axios.post('/backend/core/block-item', data)).data;
export const updateBlockItem = async (data: Record<string, any>): Promise<any> => (await axios.post('/backend/core/block-item?_method=put', data)).data;
export const updateBlockItemOrder = async (data: number[]): Promise<any> => (await axios.post('/backend/core/block-item/order?_method=put', data)).data;
export const deleteBlockItem = async (data: number[]): Promise<any> => (await axios.post('/backend/core/block-item?_method=delete', data)).data;

export const queryDictList = async (params?: Record<string, any>): Promise<any> => (await axios.get('/backend/core/dict', { params })).data;
export const queryDictListByAlias = async (alias: string, name?: string): Promise<any> => (await axios.get('/backend/core/dict/list-by-alias', { params: { alias, name } })).data;
export const queryDict = async (id: number): Promise<any> => (await axios.get(`/backend/core/dict/${id}`)).data;
export const createDict = async (data: Record<string, any>): Promise<any> => (await axios.post('/backend/core/dict', data)).data;
export const updateDict = async (data: Record<string, any>): Promise<any> => (await axios.post('/backend/core/dict?_method=put', data)).data;
export const updateDictOrder = async (data: number[]): Promise<any> => (await axios.post('/backend/core/dict/order?_method=put', data)).data;
export const deleteDict = async (data: number[]): Promise<any> => (await axios.post('/backend/core/dict?_method=delete', data)).data;

export const fulltextReindexAll = async (): Promise<any> => (await axios.post('/backend/core/generator/fulltext-reindex-all')).data;
export const fulltextReindexSite = async (): Promise<any> => (await axios.post('/backend/core/generator/fulltext-reindex-site')).data;
export const htmlAll = async (): Promise<any> => (await axios.post('/backend/core/generator/html-all')).data;
export const htmlHome = async (): Promise<any> => (await axios.post('/backend/core/generator/html-home')).data;
export const htmlChannel = async (): Promise<any> => (await axios.post('/backend/core/generator/html-channel')).data;
export const htmlArticle = async (): Promise<any> => (await axios.post('/backend/core/generator/html-article')).data;

export const queryTagPage = async (params?: Record<string, any>): Promise<any> => (await axios.get('/backend/core/tag', { params })).data;
export const queryTagList = async (params?: Record<string, any>): Promise<any> => (await axios.get('/backend/core/tag/list', { params })).data;
export const queryTag = async (id: number): Promise<any> => (await axios.get(`/backend/core/tag/${id}`)).data;
export const createTag = async (data: Record<string, any>): Promise<any> => (await axios.post('/backend/core/tag', data)).data;
export const updateTag = async (data: Record<string, any>): Promise<any> => (await axios.post('/backend/core/tag?_method=put', data)).data;
export const deleteTag = async (data: number[]): Promise<any> => (await axios.post('/backend/core/tag?_method=delete', data)).data;
