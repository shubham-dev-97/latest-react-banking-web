import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../services/api';
import { BankKPIDashboardResponse } from '../types/bankKPI';

export const useBankKPI = (
    finYear?: string,
    yearType?: string,
    regionName?: string,
    pbrcode?: number,
    topRecords?: number
) => {
    return useQuery({
        queryKey: ['bankKPI', finYear, yearType, regionName, pbrcode, topRecords],
        queryFn: () => dashboardApi.getBankKPIDashboard(
            finYear,
            yearType,
            regionName,
            pbrcode,
            topRecords
        ),
        enabled: true,
        staleTime: 5 * 60 * 1000,
    });
};