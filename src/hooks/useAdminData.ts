import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../services/adminApi';

// Dashboard Stats
export const useDashboardStats = () => {
    return useQuery({
        queryKey: ['dashboardStats'],
        queryFn: () => adminApi.getDashboardStats(),
    });
};

// Users
export const useUsers = () => {
    return useQuery({
        queryKey: ['users'],
        queryFn: () => adminApi.getUsers(),
    });
};

export const useUser = (id: number) => {
    return useQuery({
        queryKey: ['user', id],
        queryFn: () => adminApi.getUserById(id),
        enabled: !!id,
    });
};

export const useCreateUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (user: Partial<User>) => adminApi.createUser(user),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
    });
};

export const useUpdateUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, user }: { id: number; user: Partial<User> }) =>
            adminApi.updateUser(id, user),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
    });
};

export const useDeleteUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => adminApi.deleteUser(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
    });
};

export const useToggleUserStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => adminApi.toggleUserStatus(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
    });
};

// Roles
export const useRoles = () => {
    return useQuery({
        queryKey: ['roles'],
        queryFn: () => adminApi.getRoles(),
    });
};

export const useRole = (id: number) => {
    return useQuery({
        queryKey: ['role', id],
        queryFn: () => adminApi.getRoleById(id),
        enabled: !!id,
    });
};

export const useCreateRole = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (role: Partial<Role>) => adminApi.createRole(role),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['roles'] });
        },
    });
};

// Pages
export const usePages = () => {
    return useQuery({
        queryKey: ['pages'],
        queryFn: () => adminApi.getPages(),
    });
};

// Role Page Access
export const useRolePageAccess = (roleId: number) => {
    return useQuery({
        queryKey: ['rolePageAccess', roleId],
        queryFn: () => adminApi.getRolePageAccess(roleId),
        enabled: !!roleId,
    });
};

export const useUpdateRolePageAccess = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (accesses: RolePageAccess[]) => adminApi.updateRolePageAccess(accesses),
        onSuccess: (_, variables) => {
            if (variables.length > 0) {
                queryClient.invalidateQueries({ queryKey: ['rolePageAccess', variables[0].roleID] });
            }
        },
    });
};

// Audit
export const useRecentLogins = (count: number = 10) => {
    return useQuery({
        queryKey: ['recentLogins', count],
        queryFn: () => adminApi.getRecentLogins(count),
    });
};

export const useFailedLogins = (count: number = 10) => {
    return useQuery({
        queryKey: ['failedLogins', count],
        queryFn: () => adminApi.getFailedLogins(count),
    });
};

export const useActiveUsers = () => {
    return useQuery({
        queryKey: ['activeUsers'],
        queryFn: () => adminApi.getActiveUsers(),
    });
};