import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../services/api';
import { GLDashboardSummary } from '../types';

export const useGLDashboardSummary = (asOnDate: string) => {
    return useQuery({
        queryKey: ['glDashboardSummary', asOnDate],
        queryFn: () => dashboardApi.getGLDashboardSummary(asOnDate),
        enabled: !!asOnDate && asOnDate !== 'all',
    });
};