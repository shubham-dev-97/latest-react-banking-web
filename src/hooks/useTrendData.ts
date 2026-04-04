import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../services/api';
import { DepositTrend, LoanTrend } from '../types';

export const useDepositTrend = (asOnDate: string) => {
    return useQuery({
        queryKey: ['depositTrend', asOnDate],
        queryFn: () => dashboardApi.getDepositTrend(asOnDate),
        enabled: !!asOnDate && asOnDate !== 'all',
    });
};

export const useLoanTrend = (asOnDate: string) => {
    return useQuery({
        queryKey: ['loanTrend', asOnDate],
        queryFn: () => dashboardApi.getLoanTrend(asOnDate),
        enabled: !!asOnDate && asOnDate !== 'all',
    });
};