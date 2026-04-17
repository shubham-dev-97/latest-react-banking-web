import React, { useState, useMemo } from 'react';
import {
    Box, Paper, Typography, Chip, Stack, IconButton,
    Tooltip, ToggleButton, ToggleButtonGroup, CircularProgress
} from '@mui/material';
import {
    ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
    Area, AreaChart
} from 'recharts';
import { formatCurrency, formatNumber, formatPercentage } from '../../utils/formatters';
import DownloadIcon from '@mui/icons-material/Download';
import PrintIcon from '@mui/icons-material/Print';
import BarChartIcon from '@mui/icons-material/BarChart';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

interface DepLoanMonthlyTrend {
    montH_END?: string;      // API returns with capital H
    month_END?: string;      // Alternative casing
    depositBal: number;
    loanBal: number;
    cD_RATIO_PERCENT?: number;  // API returns with capital letters
    cd_RATIO_PERCENT?: number;   // Alternative casing
    deposit_tag: string;
    loan_tag: string;
}

interface DepLoanTrendChartProps {
    data: DepLoanMonthlyTrend[];
    loading?: boolean;
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <Paper sx={{ p: 2, bgcolor: 'rgba(26, 35, 126, 0.95)', color: 'white', borderRadius: 2, minWidth: 260 }}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold', borderBottom: '1px solid rgba(255,255,255,0.3)', pb: 0.5 }}>
                    {label}
                </Typography>
                {payload.map((entry: any, index: number) => (
                    <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 0.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: entry.color }} />
                            <Typography variant="body2">{entry.name}:</Typography>
                        </Box>
                        <Typography variant="body2" fontWeight="bold">
                            {entry.name === 'CD Ratio %' 
                                ? `${entry.value.toFixed(2)}%`
                                : formatCurrency(entry.value)}
                        </Typography>
                    </Box>
                ))}
            </Paper>
        );
    }
    return null;
};

