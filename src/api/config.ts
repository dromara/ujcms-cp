import axios from '@/utils/request';

export const imageUploadUrl = `${import.meta.env.VITE_BASE_API}/backend/image-upload`;
export const videoUploadUrl = `${import.meta.env.VITE_BASE_API}/backend/video-upload`;
export const docUploadUrl = `${import.meta.env.VITE_BASE_API}/backend/doc-upload`;
export const fileUploadUrl = `${import.meta.env.VITE_BASE_API}/backend/file-upload`;

export const cropImage = async (data: Record<string, any>): Promise<any> => (await axios.post('/backend/image-crop', data)).data;

export const queryGlobalModel = async (): Promise<any> => (await axios.get('/backend/core/global-settings/model')).data;
export const queryGlobalSettings = async (): Promise<any> => (await axios.get('/backend/core/global-settings')).data;
export const updateGlobalBaseSettings = async (data: Record<string, any>): Promise<any> => (await axios.post('/backend/core/global-settings/base?_method=put', data)).data;
export const updateGlobalCustomsSettings = async (data: Record<string, any>): Promise<any> => (await axios.post('/backend/core/global-settings/customs?_method=put', data)).data;
export const updateGlobalUploadSettings = async (data: Record<string, any>): Promise<any> => (await axios.post('/backend/core/global-settings/upload?_method=put', data)).data;

export const querySiteSettings = async (): Promise<any> => (await axios.get('/backend/core/site-settings')).data;
export const updateSiteBaseSettings = async (data: Record<string, any>): Promise<any> => (await axios.post('/backend/core/site-settings/base?_method=put', data)).data;
export const updateSiteCustomsSettings = async (data: Record<string, any>): Promise<any> => (await axios.post('/backend/core/site-settings/customs?_method=put', data)).data;
export const updateSiteWatermarkSettings = async (data: Record<string, any>): Promise<any> => (await axios.post('/backend/core/site-settings/watermark?_method=put', data)).data;
export const querySiteHtmlSettings = async (): Promise<any> => (await axios.get('/backend/core/site-settings/html')).data;
export const updateSiteHtmlSettings = async (data: Record<string, any>): Promise<any> => (await axios.post('/backend/core/site-settings/html?_method=put', data)).data;
export const queryCurrentSiteThemeList = async (): Promise<any> => (await axios.get('/backend/core/site/theme')).data;

export const queryModelList = async (params?: Record<string, any>): Promise<any> => (await axios.get('/backend/core/model', { params })).data;
export const queryModel = async (id: number): Promise<any> => (await axios.get(`/backend/core/model/${id}`)).data;
export const createModel = async (data: Record<string, any>): Promise<any> => (await axios.post('/backend/core/model', data)).data;
export const updateModel = async (data: Record<string, any>): Promise<any> => (await axios.post('/backend/core/model?_method=put', data)).data;
export const updateModelOrder = async (data: number[]): Promise<any> => (await axios.post('/backend/core/model/order?_method=put', data)).data;
export const deleteModel = async (data: number[]): Promise<any> => (await axios.post('/backend/core/model?_method=delete', data)).data;

export const queryDictTypeList = async (params?: Record<string, any>): Promise<any> => (await axios.get('/backend/core/dict-type', { params })).data;
export const queryDictType = async (id: number): Promise<any> => (await axios.get(`/backend/core/dict-type/${id}`)).data;
export const createDictType = async (data: Record<string, any>): Promise<any> => (await axios.post('/backend/core/dict-type', data)).data;
export const updateDictType = async (data: Record<string, any>): Promise<any> => (await axios.post('/backend/core/dict-type?_method=put', data)).data;
export const updateDictTypeOrder = async (data: number[]): Promise<any> => (await axios.post('/backend/core/dict-type/order?_method=put', data)).data;
export const deleteDictType = async (data: number[]): Promise<any> => (await axios.post('/backend/core/dict-type?_method=delete', data)).data;

export const queryDictList = async (params?: Record<string, any>): Promise<any> => (await axios.get('/backend/core/dict', { params })).data;
export const queryDict = async (id: number): Promise<any> => (await axios.get(`/backend/core/dict/${id}`)).data;
export const createDict = async (data: Record<string, any>): Promise<any> => (await axios.post('/backend/core/dict', data)).data;
export const updateDict = async (data: Record<string, any>): Promise<any> => (await axios.post('/backend/core/dict?_method=put', data)).data;
export const updateDictOrder = async (data: number[]): Promise<any> => (await axios.post('/backend/core/dict/order?_method=put', data)).data;
export const deleteDict = async (data: number[]): Promise<any> => (await axios.post('/backend/core/dict?_method=delete', data)).data;

export const queryBlockList = async (params?: Record<string, any>): Promise<any> => (await axios.get('/backend/core/block', { params })).data;
export const queryBlock = async (id: number): Promise<any> => (await axios.get(`/backend/core/block/${id}`)).data;
export const createBlock = async (data: Record<string, any>): Promise<any> => (await axios.post('/backend/core/block', data)).data;
export const updateBlock = async (data: Record<string, any>): Promise<any> => (await axios.post('/backend/core/block?_method=put', data)).data;
export const updateBlockOrder = async (data: number[]): Promise<any> => (await axios.post('/backend/core/block/order?_method=put', data)).data;
export const deleteBlock = async (data: number[]): Promise<any> => (await axios.post('/backend/core/block?_method=delete', data)).data;
