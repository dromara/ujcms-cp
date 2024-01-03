import axios from '@/utils/request';

export const queryMessageBoardPage = async (params?: Record<string, any>): Promise<any> => (await axios.get('/backend/ext/message-board', { params })).data;
export const queryMessageBoardUnreviewedCount = async (params?: Record<string, any>): Promise<any> =>
  (await axios.get('/backend/ext/message-board/unreviewed-count', { params })).data;
export const queryMessageBoard = async (id: number): Promise<any> => (await axios.get(`/backend/ext/message-board/${id}`)).data;
export const createMessageBoard = async (data: Record<string, any>): Promise<any> => (await axios.post('/backend/ext/message-board', data)).data;
export const updateMessageBoard = async (data: Record<string, any>): Promise<any> => (await axios.post('/backend/ext/message-board?_method=put', data)).data;
export const updateMessageBoardStatus = async (ids: number[], status: number): Promise<any> =>
  (await axios.post('/backend/ext/message-board/status?_method=put', { ids, status })).data;
export const deleteMessageBoard = async (data: number[]): Promise<any> => (await axios.post('/backend/ext/message-board?_method=delete', data)).data;

export const queryVotePage = async (params?: Record<string, any>): Promise<any> => (await axios.get('/backend/ext/vote', { params })).data;
export const queryVote = async (id: number): Promise<any> => (await axios.get(`/backend/ext/vote/${id}`)).data;
export const createVote = async (data: Record<string, any>): Promise<any> => (await axios.post('/backend/ext/vote', data)).data;
export const updateVote = async (data: Record<string, any>): Promise<any> => (await axios.post('/backend/ext/vote?_method=put', data)).data;
export const deleteVote = async (data: number[]): Promise<any> => (await axios.post('/backend/ext/vote?_method=delete', data)).data;

export const querySurveyPage = async (params?: Record<string, any>): Promise<any> => (await axios.get('/backend/ext/survey', { params })).data;
export const querySurvey = async (id: number): Promise<any> => (await axios.get(`/backend/ext/survey/${id}`)).data;
export const createSurvey = async (data: Record<string, any>): Promise<any> => (await axios.post('/backend/ext/survey', data)).data;
export const updateSurvey = async (data: Record<string, any>): Promise<any> => (await axios.post('/backend/ext/survey?_method=put', data)).data;
export const deleteSurvey = async (data: number[]): Promise<any> => (await axios.post('/backend/ext/survey?_method=delete', data)).data;
export const querySurveyOptionFeedbackPage = async (params?: Record<string, any>): Promise<any> => (await axios.get('/backend/ext/survey/option-feedback', { params })).data;
export const querySurveyItemFeedbackPage = async (params?: Record<string, any>): Promise<any> => (await axios.get('/backend/ext/survey/item-feedback', { params })).data;
export const updateSurveyItemFeedback = async (data: Record<string, any>): Promise<any> => (await axios.post('/backend/ext/survey/item-feedback?_method=put', data)).data;

export const queryExamplePage = async (params?: Record<string, any>): Promise<any> => (await axios.get('/backend/ext/example', { params })).data;
export const queryExample = async (id: number): Promise<any> => (await axios.get(`/backend/ext/example/${id}`)).data;
export const createExample = async (data: Record<string, any>): Promise<any> => (await axios.post('/backend/ext/example', data)).data;
export const updateExample = async (data: Record<string, any>): Promise<any> => (await axios.post('/backend/ext/example?_method=put', data)).data;
export const deleteExample = async (data: number[]): Promise<any> => (await axios.post('/backend/ext/example?_method=delete', data)).data;
