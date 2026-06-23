import { useCurrency } from '../contexts/CurrencyContext';

export const useFormatters = () => {
    const { formatCurrency, formatNumber } = useCurrency();
    return { formatCurrency, formatNumber };
};

export const formatCurrency = (value: number | undefined | null): string => {
    console.warn('Using deprecated formatCurrency. Please use useCurrency hook instead.');
    if (value === undefined || value === null) return '₹0';
    return `₹${value.toLocaleString('en-IN')}`;
};

export const formatNumber = (num: number | undefined | null): string => {
    if (num === undefined || num === null) return '0';
    return new Intl.NumberFormat('en-IN').format(num);
};

export const formatPercentage = (value: number | undefined | null): string => {
    if (value === undefined || value === null) return '0%';
    return `${value.toFixed(2)}%`;
};

export const getMonthName = (month: number | undefined): string => {
    if (!month) return '';
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[month - 1];
};

// Format date from YYYY-MM-DD to DD-MM-YYYY
export const formatDateToDDMMYYYY = (dateString: string): string => {
    if (!dateString) return '';
    const parts = dateString.split('-');
    if (parts.length === 3) {
        return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return dateString;
};

// Format date from DD-MM-YYYY to YYYY-MM-DD (for API calls if needed)
export const formatDateToYYYYMMDD = (dateString: string): string => {
    if (!dateString) return '';
    const parts = dateString.split('-');
    if (parts.length === 3) {
        return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return dateString;
};