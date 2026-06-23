import React, { useState } from 'react';
import {
    Box, Container, Grid, Paper,
    Typography, FormControl, InputLabel,
    Select, MenuItem, Card, CardContent,
    Avatar, Stack, Table, TableBody,
    TableCell, TableContainer, TableHead,
    TableRow, Chip, Divider
} from '@mui/material';
import {
    Savings, AccountBalance, TrendingUp,
    AttachMoney, CalendarToday, ArrowUpward,
    AccountBalanceWallet, Percent, ShowChart,
    Assessment
} from '@mui/icons-material';
import { useCASASummary } from '../hooks/useCASAData';
import { useAvailableDates } from '../hooks/useCustomerData';
import { formatCurrency, formatNumber,formatDateToDDMMYYYY } from '../utils/formatters';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import { useCurrency } from '../contexts/CurrencyContext';
import StyledCard from '../components/common/StyledCard';
import { useTranslation } from '../hooks/useTranslation';

const COLORS = ['#2563EB', '#059669', 'secondary.main', '#DC2626', '#7C3AED', '#00acc1'];

const CASASummary: React.FC = () => {
    const [selectedDate, setSelectedDate] = useState<string>('2025-03-31');
    const { t } = useTranslation();

    // Fetch available dates
    const { data: availableDates, isLoading: datesLoading } = useAvailableDates();
    
    // Fetch CASA data
    const { data: casaData, isLoading } = useCASASummary(selectedDate);

    // Process data for different views
    const savingsData = casaData?.find(item => item.deposit_Type === 'Saving CASA');
    const currentData = casaData?.find(item => item.deposit_Type === 'Current Deposit CASA');
    const savingsIncrease = casaData?.find(item => item.deposit_Type === 'Saving INCREASE IN LAST 30 DAYS');
    const currentIncrease = casaData?.find(item => item.deposit_Type === 'Current Deposit INCREASED IN LAST 30 DAYS');

    // Calculate totals
    const totalCASA = (savingsData?.total_Balance || 0) + (currentData?.total_Balance || 0);
    const totalAccounts = (savingsData?.cnt || 0) + (currentData?.cnt || 0);
    const avgBalance = totalAccounts ? totalCASA / totalAccounts : 0;
    const totalGrowth = (savingsIncrease?.total_Balance || 0) + (currentIncrease?.total_Balance || 0);
    const growthPercentage = totalCASA ? (totalGrowth / totalCASA) * 100 : 0;
    
    // Savings vs Current ratio
    const savingsPercentage = totalCASA ? ((savingsData?.total_Balance || 0) / totalCASA) * 100 : 0;
    const currentPercentage = totalCASA ? ((currentData?.total_Balance || 0) / totalCASA) * 100 : 0;

    // Prepare pie chart data
    const pieData = [
        { name: t('casa.savings_casa', 'Savings CASA'), value: savingsData?.total_Balance || 0 },
        { name: t('casa.current_casa', 'Current CASA'), value: currentData?.total_Balance || 0 },
    ];

    // Prepare bar chart data for last 30 days increase
    const increaseData = [
        { name: t('casa.savings', 'Savings'), amount: savingsIncrease?.total_Balance || 0, count: savingsIncrease?.cnt || 0 },
        { name: t('casa.current', 'Current'), amount: currentIncrease?.total_Balance || 0, count: currentIncrease?.cnt || 0 },
    ];
   
    const { formatCurrency, formatNumber } = useCurrency();

    return (
        <Box sx={{ width: '100%', height: '100%', overflow: 'auto', p: 2 }}>
            <Container maxWidth={false}>
                {/* Date Filter */}
                <Paper sx={{ p: 2, mb: 3 }}>
                    <Grid container spacing={2} alignItems="center">
                        <Grid size={{ xs: 12, md: 4 }}>
                            <FormControl fullWidth size="small">
                                <InputLabel>{t('home.as_on_date')}</InputLabel>
                                <Select
                                    value={selectedDate}
                                    label={t('home.as_on_date')}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                >
                                    {datesLoading ? (
                                        <MenuItem disabled>{t('common.loading')}</MenuItem>
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
                        <Typography>{t('common.loading')}</Typography>
                    </Paper>
                ) : (
                    <>
                        {/* Summary Cards */}
                        <Grid container spacing={2} sx={{ mb: 4 }}>
                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                <StyledCard
                                    title={t('dashboard.total_casa_balance')}
                                    value={formatCurrency(totalCASA)}
                                    icon={<AccountBalanceWallet />}
                                    colorIndex={2} // Blue
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                <StyledCard
                                    title={t('dashboard.total_casa_accounts')}
                                    value={(totalAccounts)}
                                    icon={<AccountBalance />}
                                    colorIndex={3} // Green
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                <StyledCard
                                    title={t('dashboard.avg_balance_per_account')}
                                    value={formatCurrency(avgBalance)}
                                    icon={<AttachMoney />}
                                    colorIndex={4} // Orange
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                <StyledCard
                                    title={t('casa.last_30_days_growth', 'Last 30 Days Growth')}
                                    value={formatCurrency(totalGrowth)}
                                    subtitle={`${growthPercentage.toFixed(1)}% ${t('common.of_total', 'of total')}`}
                                    icon={<TrendingUp />}
                                    colorIndex={5} // Teal
                                />
                            </Grid>
                        </Grid>

                        {/* Composition Cards */}
                        <Grid container spacing={2} sx={{ mb: 4 }}>
                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                <StyledCard
                                    title={t('dashboard.savings_casa')}
                                    value={formatCurrency(savingsData?.total_Balance)}
                                    subtitle={`${savingsPercentage.toFixed(1)}% ${t('common.of_total')}`}
                                    icon={<Savings />}
                                    colorIndex={0} // Purple
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                <StyledCard
                                    title={t('dashboard.current_casa')}
                                    value={formatCurrency(currentData?.total_Balance)}
                                    subtitle={`${currentPercentage.toFixed(1)}% ${t('common.of_total')}`}
                                    icon={<AccountBalance />}
                                    colorIndex={2} // Blue
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                <StyledCard
                                    title={t('dashboard.savings_accounts')}
                                    value={(savingsData?.cnt)}
                                    icon={<Assessment />}
                                    colorIndex={0} // Purple
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                <StyledCard
                                    title={t('dashboard.current_accounts')}
                                    value={(currentData?.cnt)}
                                    icon={<Assessment />}
                                    colorIndex={2} // Blue
                                />
                            </Grid>
                        </Grid>

                        {/* Charts Section */}
                        <Grid container spacing={2} sx={{ mb: 4 }}>
                            {/* Pie Chart - CASA Distribution */}
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Paper sx={{ p: 2, height: '100%', minHeight: 350 }}>
                                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'primary.main' }}>
                                        {t('dashboard.casa_distribution')}
                                    </Typography>
                                    <Box sx={{ height: 280, width: "100%" }}>
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

                            {/* Bar Chart - Last 30 Days Increase */}
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Paper sx={{ p: 2, height: '100%', minHeight: 350 }}>
                                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'primary.main' }}>
                                        {t('dashboard.last_30_days_increase')}
                                    </Typography>
                                    <Box sx={{ height: 280, width: "100%" }}>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={increaseData}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="name" />
                                                <YAxis yAxisId="left" orientation="left" stroke="#2563EB" />
                                                <YAxis yAxisId="right" orientation="right" stroke="#059669" />
                                                <Tooltip />
                                                <Legend />
                                                <Bar yAxisId="left" dataKey="amount" name={t('dashboard.amount')} fill="#2563EB" />
                                                <Bar yAxisId="right" dataKey="count" name={t('dashboard.number_of_accounts')} fill="#059669" />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </Box>
                                </Paper>
                            </Grid>
                        </Grid>

                        {/* Detailed Tables */}
                        <Grid container spacing={2}>
                            {/* Savings CASA Details */}
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Paper sx={{ p: 2 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <Savings sx={{ color: '#2563EB', mr: 1 }} />
                                        <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                                            {t('dashboard.savings_casa_details')}
                                        </Typography>
                                    </Box>
                                    <Divider sx={{ mb: 2 }} />
                                    
                                    <TableContainer>
                                        <Table size="small">
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell><strong>{t('dashboard.total_balance')}</strong></TableCell>
                                                    <TableCell align="right" sx={{ fontWeight: 500, color: '#2563EB' }}>
                                                        {formatCurrency(savingsData?.total_Balance)}
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell><strong>{t('dashboard.number_of_accounts')}</strong></TableCell>
                                                    <TableCell align="right" sx={{ fontWeight: 500 }}>
                                                        {formatNumber(savingsData?.cnt)}
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell><strong>{t('dashboard.average_balance')}</strong></TableCell>
                                                    <TableCell align="right" sx={{ fontWeight: 500 }}>
                                                        {formatCurrency((savingsData?.total_Balance || 0) / (savingsData?.cnt || 1))}
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow sx={{ bgcolor: '#e3f2fd' }}>
                                                    <TableCell><strong>{t('dashboard.last_30_days_increase')}</strong></TableCell>
                                                    <TableCell align="right">
                                                        <Chip 
                                                            label={formatCurrency(savingsIncrease?.total_Balance)}
                                                            color="success"
                                                            size="small"
                                                            icon={<ArrowUpward />}
                                                            sx={{ fontWeight: 500 }}
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow sx={{ bgcolor: '#e3f2fd' }}>
                                                    <TableCell><strong>{t('dashboard.new_accounts_30_days')}</strong></TableCell>
                                                    <TableCell align="right">
                                                        <Chip 
                                                            label={formatNumber(savingsIncrease?.cnt)}
                                                            color="info"
                                                            size="small"
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Paper>
                            </Grid>

                            {/* Current CASA Details */}
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Paper sx={{ p: 2 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <AccountBalance sx={{ color: '#059669', mr: 1 }} />
                                        <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                                            {t('dashboard.current_casa_details')}
                                        </Typography>
                                    </Box>
                                    <Divider sx={{ mb: 2 }} />
                                    
                                    <TableContainer>
                                        <Table size="small">
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell><strong>{t('dashboard.total_balance')}</strong></TableCell>
                                                    <TableCell align="right" sx={{ fontWeight: 500, color: '#2563EB' }}>
                                                        {formatCurrency(currentData?.total_Balance)}
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell><strong>{t('dashboard.number_of_accounts')}</strong></TableCell>
                                                    <TableCell align="right" sx={{ fontWeight: 500 }}>
                                                        {formatNumber(currentData?.cnt)}
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell><strong>{t('dashboard.average_balance')}</strong></TableCell>
                                                    <TableCell align="right" sx={{ fontWeight: 500 }}>
                                                        {formatCurrency((currentData?.total_Balance || 0) / (currentData?.cnt || 1))}
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow sx={{ bgcolor: '#c8e6c9' }}>
                                                    <TableCell><strong>{t('dashboard.last_30_days_increase')}</strong></TableCell>
                                                    <TableCell align="right">
                                                        <Chip 
                                                            label={formatCurrency(currentIncrease?.total_Balance)}
                                                            color="success"
                                                            size="small"
                                                            icon={<ArrowUpward />}
                                                            sx={{ fontWeight: 500 }}
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow sx={{ bgcolor: '#c8e6c9' }}>
                                                    <TableCell><strong>{t('dashboard.new_accounts_30_days')}</strong></TableCell>
                                                    <TableCell align="right">
                                                        <Chip 
                                                            label={formatNumber(currentIncrease?.cnt)}
                                                            color="info"
                                                            size="small"
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Paper>
                            </Grid>
                        </Grid>
                    </>
                )}
            </Container>
        </Box>
    );
};

export default CASASummary;
