import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../services/api';
import { NPASummary } from '../types';

export const useNPASummary = (asOnDate: string) => {
    return useQuery({
        queryKey: ['npaSummary', asOnDate],
        queryFn: () => dashboardApi.getNPASummary(asOnDate),
        enabled: !!asOnDate && asOnDate !== 'all',
    });
};