import React, { createContext, useState, useContext, ReactNode } from 'react';

export type CurrencyUnit = 
    | 'Rupees (₹)' 
    | 'Thousand' 
    | 'Lakh' 
    | 'Crore' 
    | 'Hundred Crore' 
    | 'Thousand Crore' 
    | 'Million (Mn)' 
    | 'Billion (Bn)' 
    | 'Trillion (Tn)';

    interface CurrencyContextType {
    currencyUnit: CurrencyUnit;
    setCurrencyUnit: (unit: CurrencyUnit) => void;
    formatCurrency: (value: number | undefined | null) => string;
    formatNumber: (value: number | undefined | null) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);


export const useCurrency = () => {
    const context = useContext(CurrencyContext);
    if (!context) {
        throw new Error('useCurrency must be used within a CurrencyProvider');
    }
    return context;
};


interface CurrencyProviderProps {
    children: ReactNode;
}

export const CurrencyProvider: React.FC<CurrencyProviderProps> = ({ children }) => {
    const [currencyUnit, setCurrencyUnit] = useState<CurrencyUnit>('Rupees (₹)');

    const formatNumber = (value: number | undefined | null): string => {
        if (value === undefined || value === null) return '0';
        
        switch (currencyUnit) {
            case 'Rupees (₹)':
                return value.toLocaleString('en-IN');
            case 'Thousand':
                return (value / 1000).toFixed(2) + 'K';
            case 'Lakh':
                return (value / 100000).toFixed(2) + 'L';
            case 'Crore':
                return (value / 10000000).toFixed(2) + 'Cr';
            case 'Hundred Crore':
                return (value / 1000000000).toFixed(2) + 'H Cr';
            case 'Thousand Crore':
                return (value / 10000000000).toFixed(2) + 'T Cr';
            case 'Million (Mn)':
                return (value / 1000000).toFixed(2) + 'M';
            case 'Billion (Bn)':
                return (value / 1000000000).toFixed(2) + 'B';
            case 'Trillion (Tn)':
                return (value / 1000000000000).toFixed(2) + 'T';
            default:
                return value.toLocaleString('en-IN');
        }
    };



    const formatCurrency = (value: number | undefined | null): string => {
        if (value === undefined || value === null) return '₹0';
        
        const formattedNumber = formatNumber(value);
        
        // Add ₹ symbol for Rupees, otherwise just the formatted number
        if (currencyUnit === 'Rupees (₹)') {
            return `₹${formattedNumber}`;
        }
        
        return formattedNumber;
    };

    return (
        <CurrencyContext.Provider value={{
            currencyUnit,
            setCurrencyUnit,
            formatCurrency,
            formatNumber
        }}>
            {children}
        </CurrencyContext.Provider>
    );
};