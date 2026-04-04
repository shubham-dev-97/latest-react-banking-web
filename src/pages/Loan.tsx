import React, { useState, useMemo } from 'react';
import {
    Box, Container, Paper, Grid,
    FormControl, InputLabel, Select, MenuItem, TextField,
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Chip, Typography, IconButton,
    Collapse, Card, CardContent, Button, CircularProgress
} from '@mui/material';
import {
    Refresh as RefreshIcon,
    ExpandMore as ExpandMoreIcon,
    ExpandLess as ExpandLessIcon,
    Download as DownloadIcon,
    AccountBalance, TrendingUp, AttachMoney,
    People, Warning, CheckCircle, Cancel
} from '@mui/icons-material';
import { useLoanAnalysis, useLoanPortfolioOverview } from '../hooks/useDashboardData';
import { formatCurrency, formatPercentage, formatNumber } from '../utils/formatters';
import StyledCard from '../components/common/StyledCard';
import { useCurrency } from '../contexts/CurrencyContext';
import { useSharedData } from '../contexts/DataContext';
import { useLoanTrend } from '../hooks/useTrendData';
import TrendChart from '../components/dashboard/TrendChart';

const Loan: React.FC = () => {
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        branchCode: '',
        schemeCode: '',
        purpose: '',
        segment: '',
        accountStatus: '',
        year: new Date().getFullYear(),
    });

    // Get shared data from context
    const { 
        selectedDate,
        setSelectedDate,
        availableDates,
        datesLoading
    } = useSharedData();

    // Fetch portfolio overview data
    const { 
        data: portfolioOverview, 
        isLoading: overviewLoading 
    } = useLoanPortfolioOverview(selectedDate !== 'all' ? selectedDate : '');

    // Fetch detailed loan analysis data
    const { data: detailedData, isLoading: detailedLoading, refetch } = useLoanAnalysis(filters);
    const { data: loanTrend, isLoading: trendLoading } = useLoanTrend(selectedDate !== 'all' ? selectedDate : '');

    const { formatCurrency, formatNumber } = useCurrency();

    // Filter detailed data
    const filteredData = useMemo(() => {
        if (!detailedData) return [];
        
        return detailedData.filter(item => {
            if (filters.branchCode && item.branchCode !== filters.branchCode) return false;
            if (filters.schemeCode && !item.loanSchemeCode?.includes(filters.schemeCode)) return false;
            if (filters.purpose && !item.purpose?.includes(filters.purpose)) return false;
            if (filters.segment && !item.segment?.includes(filters.segment)) return false;
            if (filters.accountStatus && item.accountStatus !== filters.accountStatus) return false;
            if (filters.year && item.disbursementYear !== filters.year) return false;
            return true;
        });
    }, [detailedData, filters]);

    const handleFilterChange = (field: string, value: any) => {
        setFilters(prev => ({ ...prev, [field]: value }));
    };

    const handleRefresh = () => {
        refetch();
    };

    const handleExport = () => {
        console.log('Exporting data...');
    };

    const getStatusColor = (status: string | undefined) => {
        switch(status) {
            case 'ACTIVE': return 'success';
            case 'OVERDUE': return 'error';
            case 'CLOSED': return 'default';
            default: return 'default';
        }
    };

    if (overviewLoading || detailedLoading || datesLoading || trendLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    // Calculate percentages
    const activePercentage = portfolioOverview?.total_Accounts 
        ? (portfolioOverview.active_Accounts / portfolioOverview.total_Accounts) * 100 
        : 0;
    
    const overduePercentage = portfolioOverview?.total_Accounts 
        ? (portfolioOverview.overdue_Accounts / portfolioOverview.total_Accounts) * 100 
        : 0;
    
    const overdueRatio = portfolioOverview?.total_Outstanding 
        ? (portfolioOverview.total_Overdue / portfolioOverview.total_Outstanding) * 100 
        : 0;

    return (
        <Box sx={{ width: '100%', height: '100%', overflow: 'auto', p: 2 }}>
            <Container maxWidth={false}>
                {/* Header Section */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Box>
                        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1a237e' }}>
                            Loan Analysis
                        </Typography>
                        <Typography variant="body1" color="textSecondary">
                            Detailed view of all loan accounts and their performance
                        </Typography>
                    </Box>
                    <Box>
                        <Button 
                            variant="outlined" 
                            startIcon={<DownloadIcon />}
                            onClick={handleExport}
                            sx={{ mr: 1 }}
                        >
                            Export
                        </Button>
                        <Button 
                            variant="outlined" 
                            startIcon={<RefreshIcon />}
                            onClick={handleRefresh}
                        >
                            Refresh
                        </Button>
                    </Box>
                </Box>

                {/* Main Filters - As On Date and Year */}
                <Paper sx={{ p: 2, mb: 3 }}>
                    <Grid container spacing={2} alignItems="center">
                        {/* As On Date Dropdown */}
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
                                size="small"
                                label="Year"
                                type="number"
                                value={filters.year}
                                onChange={(e) => handleFilterChange('year', parseInt(e.target.value) || new Date().getFullYear())}
                                inputProps={{ min: 2020, max: 2030 }}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, md: 3 }}>
                            <Button
                                variant="outlined"
                                startIcon={showFilters ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                onClick={() => setShowFilters(!showFilters)}
                            >
                                Advanced Filters
                            </Button>
                        </Grid>
                    </Grid>

                    {/* Advanced Filters */}
                    <Collapse in={showFilters}>
                        <Grid container spacing={2} sx={{ mt: 2 }}>
                            <Grid size={{ xs: 12, md: 3 }}>
                                <FormControl fullWidth size="small">
                                    <InputLabel>Branch</InputLabel>
                                    <Select
                                        value={filters.branchCode}
                                        label="Branch"
                                        onChange={(e) => handleFilterChange('branchCode', e.target.value)}
                                    >
                                        <MenuItem value="">All Branches</MenuItem>
                                        <MenuItem value="BR001">Branch 001</MenuItem>
                                        <MenuItem value="BR002">Branch 002</MenuItem>
                                        <MenuItem value="BR003">Branch 003</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid size={{ xs: 12, md: 3 }}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    label="Scheme Code"
                                    value={filters.schemeCode}
                                    onChange={(e) => handleFilterChange('schemeCode', e.target.value)}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, md: 3 }}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    label="Purpose"
                                    value={filters.purpose}
                                    onChange={(e) => handleFilterChange('purpose', e.target.value)}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, md: 3 }}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    label="Segment"
                                    value={filters.segment}
                                    onChange={(e) => handleFilterChange('segment', e.target.value)}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, md: 3 }}>
                                <FormControl fullWidth size="small">
                                    <InputLabel>Status</InputLabel>
                                    <Select
                                        value={filters.accountStatus}
                                        label="Status"
                                        onChange={(e) => handleFilterChange('accountStatus', e.target.value)}
                                    >
                                        <MenuItem value="">All</MenuItem>
                                        <MenuItem value="ACTIVE">Active</MenuItem>
                                        <MenuItem value="OVERDUE">Overdue</MenuItem>
                                        <MenuItem value="CLOSED">Closed</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Collapse>
                </Paper>

                {/* KPI Cards - Row 1 */}
                <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <StyledCard
                            title="Total Loan Amount"
                            value={formatCurrency(portfolioOverview?.total_Loan_Amount)}
                            subtitle="Sanctioned amount"
                            icon={<AccountBalance />}
                            colorIndex={0}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <StyledCard
                            title="Total Outstanding"
                            value={formatCurrency(portfolioOverview?.total_Outstanding)}
                            subtitle="Current outstanding"
                            icon={<AttachMoney />}
                            colorIndex={2}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <StyledCard
                            title="Total Overdue"
                            value={formatCurrency(portfolioOverview?.total_Overdue)}
                            subtitle={`${overdueRatio.toFixed(1)}% of outstanding`}
                            icon={<Warning />}
                            colorIndex={1}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <StyledCard
                            title="Average Interest Rate"
                            value={formatPercentage(portfolioOverview?.avg_Interest_Rate)}
                            subtitle="Portfolio average"
                            icon={<TrendingUp />}
                            colorIndex={4}
                        />
                    </Grid>
                </Grid>

                {/* KPI Cards - Row 2 */}
                <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <StyledCard
                            title="Total Accounts"
                            value={formatNumber(portfolioOverview?.total_Accounts)}
                            subtitle="All loan accounts"
                            icon={<People />}
                            colorIndex={0}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <StyledCard
                            title="Active Accounts"
                            value={formatNumber(portfolioOverview?.active_Accounts)}
                            subtitle={`${activePercentage.toFixed(1)}% of total`}
                            icon={<CheckCircle />}
                            colorIndex={3}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <StyledCard
                            title="Overdue Accounts"
                            value={formatNumber(portfolioOverview?.overdue_Accounts)}
                            subtitle={`${overduePercentage.toFixed(1)}% of total`}
                            icon={<Warning />}
                            colorIndex={1}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <StyledCard
                            title="Average Loan Size"
                            value={formatCurrency(portfolioOverview?.avg_Loan_Size)}
                            subtitle="Per account average"
                            icon={<AttachMoney />}
                            colorIndex={5}
                        />
                    </Grid>
                </Grid>

                {/* Loan Trend - Last 6 Months */}
                <Typography variant="h6" sx={{ mt: 4, mb: 2, fontWeight: 600, color: '#1a237e', display: 'flex', alignItems: 'center', gap: 1 }}>
                    📊 Loan Portfolio Trends
                    <Chip label="Last 6 Months" size="small" color="primary" />
                </Typography>

                <Grid container spacing={3} sx={{ mb: 4 }}>
                    {/* Total Outstanding Trend */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <TrendChart
                            title="Total Outstanding Trend"
                            data={loanTrend?.map(item => ({
                                monthName: item.monthName,
                                totalOutstanding: item.totalOutstanding
                            })) || []}
                            type="area"
                            dataKeys={[
                                { key: 'totalOutstanding', name: 'Total Outstanding', color: '#f44336', type: 'currency' }
                            ]}
                            showTrend={true}
                            showAverage={true}
                            gradient={true}
                        />
                    </Grid>

                    {/* Total Sanctioned Trend */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <TrendChart
                            title="Total Sanctioned Trend"
                            data={loanTrend?.map(item => ({
                                monthName: item.monthName,
                                totalSanctioned: item.totalSanctioned
                            })) || []}
                            type="area"
                            dataKeys={[
                                { key: 'totalSanctioned', name: 'Total Sanctioned', color: '#9c27b0', type: 'currency' }
                            ]}
                            showTrend={true}
                            showAverage={true}
                            gradient={true}
                        />
                    </Grid>

                    {/* Account Growth Trend */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <TrendChart
                            title="Account Growth Trend"
                            data={loanTrend?.map(item => ({
                                monthName: item.monthName,
                                accountCount: item.accountCount
                            })) || []}
                            type="bar"
                            dataKeys={[
                                { key: 'accountCount', name: 'Account Count', color: '#4caf50', type: 'number' }
                            ]}
                            showTrend={true}
                            showAverage={true}
                            gradient={false}
                        />
                    </Grid>

                    {/* Average Loan Size Trend */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <TrendChart
                            title="Average Loan Size Trend"
                            data={loanTrend?.map(item => ({
                                monthName: item.monthName,
                                averageLoanSize: item.averageLoanSize
                            })) || []}
                            type="line"
                            dataKeys={[
                                { key: 'averageLoanSize', name: 'Average Loan Size', color: '#ff9800', type: 'currency' }
                            ]}
                            showTrend={true}
                            showAverage={true}
                            gradient={true}
                        />
                    </Grid>

                    {/* Combined View - Outstanding vs Sanctioned */}
                    <Grid size={{ xs: 12 }}>
                        <TrendChart
                            title="Outstanding vs Sanctioned Comparison"
                            data={loanTrend?.map(item => ({
                                monthName: item.monthName,
                                totalOutstanding: item.totalOutstanding,
                                totalSanctioned: item.totalSanctioned
                            })) || []}
                            type="composed"
                            dataKeys={[
                                { key: 'totalOutstanding', name: 'Total Outstanding', color: '#f44336', type: 'currency' },
                                { key: 'totalSanctioned', name: 'Total Sanctioned', color: '#9c27b0', type: 'currency' }
                            ]}
                            showTrend={true}
                            showAverage={true}
                            gradient={true}
                        />
                    </Grid>
                </Grid>

                {/* Detailed Data Table */}
                <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                    <Typography variant="h6" sx={{ p: 2, pb: 0, fontWeight: 600, color: '#1a237e' }}>
                        Detailed Loan Analysis
                    </Typography>
                    <TableContainer sx={{ maxHeight: 500 }}>
                        <Table stickyHeader size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5' }}>Branch</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5' }}>Scheme</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5' }}>Purpose</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5' }}>Segment</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5' }} align="right">Count</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5' }} align="right">Sanctioned</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5' }} align="right">Outstanding</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5' }} align="right">Overdue</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5' }} align="right">Avg Rate</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5' }} align="center">Status</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredData.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={10} align="center" sx={{ py: 3 }}>
                                            <Typography color="textSecondary">No data available</Typography>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredData.map((row, index) => (
                                        <TableRow key={index} hover>
                                            <TableCell>{row.branchCode || '-'}</TableCell>
                                            <TableCell>{row.loanSchemeCode || '-'}</TableCell>
                                            <TableCell>{row.purpose || '-'}</TableCell>
                                            <TableCell>{row.segment || '-'}</TableCell>
                                            <TableCell align="right">{row.loanCount?.toLocaleString()}</TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 500, color: '#9c27b0' }}>
                                                {formatCurrency(row.totalSanctionAmount)}
                                            </TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 500, color: '#f44336' }}>
                                                {formatCurrency(row.totalOutstanding)}
                                            </TableCell>
                                            <TableCell 
                                                align="right" 
                                                sx={{ 
                                                    fontWeight: 600, 
                                                    color: row.totalOverdueAmount ? '#d32f2f' : 'inherit'
                                                }}
                                            >
                                                {formatCurrency(row.totalOverdueAmount)}
                                            </TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 500 }}>
                                                {formatPercentage(row.avgInterestRate)}
                                            </TableCell>
                                            <TableCell align="center">
                                                <Chip 
                                                    label={row.accountStatus || 'Unknown'} 
                                                    color={getStatusColor(row.accountStatus)}
                                                    size="small"
                                                    sx={{ minWidth: 70 }}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </Container>
        </Box>
    );
};

export default Loan;