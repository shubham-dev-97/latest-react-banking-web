import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../services/api';
import { BranchPerformanceResponse } from '../types/branchPerformance';

export const useBranchPerformance = (
    targetDate?: string,
    regionName?: string,
    performanceStatus?: string
) => {
    return useQuery({
        queryKey: ['branchPerformance', targetDate, regionName, performanceStatus],
        queryFn: () => dashboardApi.getBranchPerformanceDashboard(
            targetDate,
            regionName,
            performanceStatus
        ),
        enabled: true,
        staleTime: 5 * 60 * 1000,
    });
};