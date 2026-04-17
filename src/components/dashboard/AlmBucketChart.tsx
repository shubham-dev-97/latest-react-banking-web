import React, { useState } from 'react';
import { 
    Box, Paper, Typography, CircularProgress, 
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Chip, Stack, IconButton,
    Tooltip as MuiTooltip, Button, ToggleButton, ToggleButtonGroup
} from '@mui/material';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell,
    AreaChart, Area
} from 'recharts';
import { formatCurrency, formatNumber } from '../../utils/formatters';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import BarChartIcon from '@mui/icons-material/BarChart';
import PieChartIcon from '@mui/icons-material/PieChart';
import TableChartIcon from '@mui/icons-material/TableChart';
import DownloadIcon from '@mui/icons-material/Download';
import PrintIcon from '@mui/icons-material/Print';

interface AlmBucketRBI {
    rbI_BUCKET?: string;        // Note: API returns "rbI_BUCKET"
    rbi_BUCKET?: string;        // Alternative casing
    nO_OF_ACCOUNTS?: number;    // API returns "nO_OF_ACCOUNTS"
    no_OF_ACCOUNTS?: number;    // Alternative casing
    outstandinG_BALANCE?: number; // API returns "outstandinG_BALANCE"
    outstanding_BALANCE?: number; // Alternative casing
    maturitY_AMOUNT?: number;   // API returns "maturitY_AMOUNT"
    maturity_AMOUNT?: number;   // Alternative casing
}

interface AlmBucketChartProps {
    data: AlmBucketRBI[];
    loading?: boolean;
}