const DepLoanTrendChart: React.FC<DepLoanTrendChartProps> = ({ data, loading = false }) => {
    const [chartType, setChartType] = useState<'composed' | 'area'>('composed');

    // Normalize and filter data - remove months with zero deposit balance for meaningful analysis
    const normalizedData = useMemo(() => {
        if (!data || data.length === 0) return [];

        return data
            .map(item => {
                // Handle different property name casings
                const monthEnd = item.montH_END || item.month_END || '';
                const cdRatio = item.cD_RATIO_PERCENT !== undefined ? item.cD_RATIO_PERCENT : (item.cd_RATIO_PERCENT || 0);
                
                // Parse date correctly
                let formattedMonth = '';
                if (monthEnd) {
                    try {
                        const date = new Date(monthEnd);
                        if (!isNaN(date.getTime())) {
                            formattedMonth = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
                        }
                    } catch (e) {
                        console.error('Date parsing error:', e);
                    }
                }
                
                return {
                    month: formattedMonth || monthEnd?.split('T')[0] || 'Unknown',
                    rawMonth: monthEnd,
                    deposit: item.depositBal || 0,
                    loan: item.loanBal || 0,
                    cdRatio: cdRatio
                };
            })
            // Filter out months with both deposit and loan as 0
            .filter(item => item.deposit > 0 || item.loan > 0);
    }, [data]);

    // Calculate statistics (only for months with non-zero values)
    const stats = useMemo(() => {
        const validMonths = normalizedData.filter(item => item.deposit > 0);
        const validLoanMonths = normalizedData.filter(item => item.loan > 0);
        const validCDMonths = normalizedData.filter(item => item.cdRatio > 0);
        
        const avgDeposit = validMonths.length > 0 
            ? validMonths.reduce((sum, item) => sum + item.deposit, 0) / validMonths.length 
            : 0;
        
        const avgLoan = validLoanMonths.length > 0 
            ? validLoanMonths.reduce((sum, item) => sum + item.loan, 0) / validLoanMonths.length 
            : 0;
        
        const avgCDRatio = validCDMonths.length > 0 
            ? validCDMonths.reduce((sum, item) => sum + item.cdRatio, 0) / validCDMonths.length 
            : 0;
        
        const cdRatios = normalizedData.filter(item => item.cdRatio > 0).map(item => item.cdRatio);
        const maxCDRatio = cdRatios.length > 0 ? Math.max(...cdRatios) : 0;
        const minCDRatio = cdRatios.length > 0 ? Math.min(...cdRatios) : 0;
        
        return {
            avgDeposit,
            avgLoan,
            avgCDRatio,
            maxCDRatio,
            minCDRatio
        };
    }, [normalizedData]);

    if (loading) {
        return (
            <Paper sx={{ p: 5, textAlign: 'center', borderRadius: 3 }}>
                <CircularProgress />
                <Typography sx={{ mt: 2 }}>Loading Deposit-Loan trend data...</Typography>
            </Paper>
        );
    }

    if (!normalizedData || normalizedData.length === 0) {
        return (
            <Paper sx={{ p: 5, textAlign: 'center', borderRadius: 3 }}>
                <Typography color="error">No data available for the selected date.</Typography>
            </Paper>
        );
    }

    // Chart data for recharts
    const chartData = normalizedData;

    const handleExportCSV = () => {
        const headers = ['Month', 'Deposit Balance (Cr)', 'Loan Balance (Cr)', 'CD Ratio (%)'];
        const csvData = chartData.map(item => [
            item.month,
            (item.deposit / 10000000).toFixed(2),
            (item.loan / 10000000).toFixed(2),
            item.cdRatio.toFixed(2)
        ]);
        
        const csvContent = [headers, ...csvData].map(row => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Deposit_Loan_Trend_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handlePrint = () => {
        window.print();
    };

    const renderChart = () => {
        if (chartType === 'area') {
            return (
                <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 30 }}>
                    <defs>
                        <linearGradient id="depositGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#1976D2" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#1976D2" stopOpacity={0.1}/>
                        </linearGradient>
                        <linearGradient id="loanGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#F44336" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#F44336" stopOpacity={0.1}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                        dataKey="month" 
                        tick={{ fill: '#666', fontSize: 11 }} 
                        angle={-45} 
                        textAnchor="end" 
                        height={70} 
                        interval={0} 
                    />
                    <YAxis yAxisId="left" tickFormatter={(v) => `₹${(v / 10000000).toFixed(0)}Cr`} />
                    <YAxis yAxisId="right" orientation="right" tickFormatter={(v) => `${v}%`} />
                    <RechartsTooltip content={<CustomTooltip />} />
                    <Legend />
                    <Area yAxisId="left" type="monotone" dataKey="deposit" name="Deposit Balance" stroke="#1976D2" fill="url(#depositGradient)" />
                    <Area yAxisId="left" type="monotone" dataKey="loan" name="Loan Balance" stroke="#F44336" fill="url(#loanGradient)" />
                    <Line yAxisId="right" type="monotone" dataKey="cdRatio" name="CD Ratio %" stroke="#FFA000" strokeWidth={3} dot={{ r: 5 }} />
                </AreaChart>
            );
        }

        // Composed Chart (default)
        return (
            <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 30 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                    dataKey="month" 
                    tick={{ fill: '#666', fontSize: 11 }} 
                    angle={-45} 
                    textAnchor="end" 
                    height={70} 
                    interval={0} 
                />
                <YAxis yAxisId="left" tickFormatter={(v) => `₹${(v / 10000000).toFixed(0)}Cr`} />
                <YAxis yAxisId="right" orientation="right" tickFormatter={(v) => `${v}%`} />
                <RechartsTooltip content={<CustomTooltip />} />
                <Legend />
                <Bar yAxisId="left" dataKey="deposit" name="Deposit Balance" fill="#1976D2" radius={[8, 8, 0, 0]} barSize={40} />
                <Bar yAxisId="left" dataKey="loan" name="Loan Balance" fill="#F44336" radius={[8, 8, 0, 0]} barSize={40} />
                <Line yAxisId="right" type="monotone" dataKey="cdRatio" name="CD Ratio %" stroke="#FFA000" strokeWidth={3} dot={{ r: 5, fill: '#FFA000' }} />
            </ComposedChart>
        );
    };

    return (
        <Paper sx={{ 
            p: 3, 
            borderRadius: 3,
            background: 'linear-gradient(135deg, #ffffff 0%, #fafafa 100%)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
        }}>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
                <Box>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: '#1a237e' }}>
                        Deposit vs Loan Analysis with CD Ratio
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                        Last 12 months trend with Credit-Deposit Ratio (RBI Norm: 60-80%)
                    </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="Export CSV">
                        <IconButton onClick={handleExportCSV} size="small" sx={{ bgcolor: '#f5f5f5' }}>
                            <DownloadIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Print">
                        <IconButton onClick={handlePrint} size="small" sx={{ bgcolor: '#f5f5f5' }}>
                            <PrintIcon />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Box>

            {/* Summary Stats Cards */}
            <Stack direction="row" spacing={3} sx={{ mb: 3, pb: 2, borderBottom: '1px solid #e0e0e0', flexWrap: 'wrap', gap: 2 }}>
                <Box>
                    <Typography variant="caption" color="textSecondary">Avg Deposit Balance</Typography>
                    <Typography variant="h6" fontWeight="bold" color="#1976D2">
                        {formatCurrency(stats.avgDeposit)}
                    </Typography>
                </Box>
                <Box>
                    <Typography variant="caption" color="textSecondary">Avg Loan Balance</Typography>
                    <Typography variant="h6" fontWeight="bold" color="#F44336">
                        {formatCurrency(stats.avgLoan)}
                    </Typography>
                </Box>
                <Box>
                    <Typography variant="caption" color="textSecondary">Avg CD Ratio</Typography>
                    <Typography variant="h6" fontWeight="bold" color="#FFA000">
                        {stats.avgCDRatio > 0 ? `${stats.avgCDRatio.toFixed(2)}%` : 'N/A'}
                    </Typography>
                </Box>
                <Box>
                    <Typography variant="caption" color="textSecondary">CD Ratio Range</Typography>
                    <Typography variant="h6" fontWeight="bold">
                        {stats.minCDRatio > 0 ? `${stats.minCDRatio.toFixed(1)}% - ${stats.maxCDRatio.toFixed(1)}%` : 'N/A'}
                    </Typography>
                </Box>
            </Stack>

            {/* Chart Type Toggle */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                <ToggleButtonGroup
                    value={chartType}
                    exclusive
                    onChange={(e, val) => val && setChartType(val)}
                    size="small"
                >
                    <ToggleButton value="composed">
                        <BarChartIcon sx={{ mr: 1 }} /> Bar + Line
                    </ToggleButton>
                    <ToggleButton value="area">
                        <ShowChartIcon sx={{ mr: 1 }} /> Area + Line
                    </ToggleButton>
                </ToggleButtonGroup>
            </Box>

            {/* Chart */}
            <Box sx={{ width: '100%', height: 450 }}>
                <ResponsiveContainer width="100%" height="100%">
                    {renderChart()}
                </ResponsiveContainer>
            </Box>

            {/* Data Note */}
            {normalizedData.some(item => item.deposit === 0) && (
                <Typography variant="caption" color="warning.main" sx={{ display: 'block', textAlign: 'center', mt: 1 }}>
                    Note: Some months show zero deposit balance - data may be incomplete for those periods.
                </Typography>
            )}

            {/* CD Ratio Legend */}
            <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid #e0e0e0' }}>
                <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap" gap={2}>
                    <Chip 
                        icon={<TrendingUpIcon />} 
                        label="Ideal CD Ratio: 60-80%" 
                        sx={{ bgcolor: '#2E7D32', color: 'white' }}
                    />
                    <Chip 
                        label="Below 60% - Low Risk / Low Profitability" 
                        sx={{ bgcolor: '#FFA000', color: 'white' }}
                    />
                    <Chip 
                        label="Above 80% - High Risk / High Growth" 
                        sx={{ bgcolor: '#D32F2F', color: 'white' }}
                    />
                </Stack>
                <Typography variant="caption" color="textSecondary" sx={{ display: 'block', textAlign: 'center', mt: 1 }}>
                    Credit-Deposit Ratio (CD Ratio) indicates how much of deposits are lent out as loans. RBI recommends 60-80% for healthy banking.
                </Typography>
            </Box>
        </Paper>
    );
};

export default DepLoanTrendChart;