import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { dashboardApi } from '../services/api';
import {
    HomeFilter, DepositFilter, LoanFilter,
    MonthlyTrendFilter, SummaryFilter
} from '../types';
import { useAvailableDates } from './useCustomerData';
import { useDepositOpeningSummary } from './useDepositData';
import { useNPASummary } from './useNPAData';
import { useHCDistribution } from './useLoanData';

export const useHomeKpi = (filter?: HomeFilter) => {
    return useQuery({
        queryKey: ['homeKpi', filter],
        queryFn: () => dashboardApi.getHomeKpi(filter),
    });
};

export const useDepositAnalysis = (filter?: DepositFilter) => {
    return useQuery({
        queryKey: ['depositAnalysis', filter],
        queryFn: () => dashboardApi.getDepositAnalysis(filter),
    });
};

export const useLoanAnalysis = (filter?: LoanFilter) => {
    return useQuery({
        queryKey: ['loanAnalysis', filter],
        queryFn: () => dashboardApi.getLoanAnalysis(filter),
    });
};

export const useMonthlyTrend = (filter?: MonthlyTrendFilter) => {
    return useQuery({
        queryKey: ['monthlyTrend', filter],
        queryFn: () => dashboardApi.getMonthlyTrend(filter),
    });
};

export const useBankingSummary = (filter?: SummaryFilter) => {
    return useQuery({
        queryKey: ['bankingSummary', filter],
        queryFn: () => dashboardApi.getSummary(filter),
    });
};

export const useHomeCustomerSummary = (asOnDate?: string) => {
    // If no date provided, use '2025-03-31'
    const dateToUse = asOnDate || '2025-03-31';
    
    return useQuery({
        queryKey: ['homeCustomerSummary', dateToUse],
        queryFn: () => dashboardApi.getHomeCustomerSummary(dateToUse),
    });
};


export const usePortfolioOverview = (asOnDate: string) => {
    return useQuery({
        queryKey: ['portfolioOverview', asOnDate],
        queryFn: () => dashboardApi.getPortfolioOverview(asOnDate),
        enabled: !!asOnDate && asOnDate !== 'all',
    });
};

export const useInterestAndOverdueKPI = (asOnDate: string) => {
    return useQuery({
        queryKey: ['interestAndOverdueKPI', asOnDate],
        queryFn: () => dashboardApi.getInterestAndOverdueKPI(asOnDate),
        enabled: !!asOnDate && asOnDate !== 'all',
    });
};

export const useDepositPortfolioOverview = (asOnDate: string) => {
    return useQuery({
        queryKey: ['depositPortfolioOverview', asOnDate],
        queryFn: () => dashboardApi.getDepositPortfolioOverview(asOnDate),
        enabled: !!asOnDate && asOnDate !== 'all',
    });
};


export const useLoanPortfolioOverview = (asOnDate: string) => {
    return useQuery({
        queryKey: ['loanPortfolioOverview', asOnDate],
        queryFn: () => dashboardApi.getLoanPortfolioOverview(asOnDate),
        enabled: !!asOnDate && asOnDate !== 'all',
    });
};
// Combined hook for dashboard data
export const useDashboardData = () => {
    const [branchCode, setBranchCode] = useState<string>('');
    const [year, setYear] = useState<number>(new Date().getFullYear());
    const [selectedDate, setSelectedDate] = useState<string>('2025-03-31');

    // Fetch all data
    const { data: availableDates, isLoading: datesLoading } = useAvailableDates();
    const { data: homeKpi, isLoading: homeKpiLoading } = useHomeKpi({ branchCode, year });
    const { data: summary, isLoading: summaryLoading } = useBankingSummary({ branchCode });
    const { data: depositData, isLoading: depositLoading } = useDepositAnalysis({ branchCode, year });
    const { data: loanData, isLoading: loanLoading } = useLoanAnalysis({ branchCode, year });
    const { data: monthlyTrend, isLoading: trendLoading } = useMonthlyTrend({ year });
    const { data: customerSummary, isLoading: customerSummaryLoading } = useHomeCustomerSummary(selectedDate);
    const { data: depositOpening, isLoading: depositOpeningLoading } = useDepositOpeningSummary(selectedDate !== 'all' ? selectedDate : '');
    const { data: npaSummary, isLoading: npaLoading } = useNPASummary(selectedDate !== 'all' ? selectedDate : '');
    const { data: hcData, isLoading: hcLoading } = useHCDistribution(selectedDate !== 'all' ? selectedDate : '');

    // Set first available date as default when dates load
    useEffect(() => {
        if (availableDates && availableDates.length > 0 && !selectedDate) {
            setSelectedDate(availableDates[0]);
        }
    }, [availableDates]);

    // Update year when date changes
    useEffect(() => {
        if (selectedDate && selectedDate !== 'all') {
            const yearFromDate = parseInt(selectedDate.split('-')[0]);
            setYear(yearFromDate);
        }
    }, [selectedDate]);

    return {
        // Filters
        branchCode,
        setBranchCode,
        year,
        setYear,
        selectedDate,
        setSelectedDate,
        availableDates,
        datesLoading,
        
        // Data
        homeKpi,
        homeKpiLoading,
        summary,
        summaryLoading,
        depositData,
        depositLoading,
        loanData,
        loanLoading,
        monthlyTrend,
        trendLoading,
        customerSummary,
        customerSummaryLoading,
        depositOpening,
        depositOpeningLoading,
        npaSummary,
        npaLoading,
        hcData,
        hcLoading,
    };
};