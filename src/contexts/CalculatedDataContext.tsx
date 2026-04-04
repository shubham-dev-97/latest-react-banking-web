import React, { createContext, useContext, ReactNode } from 'react';

// Define the calculated data structure
export interface LoanCalculatedData {
    totalLoanAmount: number;
    totalOutstanding: number;
    totalOverdue: number;
    avgInterestRate: number;
    totalAccounts: number;
    activeAccounts: number;
    overdueAccounts: number;
    avgLoanSize: number;
    activePercentage: number;
    overduePercentage: number;
    overdueRatio: number;
}

export interface DepositCalculatedData {
    totalBalance: number;
    totalAccounts: number;
    avgBalance: number;
    avgInterestRate: number;
    activeAccounts: number;
    dormantAccounts: number;
    closedAccounts: number;
    avgAccountSize: number;
    activePercentage: number;
}

export interface SummaryCalculatedData {
    totalLoanAmount: number;
    totalLoanAccounts: number;
    avgLoanSize: number;
    totalDepositAmount: number;
    totalDepositAccounts: number;
    avgDepositSize: number;
    totalAccounts: number;
    netPosition: number;
    loanToDepositRatio: number;
}

interface CalculatedDataContextType {
    // Loan calculated data
    loanCalculated: LoanCalculatedData;
    setLoanCalculated: (data: LoanCalculatedData) => void;
    
    // Deposit calculated data
    depositCalculated: DepositCalculatedData;
    setDepositCalculated: (data: DepositCalculatedData) => void;
    
    // Summary calculated data (derived from loan and deposit)
    summaryCalculated: SummaryCalculatedData;
}

const CalculatedDataContext = createContext<CalculatedDataContextType | undefined>(undefined);

export const useCalculatedData = () => {
    const context = useContext(CalculatedDataContext);
    if (!context) {
        throw new Error('useCalculatedData must be used within CalculatedDataProvider');
    }
    return context;
};

interface CalculatedDataProviderProps {
    children: ReactNode;
}

export const CalculatedDataProvider: React.FC<CalculatedDataProviderProps> = ({ children }) => {
    const [loanCalculated, setLoanCalculated] = useState<LoanCalculatedData>({
        totalLoanAmount: 0,
        totalOutstanding: 0,
        totalOverdue: 0,
        avgInterestRate: 0,
        totalAccounts: 0,
        activeAccounts: 0,
        overdueAccounts: 0,
        avgLoanSize: 0,
        activePercentage: 0,
        overduePercentage: 0,
        overdueRatio: 0
    });

    const [depositCalculated, setDepositCalculated] = useState<DepositCalculatedData>({
        totalBalance: 0,
        totalAccounts: 0,
        avgBalance: 0,
        avgInterestRate: 0,
        activeAccounts: 0,
        dormantAccounts: 0,
        closedAccounts: 0,
        avgAccountSize: 0,
        activePercentage: 0
    });

    // Calculate summary data from loan and deposit calculated data
    const summaryCalculated = React.useMemo(() => {
        const totalLoanAmount = loanCalculated.totalLoanAmount;
        const totalLoanAccounts = loanCalculated.totalAccounts;
        const avgLoanSize = loanCalculated.avgLoanSize;
        
        const totalDepositAmount = depositCalculated.totalBalance;
        const totalDepositAccounts = depositCalculated.totalAccounts;
        const avgDepositSize = depositCalculated.avgAccountSize;
        
        const totalAccounts = totalLoanAccounts + totalDepositAccounts;
        const netPosition = totalDepositAmount - totalLoanAmount;
        const loanToDepositRatio = totalDepositAmount > 0 
            ? (totalLoanAmount / totalDepositAmount) * 100 
            : 0;

        return {
            totalLoanAmount,
            totalLoanAccounts,
            avgLoanSize,
            totalDepositAmount,
            totalDepositAccounts,
            avgDepositSize,
            totalAccounts,
            netPosition,
            loanToDepositRatio
        };
    }, [loanCalculated, depositCalculated]);

    return (
        <CalculatedDataContext.Provider value={{
            loanCalculated,
            setLoanCalculated,
            depositCalculated,
            setDepositCalculated,
            summaryCalculated
        }}>
            {children}
        </CalculatedDataContext.Provider>
    );
};