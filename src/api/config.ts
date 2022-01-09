import axios from '@/utils/request';

export const imageUploadUrl = `${process.env.VUE_APP_BASE_API}/backend/image-upload`;
export const videoUploadUrl = `${process.env.VUE_APP_BASE_API}/backend/video-upload`;
export const docUploadUrl = `${process.env.VUE_APP_BASE_API}/backend/doc-upload`;
export const fileUploadUrl = `${process.env.VUE_APP_BASE_API}/backend/file-upload`;
export const cropImage = async (data: any) => (await axios.post('/backend/image-crop', data)).data;

export const queryGlobalModel = async () => (await axios.get('/backend/core/global-settings/model')).data;
export const queryGlobalSettings = async () => (await axios.get('/backend/core/global-settings')).data;
export const updateGlobalSettings = async (data: any) => (await axios.post('/backend/core/global-settings?_method=put', data)).data;

export const querySiteSettings = async () => (await axios.get('/backend/core/site-settings')).data;
export const updateSiteSettings = async (data: any) => (await axios.post('/backend/core/site-settings?_method=put', data)).data;
export const queryCurrentSiteThemeList = async () => (await axios.get('/backend/core/site/theme')).data;

export const queryModelList = async (params?: any) => (await axios.get('/backend/core/model', { params })).data;
export const queryModel = async (id: number) => (await axios.get(`/backend/core/model/${id}`)).data;
export const createModel = async (data: any) => (await axios.post('/backend/core/model', data)).data;
export const updateModel = async (data: any) => (await axios.post('/backend/core/model?_method=put', data)).data;
export const updateModelOrder = async (data: number[]) => (await axios.post('/backend/core/model/order?_method=put', data)).data;
export const deleteModel = async (data: number[]) => (await axios.post('/backend/core/model?_method=delete', data)).data;

export const queryDictTypeList = async (params?: any) => (await axios.get('/backend/core/dict-type', { params })).data;
export const queryDictType = async (id: number) => (await axios.get(`/backend/core/dict-type/${id}`)).data;
export const createDictType = async (data: any) => (await axios.post('/backend/core/dict-type', data)).data;
export const updateDictType = async (data: any) => (await axios.post('/backend/core/dict-type?_method=put', data)).data;
export const updateDictTypeOrder = async (data: number[]) => (await axios.post('/backend/core/dict-type/order?_method=put', data)).data;
export const deleteDictType = async (data: number[]) => (await axios.post('/backend/core/dict-type?_method=delete', data)).data;

export const queryDictList = async (params?: any) => (await axios.get('/backend/core/dict', { params })).data;
export const queryDict = async (id: number) => (await axios.get(`/backend/core/dict/${id}`)).data;
export const createDict = async (data: any) => (await axios.post('/backend/core/dict', data)).data;
export const updateDict = async (data: any) => (await axios.post('/backend/core/dict?_method=put', data)).data;
export const updateDictOrder = async (data: number[]) => (await axios.post('/backend/core/dict/order?_method=put', data)).data;
export const deleteDict = async (data: number[]) => (await axios.post('/backend/core/dict?_method=delete', data)).data;

export const queryBlockList = async (params?: any) => (await axios.get('/backend/core/block', { params })).data;
export const queryBlock = async (id: number) => (await axios.get(`/backend/core/block/${id}`)).data;
export const createBlock = async (data: any) => (await axios.post('/backend/core/block', data)).data;
export const updateBlock = async (data: any) => (await axios.post('/backend/core/block?_method=put', data)).data;
export const updateBlockOrder = async (data: number[]) => (await axios.post('/backend/core/block/order?_method=put', data)).data;
export const deleteBlock = async (data: number[]) => (await axios.post('/backend/core/block?_method=delete', data)).data;
