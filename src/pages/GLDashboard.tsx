import React, { useState, useEffect } from 'react';
import {
    Box, Container, Grid, Paper,
    Typography, FormControl, InputLabel,
    Select, MenuItem, Card, CardContent,
    Avatar, Stack, Divider, useTheme
} from '@mui/material';
import {
    AccountBalance, TrendingUp, TrendingDown,
    AttachMoney, Receipt, Savings,
    Assessment, AccountBalanceWallet, ShowChart,
    Warning, Percent
} from '@mui/icons-material';
import { useGLDashboardSummary } from '../hooks/useGLData';
import { useAvailableDates } from '../hooks/useCustomerData';
import { useCurrency } from '../contexts/CurrencyContext';
import { formatPercentage } from '../utils/formatters';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import StyledCard from '../components/common/StyledCard';

const GLDashboard: React.FC = () => {
    const theme = useTheme();
    const { formatCurrency } = useCurrency();
    
    // Set default date to today's date or a recent fixed date
    const today = new Date();
    const defaultDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    
    const [selectedDate, setSelectedDate] = useState<string>(defaultDate);

    // Fetch available dates
    const { data: availableDates, isLoading: datesLoading } = useAvailableDates();
    
    // Fetch GL data
    const { data: glData, isLoading } = useGLDashboardSummary(selectedDate);

    // Update selected date when availableDates load and current selected is not in list
    useEffect(() => {
        if (availableDates && availableDates.length > 0 && !availableDates.includes(selectedDate)) {
            setSelectedDate(availableDates[0]);
        }
    }, [availableDates, selectedDate]);

    // Calculate ratios
    const assetLiabilityRatio = glData?.total_Liabilities && glData.total_Liabilities !== 0
        ? (glData.total_Assets / glData.total_Liabilities).toFixed(2)
        : 'N/A';
    
    const profitMargin = glData?.total_Income && glData.total_Income !== 0
        ? ((glData.net_Profit / glData.total_Income) * 100).toFixed(2)
        : '0';

    // Data for pie chart
    const pieData = [
        { name: 'Assets', value: glData?.total_Assets || 0 },
        { name: 'Liabilities', value: glData?.total_Liabilities || 0 },
    ];

    const COLORS = ['#1976d2', '#f44336', '#ff9800', '#4caf50', '#9c27b0'];

    // Data for bar chart (Income vs Expense)
    const barData = [
        { name: 'Income', amount: glData?.total_Income || 0 },
        { name: 'Expense', amount: glData?.total_Expense || 0 },
    ];

    return (
        <Box sx={{ width: '100%', height: '100%', overflow: 'auto', p: 2 }}>
            <Container maxWidth={false}>
                {/* Header */}
                <Box sx={{ mb: 3 }}>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1a237e' }}>
                        GL Dashboard Summary
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                        General Ledger financial position and performance
                    </Typography>
                </Box>

                {/* Date Filter */}
                <Paper sx={{ p: 2, mb: 3 }}>
                    <Grid container spacing={2} alignItems="center">
                        <Grid size={{ xs: 12, md: 4 }}>
                            <FormControl fullWidth size="small">
                                <InputLabel>As On Date</InputLabel>
                                <Select
                                    value={selectedDate}
                                    label="As On Date"
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                >
                                    {datesLoading ? (
                                        <MenuItem disabled>Loading dates...</MenuItem>
                                    ) : availableDates?.map((date) => (
                                        <MenuItem key={date} value={date}>
                                            {date}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </Paper>

                {isLoading ? (
                    <Paper sx={{ p: 4, textAlign: 'center' }}>
                        <Typography>Loading GL data...</Typography>
                    </Paper>
                ) : glData ? (
                    <>
                        {/* Key Metrics Cards with StyledCard */}
                        <Grid container spacing={2} sx={{ mb: 4 }}>
                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                <StyledCard
                                    title="Total Assets"
                                    value={formatCurrency(glData.total_Assets)}
                                    icon={<AccountBalance />}
                                    colorIndex={2} // Blue
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                <StyledCard
                                    title="Total Liabilities"
                                    value={formatCurrency(glData.total_Liabilities)}
                                    icon={<TrendingDown />}
                                    colorIndex={1} // Red
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                <StyledCard
                                    title="Net Position"
                                    value={formatCurrency(glData.net_Position)}
                                    icon={<AccountBalanceWallet />}
                                    colorIndex={3} // Green
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                <StyledCard
                                    title="Net Profit"
                                    value={formatCurrency(glData.net_Profit)}
                                    icon={<TrendingUp />}
                                    colorIndex={0} // Purple
                                />
                            </Grid>
                        </Grid>

                        {/* Second Row of Metrics */}
                        <Grid container spacing={2} sx={{ mb: 4 }}>
                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                <StyledCard
                                    title="Total Income"
                                    value={formatCurrency(glData.total_Income)}
                                    icon={<AttachMoney />}
                                    colorIndex={3} // Green
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                <StyledCard
                                    title="Total Expense"
                                    value={formatCurrency(glData.total_Expense)}
                                    icon={<Receipt />}
                                    colorIndex={1} // Red
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                <StyledCard
                                    title="Total Debit"
                                    value={formatCurrency(glData.total_Debit)}
                                    icon={<Assessment />}
                                    colorIndex={2} // Blue
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                <StyledCard
                                    title="Total Credit"
                                    value={formatCurrency(glData.total_Credit)}
                                    icon={<Savings />}
                                    colorIndex={4} // Orange
                                />
                            </Grid>
                        </Grid>

                        {/* Charts Row */}
                        <Grid container spacing={2} sx={{ mb: 4 }}>
                            {/* Pie Chart */}
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Paper sx={{ p: 2, height: '100%', minHeight: 350 }}>
                                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#1a237e' }}>
                                        <ShowChart sx={{ mr: 1, verticalAlign: 'middle' }} /> Assets vs Liabilities
                                    </Typography>
                                    <Box sx={{ height: 280, display: 'flex', justifyContent: 'center' }}>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={pieData}
                                                    cx="50%"
                                                    cy="50%"
                                                    labelLine={false}
                                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                                    outerRadius="80%"
                                                    fill="#8884d8"
                                                    dataKey="value"
                                                >
                                                    {pieData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip formatter={(value) => formatCurrency(value as number)} />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </Box>
                                </Paper>
                            </Grid>
                            {/* Bar Chart */}
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Paper sx={{ p: 2, height: '100%', minHeight: 350 }}>
                                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#1a237e' }}>
                                        <ShowChart sx={{ mr: 1, verticalAlign: 'middle' }} /> Income vs Expense
                                    </Typography>
                                    <Box sx={{ height: 280 }}>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={barData}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="name" />
                                                <YAxis />
                                                <Tooltip formatter={(value) => formatCurrency(value as number)} />
                                                <Legend />
                                                <Bar dataKey="amount" fill="#1976d2" />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </Box>
                                </Paper>
                            </Grid>
                        </Grid>

                        {/* Financial Breakdown Cards */}
                        <Grid container spacing={2} sx={{ mb: 4 }}>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Card sx={{ height: '100%' }}>
                                    <CardContent>
                                        <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a237e', mb: 2 }}>
                                            Income & Expense
                                        </Typography>
                                        <Divider sx={{ mb: 2 }} />
                                        <Grid container spacing={2}>
                                            <Grid item xs={6}>
                                                <Typography color="textSecondary" gutterBottom variant="body2">
                                                    Total Income
                                                </Typography>
                                                <Typography variant="h6" sx={{ color: '#4caf50', fontWeight: 600 }}>
                                                    {formatCurrency(glData.total_Income)}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Typography color="textSecondary" gutterBottom variant="body2">
                                                    Total Expense
                                                </Typography>
                                                <Typography variant="h6" sx={{ color: '#f44336', fontWeight: 600 }}>
                                                    {formatCurrency(glData.total_Expense)}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Divider />
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                                                    <Typography variant="subtitle1" fontWeight="600">Net Profit</Typography>
                                                    <Typography variant="h6" sx={{ 
                                                        color: glData.net_Profit >= 0 ? '#4caf50' : '#f44336',
                                                        fontWeight: 600 
                                                    }}>
                                                        {formatCurrency(glData.net_Profit)}
                                                    </Typography>
                                                </Box>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                                                    <Typography variant="subtitle2" fontWeight="500">Profit Margin</Typography>
                                                    <Typography variant="subtitle2" sx={{ 
                                                        color: parseFloat(profitMargin) >= 0 ? '#4caf50' : '#f44336',
                                                        fontWeight: 600
                                                    }}>
                                                        {profitMargin}%
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Card sx={{ height: '100%' }}>
                                    <CardContent>
                                        <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a237e', mb: 2 }}>
                                            Debit & Credit Summary
                                        </Typography>
                                        <Divider sx={{ mb: 2 }} />
                                        <Grid container spacing={2}>
                                            <Grid item xs={6}>
                                                <Typography color="textSecondary" gutterBottom variant="body2">
                                                    Total Debit
                                                </Typography>
                                                <Typography variant="h6" sx={{ color: '#1976d2', fontWeight: 600 }}>
                                                    {formatCurrency(glData.total_Debit)}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Typography color="textSecondary" gutterBottom variant="body2">
                                                    Total Credit
                                                </Typography>
                                                <Typography variant="h6" sx={{ color: '#ff9800', fontWeight: 600 }}>
                                                    {formatCurrency(glData.total_Credit)}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Divider />
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                                                    <Typography variant="subtitle1" fontWeight="600">Balance (Debit - Credit)</Typography>
                                                    <Typography variant="h6" sx={{ 
                                                        color: (glData.total_Debit - glData.total_Credit) >= 0 ? '#4caf50' : '#f44336',
                                                        fontWeight: 600
                                                    }}>
                                                        {formatCurrency(glData.total_Debit - glData.total_Credit)}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>

                        {/* Detailed Tables */}
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Paper sx={{ p: 2 }}>
                                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a237e', mb: 2 }}>
                                        Asset & Liability Details
                                    </Typography>
                                    <Box sx={{ overflowX: 'auto' }}>
                                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                            <tbody>
                                                <tr>
                                                    <td style={{ padding: '8px', fontWeight: 'bold' }}>Assets</td>
                                                    <td style={{ padding: '8px', textAlign: 'right', fontWeight: 500, color: '#1976d2' }}>
                                                        {formatCurrency(glData.total_Assets)}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style={{ padding: '8px', fontWeight: 'bold' }}>Liabilities</td>
                                                    <td style={{ padding: '8px', textAlign: 'right', fontWeight: 500, color: '#f44336' }}>
                                                        {formatCurrency(glData.total_Liabilities)}
                                                    </td>
                                                </tr>
                                                <tr style={{ backgroundColor: '#f5f5f5' }}>
                                                    <td style={{ padding: '8px', fontWeight: 'bold' }}>Net Position</td>
                                                    <td style={{ padding: '8px', textAlign: 'right', fontWeight: 600, color: '#2e7d32' }}>
                                                        {formatCurrency(glData.net_Position)}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style={{ padding: '8px', fontWeight: 'bold' }}>Asset/Liability Ratio</td>
                                                    <td style={{ padding: '8px', textAlign: 'right', fontWeight: 500 }}>
                                                        {assetLiabilityRatio}
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </Box>
                                </Paper>
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Paper sx={{ p: 2 }}>
                                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a237e', mb: 2 }}>
                                        Income & Expense Details
                                    </Typography>
                                    <Box sx={{ overflowX: 'auto' }}>
                                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                            <tbody>
                                                <tr>
                                                    <td style={{ padding: '8px', fontWeight: 'bold' }}>Income</td>
                                                    <td style={{ padding: '8px', textAlign: 'right', fontWeight: 500, color: '#4caf50' }}>
                                                        {formatCurrency(glData.total_Income)}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style={{ padding: '8px', fontWeight: 'bold' }}>Expense</td>
                                                    <td style={{ padding: '8px', textAlign: 'right', fontWeight: 500, color: '#f44336' }}>
                                                        {formatCurrency(glData.total_Expense)}
                                                    </td>
                                                </tr>
                                                <tr style={{ backgroundColor: '#f5f5f5' }}>
                                                    <td style={{ padding: '8px', fontWeight: 'bold' }}>Net Profit</td>
                                                    <td style={{ padding: '8px', textAlign: 'right', fontWeight: 600, color: '#2e7d32' }}>
                                                        {formatCurrency(glData.net_Profit)}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style={{ padding: '8px', fontWeight: 'bold' }}>Profit Margin</td>
                                                    <td style={{ padding: '8px', textAlign: 'right', fontWeight: 500 }}>
                                                        {profitMargin}%
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </Box>
                                </Paper>
                            </Grid>
                        </Grid>
                    </>
                ) : (
                    <Paper sx={{ p: 4, textAlign: 'center' }}>
                        <Typography color="textSecondary">No data available for selected date.</Typography>
                    </Paper>
                )}
            </Container>
        </Box>
    );
};

export default GLDashboard;