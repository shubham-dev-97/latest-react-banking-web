import React, { useState, useEffect } from 'react';
import {
    Box, Container, Grid, Paper,
    Typography, FormControl, InputLabel,
    Select, MenuItem, TextField,
} from '@mui/material';
import {
    AccountBalance, People, TrendingUp, Savings,
    Warning, Assessment, AttachMoney, AccountBalanceWallet,
    TrendingDown, TrendingFlat, PeopleAlt, CalendarToday, Percent 
} from '@mui/icons-material';
import { useHomeKpi, useBankingSummary, useMonthlyTrend, useDepositAnalysis, useLoanAnalysis ,usePortfolioOverview, useInterestAndOverdueKPI} from '../hooks/useDashboardData';
import { useHomeCustomerSummary, useAvailableDates } from '../hooks/useCustomerData';
import { formatCurrency, formatNumber, formatPercentage } from '../utils/formatters';
import MonthlyTrendChart from '../components/dashboard/MonthlyTrendChart';
import { useDepositOpeningSummary } from '../hooks/useDepositData';
import { useNPASummary } from '../hooks/useNPAData';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { useHCDistribution } from '../hooks/useLoanData';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useCurrency } from '../contexts/CurrencyContext';

import StyledCard from '../components/common/StyledCard';

// Define types for the totals accumulator
interface TotalsAccumulator {
    totalLoans: number;
    totalDeposits: number;
    totalLoanAccounts: number;
    totalDepositAccounts: number;
}

