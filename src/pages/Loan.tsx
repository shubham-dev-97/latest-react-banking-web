import React, { useState, useMemo } from 'react';
import {
    Box, Container, Paper, Grid,
    FormControl, InputLabel, Select, MenuItem, TextField,
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Chip, Typography, IconButton,
    Collapse, Card, CardContent, Button, CircularProgress, TablePagination
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
import { formatCurrency, formatPercentage, formatNumber, formatDateToDDMMYYYY } from '../utils/formatters';
import StyledCard from '../components/common/StyledCard';
import { useCurrency } from '../contexts/CurrencyContext';
import { useSharedData } from '../contexts/DataContext';
import { useLoanTrend } from '../hooks/useTrendData';
import TrendChart from '../components/dashboard/TrendChart';
import { useTranslation } from '../hooks/useTranslation';

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
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // Get shared data from context
    const { 
        selectedDate,
        setSelectedDate,
        availableDates,
        datesLoading
    } = useSharedData();

    // Translation hook
    const { t } = useTranslation();

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
                {/* Header */}
                

                {/* Main Filters - As On Date and Year */}
                <Paper sx={{ p: 2, mb: 3 }}>
                    <Grid container spacing={2} alignItems="center">
                        {/* As On Date Dropdown */}
                        <Grid size={{ xs: 12, md: 3 }}>
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

                        {/* Year Filter */}
                        <Grid size={{ xs: 12, md: 3 }}>
                            <TextField
                                fullWidth
                                size="small"
                                label={t('loan.year')}
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
                                {t('loan.advanced_filters')}
                            </Button>
                        </Grid>
                    </Grid>

                    {/* Advanced Filters */}
                    <Collapse in={showFilters}>
                        <Grid container spacing={2} sx={{ mt: 2 }}>
                            <Grid size={{ xs: 12, md: 3 }}>
                                <FormControl fullWidth size="small">
                                    <InputLabel>{t('loan.branch')}</InputLabel>
                                    <Select
                                        value={filters.branchCode}
                                        label={t('loan.branch')}
                                        onChange={(e) => handleFilterChange('branchCode', e.target.value)}
                                    >
                                        <MenuItem value="">{t('loan.all_branches')}</MenuItem>
                                        <MenuItem value="BR001">Branch 001 - Downtown</MenuItem>
                                        <MenuItem value="BR002">Branch 002 - Uptown</MenuItem>
                                        <MenuItem value="BR003">Branch 003 - Central</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid size={{ xs: 12, md: 3 }}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    label={t('loan.scheme_code')}
                                    value={filters.schemeCode}
                                    onChange={(e) => handleFilterChange('schemeCode', e.target.value)}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, md: 3 }}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    label={t('loan.purpose')}
                                    value={filters.purpose}
                                    onChange={(e) => handleFilterChange('purpose', e.target.value)}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, md: 3 }}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    label={t('loan.segment')}
                                    value={filters.segment}
                                    onChange={(e) => handleFilterChange('segment', e.target.value)}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, md: 3 }}>
                                <FormControl fullWidth size="small">
                                    <InputLabel>{t('loan.account_status')}</InputLabel>
                                    <Select
                                        value={filters.accountStatus}
                                        label={t('loan.account_status')}
                                        onChange={(e) => handleFilterChange('accountStatus', e.target.value)}
                                    >
                                        <MenuItem value="">{t('common.all')}</MenuItem>
                                        <MenuItem value="ACTIVE">{t('loan.active')}</MenuItem>
                                        <MenuItem value="OVERDUE">{t('loan.overdue')}</MenuItem>
                                        <MenuItem value="CLOSED">{t('loan.closed')}</MenuItem>
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
                            title={t('loan.total_loan_amount')}
                            value={formatCurrency(portfolioOverview?.total_Loan_Amount)}
                            subtitle={t('loan.sanctioned_amount')}
                            icon={<AccountBalance />}
                            colorIndex={0}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <StyledCard
                            title={t('loan.total_outstanding')}
                            value={formatCurrency(portfolioOverview?.total_Outstanding)}
                            subtitle={t('loan.current_outstanding')}
                            icon={<AttachMoney />}
                            colorIndex={2}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <StyledCard
                            title={t('loan.total_overdue')}
                            value={formatCurrency(portfolioOverview?.total_Overdue)}
                            subtitle={`${overdueRatio.toFixed(1)}% ${t('loan.of_outstanding')}`}
                            icon={<Warning />}
                            colorIndex={1}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <StyledCard
                            title={t('loan.avg_interest_rate')}
                            value={formatPercentage(portfolioOverview?.avg_Interest_Rate)}
                            subtitle={t('loan.portfolio_average')}
                            icon={<TrendingUp />}
                            colorIndex={4}
                        />
                    </Grid>
                </Grid>

                {/* KPI Cards - Row 2 */}
                <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <StyledCard
                            title={t('loan.total_accounts')}
                            value={(portfolioOverview?.total_Accounts)}
                            subtitle={t('loan.all_loan_accounts')}
                            icon={<People />}
                            colorIndex={0}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <StyledCard
                            title={t('loan.active_accounts')}
                            value={(portfolioOverview?.active_Accounts)}
                            subtitle={`${activePercentage.toFixed(1)}% ${t('loan.of_total')}`}
                            icon={<CheckCircle />}
                            colorIndex={3}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <StyledCard
                            title={t('loan.overdue_accounts')}
                            value={(portfolioOverview?.overdue_Accounts)}
                            subtitle={`${overduePercentage.toFixed(1)}% ${t('loan.of_total')}`}
                            icon={<Warning />}
                            colorIndex={1}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <StyledCard
                            title={t('loan.average_loan_size')}
                            value={formatCurrency(portfolioOverview?.avg_Loan_Size)}
                            subtitle={t('loan.per_account_average')}
                            icon={<AttachMoney />}
                            colorIndex={5}
                        />
                    </Grid>
                </Grid>

                {/* Loan Trend - Last 6 Months */}
                <Typography variant="h6" sx={{ mt: 4, mb: 2, fontWeight: 600, color: 'primary.main', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TrendingUp sx={{ color: '#2563EB' }} /> {t('loan.loan_portfolio_trends')}
                    <Chip label={t('loan.last_6_months')} size="small" color="primary" />
                </Typography>

                <Grid container spacing={3} sx={{ mb: 4 }}>
                    {/* Total Outstanding Trend */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <TrendChart
                            title={t('loan.total_outstanding_trend')}
                            data={loanTrend?.map(item => ({
                                monthName: item.monthName,
                                totalOutstanding: item.totalOutstanding
                            })) || []}
                            type="area"
                            dataKeys={[
                                { key: 'totalOutstanding', name: t('loan.total_outstanding'), color: '#DC2626', type: 'currency' }
                            ]}
                            showTrend={true}
                            showAverage={true}
                            gradient={true}
                        />
                    </Grid>

                    {/* Total Sanctioned Trend */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <TrendChart
                            title={t('loan.total_sanctioned_trend')}
                            data={loanTrend?.map(item => ({
                                monthName: item.monthName,
                                totalSanctioned: item.totalSanctioned
                            })) || []}
                            type="area"
                            dataKeys={[
                                { key: 'totalSanctioned', name: t('loan.total_sanctioned'), color: '#7C3AED', type: 'currency' }
                            ]}
                            showTrend={true}
                            showAverage={true}
                            gradient={true}
                        />
                    </Grid>

                    {/* Account Growth Trend */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <TrendChart
                            title={t('loan.account_growth_trend')}
                            data={loanTrend?.map(item => ({
                                monthName: item.monthName,
                                accountCount: item.accountCount
                            })) || []}
                            type="bar"
                            dataKeys={[
                                { key: 'accountCount', name: t('loan.account_count'), color: '#059669', type: 'number' }
                            ]}
                            showTrend={true}
                            showAverage={true}
                            gradient={false}
                        />
                    </Grid>

                    {/* Average Loan Size Trend */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <TrendChart
                            title={t('loan.average_loan_size_trend')}
                            data={loanTrend?.map(item => ({
                                monthName: item.monthName,
                                averageLoanSize: item.averageLoanSize
                            })) || []}
                            type="line"
                            dataKeys={[
                                { key: 'averageLoanSize', name: t('loan.average_loan_size'), color: 'secondary.main', type: 'currency' }
                            ]}
                            showTrend={true}
                            showAverage={true}
                            gradient={true}
                        />
                    </Grid>

                    {/* Combined View - Outstanding vs Sanctioned */}
                    <Grid size={{ xs: 12 }}>
                        <TrendChart
                            title={t('loan.outstanding_vs_sanctioned')}
                            data={loanTrend?.map(item => ({
                                monthName: item.monthName,
                                totalOutstanding: item.totalOutstanding,
                                totalSanctioned: item.totalSanctioned
                            })) || []}
                            type="composed"
                            dataKeys={[
                                { key: 'totalOutstanding', name: t('loan.total_outstanding'), color: '#DC2626', type: 'currency' },
                                { key: 'totalSanctioned', name: t('loan.total_sanctioned'), color: '#7C3AED', type: 'currency' }
                            ]}
                            showTrend={true}
                            showAverage={true}
                            gradient={true}
                        />
                    </Grid>
                </Grid>

                {/* Detailed Data Table */}
                <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                    <Typography variant="h6" sx={{ p: 2, pb: 0, fontWeight: 600, color: 'primary.main' }}>
                        {t('loan.detailed_loan_analysis')}
                    </Typography>
                    <TableContainer sx={{ maxHeight: 500 }}>
                        <Table stickyHeader size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5' }}>{t('loan.branch')}</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5' }}>{t('loan.scheme')}</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5' }}>{t('loan.purpose')}</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5' }}>{t('loan.segment')}</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5' }} align="right">{t('loan.count')}</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5' }} align="right">{t('loan.sanctioned')}</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5' }} align="right">{t('loan.outstanding')}</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5' }} align="right">{t('loan.overdue')}</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5' }} align="right">{t('loan.avg_rate')}</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5' }} align="center">{t('loan.status')}</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredData.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={10} align="center" sx={{ py: 3 }}>
                                            <Typography color="textSecondary">{t('common.no_data')}</Typography>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                                        <TableRow key={index} hover>
                                            <TableCell>{row.branchCode || '-'}</TableCell>
                                            <TableCell>{row.loanSchemeCode || '-'}</TableCell>
                                            <TableCell>{row.purpose || '-'}</TableCell>
                                            <TableCell>{row.segment || '-'}</TableCell>
                                            <TableCell align="right">{row.loanCount?.toLocaleString()}</TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 500, color: '#7C3AED' }}>
                                                {formatCurrency(row.totalSanctionAmount)}
                                            </TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 500, color: '#DC2626' }}>
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
                                                    label={row.accountStatus || t('common.unknown')} 
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
                    <TablePagination
                        rowsPerPageOptions={[10, 25, 50, 100]}
                        component="div"
                        count={filteredData.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={(e, newPage) => setPage(newPage)}
                        onRowsPerPageChange={(e) => {
                            setRowsPerPage(parseInt(e.target.value, 10));
                            setPage(0);
                        }}
                    />
                </Paper>
            </Container>
        </Box>
    );
};

export default Loan;
