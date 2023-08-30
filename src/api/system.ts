import axios from '@/utils/request';

export const queryCurrentSite = async (): Promise<any> => (await axios.get('/backend/core/site/current')).data;

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

export const queryProcessModelList = async (params?: Record<string, any>): Promise<any> => (await axios.get('/backend/core/process-model', { params })).data;
export const queryProcessModel = async (id: string): Promise<any> => (await axios.get(`/backend/core/process-model/${id}`)).data;
export const queryProcessModelXml = async (id: string): Promise<any> => (await axios.get(`/backend/core/process-model/xml/${id}`)).data;
export const createProcessModel = async (data: Record<string, any>): Promise<any> => (await axios.post('/backend/core/process-model', data)).data;
export const updateProcessModel = async (data: Record<string, any>): Promise<any> => (await axios.post('/backend/core/process-model?_method=put', data)).data;
export const updateProcessModelXml = async (data: Record<string, any>): Promise<any> => (await axios.post('/backend/core/process-model/xml?_method=put', data)).data;
export const validateProcessModelXml = async (xml: string): Promise<any> =>
  (await axios.post('/backend/core/process-model/xml/validate', xml, { headers: { 'Content-Type': 'text/plain' } })).data;
export const deployProcessModel = async (id: string): Promise<any> => (await axios.post(`/backend/core/process-model/deploy/${id}`)).data;
export const deleteProcessModel = async (data: string[]): Promise<any> => (await axios.post('/backend/core/process-model?_method=delete', data)).data;

export const queryProcessDefinitionList = async (params?: Record<string, any>): Promise<any> => (await axios.get('/backend/core/process-definition', { params })).data;
export const queryProcessDefinitionXml = async (id: string): Promise<any> => (await axios.get(`/backend/core/process-definition/xml/${id}`)).data;
export const deleteProcessDefinition = async (data: string[]): Promise<any> => (await axios.post('/backend/core/process-definition?_method=delete', data)).data;

export const queryProcessInstanceList = async (params?: Record<string, any>): Promise<any> => (await axios.get('/backend/core/process-instance', { params })).data;
export const queryProcessTaskList = async (instanceId: string): Promise<any> => (await axios.get(`/backend/core/process-instance/task/${instanceId}`)).data;
export const deleteProcessInstance = async (data: string[]): Promise<any> => (await axios.post('/backend/core/process-instance?_method=delete', data)).data;

export const queryProcessHistoryList = async (params?: Record<string, any>): Promise<any> => (await axios.get('/backend/core/process-history', { params })).data;
export const deleteProcessHistory = async (data: string[]): Promise<any> => (await axios.post('/backend/core/process-history?_method=delete', data)).data;

export const querySensitiveWordPage = async (params?: Record<string, any>): Promise<any> => (await axios.get('/backend/core/sensitive-word', { params })).data;
export const querySensitiveWord = async (id: number): Promise<any> => (await axios.get(`/backend/core/sensitive-word/${id}`)).data;
export const createSensitiveWord = async (data: Record<string, any>): Promise<any> => (await axios.post('/backend/core/sensitive-word', data)).data;
export const updateSensitiveWord = async (data: Record<string, any>): Promise<any> => (await axios.post('/backend/core/sensitive-word?_method=put', data)).data;
export const deleteSensitiveWord = async (data: number[]): Promise<any> => (await axios.post('/backend/core/sensitive-word?_method=delete', data)).data;
export const validateSensitiveWord = async (data: Record<string, any>): Promise<any> => (await axios.post('/backend/core/sensitive-word/validate-sensitive-word', data)).data;

export const queryErrorWordPage = async (params?: Record<string, any>): Promise<any> => (await axios.get('/backend/core/error-word', { params })).data;
export const queryErrorWord = async (id: number): Promise<any> => (await axios.get(`/backend/core/error-word/${id}`)).data;
export const createErrorWord = async (data: Record<string, any>): Promise<any> => (await axios.post('/backend/core/error-word', data)).data;
export const updateErrorWord = async (data: Record<string, any>): Promise<any> => (await axios.post('/backend/core/error-word?_method=put', data)).data;
export const deleteErrorWord = async (data: number[]): Promise<any> => (await axios.post('/backend/core/error-word?_method=delete', data)).data;
export const validateErrorWord = async (data: Record<string, any>): Promise<any> => (await axios.post('/backend/core/error-word/validate-error-word', data)).data;
