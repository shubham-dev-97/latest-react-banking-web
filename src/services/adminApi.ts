import axios from 'axios';
import {
    DashboardStats, User, Role, Page, RolePageAccess,
    UserBranchAccess, UserRegionAccess, LoginAudit,
    BranchAccessRequest, RegionAccessRequest
} from '../types/admin';


const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://localhost:7009/api';
// const API_BASE_URL = 'https://localhost:7009/api/admin';

const api = axios.create({
     baseURL:`${API_BASE_URL}/admin`,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor for logging
api.interceptors.request.use(request => {
    console.log('🚀 Admin API Request:', request.method?.toUpperCase(), request.url);
    return request;
});

// Add response interceptor for logging
api.interceptors.response.use(
    response => {
        console.log('✅ Admin API Response:', response.status, response.config.url);
        return response;
    },
    error => {
        console.error('❌ Admin API Error:', error.message);
        return Promise.reject(error);
    }
);

export const adminApi = {
    // Dashboard Stats
    getDashboardStats: async (): Promise<DashboardStats> => {
        const response = await api.get<DashboardStats>('/dashboard-stats');
        return response.data;
    },

    // User Management
    getUsers: async (): Promise<User[]> => {
        const response = await api.get<User[]>('/users');
        return response.data;
    },

    getUserById: async (id: number): Promise<User> => {
        const response = await api.get<User>(`/users/${id}`);
        return response.data;
    },

    createUser: async (user: Partial<User>): Promise<{ message: string }> => {
        const response = await api.post<{ message: string }>('/users', user);
        return response.data;
    },

    updateUser: async (id: number, user: Partial<User>): Promise<{ message: string }> => {
        const response = await api.put<{ message: string }>(`/users/${id}`, user);
        return response.data;
    },

    deleteUser: async (id: number): Promise<{ message: string }> => {
        const response = await api.delete<{ message: string }>(`/users/${id}`);
        return response.data;
    },

    toggleUserStatus: async (id: number): Promise<{ message: string }> => {
        const response = await api.patch<{ message: string }>(`/users/${id}/toggle-status`);
        return response.data;
    },

    // Role Management
    getRoles: async (): Promise<Role[]> => {
        const response = await api.get<Role[]>('/roles');
        return response.data;
    },

    getRoleById: async (id: number): Promise<Role> => {
        const response = await api.get<Role>(`/roles/${id}`);
        return response.data;
    },

    createRole: async (role: Partial<Role>): Promise<{ message: string }> => {
        const response = await api.post<{ message: string }>('/roles', role);
        return response.data;
    },

    updateRole: async (id: number, role: Partial<Role>): Promise<{ message: string }> => {
        const response = await api.put<{ message: string }>(`/roles/${id}`, role);
        return response.data;
    },

    deleteRole: async (id: number): Promise<{ message: string }> => {
        const response = await api.delete<{ message: string }>(`/roles/${id}`);
        return response.data;
    },

    // Page Management
    getPages: async (): Promise<Page[]> => {
        const response = await api.get<Page[]>('/pages');
        return response.data;
    },

    getPageById: async (id: number): Promise<Page> => {
        const response = await api.get<Page>(`/pages/${id}`);
        return response.data;
    },

    createPage: async (page: Partial<Page>): Promise<{ message: string }> => {
        const response = await api.post<{ message: string }>('/pages', page);
        return response.data;
    },

    updatePage: async (id: number, page: Partial<Page>): Promise<{ message: string }> => {
        const response = await api.put<{ message: string }>(`/pages/${id}`, page);
        return response.data;
    },

    deletePage: async (id: number): Promise<{ message: string }> => {
        const response = await api.delete<{ message: string }>(`/pages/${id}`);
        return response.data;
    },

    // Role Page Access
    getRolePageAccess: async (roleId: number): Promise<RolePageAccess[]> => {
        const response = await api.get<RolePageAccess[]>(`/role-access/${roleId}`);
        return response.data;
    },

    updateRolePageAccess: async (accesses: RolePageAccess[]): Promise<{ message: string }> => {
        const response = await api.put<{ message: string }>('/role-access', accesses);
        return response.data;
    },

    // User Branch Access
    getUserBranchAccess: async (userId: number): Promise<UserBranchAccess[]> => {
        const response = await api.get<UserBranchAccess[]>(`/users/${userId}/branch-access`);
        return response.data;
    },

    assignUserBranchAccess: async (userId: number, request: BranchAccessRequest): Promise<{ message: string }> => {
        const response = await api.post<{ message: string }>(`/users/${userId}/branch-access`, request);
        return response.data;
    },

    removeUserBranchAccess: async (userId: number, branchId: number): Promise<{ message: string }> => {
        const response = await api.delete<{ message: string }>(`/users/${userId}/branch-access/${branchId}`);
        return response.data;
    },

    // User Region Access
    getUserRegionAccess: async (userId: number): Promise<UserRegionAccess[]> => {
        const response = await api.get<UserRegionAccess[]>(`/users/${userId}/region-access`);
        return response.data;
    },

    assignUserRegionAccess: async (userId: number, request: RegionAccessRequest): Promise<{ message: string }> => {
        const response = await api.post<{ message: string }>(`/users/${userId}/region-access`, request);
        return response.data;
    },

    removeUserRegionAccess: async (userId: number, regionId: number): Promise<{ message: string }> => {
        const response = await api.delete<{ message: string }>(`/users/${userId}/region-access/${regionId}`);
        return response.data;
    },

    // Audit & Monitoring
    getRecentLogins: async (count: number): Promise<LoginAudit[]> => {
        const response = await api.get<LoginAudit[]>(`/recent-logins/${count}`);
        return response.data;
    },

    getFailedLogins: async (count: number): Promise<LoginAudit[]> => {
        const response = await api.get<LoginAudit[]>(`/failed-logins/${count}`);
        return response.data;
    },

    getActiveUsers: async (): Promise<User[]> => {
        const response = await api.get<User[]>('/active-users');
        return response.data;
    },

    
};