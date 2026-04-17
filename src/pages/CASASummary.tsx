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
import { formatCurrency, formatNumber } from '../utils/formatters';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import { useCurrency } from '../contexts/CurrencyContext';
import StyledCard from '../components/common/StyledCard';

const COLORS = ['#1976d2', '#4caf50', '#ff9800', '#f44336', '#9c27b0', '#00acc1'];

const CASASummary: React.FC = () => {
    const [selectedDate, setSelectedDate] = useState<string>('2025-03-31');

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
        { name: 'Savings CASA', value: savingsData?.total_Balance || 0 },
        { name: 'Current CASA', value: currentData?.total_Balance || 0 },
    ];

    // Prepare bar chart data for last 30 days increase
    const increaseData = [
        { name: 'Savings', amount: savingsIncrease?.total_Balance || 0, count: savingsIncrease?.cnt || 0 },
        { name: 'Current', amount: currentIncrease?.total_Balance || 0, count: currentIncrease?.cnt || 0 },
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
                        <Typography>Loading CASA data...</Typography>
                    </Paper>
                ) : (
                    <>
                        {/* Summary Cards */}
                        <Grid container spacing={2} sx={{ mb: 4 }}>
                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                <StyledCard
                                    title="Total CASA Balance"
                                    value={formatCurrency(totalCASA)}
                                    icon={<AccountBalanceWallet />}
                                    colorIndex={2} // Blue
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                <StyledCard
                                    title="Total CASA Accounts"
                                    value={(totalAccounts)}
                                    icon={<AccountBalance />}
                                    colorIndex={3} // Green
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                <StyledCard
                                    title="Avg Balance Per Account"
                                    value={formatCurrency(avgBalance)}
                                    icon={<AttachMoney />}
                                    colorIndex={4} // Orange
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                <StyledCard
                                    title="Last 30 Days Growth"
                                    value={formatCurrency(totalGrowth)}
                                    subtitle={`${growthPercentage.toFixed(1)}% of total`}
                                    icon={<TrendingUp />}
                                    colorIndex={5} // Teal
                                />
                            </Grid>
                        </Grid>

                        {/* Composition Cards */}
                        <Grid container spacing={2} sx={{ mb: 4 }}>
                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                <StyledCard
                                    title="Savings CASA"
                                    value={formatCurrency(savingsData?.total_Balance)}
                                    subtitle={`${savingsPercentage.toFixed(1)}% of total`}
                                    icon={<Savings />}
                                    colorIndex={0} // Purple
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                <StyledCard
                                    title="Current CASA"
                                    value={formatCurrency(currentData?.total_Balance)}
                                    subtitle={`${currentPercentage.toFixed(1)}% of total`}
                                    icon={<AccountBalance />}
                                    colorIndex={2} // Blue
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                <StyledCard
                                    title="Savings Accounts"
                                    value={(savingsData?.cnt)}
                                    icon={<Assessment />}
                                    colorIndex={0} // Purple
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                <StyledCard
                                    title="Current Accounts"
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
                                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#1a237e' }}>
                                        CASA Distribution by Balance
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
                                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#1a237e' }}>
                                        Last 30 Days Increase by Type
                                    </Typography>
                                    <Box sx={{ height: 280, width: "100%" }}>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={increaseData}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="name" />
                                                <YAxis yAxisId="left" orientation="left" stroke="#1976d2" />
                                                <YAxis yAxisId="right" orientation="right" stroke="#4caf50" />
                                                <Tooltip />
                                                <Legend />
                                                <Bar yAxisId="left" dataKey="amount" name="Amount (₹)" fill="#1976d2" />
                                                <Bar yAxisId="right" dataKey="count" name="Number of Accounts" fill="#4caf50" />
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
                                        <Savings sx={{ color: '#1976d2', mr: 1 }} />
                                        <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a237e' }}>
                                            Savings CASA Details
                                        </Typography>
                                    </Box>
                                    <Divider sx={{ mb: 2 }} />
                                    
                                    <TableContainer>
                                        <Table size="small">
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell><strong>Total Balance</strong></TableCell>
                                                    <TableCell align="right" sx={{ fontWeight: 500, color: '#1976d2' }}>
                                                        {formatCurrency(savingsData?.total_Balance)}
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell><strong>Number of Accounts</strong></TableCell>
                                                    <TableCell align="right" sx={{ fontWeight: 500 }}>
                                                        {formatNumber(savingsData?.cnt)}
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell><strong>Average Balance</strong></TableCell>
                                                    <TableCell align="right" sx={{ fontWeight: 500 }}>
                                                        {formatCurrency((savingsData?.total_Balance || 0) / (savingsData?.cnt || 1))}
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow sx={{ bgcolor: '#e3f2fd' }}>
                                                    <TableCell><strong>Last 30 Days Increase</strong></TableCell>
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
                                                    <TableCell><strong>New Accounts (30 days)</strong></TableCell>
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
                                        <AccountBalance sx={{ color: '#4caf50', mr: 1 }} />
                                        <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a237e' }}>
                                            Current CASA Details
                                        </Typography>
                                    </Box>
                                    <Divider sx={{ mb: 2 }} />
                                    
                                    <TableContainer>
                                        <Table size="small">
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell><strong>Total Balance</strong></TableCell>
                                                    <TableCell align="right" sx={{ fontWeight: 500, color: '#1976d2' }}>
                                                        {formatCurrency(currentData?.total_Balance)}
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell><strong>Number of Accounts</strong></TableCell>
                                                    <TableCell align="right" sx={{ fontWeight: 500 }}>
                                                        {formatNumber(currentData?.cnt)}
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell><strong>Average Balance</strong></TableCell>
                                                    <TableCell align="right" sx={{ fontWeight: 500 }}>
                                                        {formatCurrency((currentData?.total_Balance || 0) / (currentData?.cnt || 1))}
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow sx={{ bgcolor: '#c8e6c9' }}>
                                                    <TableCell><strong>Last 30 Days Increase</strong></TableCell>
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
                                                    <TableCell><strong>New Accounts (30 days)</strong></TableCell>
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