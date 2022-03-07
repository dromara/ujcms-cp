import axios from '@/utils/request';

export const queryOrgList = async (params?: Record<string, any>): Promise<any> => (await axios.get('/backend/core/org', { params })).data;
export const queryOrg = async (id: number): Promise<any> => (await axios.get(`/backend/core/org/${id}`)).data;
export const createOrg = async (data: Record<string, any>): Promise<any> => (await axios.post('/backend/core/org', data)).data;
export const updateOrg = async (data: Record<string, any>): Promise<any> => (await axios.post('/backend/core/org?_method=put', data)).data;
export const updateOrgOrder = async (data: number[]): Promise<any> => (await axios.post('/backend/core/org/order?_method=put', data)).data;
export const deleteOrg = async (data: number[]): Promise<any> => (await axios.post('/backend/core/org?_method=delete', data)).data;

export const queryRoleList = async (params?: Record<string, any>): Promise<any> => (await axios.get('/backend/core/role', { params })).data;
export const queryRole = async (id: number): Promise<any> => (await axios.get(`/backend/core/role/${id}`)).data;
export const createRole = async (data: Record<string, any>): Promise<any> => (await axios.post('/backend/core/role', data)).data;
export const updateRole = async (data: Record<string, any>): Promise<any> => (await axios.post('/backend/core/role?_method=put', data)).data;
export const updateRoleOrder = async (data: number[]): Promise<any> => (await axios.post('/backend/core/role/order?_method=put', data)).data;
export const deleteRole = async (data: number[]): Promise<any> => (await axios.post('/backend/core/role?_method=delete', data)).data;

export const queryGroupList = async (params?: Record<string, any>): Promise<any> => (await axios.get('/backend/core/group', { params })).data;
export const queryGroup = async (id: number): Promise<any> => (await axios.get(`/backend/core/group/${id}`)).data;
export const createGroup = async (data: Record<string, any>): Promise<any> => (await axios.post('/backend/core/group', data)).data;
export const updateGroup = async (data: Record<string, any>): Promise<any> => (await axios.post('/backend/core/group?_method=put', data)).data;
export const updateGroupOrder = async (data: number[]): Promise<any> => (await axios.post('/backend/core/group/order?_method=put', data)).data;
export const deleteGroup = async (data: number[]): Promise<any> => (await axios.post('/backend/core/group?_method=delete', data)).data;

export const queryUserPage = async (params?: Record<string, any>): Promise<any> => (await axios.get('/backend/core/user', { params })).data;
export const queryUser = async (id: number): Promise<any> => (await axios.get(`/backend/core/user/${id}`)).data;
export const createUser = async (data: Record<string, any>): Promise<any> => (await axios.post('/backend/core/user', data)).data;
export const updateUser = async (data: Record<string, any>): Promise<any> => (await axios.post('/backend/core/user?_method=put', data)).data;
export const deleteUser = async (data: number[]): Promise<any> => (await axios.post('/backend/core/user?_method=delete', data)).data;
export const usernameValidation = async (username?: string): Promise<any> => (await axios.get('/backend/core/user/username-validation', { params: { username } })).data;
export const emailValidation = async (email?: string): Promise<any> => (await axios.get('/backend/core/user/email-validation', { params: { email } })).data;
export const mobileValidation = async (mobile?: string): Promise<any> => (await axios.get('/backend/core/user/mobile-validation', { params: { mobile } })).data;
