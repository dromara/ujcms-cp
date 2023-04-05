import axios from '@/utils/request';

export const updatePassword = async (data: Record<string, any>): Promise<any> => (await axios.post('/backend/core/personal/password?_method=put', data)).data;

export const queryMachineCode = async (): Promise<any> => (await axios.get('/backend/core/machine/code')).data;
export const queryMachineLicense = async (): Promise<any> => (await axios.get('/backend/core/machine/license')).data;

export const queryHomepageEnvironment = async (): Promise<any> => (await axios.get('/backend/core/homepage/environment')).data;
export const queryHomepageGeneratedKey = async (): Promise<any> => (await axios.get('/backend/core/homepage/generated-key')).data;
