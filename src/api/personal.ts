import axios from '@/utils/request';

export const updatePassword = async (data: any) => (await axios.post('/backend/core/personal/password?_method=put', data)).data;
export const passwordValidation = async (password?: string) => (await axios.get('/backend/core/personal/password-validation', { params: { password } })).data;
