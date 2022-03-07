import axios from '@/utils/request';

export const updatePassword = async (data: Record<string, any>): Promise<any> => (await axios.post('/backend/core/personal/password?_method=put', data)).data;
export const passwordValidation = async (password?: string): Promise<any> => (await axios.get('/backend/core/personal/password-validation', { params: { password } })).data;
