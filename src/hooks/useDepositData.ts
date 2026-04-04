import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../services/api';
import { DepositOpeningSummary } from '../types';

export const useDepositOpeningSummary = (asOnDate: string) => {
    return useQuery({
        queryKey: ['depositOpeningSummary', asOnDate],
        queryFn: () => dashboardApi.getDepositOpeningSummary(asOnDate),
        enabled: !!asOnDate && asOnDate !== 'all', // Only fetch if a specific date is selected
    });
};