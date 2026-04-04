import axios from 'axios';
import {
    HomeFilter, HomeKpi,
    DepositFilter, DepositAnalysis,
    LoanFilter, LoanAnalysis,
    MonthlyTrendFilter, MonthlyTrend,
    SummaryFilter, BankingSummary,HomeCustomerSummary, DepositOpeningSummary,NPASummary,HCDistribution,CASASummary, GLDashboardSummary, PortfolioOverview, InterestAndOverdueKPI
} from '../types';


const API_BASE_URL = 'https://localhost:7009/api/dashboard';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const dashboardApi = {
    getHomeCustomerSummary: async (asOnDate?: string): Promise<HomeCustomerSummary> => {
    console.log('🏠 Fetching home customer summary', asOnDate ? `for date: ${asOnDate}` : 'for today');
    const params = asOnDate ? { asOnDate } : {};
    const response = await api.get<HomeCustomerSummary>('/home-customer-summary', { params });
    console.log('🏠 Home customer summary response:', response.data);
    return response.data;
    },

    getAvailableDates: async (): Promise<string[]> => {
    console.log('📅 Fetching available dates');
    const response = await api.get<string[]>('/available-dates');
    console.log('📅 Available dates:', response.data);
    return response.data;
    },


    getDepositOpeningSummary: async (asOnDate: string): Promise<DepositOpeningSummary> => {
    console.log('💰 Fetching deposit opening summary for date:', asOnDate);
    const response = await api.get<DepositOpeningSummary>('/deposit-opening-summary', { 
        params: { asOnDate } 
    });
    console.log('💰 Deposit opening summary:', response.data);
    return response.data;
},



   getNPASummary: async (asOnDate: string): Promise<NPASummary> => {
    console.log('⚠️ Fetching NPA summary for date:', asOnDate);
    const response = await api.get<NPASummary>('/npa-summary', { 
        params: { asOnDate } 
    });
    console.log('⚠️ NPA summary:', response.data);
    return response.data;
  },

  getHCDistribution: async (asOnDate: string): Promise<HCDistribution[]> => {
    console.log('📊 Fetching HC distribution for date:', asOnDate);
    const response = await api.get<HCDistribution[]>('/hc-distribution', { 
        params: { asOnDate } 
    });
    console.log('📊 HC distribution:', response.data);
    return response.data;
},


getCASASummary: async (asOnDate: string): Promise<CASASummary[]> => {
    console.log('🏦 Fetching CASA summary for date:', asOnDate);
    const response = await api.get<CASASummary[]>('/casa-summary', { 
        params: { asOnDate } 
    });
    console.log('🏦 CASA summary:', response.data);
    return response.data;
},

getGLDashboardSummary: async (asOnDate: string): Promise<GLDashboardSummary> => {
    console.log('📊 Fetching GL Dashboard summary for date:', asOnDate);
    const response = await api.get<GLDashboardSummary>('/gl-dashboard-summary', { 
        params: { asOnDate } 
    });
    console.log('📊 GL Dashboard summary:', response.data);
    return response.data;
},

getPortfolioOverview: async (asOnDate: string): Promise<PortfolioOverview> => {
    console.log('📊 Fetching portfolio overview for date:', asOnDate);
    const response = await api.get<PortfolioOverview>('/portfolio-overview', { 
        params: { asOnDate } 
    });
    console.log('📊 Portfolio overview:', response.data);
    return response.data;
},

getInterestAndOverdueKPI: async (asOnDate: string): Promise<InterestAndOverdueKPI> => {
    console.log('📈 Fetching interest and overdue KPI for date:', asOnDate);
    const response = await api.get<InterestAndOverdueKPI>('/interest-overdue-kpi', { 
        params: { asOnDate } 
    });
    console.log('📈 Interest and overdue KPI:', response.data);
    return response.data;
},

getDepositPortfolioOverview: async (asOnDate: string): Promise<DepositPortfolioOverview> => {
    console.log('💰 Fetching deposit portfolio overview for date:', asOnDate);
    const response = await api.get<DepositPortfolioOverview>('/deposit-portfolio-overview', { 
        params: { asOnDate } 
    });
    console.log('💰 Deposit portfolio overview:', response.data);
    return response.data;
},

getLoanPortfolioOverview: async (asOnDate: string): Promise<LoanPortfolioOverview> => {
    console.log('🏦 Fetching loan portfolio overview for date:', asOnDate);
    const response = await api.get<LoanPortfolioOverview>('/loan-portfolio-overview', { 
        params: { asOnDate } 
    });
    console.log('🏦 Loan portfolio overview:', response.data);
    return response.data;
},

getDepositTrend: async (asOnDate: string): Promise<DepositTrend[]> => {
    console.log('📈 Fetching deposit trend for date:', asOnDate);
    const response = await api.get<DepositTrend[]>('/deposit-trend', { 
        params: { asOnDate } 
    });
    console.log('📈 Deposit trend:', response.data);
    return response.data;
},

getLoanTrend: async (asOnDate: string): Promise<LoanTrend[]> => {
    console.log('📈 Fetching loan trend for date:', asOnDate);
    const response = await api.get<LoanTrend[]>('/loan-trend', { 
        params: { asOnDate } 
    });
    console.log('📈 Loan trend:', response.data);
    return response.data;
},
};