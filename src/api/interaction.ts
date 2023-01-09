import axios from '@/utils/request';

export const queryMessageBoardPage = async (params?: Record<string, any>): Promise<any> => (await axios.get('/backend/core/message-board', { params })).data;
export const queryMessageBoard = async (id: number): Promise<any> => (await axios.get(`/backend/core/message-board/${id}`)).data;
export const createMessageBoard = async (data: Record<string, any>): Promise<any> => (await axios.post('/backend/core/message-board', data)).data;
export const updateMessageBoard = async (data: Record<string, any>): Promise<any> => (await axios.post('/backend/core/message-board?_method=put', data)).data;
export const updateMessageBoardStatus = async (ids: number[], status: number): Promise<any> =>
  (await axios.post('/backend/core/message-board/status?_method=put', { ids, status })).data;
export const deleteMessageBoard = async (data: number[]): Promise<any> => (await axios.post('/backend/core/message-board?_method=delete', data)).data;
