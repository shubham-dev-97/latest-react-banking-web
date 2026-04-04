import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../services/api';
import { CASASummary } from '../types';

export const useCASASummary = (asOnDate: string) => {
    return useQuery({
        queryKey: ['casaSummary', asOnDate],
        queryFn: () => dashboardApi.getCASASummary(asOnDate),
        enabled: !!asOnDate && asOnDate !== 'all',
    });
};