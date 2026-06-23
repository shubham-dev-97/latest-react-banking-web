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
import { formatPercentage, formatDateToDDMMYYYY } from '../utils/formatters';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import StyledCard from '../components/common/StyledCard';
import { useTranslation } from '../hooks/useTranslation';

const GLDashboard: React.FC = () => {
    const theme = useTheme();
    const { formatCurrency } = useCurrency();
    const { t } = useTranslation();
    
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
        { name: t('gl.assets', 'Assets'), value: glData?.total_Assets || 0 },
        { name: t('gl.liabilities', 'Liabilities'), value: glData?.total_Liabilities || 0 },
    ];

    const COLORS = ['#2563EB', '#DC2626', 'secondary.main', '#059669', '#7C3AED'];

    // Data for bar chart (Income vs Expense)
    const barData = [
        { name: t('gl.income', 'Income'), amount: glData?.total_Income || 0 },
        { name: t('gl.expense', 'Expense'), amount: glData?.total_Expense || 0 },
    ];

    return (
        <Box sx={{ width: '100%', height: '100%', overflow: 'auto', p: 2 }}>
            <Container maxWidth={false}>
                {/* Date Filter */}
                <Paper sx={{ p: 2, mb: 3 }}>
                    <Grid container spacing={2} alignItems="center">
                        <Grid size={{ xs: 12, md: 4 }}>
                            <FormControl fullWidth size="small">
                                <InputLabel>{t('home.as_on_date', 'As On Date')}</InputLabel>
                                <Select
                                    value={selectedDate}
                                    label={t('home.as_on_date', 'As On Date')}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                >
                                    {datesLoading ? (
                                        <MenuItem disabled>{t('common.loading', 'Loading...')}</MenuItem>
                                    ) : availableDates?.map((date) => (
                                        <MenuItem key={date} value={date}>
                                            {formatDateToDDMMYYYY(date)}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </Paper>

                {isLoading ? (
                    <Paper sx={{ p: 4, textAlign: 'center' }}>
                        <Typography>{t('common.loading', 'Loading...')}</Typography>
                    </Paper>
                ) : glData ? (
                    <>
                        {/* Key Metrics Cards with StyledCard */}
                        <Grid container spacing={2} sx={{ mb: 4 }}>
                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                <StyledCard
                                    title={t('gl.total_assets', 'Total Assets')}
                                    value={formatCurrency(glData.total_Assets)}
                                    icon={<AccountBalance />}
                                    colorIndex={2} // Blue
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                <StyledCard
                                    title={t('gl.total_liabilities', 'Total Liabilities')}
                                    value={formatCurrency(glData.total_Liabilities)}
                                    icon={<TrendingDown />}
                                    colorIndex={1} // Red
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                <StyledCard
                                    title={t('gl.net_position', 'Net Position')}
                                    value={formatCurrency(glData.net_Position)}
                                    icon={<AccountBalanceWallet />}
                                    colorIndex={3} // Green
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                <StyledCard
                                    title={t('gl.net_profit', 'Net Profit')}
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
                                    title={t('gl.total_income', 'Total Income')}
                                    value={formatCurrency(glData.total_Income)}
                                    icon={<AttachMoney />}
                                    colorIndex={3} // Green
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                <StyledCard
                                    title={t('gl.total_expense', 'Total Expense')}
                                    value={formatCurrency(glData.total_Expense)}
                                    icon={<Receipt />}
                                    colorIndex={1} // Red
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                <StyledCard
                                    title={t('gl.total_debit', 'Total Debit')}
                                    value={formatCurrency(glData.total_Debit)}
                                    icon={<Assessment />}
                                    colorIndex={2} // Blue
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                <StyledCard
                                    title={t('gl.total_credit', 'Total Credit')}
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
                                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'primary.main' }}>
                                        <ShowChart sx={{ mr: 1, verticalAlign: 'middle' }} /> {t('gl.assets_vs_liabilities', 'Assets vs Liabilities')}
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
                                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'primary.main' }}>
                                        <ShowChart sx={{ mr: 1, verticalAlign: 'middle' }} /> {t('gl.income_vs_expense', 'Income vs Expense')}
                                    </Typography>
                                    <Box sx={{ height: 280 }}>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={barData}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="name" />
                                                <YAxis />
                                                <Tooltip formatter={(value) => formatCurrency(value as number)} />
                                                <Legend />
                                                <Bar dataKey="amount" fill="#2563EB" />
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
                                        <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main', mb: 2 }}>
                                            {t('gl.income_and_expense', 'Income & Expense')}
                                        </Typography>
                                        <Divider sx={{ mb: 2 }} />
                                        <Grid container spacing={2}>
                                            <Grid item xs={6}>
                                                <Typography color="textSecondary" gutterBottom variant="body2">
                                                    {t('gl.total_income', 'Total Income')}
                                                </Typography>
                                                <Typography variant="h6" sx={{ color: '#059669', fontWeight: 600 }}>
                                                    {formatCurrency(glData.total_Income)}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Typography color="textSecondary" gutterBottom variant="body2">
                                                    {t('gl.total_expense', 'Total Expense')}
                                                </Typography>
                                                <Typography variant="h6" sx={{ color: '#DC2626', fontWeight: 600 }}>
                                                    {formatCurrency(glData.total_Expense)}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Divider />
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                                                    <Typography variant="subtitle1" fontWeight="600">{t('gl.net_profit', 'Net Profit')}</Typography>
                                                    <Typography variant="h6" sx={{ 
                                                        color: glData.net_Profit >= 0 ? '#059669' : '#DC2626',
                                                        fontWeight: 600 
                                                    }}>
                                                        {formatCurrency(glData.net_Profit)}
                                                    </Typography>
                                                </Box>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                                                    <Typography variant="subtitle2" fontWeight="500">{t('gl.profit_margin', 'Profit Margin')}</Typography>
                                                    <Typography variant="subtitle2" sx={{ 
                                                        color: parseFloat(profitMargin) >= 0 ? '#059669' : '#DC2626',
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
                                        <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main', mb: 2 }}>
                                            {t('gl.debit_credit_summary', 'Debit & Credit Summary')}
                                        </Typography>
                                        <Divider sx={{ mb: 2 }} />
                                        <Grid container spacing={2}>
                                            <Grid item xs={6}>
                                                <Typography color="textSecondary" gutterBottom variant="body2">
                                                    {t('gl.total_debit', 'Total Debit')}
                                                </Typography>
                                                <Typography variant="h6" sx={{ color: '#2563EB', fontWeight: 600 }}>
                                                    {formatCurrency(glData.total_Debit)}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Typography color="textSecondary" gutterBottom variant="body2">
                                                    {t('gl.total_credit', 'Total Credit')}
                                                </Typography>
                                                <Typography variant="h6" sx={{ color: 'secondary.main', fontWeight: 600 }}>
                                                    {formatCurrency(glData.total_Credit)}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Divider />
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                                                    <Typography variant="subtitle1" fontWeight="600">{t('gl.balance_debit_credit', 'Balance (Debit - Credit)')}</Typography>
                                                    <Typography variant="h6" sx={{ 
                                                        color: (glData.total_Debit - glData.total_Credit) >= 0 ? '#059669' : '#DC2626',
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
                                    <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main', mb: 2 }}>
                                        {t('gl.asset_liability_details', 'Asset & Liability Details')}
                                    </Typography>
                                    <Box sx={{ overflowX: 'auto' }}>
                                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                            <tbody>
                                                <tr>
                                                    <td style={{ padding: '8px', fontWeight: 'bold' }}>{t('gl.assets', 'Assets')}</td>
                                                    <td style={{ padding: '8px', textAlign: 'right', fontWeight: 500, color: '#2563EB' }}>
                                                        {formatCurrency(glData.total_Assets)}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style={{ padding: '8px', fontWeight: 'bold' }}>{t('gl.liabilities', 'Liabilities')}</td>
                                                    <td style={{ padding: '8px', textAlign: 'right', fontWeight: 500, color: '#DC2626' }}>
                                                        {formatCurrency(glData.total_Liabilities)}
                                                    </td>
                                                </tr>
                                                <tr style={{ backgroundColor: '#f5f5f5' }}>
                                                    <td style={{ padding: '8px', fontWeight: 'bold' }}>{t('gl.net_position', 'Net Position')}</td>
                                                    <td style={{ padding: '8px', textAlign: 'right', fontWeight: 600, color: '#2e7d32' }}>
                                                        {formatCurrency(glData.net_Position)}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style={{ padding: '8px', fontWeight: 'bold' }}>{t('gl.asset_liability_ratio', 'Asset/Liability Ratio')}</td>
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
                                    <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main', mb: 2 }}>
                                        {t('gl.income_expense_details', 'Income & Expense Details')}
                                    </Typography>
                                    <Box sx={{ overflowX: 'auto' }}>
                                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                            <tbody>
                                                <tr>
                                                    <td style={{ padding: '8px', fontWeight: 'bold' }}>{t('gl.income', 'Income')}</td>
                                                    <td style={{ padding: '8px', textAlign: 'right', fontWeight: 500, color: '#059669' }}>
                                                        {formatCurrency(glData.total_Income)}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style={{ padding: '8px', fontWeight: 'bold' }}>{t('gl.expense', 'Expense')}</td>
                                                    <td style={{ padding: '8px', textAlign: 'right', fontWeight: 500, color: '#DC2626' }}>
                                                        {formatCurrency(glData.total_Expense)}
                                                    </td>
                                                </tr>
                                                <tr style={{ backgroundColor: '#f5f5f5' }}>
                                                    <td style={{ padding: '8px', fontWeight: 'bold' }}>{t('gl.net_profit', 'Net Profit')}</td>
                                                    <td style={{ padding: '8px', textAlign: 'right', fontWeight: 600, color: '#2e7d32' }}>
                                                        {formatCurrency(glData.net_Profit)}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style={{ padding: '8px', fontWeight: 'bold' }}>{t('gl.profit_margin', 'Profit Margin')}</td>
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
                        <Typography color="textSecondary">{t('common.no_data', 'No data available for selected date.')}</Typography>
                    </Paper>
                )}
            </Container>
        </Box>
    );
};

export default GLDashboard;
