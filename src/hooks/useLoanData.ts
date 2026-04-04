import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../services/api';
import { HCDistribution } from '../types';

export const useHCDistribution = (asOnDate: string) => {
    return useQuery({
        queryKey: ['hcDistribution', asOnDate],
        queryFn: () => dashboardApi.getHCDistribution(asOnDate),
        enabled: !!asOnDate && asOnDate !== 'all',
    });
};