const Home: React.FC = () => {
    const [branchCode, setBranchCode] = useState<string>('');
    const [year, setYear] = useState<number>(new Date().getFullYear());
    const [selectedDate, setSelectedDate] = useState<string>('2025-03-31');

    // Fetch available dates
    const { data: availableDates, isLoading: datesLoading } = useAvailableDates();

    // Fetch new DepositAccount Opening
    const { data: depositOpening, isLoading: depositOpeningLoading } = useDepositOpeningSummary(
        selectedDate !== 'all' ? selectedDate : ''
    );

    // Fetch all data
    const { data: homeKpi, isLoading: homeKpiLoading } = useHomeKpi({ branchCode, year });
    const { data: summary } = useBankingSummary({ branchCode });
    const { data: depositData } = useDepositAnalysis({ branchCode, year });
    const { data: loanData } = useLoanAnalysis({ branchCode, year });
    const { data: monthlyTrend, isLoading: trendLoading } = useMonthlyTrend({ year });
    const { data: customerSummary, isLoading: customerLoading } = useHomeCustomerSummary(selectedDate);

    // Set first available date as default when dates load
    useEffect(() => {
        if (availableDates && availableDates.length > 0 && !selectedDate) {
            setSelectedDate(availableDates[0]);
        }
    }, [availableDates]);

    // Update year when date changes
    useEffect(() => {
        if (selectedDate) {
            const yearFromDate = parseInt(selectedDate.split('-')[0]);
            setYear(yearFromDate);
        }
    }, [selectedDate]);

    // Calculate totals from summary with proper typing
    const totals: TotalsAccumulator | undefined = summary?.reduce<TotalsAccumulator>(
        (acc, curr) => ({
            totalLoans: (acc.totalLoans || 0) + (curr.totalLoanAmount || 0),
            totalDeposits: (acc.totalDeposits || 0) + (curr.totalDepositAmount || 0),
            totalLoanAccounts: (acc.totalLoanAccounts || 0) + (curr.totalLoanAccounts || 0),
            totalDepositAccounts: (acc.totalDepositAccounts || 0) + (curr.totalDepositAccounts || 0),
        }), 
        { totalLoans: 0, totalDeposits: 0, totalLoanAccounts: 0, totalDepositAccounts: 0 }
    );

    // Calculate average interest rates from HomeKpi
    const avgLoanRateValue = homeKpi?.avgLoanInterest || 0;
    const avgDepositRateValue = homeKpi?.avgDepositInterest || 0;

    // Calculate loan performance metrics from LoanAnalysis data
    const totalOverdue = loanData?.reduce((sum, item) => sum + (item.totalOverdueAmount || 0), 0) || 0;
    const totalOutstanding = loanData?.reduce((sum, item) => sum + (item.totalOutstanding || 0), 0) || 0;
    const overdueRatio = totalOutstanding > 0 ? (totalOverdue / totalOutstanding) * 100 : 0;

    // Calculate deposit metrics from DepositAnalysis data
    const totalDepositBalance = depositData?.reduce((sum, item) => sum + (item.totalBalance || 0), 0) || 0;
    const avgAccountSize = depositData?.length ? totalDepositBalance / depositData.length : 0;

    // Calculate Loan to Deposit Ratio
    const ldr = totals?.totalDeposits ? (totals.totalLoans / totals.totalDeposits) * 100 : 0;

    // Get customer metrics from HomeKpi
    const totalLoanCustomers = homeKpi?.totalLoanCustomers || 0;
    const totalDepositCustomers = homeKpi?.totalDepositCustomers || 0;
    const activeLoanAccounts = homeKpi?.activeLoanAccounts || 0;
    const activeDepositAccounts = homeKpi?.activeDepositAccounts || 0;

    const { data: portfolioOverview, isLoading: portfolioLoading } = usePortfolioOverview(selectedDate);
const { data: kpiData, isLoading: kpiLoading } = useInterestAndOverdueKPI(selectedDate);
   
    const { data: npaSummary, isLoading: npaLoading } = useNPASummary(
        selectedDate !== 'all' ? selectedDate : ''
    );
 
    const { data: hcData, isLoading: hcLoading } = useHCDistribution(
        selectedDate !== 'all' ? selectedDate : ''
    );

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FF6B6B', '#6B66FF'];
    const { formatCurrency, formatNumber } = useCurrency();

    return (
        <Box sx={{ width: '100%', height: '100%', overflow: 'auto' }}>
            <Container maxWidth={false} sx={{ py: 3, px: { xs: 2, md: 3 } }}>
                {/* Header Section */}
                <Box sx={{ mb: 3 }}>
                    <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#1a237e' }}>
                        Banking Dashboard
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                        Welcome back! Here's your bank's performance overview
                    </Typography>
                </Box>

                {/* Filters Section */}
                <Paper sx={{ p: 2, mb: 3 }}>
                    <Grid container spacing={2} alignItems="center">
                        {/* Branch Filter */}
                        <Grid size={{ xs: 12, md: 3 }}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Branch</InputLabel>
                                <Select
                                    value={branchCode}
                                    label="Branch"
                                    onChange={(e) => setBranchCode(e.target.value)}
                                >
                                    <MenuItem value="">All Branches</MenuItem>
                                    <MenuItem value="BR001">Branch 001 - Downtown</MenuItem>
                                    <MenuItem value="BR002">Branch 002 - Uptown</MenuItem>
                                    <MenuItem value="BR003">Branch 003 - Central</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* AS ON DATE Dropdown */}
                        <Grid size={{ xs: 12, md: 3 }}>
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

                        {/* Year Filter */}
                        <Grid size={{ xs: 12, md: 3 }}>
                            <TextField
                                fullWidth
                                label="Year"
                                type="number"
                                size="small"
                                value={year}
                                onChange={(e) => setYear(parseInt(e.target.value) || new Date().getFullYear())}
                                inputProps={{ min: 2020, max: 2030 }}
                            />
                        </Grid>
                    </Grid>
                </Paper>
{/* Portfolio Overview Section */}
<Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#1a237e' }}>
    Portfolio Overview
</Typography>
<Grid container spacing={2} sx={{ mb: 3 }}>
    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <StyledCard
            title="Total Deposit Portfolio"
            value={formatCurrency(portfolioOverview?.total_Deposit)}
            subtitle="All deposit accounts"
            icon={<Savings />}
            colorIndex={3}
        />
    </Grid>
    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <StyledCard
            title="Total Loan Portfolio"
            value={formatCurrency(portfolioOverview?.total_Loan)}
            subtitle="All loan accounts"
            icon={<AccountBalance />}
            colorIndex={0}
        />
    </Grid>
    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <StyledCard
            title="Net Position"
            value={formatCurrency(portfolioOverview?.net_Position)}
            subtitle="Deposits - Loans"
            icon={<AccountBalanceWallet />}
            colorIndex={2}
        />
    </Grid>
    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <StyledCard
            title="Loan to Deposit Ratio"
            value={`${(portfolioOverview?.loan_To_Deposit_Ratio || 0).toFixed(1)}%`}
            subtitle={portfolioOverview?.loan_To_Deposit_Ratio > 100 ? 'High Risk' : 
                     portfolioOverview?.loan_To_Deposit_Ratio > 80 ? 'Moderate' : 'Healthy'}
            icon={<Assessment />}
            colorIndex={4}
        />
    </Grid>
</Grid>

{/* Performance Indicators Section */}
<Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#1a237e' }}>
    Performance Indicators
</Typography>
<Grid container spacing={2} sx={{ mb: 3 }}>
    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <StyledCard
            title="Avg Loan Interest Rate"
            value={formatPercentage(kpiData?.avg_Loan_Interest_Rate)}
            subtitle="Portfolio average"
            icon={<TrendingUp />}
            colorIndex={4}
        />
    </Grid>
    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <StyledCard
            title="Avg Deposit Interest Rate"
            value={formatPercentage(kpiData?.avg_Deposit_Interest_Rate)}
            subtitle="Portfolio average"
            icon={<TrendingDown />}
            colorIndex={3}
        />
    </Grid>
    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <StyledCard
            title="Overdue Amount"
            value={formatCurrency(kpiData?.overdue_Amount)}
            subtitle="Total overdue amount"
            icon={<Warning />}
            colorIndex={1}
        />
    </Grid>
    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <StyledCard
            title="Average Account Size"
            value={formatCurrency(kpiData?.avg_Account_Size)}
            subtitle="Per account average"
            icon={<AttachMoney />}
            colorIndex={5}
        />
    </Grid>
</Grid>

                {/* Customer Summary with Styled Cards */}
                <Typography variant="h6" sx={{ mt: 4, mb: 2, fontWeight: 600, color: '#1a237e' }}>
                    Customer Summary (as of {selectedDate})
                </Typography>
                <Grid container spacing={2} sx={{ mb: 4 }}>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <StyledCard
                            title="Total Deposit Customers"
                            value={formatNumber(customerSummary?.totalDepositCustomers)}
                            icon={<People />}
                            colorIndex={2} // Blue
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <StyledCard
                            title="Total Loan Customers"
                            value={formatNumber(customerSummary?.totalLoanCustomers)}
                            icon={<People />}
                            colorIndex={4} // Orange
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <StyledCard
                            title="Total Customers"
                            value={formatNumber(customerSummary?.totalCustomers)}
                            subtitle="Deposit + Loan"
                            icon={<PeopleAlt />}
                            colorIndex={0} // Purple
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <StyledCard
                            title="NPA Customers"
                            value={formatNumber(customerSummary?.npaCustomers)}
                            subtitle="Non-Performing Assets"
                            icon={<Warning />}
                            colorIndex={1} // Red
                        />
                    </Grid>
                </Grid>

                {/* Deposit Opening Summary with Styled Cards */}
                <Typography variant="h6" sx={{ mt: 4, mb: 2, fontWeight: 600, color: '#1a237e' }}>
                    Deposit Growth Summary {selectedDate !== 'all' ? `(as of ${selectedDate})` : ''}
                </Typography>

                {selectedDate === 'all' ? (
                    <Paper sx={{ p: 3, mb: 4, bgcolor: '#f5f5f5', textAlign: 'center' }}>
                        <Typography variant="body1" color="textSecondary">
                            Please select a specific date to view deposit opening summary.
                        </Typography>
                    </Paper>
                ) : (
                    <Grid container spacing={2} sx={{ mb: 4 }}>
                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                            <StyledCard
                                title="New Accounts (Last 30 Days)"
                                value={formatNumber(depositOpening?.totalDepositOpenLast30Days)}
                                icon={<CalendarToday />}
                                colorIndex={2} // Blue
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                            <StyledCard
                                title="Total Active Accounts"
                                value={formatNumber(depositOpening?.totalDepositAccountInBank)}
                                icon={<AccountBalance />}
                                colorIndex={3} // Green
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                            <StyledCard
                                title="Total Deposit Amount"
                                value={formatCurrency(depositOpening?.totalDepositAmount)}
                                icon={<AttachMoney />}
                                colorIndex={0} // Purple
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                            <StyledCard
                                title="Opening Percentage"
                                value={`${(depositOpening?.openingPercentage || 0).toFixed(2)}%`}
                                subtitle="New accounts vs Total"
                                icon={<Percent />}
                                colorIndex={5} // Teal
                            />
                        </Grid>
                    </Grid>
                )}

                {/* NPA Summary with Styled Cards */}
                <Typography variant="h6" sx={{ mt: 4, mb: 2, fontWeight: 600, color: '#1a237e' }}>
                    NPA Summary {selectedDate !== 'all' ? `(as of ${selectedDate})` : ''}
                </Typography>

                {selectedDate === 'all' ? (
                    <Paper sx={{ p: 3, mb: 4, bgcolor: '#f5f5f5', textAlign: 'center' }}>
                        <Typography variant="body1" color="textSecondary">
                            Please select a specific date to view NPA summary.
                        </Typography>
                    </Paper>
                ) : (
                    <Grid container spacing={2} sx={{ mb: 4 }}>
                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                            <StyledCard
                                title="New NPA (Last 30 Days)"
                                value={formatNumber(npaSummary?.totalNPAOpenLast30Days)}
                                icon={<WarningAmberIcon />}
                                colorIndex={1} // Red
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                            <StyledCard
                                title="Total NPA Accounts"
                                value={formatNumber(npaSummary?.totalNPAAccountInBank)}
                                icon={<Warning />}
                                colorIndex={1} // Red
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                            <StyledCard
                                title="Total NPA Amount"
                                value={formatCurrency(npaSummary?.totalNPAAmount)}
                                icon={<AttachMoney />}
                                colorIndex={1} // Red
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                            <StyledCard
                                title="NPA Opening %"
                                value={`${(npaSummary?.openingPercentage || 0).toFixed(2)}%`}
                                subtitle="New NPA vs Total"
                                icon={<Percent />}
                                colorIndex={1} // Red
                            />
                        </Grid>
                    </Grid>
                )}

                {/* HC Distribution Chart - Keep as is */}
                <Typography variant="h6" sx={{ mt: 4, mb: 2, fontWeight: 600, color: '#1a237e' }}>
                    Housing Category Distribution {selectedDate !== 'all' ? `(as of ${selectedDate})` : ''}
                </Typography>

                {selectedDate === 'all' ? (
                    <Paper sx={{ p: 3, mb: 4, bgcolor: '#f5f5f5', textAlign: 'center' }}>
                        <Typography variant="body1" color="textSecondary">
                            Please select a specific date to view HC distribution.
                        </Typography>
                    </Paper>
                ) : hcLoading ? (
                    <Paper sx={{ p: 3, mb: 4, textAlign: 'center' }}>
                        <Typography>Loading chart data...</Typography>
                    </Paper>
                ) : hcData && hcData.length > 0 ? (
                    <Paper sx={{ p: 3, mb: 4 }}>
                        <Box sx={{ width: '100%', height: 400 }}>
                            <ResponsiveContainer>
                                <BarChart
                                    data={hcData}
                                    margin={{
                                        top: 20,
                                        right: 30,
                                        left: 20,
                                        bottom: 60,
                                    }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis 
                                        dataKey="hc" 
                                        angle={-45} 
                                        textAnchor="end" 
                                        height={80}
                                        interval={0}
                                    />
                                    <YAxis />
                                    <Tooltip 
                                        formatter={(value: number) => [`${value} accounts`, 'Count']}
                                        labelFormatter={(label) => `HC: ${label}`}
                                    />
                                    <Legend />
                                    <Bar dataKey="count" name="Number of Accounts">
                                        {hcData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </Box>
                        
                        {/* Summary Table */}
                        <TableContainer component={Paper} sx={{ mt: 3 }}>
                            <Table size="small">
                                <TableHead>
                                    <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                                        <TableCell><strong>Code</strong></TableCell>
                                        <TableCell align="right"><strong>Number of Accounts</strong></TableCell>
                                        <TableCell align="right"><strong>Percentage</strong></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {hcData.map((item, index) => {
                                        const total = hcData.reduce((sum, i) => sum + i.count, 0);
                                        const percentage = ((item.count / total) * 100).toFixed(1);
                                        return (
                                            <TableRow key={index}>
                                                <TableCell>{item.hc || 'Unknown'}</TableCell>
                                                <TableCell align="right">{formatNumber(item.count)}</TableCell>
                                                <TableCell align="right">{percentage}%</TableCell>
                                            </TableRow>
                                        );
                                    })}
                                    <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                                        <TableCell><strong>TOTAL</strong></TableCell>
                                        <TableCell align="right"><strong>
                                            {formatNumber(hcData.reduce((sum, i) => sum + i.count, 0))}
                                        </strong></TableCell>
                                        <TableCell align="right"><strong>100%</strong></TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                ) : (
                    <Paper sx={{ p: 3, mb: 4, textAlign: 'center' }}>
                        <Typography color="textSecondary">No HC distribution data available for this date.</Typography>
                    </Paper>
                )}

                {/* Monthly Trends Chart */}
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#1a237e' }}>
                    Monthly Trends
                </Typography>
                <MonthlyTrendChart data={monthlyTrend} isLoading={trendLoading} />
            </Container>
        </Box>
    );
};

export default Home;