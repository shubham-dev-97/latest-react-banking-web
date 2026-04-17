import React, { useState, useEffect, useMemo } from 'react';
import {
    Box, Container, Grid, Paper,
    Typography, FormControl, InputLabel,
    Select, MenuItem, TextField, Chip, CircularProgress, Stack,
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, TablePagination, InputAdornment, Button, Alert
} from '@mui/material';
import {
    AccountBalance, People, TrendingUp, Savings,
    Warning, Assessment, AttachMoney, AccountBalanceWallet,
    TrendingDown, TrendingFlat, PeopleAlt, CalendarToday, Percent,
    Search as SearchIcon, Download as DownloadIcon,
    Clear as ClearIcon, Assignment as AssignmentIcon,
    Visibility as VisibilityIcon, CheckCircle
} from '@mui/icons-material';
import { useHomeKpi, useBankingSummary, useMonthlyTrend, useDepositAnalysis, useLoanAnalysis, usePortfolioOverview, useInterestAndOverdueKPI, useAlmBucketRBI, useDepLoanMonthlyTrendWithCDRatio, useRbiLoanAuditDump, useRbiDepositAuditDumpPaginated } from '../hooks/useDashboardData';
import { useHomeCustomerSummary, useAvailableDates } from '../hooks/useCustomerData';
import { formatCurrency, formatNumber, formatPercentage } from '../utils/formatters';
import MonthlyTrendChart from '../components/dashboard/MonthlyTrendChart';
import { useDepositOpeningSummary } from '../hooks/useDepositData';
import { useNPASummary } from '../hooks/useNPAData';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { useHCDistribution } from '../hooks/useLoanData';
import AlmBucketChart from '../components/dashboard/AlmBucketChart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { useCurrency } from '../contexts/CurrencyContext';
import CancelIcon from '@mui/icons-material/Cancel';
import DepLoanTrendChart from '../components/dashboard/DepLoanTrendChart';
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

    // Fetch ALM data
    const { data: almData, isLoading: almLoading } = useAlmBucketRBI(
        selectedDate !== 'all' ? selectedDate : ''
    );

    const { data: depLoanTrend, isLoading: depLoanTrendLoading } = useDepLoanMonthlyTrendWithCDRatio(
        selectedDate !== 'all' ? selectedDate : ''
    );

    const { data: rbiAuditData, isLoading: rbiAuditLoading } = useRbiLoanAuditDump(
        selectedDate !== 'all' ? selectedDate : ''
    );

    // For Deposit Audit - Paginated version
    const [depositSearchTerm, setDepositSearchTerm] = useState('');
    const [depositPage, setDepositPage] = useState(1);
    const [depositRowsPerPage, setDepositRowsPerPage] = useState(50);

    // Fetch paginated deposit data
    const { data: depositPaginatedData, isLoading: rbiDepositLoading, refetch: refetchDeposit } = useRbiDepositAuditDumpPaginated(
        selectedDate !== 'all' ? selectedDate : '',
        depositPage,
        depositRowsPerPage
    );

    const rbiDepositData = depositPaginatedData?.data || [];
    const totalDepositCount = depositPaginatedData?.totalCount || 0;

    useEffect(() => {
    document.title = 'CEO Dashboard | Banking Dashboard';
}, []);

    // Set first available date as default when dates load
    useEffect(() => {
        if (availableDates && availableDates.length > 0 && !selectedDate) {
            setSelectedDate(availableDates[0]);
        }
    }, [availableDates]);

    // Update year when date changes
    useEffect(() => {
        if (selectedDate && selectedDate !== 'all') {
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

    // For the Audit Loan Dump
    const [searchTerm, setSearchTerm] = useState('');
    const [rbiClassFilter, setRbiClassFilter] = useState('');
    const [securityTypeFilter, setSecurityTypeFilter] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // Filter and paginate audit data
    const filteredAuditData = useMemo(() => {
        if (!rbiAuditData) return [];
        
        return rbiAuditData.filter(item => {
            if (searchTerm) {
                const searchLower = searchTerm.toLowerCase();
                const matchesSearch = 
                    item.loaN_ACCOUNT_NO?.toString().includes(searchTerm) ||
                    item.borroweR_NAME?.toLowerCase().includes(searchLower) ||
                    item.paN_NO?.toLowerCase().includes(searchLower);
                if (!matchesSearch) return false;
            }
            if (rbiClassFilter && item.rbI_ASSET_CLASS !== rbiClassFilter) return false;
            if (securityTypeFilter && item.securitY_TYPE !== securityTypeFilter) return false;
            return true;
        });
    }, [rbiAuditData, searchTerm, rbiClassFilter, securityTypeFilter]);

    const paginatedAuditData = useMemo(() => {
        return filteredAuditData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    }, [filteredAuditData, page, rowsPerPage]);

    // Export function for Loan Audit
    const handleExportAuditCSV = () => {
        if (!filteredAuditData.length) return;
        
        const headers = ['Loan Account No', 'Borrower Name', 'Branch', 'Outstanding', 'Overdue', 'Days Past Due', 'RBI Asset Class', 'Security Type', 'Provision'];
        const csvData = filteredAuditData.map(item => [
            item.loaN_ACCOUNT_NO,
            item.borroweR_NAME,
            item.brancH_ID,
            item.outstandinG_AMOUNT,
            item.overduE_AMOUNT,
            item.dayS_PAST_DUE,
            item.rbI_ASSET_CLASS,
            item.securitY_TYPE,
            item.totaL_PROVISION
        ]);
        
        const csvContent = [headers, ...csvData].map(row => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `RBI_Loan_Audit_${selectedDate}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    //For Deposit Audit
    const handleExportDepositCSV = () => {
    if (!rbiDepositData.length) return;
    
    const headers = ['Account No', 'Customer Name', 'Branch', 'Current Balance', 'Deposit Amount', 'Maturity Date', 'KYC Status', 'Account Status'];
    const csvData = rbiDepositData.map(item => [
        item.accounT_NO,
        item.customeR_NAME,
        item.brancH_ID,
        item.currenT_BALANCE,
        item.deposiT_AMOUNT,
        item.maturitY_DATE,
        item.kyC_STATUS,
        item.accounT_ACTIVITY_STATUS
    ]);
    
    const csvContent = [headers, ...csvData].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `RBI_Deposit_Audit_Page${depositPage}_${selectedDate}.csv`;
    a.click();
    URL.revokeObjectURL(url);
};
    const handleClearFilters = () => {
        setSearchTerm('');
        setRbiClassFilter('');
        setSecurityTypeFilter('');
        setPage(0);
    };

    const handleClearDepositFilters = () => {
        setDepositSearchTerm('');
        setDepositPage(1);
        refetchDeposit();
    };

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FF6B6B', '#6B66FF'];
    const { formatCurrency, formatNumber } = useCurrency();

    return (
        <Box sx={{ width: '100%', height: '100%', overflow: 'auto' }}>
            <Container maxWidth={false} sx={{ py: 2, px: { xs: 1, md: 2 } }}>
                {/* Filters Section */}
                <Paper sx={{ p: 2, mb: 3 }}>
                    <Grid container spacing={2} alignItems="center">
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
                            value={(customerSummary?.totalDepositCustomers)}
                            icon={<People />}
                            colorIndex={2}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <StyledCard
                            title="Total Loan Customers"
                            value={(customerSummary?.totalLoanCustomers)}
                            icon={<People />}
                            colorIndex={4}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <StyledCard
                            title="Total Customers"
                            value={(customerSummary?.totalCustomers)}
                            subtitle="Deposit + Loan"
                            icon={<PeopleAlt />}
                            colorIndex={0}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <StyledCard
                            title="NPA Customers"
                            value={(customerSummary?.npaCustomers)}
                            subtitle="Non-Performing Assets"
                            icon={<Warning />}
                            colorIndex={1}
                        />
                    </Grid>
                </Grid>

                {/* Deposit Opening Summary */}
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
                                value={(depositOpening?.totalDepositOpenLast30Days)}
                                icon={<CalendarToday />}
                                colorIndex={2}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                            <StyledCard
                                title="Total Active Accounts"
                                value={(depositOpening?.totalDepositAccountInBank)}
                                icon={<AccountBalance />}
                                colorIndex={3}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                            <StyledCard
                                title="Total Deposit Amount"
                                value={formatCurrency(depositOpening?.totalDepositAmount)}
                                icon={<AttachMoney />}
                                colorIndex={0}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                            <StyledCard
                                title="Opening Percentage"
                                value={`${(depositOpening?.openingPercentage || 0).toFixed(2)}%`}
                                subtitle="New accounts vs Total"
                                icon={<Percent />}
                                colorIndex={5}
                            />
                        </Grid>
                    </Grid>
                )}

                {/* NPA Summary */}
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
                                value={(npaSummary?.totalNPAOpenLast30Days)}
                                icon={<WarningAmberIcon />}
                                colorIndex={1}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                            <StyledCard
                                title="Total NPA Accounts"
                                value={(npaSummary?.totalNPAAccountInBank)}
                                icon={<Warning />}
                                colorIndex={1}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                            <StyledCard
                                title="Total NPA Amount"
                                value={formatCurrency(npaSummary?.totalNPAAmount)}
                                icon={<AttachMoney />}
                                colorIndex={1}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                            <StyledCard
                                title="NPA Opening %"
                                value={`${(npaSummary?.openingPercentage || 0).toFixed(2)}%`}
                                subtitle="New NPA vs Total"
                                icon={<Percent />}
                                colorIndex={1}
                            />
                        </Grid>
                    </Grid>
                )}

                {/* HC Distribution Chart */}
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
             
                {/* ALM Bucket Analysis */}
                <Typography variant="h6" sx={{ mt: 4, mb: 2, fontWeight: 600, color: '#1a237e' }}>
                    ALM - RBI Bucket Analysis (as on {selectedDate})
                </Typography>

                {selectedDate === 'all' ? (
                    <Paper sx={{ p: 3, mb: 4, bgcolor: '#f5f5f5', textAlign: 'center' }}>
                        <Typography variant="body1" color="textSecondary">
                            Please select a specific date to view ALM bucket analysis.
                        </Typography>
                    </Paper>
                ) : (
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12 }}>
                            <AlmBucketChart 
                                data={almData || []} 
                                loading={almLoading}
                            />
                        </Grid>
                    </Grid>
                )}

                {/* Deposit vs Loan Trend with CD Ratio */}
                <Typography variant="h6" sx={{ mt: 4, mb: 2, fontWeight: 600, color: '#1a237e' }}>
                    Credit-Deposit Ratio Analysis
                </Typography>

                <DepLoanTrendChart 
                    data={depLoanTrend || []} 
                    loading={depLoanTrendLoading}
                />
                
                {/* RBI Loan Audit Table */}
                <Typography variant="h6" sx={{ mt: 4, mb: 2, fontWeight: 600, color: '#1a237e', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AssignmentIcon /> RBI Loan Audit Report
                    <Chip label="As per RBI Guidelines" size="small" color="primary" />
                </Typography>

                {selectedDate === 'all' ? (
                    <Paper sx={{ p: 3, mb: 4, bgcolor: '#f5f5f5', textAlign: 'center' }}>
                        <Typography variant="body1" color="textSecondary">
                            Please select a specific date to view RBI Loan Audit report.
                        </Typography>
                    </Paper>
                ) : rbiAuditLoading ? (
                    <Paper sx={{ p: 3, mb: 4, textAlign: 'center' }}>
                        <CircularProgress />
                        <Typography sx={{ mt: 2 }}>Loading audit data...</Typography>
                    </Paper>
                ) : rbiAuditData && rbiAuditData.length > 0 ? (
                    <Paper sx={{ p: 2, mb: 4, borderRadius: 3 }}>
                        <Grid container spacing={2} sx={{ mb: 2 }}>
                            <Grid size={{ xs: 6, sm: 3, md: 2 }}>
                                <StyledCard
                                    title="Total Accounts"
                                    value={formatNumber(rbiAuditData.length)}
                                    icon={<AssignmentIcon />}
                                    colorIndex={0}
                                />
                            </Grid>
                            <Grid size={{ xs: 6, sm: 3, md: 2 }}>
                                <StyledCard
                                    title="Total Outstanding"
                                    value={formatCurrency(rbiAuditData.reduce((sum, item) => sum + (item.outstandinG_AMOUNT || 0), 0))}
                                    icon={<AttachMoney />}
                                    colorIndex={2}
                                />
                            </Grid>
                            <Grid size={{ xs: 6, sm: 3, md: 2 }}>
                                <StyledCard
                                    title="Total Overdue"
                                    value={formatCurrency(rbiAuditData.reduce((sum, item) => sum + (item.overduE_AMOUNT || 0), 0))}
                                    icon={<Warning />}
                                    colorIndex={1}
                                />
                            </Grid>
                            <Grid size={{ xs: 6, sm: 3, md: 2 }}>
                                <StyledCard
                                    title="NPA Accounts"
                                    value={formatNumber(rbiAuditData.filter(item => item.rbI_ASSET_CLASS === 'NPA').length)}
                                    icon={<CancelIcon />}
                                    colorIndex={1}
                                />
                            </Grid>
                            <Grid size={{ xs: 6, sm: 3, md: 2 }}>
                                <StyledCard
                                    title="SMA Accounts"
                                    value={formatNumber(rbiAuditData.filter(item => item.rbI_ASSET_CLASS?.startsWith('SMA')).length)}
                                    icon={<Warning />}
                                    colorIndex={4}
                                />
                            </Grid>
                            <Grid size={{ xs: 6, sm: 3, md: 2 }}>
                                <StyledCard
                                    title="Provision Coverage"
                                    value={formatPercentage(
                                        rbiAuditData.reduce((sum, item) => sum + (item.outstandinG_AMOUNT || 0), 0) > 0
                                            ? (rbiAuditData.reduce((sum, item) => sum + (item.totaL_PROVISION || 0), 0) / 
                                               rbiAuditData.reduce((sum, item) => sum + (item.outstandinG_AMOUNT || 0), 0)) * 100
                                            : 0
                                    )}
                                    icon={<TrendingUp />}
                                    colorIndex={5}
                                />
                            </Grid>
                        </Grid>

                        <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
                            <TextField
                                size="small"
                                placeholder="Search by Account No, Name, PAN..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                sx={{ minWidth: 250 }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <FormControl size="small" sx={{ minWidth: 150 }}>
                                <InputLabel>RBI Asset Class</InputLabel>
                                <Select
                                    value={rbiClassFilter}
                                    label="RBI Asset Class"
                                    onChange={(e) => setRbiClassFilter(e.target.value)}
                                >
                                    <MenuItem value="">All</MenuItem>
                                    <MenuItem value="STANDARD">Standard</MenuItem>
                                    <MenuItem value="SMA-0">SMA-0</MenuItem>
                                    <MenuItem value="SMA-1">SMA-1</MenuItem>
                                    <MenuItem value="SMA-2">SMA-2</MenuItem>
                                    <MenuItem value="NPA">NPA</MenuItem>
                                </Select>
                            </FormControl>
                            <FormControl size="small" sx={{ minWidth: 150 }}>
                                <InputLabel>Security Type</InputLabel>
                                <Select
                                    value={securityTypeFilter}
                                    label="Security Type"
                                    onChange={(e) => setSecurityTypeFilter(e.target.value)}
                                >
                                    <MenuItem value="">All</MenuItem>
                                    <MenuItem value="SECURED">Secured</MenuItem>
                                    <MenuItem value="UNSECURED">Unsecured</MenuItem>
                                </Select>
                            </FormControl>
                            <Button 
                                size="small" 
                                variant="outlined" 
                                startIcon={<ClearIcon />}
                                onClick={handleClearFilters}
                            >
                                Clear Filters
                            </Button>
                            <Button 
                                size="small" 
                                variant="outlined" 
                                startIcon={<DownloadIcon />}
                                onClick={handleExportAuditCSV}
                            >
                                Export
                            </Button>
                        </Box>

                        <TableContainer sx={{ maxHeight: 500 }}>
                            <Table stickyHeader size="small">
                                <TableHead>
                                    <TableRow sx={{ bgcolor: '#1a237e' }}>
                                        <TableCell sx={{ fontWeight: 'bold', bgcolor: '#1a237e', color: 'white' }}>Loan Account No</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold', bgcolor: '#1a237e', color: 'white' }}>Borrower Name</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold', bgcolor: '#1a237e', color: 'white' }}>Branch</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 'bold', bgcolor: '#1a237e', color: 'white' }}>Outstanding</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 'bold', bgcolor: '#1a237e', color: 'white' }}>Overdue</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 'bold', bgcolor: '#1a237e', color: 'white' }}>Days Past Due</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold', bgcolor: '#1a237e', color: 'white' }}>RBI Asset Class</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold', bgcolor: '#1a237e', color: 'white' }}>Security Type</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 'bold', bgcolor: '#1a237e', color: 'white' }}>Provision</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {paginatedAuditData.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={9} align="center" sx={{ py: 3 }}>
                                                <Typography color="textSecondary">No records found</Typography>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        paginatedAuditData.map((row, index) => (
                                            <TableRow key={index} hover sx={{ 
                                                bgcolor: row.rbI_ASSET_CLASS === 'NPA' ? '#FFEBEE' : 'inherit'
                                            }}>
                                                <TableCell>{row.loaN_ACCOUNT_NO}</TableCell>
                                                <TableCell>{row.borroweR_NAME}</TableCell>
                                                <TableCell>{row.brancH_ID}</TableCell>
                                                <TableCell align="right" sx={{ fontWeight: 500, color: '#F44336' }}>
                                                    {formatCurrency(row.outstandinG_AMOUNT)}
                                                </TableCell>
                                                <TableCell align="right" sx={{ color: row.overduE_AMOUNT > 0 ? '#D32F2F' : 'inherit' }}>
                                                    {formatCurrency(row.overduE_AMOUNT)}
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Chip 
                                                        label={`${row.dayS_PAST_DUE} days`}
                                                        size="small"
                                                        color={row.dayS_PAST_DUE > 90 ? 'error' : row.dayS_PAST_DUE > 30 ? 'warning' : 'success'}
                                                        variant="outlined"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Chip 
                                                        label={row.rbI_ASSET_CLASS}
                                                        size="small"
                                                        color={
                                                            row.rbI_ASSET_CLASS === 'NPA' ? 'error' :
                                                            row.rbI_ASSET_CLASS?.startsWith('SMA') ? 'warning' : 'success'
                                                        }
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Chip 
                                                        label={row.securitY_TYPE || 'N/A'}
                                                        size="small"
                                                        variant="outlined"
                                                    />
                                                </TableCell>
                                                <TableCell align="right">{formatCurrency(row.totaL_PROVISION)}</TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                            <TablePagination
                                rowsPerPageOptions={[10, 25, 50]}
                                component="div"
                                count={filteredAuditData.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={(e, newPage) => setPage(newPage)}
                                onRowsPerPageChange={(e) => {
                                    setRowsPerPage(parseInt(e.target.value, 10));
                                    setPage(0);
                                }}
                            />
                        </Box>
                    </Paper>
                ) : (
                    <Paper sx={{ p: 3, mb: 4, textAlign: 'center' }}>
                        <Typography color="textSecondary">No RBI Loan Audit data available for this date.</Typography>
                    </Paper>
                )}

                {/* RBI Deposit Audit Table with Pagination */}
                <Typography variant="h6" sx={{ mt: 4, mb: 2, fontWeight: 600, color: '#1a237e', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Savings /> RBI Deposit Audit Report
                    <Chip label="As per RBI Guidelines" size="small" color="primary" />
                    {totalDepositCount > 0 && (
                        <Chip 
                            label={`${totalDepositCount.toLocaleString()} total records`} 
                            size="small" 
                            variant="outlined" 
                            color="info"
                        />
                    )}
                </Typography>

                {selectedDate === 'all' ? (
                    <Paper sx={{ p: 3, mb: 4, bgcolor: '#f5f5f5', textAlign: 'center' }}>
                        <Typography variant="body1" color="textSecondary">
                            Please select a specific date to view RBI Deposit Audit report.
                        </Typography>
                    </Paper>
                ) : rbiDepositLoading ? (
                    <Paper sx={{ p: 3, mb: 4, textAlign: 'center' }}>
                        <CircularProgress />
                        <Typography sx={{ mt: 2 }}>Loading deposit audit data...</Typography>
                    </Paper>
                ) : rbiDepositData && rbiDepositData.length > 0 ? (
                    <Paper sx={{ p: 2, mb: 4, borderRadius: 3 }}>
                        <Grid container spacing={2} sx={{ mb: 2 }}>
                            <Grid size={{ xs: 6, sm: 3, md: 2 }}>
                                <StyledCard
                                    title="Total Accounts"
                                    value={formatNumber(totalDepositCount)}
                                    icon={<Savings />}
                                    colorIndex={0}
                                />
                            </Grid>
                            <Grid size={{ xs: 6, sm: 3, md: 2 }}>
                               <StyledCard
    title="Total Balance"
    value={formatCurrency(rbiDepositData.reduce((sum, item) => sum + (item.currenT_BALANCE || 0), 0))}
    icon={<AttachMoney />}
    colorIndex={2}
/>
                            </Grid>
                            <Grid size={{ xs: 6, sm: 3, md: 2 }}>
                                      <StyledCard
    title="Total Deposit"
    value={formatCurrency(rbiDepositData.reduce((sum, item) => sum + (item.deposiT_AMOUNT || 0), 0))}
    icon={<AccountBalance />}
    colorIndex={3}
/>
                            </Grid>
                            <Grid size={{ xs: 6, sm: 3, md: 2 }}>
            <StyledCard
    title="KYC Pending"
    value={formatNumber(rbiDepositData.filter(item => item.kyC_STATUS !== 'FULL').length)}
    icon={<Warning />}
    colorIndex={1}
/>

                            </Grid>
                            <Grid size={{ xs: 6, sm: 3, md: 2 }}>
                                           <StyledCard
    title="High Value Accounts"
    value={formatNumber(rbiDepositData.filter(item => item.deposiT_SIZE_FLAG === 'HIGH_VALUE').length)}
    icon={<TrendingUp />}
    colorIndex={4}
/>
                            </Grid>
                            <Grid size={{ xs: 6, sm: 3, md: 2 }}>
                                           <StyledCard
    title="Inoperative Accounts"
    value={formatNumber(rbiDepositData.filter(item => item.accounT_ACTIVITY_STATUS === 'INOPERATIVE').length)}
    icon={<Warning />}
    colorIndex={1}
/>
                            </Grid>
                        </Grid>

                        <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
                            <TextField
                                size="small"
                                placeholder="Search by Account No, Name, Mobile..."
                                value={depositSearchTerm}
                                onChange={(e) => {
                                    setDepositSearchTerm(e.target.value);
                                    setDepositPage(1);
                                }}
                                sx={{ minWidth: 250 }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <Button 
                                size="small" 
                                variant="outlined" 
                                startIcon={<ClearIcon />}
                                onClick={handleClearDepositFilters}
                            >
                                Clear Filters
                            </Button>
                            <Button 
                                size="small" 
                                variant="outlined" 
                                startIcon={<DownloadIcon />}
                                onClick={handleExportDepositCSV}
                            >
                                Export
                            </Button>
                            <Typography variant="caption" sx={{ alignSelf: 'center', ml: 'auto', color: '#666' }}>
                                Showing {rbiDepositData.length} of {totalDepositCount.toLocaleString()} records
                            </Typography>
                        </Box>

                        <TableContainer sx={{ maxHeight: 500 }}>
                            <Table stickyHeader size="small">
                                <TableHead>
                                    <TableRow sx={{ bgcolor: '#1a237e' }}>
                                        <TableCell sx={{ fontWeight: 'bold', bgcolor: '#1a237e', color: 'white' }}>Account No</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold', bgcolor: '#1a237e', color: 'white' }}>Customer Name</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold', bgcolor: '#1a237e', color: 'white' }}>Branch</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 'bold', bgcolor: '#1a237e', color: 'white' }}>Current Balance</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 'bold', bgcolor: '#1a237e', color: 'white' }}>Deposit Amount</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold', bgcolor: '#1a237e', color: 'white' }}>Maturity Date</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold', bgcolor: '#1a237e', color: 'white' }}>KYC Status</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold', bgcolor: '#1a237e', color: 'white' }}>Account Status</TableCell>
                                    </TableRow>
                                </TableHead>
                                  <TableBody>
    {rbiDepositData.length === 0 ? (
        <TableRow>
            <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                <Typography color="textSecondary">No records found</Typography>
            </TableCell>
        </TableRow>
    ) : (
        rbiDepositData.map((row, index) => (
            <TableRow key={index} hover>
                <TableCell>{row.accounT_NO}</TableCell>
                <TableCell>{row.customeR_NAME}</TableCell>
                <TableCell>{row.brancH_ID}</TableCell>
                <TableCell align="right" sx={{ fontWeight: 500, color: '#1976D2' }}>
                    {formatCurrency(row.currenT_BALANCE)}
                </TableCell>
                <TableCell align="right">{formatCurrency(row.deposiT_AMOUNT)}</TableCell>
                <TableCell>{row.maturitY_DATE ? new Date(row.maturitY_DATE).toLocaleDateString() : '-'}</TableCell>
                <TableCell>
                    <Chip 
                        label={row.kyC_STATUS || 'PENDING'}
                        size="small"
                        color={row.kyC_STATUS === 'FULL' ? 'success' : 'warning'}
                        variant="outlined"
                    />
                </TableCell>
                <TableCell>
                    <Chip 
                        label={row.accounT_ACTIVITY_STATUS || 'ACTIVE'}
                        size="small"
                        color={row.accounT_ACTIVITY_STATUS === 'INOPERATIVE' ? 'error' : 'success'}
                        variant="outlined"
                    />
                </TableCell>
            </TableRow>
        ))
    )}
</TableBody>
                            </Table>
                        </TableContainer>
                        
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                            <TablePagination
                                rowsPerPageOptions={[25, 50, 100, 200]}
                                component="div"
                                count={totalDepositCount}
                                rowsPerPage={depositRowsPerPage}
                                page={depositPage - 1}
                                onPageChange={(e, newPage) => setDepositPage(newPage + 1)}
                                onRowsPerPageChange={(e) => {
                                    setDepositRowsPerPage(parseInt(e.target.value, 10));
                                    setDepositPage(1);
                                }}
                            />
                        </Box>
                    </Paper>
                ) : (
                    <Paper sx={{ p: 3, mb: 4, textAlign: 'center' }}>
                        <Typography color="textSecondary">No RBI Deposit Audit data available for this date.</Typography>
                    </Paper>
                )}
            </Container>
        </Box>
    );
};

export default Home;