const AlmBucketChart: React.FC<AlmBucketChartProps> = ({ data, loading = false }) => {
    const [viewType, setViewType] = useState<'chart' | 'table'>('chart');
    const [chartType, setChartType] = useState<'bar' | 'pie' | 'area'>('bar');

    console.log('Raw API Data received:', data);

    // Normalize the data to handle different casing
    const normalizedData = (data || []).map(item => ({
        rbi_BUCKET: item.rbI_BUCKET || item.rbi_BUCKET || '',
        no_OF_ACCOUNTS: item.nO_OF_ACCOUNTS || item.no_OF_ACCOUNTS || 0,
        outstanding_BALANCE: item.outstandinG_BALANCE || item.outstanding_BALANCE || 0,
        maturity_AMOUNT: item.maturitY_AMOUNT || item.maturity_AMOUNT || 0
    }));

    console.log('Normalized Data:', normalizedData);

    if (loading) {
        return (
            <Paper sx={{ p: 5, textAlign: 'center', borderRadius: 3 }}>
                <CircularProgress />
                <Typography sx={{ mt: 2 }}>Loading ALM data...</Typography>
            </Paper>
        );
    }

    if (!normalizedData || normalizedData.length === 0) {
        return (
            <Paper sx={{ p: 5, textAlign: 'center', borderRadius: 3 }}>
                <Typography color="error">No ALM data available for the selected date.</Typography>
            </Paper>
        );
    }

    // Color scheme for different buckets (banking professional colors)
    const getBucketColor = (bucket: string, index: number) => {
        const colors = [
            '#2E7D32', // 1-14 Days - Dark Green
            '#43A047', // 15-28 Days - Green
            '#FFA000', // 29 Days - 3 Months - Amber
            '#FF6F00', // 3-6 Months - Orange
            '#D32F2F', // 6-12 Months - Red
            '#7B1FA2', // 1-3 Years - Purple
            '#283593', // 3-5 Years - Indigo
            '#1565C0', // 5+ Years - Blue
            '#757575'  // Overdue - Grey
        ];
        return colors[index % colors.length];
    };

    // Order buckets in proper sequence
    const bucketOrder = [
        '1-14 Days',
        '15-28 Days',
        '29 Days - 3 Months',
        '3-6 Months',
        '6-12 Months',
        '1-3 Years',
        '3-5 Years',
        'Above 5 Years',
        'Overdue / Matured'
    ];

    // Sort data according to bucket order
    const sortedData = [...normalizedData].sort((a, b) => {
        return bucketOrder.indexOf(a.rbi_BUCKET) - bucketOrder.indexOf(b.rbi_BUCKET);
    });

    // Prepare chart data (convert to Crores for better display)
    const chartData = sortedData.map((item, index) => ({
        name: item.rbi_BUCKET,
        accounts: item.no_OF_ACCOUNTS,
        outstanding: item.outstanding_BALANCE / 10000000, // Convert to Crores
        maturity: item.maturity_AMOUNT / 10000000,
        color: getBucketColor(item.rbi_BUCKET, index)
    }));

    // Calculate totals
    const totalAccounts = sortedData.reduce((sum, item) => sum + item.no_OF_ACCOUNTS, 0);
    const totalOutstanding = sortedData.reduce((sum, item) => sum + item.outstanding_BALANCE, 0);
    const totalMaturity = sortedData.reduce((sum, item) => sum + item.maturity_AMOUNT, 0);

    // Format large numbers to Crores
    const formatCrores = (value: number) => {
        const crores = value / 10000000;
        return `₹${crores.toFixed(2)} Cr`;
    };

    const handleExportCSV = () => {
        const headers = ['Bucket', 'No. of Accounts', 'Outstanding Balance (Cr)', 'Maturity Amount (Cr)'];
        const csvData = sortedData.map(item => [
            item.rbi_BUCKET,
            item.no_OF_ACCOUNTS,
            (item.outstanding_BALANCE / 10000000).toFixed(2),
            (item.maturity_AMOUNT / 10000000).toFixed(2)
        ]);
        
        const csvContent = [headers, ...csvData].map(row => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ALM_Bucket_Report_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handlePrint = () => {
        window.print();
    };

    const renderChart = () => {
        switch (chartType) {
            case 'pie':
                return (
                    <ResponsiveContainer width="100%" height={450}>
                        <PieChart>
                            <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={140}
                                dataKey="maturity"
                                nameKey="name"
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                labelLine={{ stroke: '#666', strokeWidth: 1 }}
                            >
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value) => formatCrores(value as number * 10000000)} />
                            <Legend verticalAlign="bottom" height={36} />
                        </PieChart>
                    </ResponsiveContainer>
                );

            case 'area':
                return (
                    <ResponsiveContainer width="100%" height={450}>
                        <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 100 }}>
                            <defs>
                                <linearGradient id="colorOutstanding" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#D32F2F" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#D32F2F" stopOpacity={0.1}/>
                                </linearGradient>
                                <linearGradient id="colorMaturity" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#2E7D32" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#2E7D32" stopOpacity={0.1}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis 
                                dataKey="name" 
                                tick={{ fill: '#666', fontSize: 11 }}
                                angle={-45}
                                textAnchor="end"
                                height={100}
                                interval={0}
                            />
                            <YAxis tickFormatter={(v) => `₹${v}Cr`} />
                            <Tooltip formatter={(value) => `₹${value} Cr`} />
                            <Legend />
                            <Area type="monotone" dataKey="outstanding" name="Outstanding Balance (Cr)" stroke="#D32F2F" fill="url(#colorOutstanding)" />
                            <Area type="monotone" dataKey="maturity" name="Maturity Amount (Cr)" stroke="#2E7D32" fill="url(#colorMaturity)" />
                        </AreaChart>
                    </ResponsiveContainer>
                );

            default: // bar chart
                return (
                    <ResponsiveContainer width="100%" height={450}>
                        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 100 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis 
                                dataKey="name" 
                                tick={{ fill: '#666', fontSize: 11 }}
                                angle={-45}
                                textAnchor="end"
                                height={100}
                                interval={0}
                            />
                            <YAxis yAxisId="left" tickFormatter={(v) => `${v}Cr`} />
                            <YAxis yAxisId="right" orientation="right" />
                            <Tooltip formatter={(value, name) => {
                                if (name === 'Accounts') return formatNumber(value as number);
                                return `₹${value} Cr`;
                            }} />
                            <Legend />
                            <Bar yAxisId="left" dataKey="maturity" name="Maturity Amount (Cr)" fill="#2E7D32" radius={[8, 8, 0, 0]} />
                            <Bar yAxisId="right" dataKey="accounts" name="No. of Accounts" fill="#1976D2" radius={[8, 8, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                );
        }
    };

    const renderTable = () => (
        <TableContainer sx={{ maxHeight: 500 }}>
            <Table stickyHeader>
                <TableHead>
                    <TableRow sx={{ bgcolor: '#1a237e' }}>
                        <TableCell sx={{ fontWeight: 'bold', bgcolor: '#1a237e', color: 'white' }}>Category</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold', bgcolor: '#1a237e', color: 'white' }}>No. of Accounts</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold', bgcolor: '#1a237e', color: 'white' }}>Outstanding Balance (INR Crores)</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold', bgcolor: '#1a237e', color: 'white' }}>Maturity Amount (INR Crores)</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {sortedData.map((item, index) => (
                        <TableRow key={index} hover>
                            <TableCell>
                                <Chip 
                                    label={item.rbi_BUCKET} 
                                    size="small"
                                    sx={{ 
                                        bgcolor: getBucketColor(item.rbi_BUCKET, index),
                                        color: 'white',
                                        fontWeight: 500
                                    }}
                                />
                            </TableCell>
                            <TableCell align="right" sx={{ fontWeight: 500 }}>
                                {formatNumber(item.no_OF_ACCOUNTS)}
                            </TableCell>
                            <TableCell align="right" sx={{ fontWeight: 500, color: '#D32F2F' }}>
                                {(item.outstanding_BALANCE / 10000000).toFixed(2)}
                            </TableCell>
                            <TableCell align="right" sx={{ fontWeight: 500, color: '#2E7D32' }}>
                                {(item.maturity_AMOUNT / 10000000).toFixed(2)}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                <TableHead>
                    <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                        <TableCell sx={{ fontWeight: 'bold' }}>TOTAL</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                            {formatNumber(totalAccounts)}
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold', color: '#D32F2F' }}>
                            {(totalOutstanding / 10000000).toFixed(2)}
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold', color: '#2E7D32' }}>
                            {(totalMaturity / 10000000).toFixed(2)}
                        </TableCell>
                    </TableRow>
                </TableHead>
            </Table>
        </TableContainer>
    );

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
                        ALM - RBI Bucket Analysis
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                        Asset Liability Management as per RBI guidelines
                    </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <MuiTooltip title="Export CSV">
                        <IconButton onClick={handleExportCSV} size="small" sx={{ bgcolor: '#f5f5f5' }}>
                            <DownloadIcon />
                        </IconButton>
                    </MuiTooltip>
                    <MuiTooltip title="Print">
                        <IconButton onClick={handlePrint} size="small" sx={{ bgcolor: '#f5f5f5' }}>
                            <PrintIcon />
                        </IconButton>
                    </MuiTooltip>
                </Box>
            </Box>

            {/* Summary Stats Cards */}
            <Stack direction="row" spacing={3} sx={{ mb: 3, pb: 2, borderBottom: '1px solid #e0e0e0', flexWrap: 'wrap', gap: 2 }}>
                <Box>
                    <Typography variant="caption" color="textSecondary">Total Accounts</Typography>
                    <Typography variant="h4" fontWeight="bold" color="#1a237e">
                        {formatNumber(totalAccounts)}
                    </Typography>
                </Box>
                <Box>
                    <Typography variant="caption" color="textSecondary">Total Outstanding Balance</Typography>
                    <Typography variant="h4" fontWeight="bold" color="#D32F2F">
                        {(totalOutstanding / 10000000).toFixed(2)} Cr
                    </Typography>
                </Box>
                <Box>
                    <Typography variant="caption" color="textSecondary">Total Maturity Amount</Typography>
                    <Typography variant="h4" fontWeight="bold" color="#2E7D32">
                        {(totalMaturity / 10000000).toFixed(2)} Cr
                    </Typography>
                </Box>
            </Stack>

            {/* View Toggles */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
                <ToggleButtonGroup
                    value={viewType}
                    exclusive
                    onChange={(e, val) => val && setViewType(val)}
                    size="small"
                >
                    <ToggleButton value="chart">
                        <BarChartIcon sx={{ mr: 1 }} /> Chart
                    </ToggleButton>
                    <ToggleButton value="table">
                        <TableChartIcon sx={{ mr: 1 }} /> Table
                    </ToggleButton>
                </ToggleButtonGroup>

                {viewType === 'chart' && (
                    <ToggleButtonGroup
                        value={chartType}
                        exclusive
                        onChange={(e, val) => val && setChartType(val)}
                        size="small"
                    >
                        <ToggleButton value="bar">
                            <BarChartIcon /> Bar
                        </ToggleButton>
                        <ToggleButton value="pie">
                            <PieChartIcon /> Pie
                        </ToggleButton>
                        <ToggleButton value="area">
                            <TrendingUpIcon /> Area
                        </ToggleButton>
                    </ToggleButtonGroup>
                )}
            </Box>

            {/* Content */}
            {viewType === 'chart' ? (
                <Box sx={{ width: '100%', mt: 2 }}>
                    {renderChart()}
                </Box>
            ) : (
                renderTable()
            )}
        </Paper>
    );
};

export default AlmBucketChart;