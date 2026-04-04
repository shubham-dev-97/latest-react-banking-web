import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../services/api';
import { HomeCustomerSummary } from '../types';

export const useHomeCustomerSummary = (asOnDate?: string) => {
    // If no date provided, use '2025-03-31'
    const dateToUse = asOnDate || '2025-03-31';
    
    return useQuery({
        queryKey: ['homeCustomerSummary', dateToUse],
        queryFn: () => dashboardApi.getHomeCustomerSummary(dateToUse),
    });
};

export const useAvailableDates = () => {
    return useQuery({
        queryKey: ['availableDates'],
        queryFn: () => dashboardApi.getAvailableDates(),
    });
};