import React, { createContext, useContext, ReactNode } from 'react';

// Define the shape of our shared data
interface SharedDataContextType {
    // Summary Data (for Summary page)
    summary: any[];
    summaryLoading: boolean;
    
    // Deposit Data (for Deposit page)
    depositData: any[];
    depositLoading: boolean;
    
    // Loan Data (for Loan page)
    loanData: any[];
    loanLoading: boolean;
    
    // Customer Summary (for Home page)
    customerSummary: any;
    
    // Deposit Opening Summary (for Home page)
    depositOpening: any;
    
    // NPA Summary (for Home page)
    npaSummary: any;
    
    // HC Distribution (for Home page)
    hcData: any;
    
    // Monthly Trend (for Home page)
    monthlyTrend: any;
    
    // Home KPI (for Home page)
    homeKpi: any;
    
    // Filters
    branchCode: string;
    setBranchCode: (code: string) => void;
    year: number;
    setYear: (year: number) => void;
    selectedDate: string;
    setSelectedDate: (date: string) => void;
    availableDates: string[];
    datesLoading: boolean;
}

const DataContext = createContext<SharedDataContextType | undefined>(undefined);

export const useSharedData = () => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useSharedData must be used within DataProvider');
    }
    return context;
};

interface DataProviderProps {
    children: ReactNode;
    value: SharedDataContextType;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children, value }) => {
    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    );
};