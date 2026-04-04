import React from 'react';
import { Paper, Typography, Box, CircularProgress } from '@mui/material';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid,
    Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { MonthlyTrend } from '../../types';
import { formatCurrency, getMonthName } from '../../utils/formatters';

interface MonthlyTrendChartProps {
    data?: MonthlyTrend[];
    isLoading: boolean;
}

const MonthlyTrendChart: React.FC<MonthlyTrendChartProps> = ({ data, isLoading }) => {
    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!data || data.length === 0) {
        return (
            <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography color="textSecondary">No trend data available</Typography>
            </Box>
        );
    }

    // Sort data by year and month
    const sortedData = [...data].sort((a, b) => {
        if (a.year !== b.year) return (a.year || 0) - (b.year || 0);
        return (a.month || 0) - (b.month || 0);
    });

    const chartData = sortedData.map(item => ({
        name: `${getMonthName(item.month)} ${item.year}`,
        Deposits: item.totalDepositAmount || 0,
        Loans: item.totalLoanAmount || 0,
        'Net Position': item.netPosition || 0,
    }));

    const formatYAxis = (value: number): string => {
        if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)}Cr`;
        if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
        if (value >= 1000) return `₹${(value / 1000).toFixed(1)}K`;
        return `₹${value}`;
    };

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <Paper sx={{ p: 2, bgcolor: 'rgba(255, 255, 255, 0.95)' }}>
                    <Typography variant="subtitle2">{label}</Typography>
                    {payload.map((entry: any, index: number) => (
                        <Typography key={index} style={{ color: entry.color }}>
                            {entry.name}: {formatCurrency(entry.value)}
                        </Typography>
                    ))}
                </Paper>
            );
        }
        return null;
    };

    return (
        <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
                Monthly Trends
            </Typography>
            <Box sx={{ width: '100%', height: 400 }}>
                <ResponsiveContainer>
                    <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                        <YAxis tickFormatter={formatYAxis} tick={{ fontSize: 12 }} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Line 
                            type="monotone" 
                            dataKey="Deposits" 
                            stroke="#4caf50" 
                            strokeWidth={2}
                            dot={{ r: 4 }}
                            activeDot={{ r: 6 }}
                        />
                        <Line 
                            type="monotone" 
                            dataKey="Loans" 
                            stroke="#f44336" 
                            strokeWidth={2}
                            dot={{ r: 4 }}
                            activeDot={{ r: 6 }}
                        />
                        <Line 
                            type="monotone" 
                            dataKey="Net Position" 
                            stroke="#2196f3" 
                            strokeWidth={2}
                            dot={{ r: 4 }}
                            activeDot={{ r: 6 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </Box>
        </Paper>
    );
};

export default MonthlyTrendChart;