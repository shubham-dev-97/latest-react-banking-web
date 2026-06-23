// import React, { useState, useMemo } from 'react';
// import {
//     Box, Container, Paper, Grid,
//     FormControl, InputLabel, Select, MenuItem, TextField,
//     Table, TableBody, TableCell, TableContainer,
//     TableHead, TableRow, Chip, Typography, IconButton,
//     Collapse, Card, CardContent, Button, CircularProgress
// } from '@mui/material';
// import {
//     Refresh as RefreshIcon,
//     ExpandMore as ExpandMoreIcon,
//     ExpandLess as ExpandLessIcon,
//     Download as DownloadIcon,
//     AccountBalance, TrendingUp, AttachMoney,
//     People, Warning, CheckCircle, Cancel
// } from '@mui/icons-material';
// import { useDepositAnalysis, useDepositPortfolioOverview } from '../hooks/useDashboardData';
// import { formatCurrency, formatPercentage, formatNumber,formatDateToDDMMYYYY } from '../utils/formatters';
// import StyledCard from '../components/common/StyledCard';
// import { useCurrency } from '../contexts/CurrencyContext';
// import { useSharedData } from '../contexts/DataContext';
// import { useDepositTrend } from '../hooks/useTrendData';
// import TrendChart from '../components/dashboard/TrendChart';

// const Deposit: React.FC = () => {
//     const [showFilters, setShowFilters] = useState(false);
//     const [filters, setFilters] = useState({
//         branchCode: '',
//         productCode: '',
//         accountStatus: '',
//         year: new Date().getFullYear(),
//     });

//     // Get shared data from context
//     const { 
//         selectedDate,
//         setSelectedDate,
//         availableDates,
//         datesLoading
//     } = useSharedData();

//     // Fetch portfolio overview data
//     const { 
//         data: portfolioOverview, 
//         isLoading: overviewLoading 
//     } = useDepositPortfolioOverview(selectedDate !== 'all' ? selectedDate : '');

//     // Fetch detailed deposit analysis data
//     const { data: detailedData, isLoading: detailedLoading, refetch } = useDepositAnalysis(filters);
//     const { data: depositTrend, isLoading: trendLoading } = useDepositTrend(selectedDate !== 'all' ? selectedDate : '');

//     const { formatCurrency, formatNumber } = useCurrency();

//     // Filter detailed data
//     const filteredData = useMemo(() => {
//         if (!detailedData) return [];
        
//         return detailedData.filter(item => {
//             if (filters.branchCode && item.branchCode !== filters.branchCode) return false;
//             if (filters.productCode && !item.productCode?.includes(filters.productCode)) return false;
//             if (filters.accountStatus && item.accountStatus !== filters.accountStatus) return false;
//             if (filters.year && item.openYear !== filters.year) return false;
//             return true;
//         });
//     }, [detailedData, filters]);

//     const handleFilterChange = (field: string, value: any) => {
//         setFilters(prev => ({ ...prev, [field]: value }));
//     };

//     const handleRefresh = () => {
//         refetch();
//     };

//     const handleExport = () => {
//         console.log('Exporting data...');
//     };

//     const getStatusColor = (status: string | undefined) => {
//         switch(status) {
//             case 'ACTIVE': return 'success';
//             case 'DORMANT': return 'warning';
//             case 'CLOSED': return 'error';
//             default: return 'default';
//         }
//     };

//     if (overviewLoading || detailedLoading || datesLoading) {
//         return (
//             <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
//                 <CircularProgress />
//             </Box>
//         );
//     }

//     // Calculate active percentage
//     const activePercentage = portfolioOverview?.total_Accounts 
//         ? (portfolioOverview.active_Accounts / portfolioOverview.total_Accounts) * 100 
//         : 0;

//     return (
//         <Box sx={{ width: '100%', height: '100%', overflow: 'auto', p: 2 }}>
//             <Container maxWidth={false}>

//                 {/* Main Filters - As On Date and Year */}
//                 <Paper sx={{ p: 2, mb: 3 }}>
//                     <Grid container spacing={2} alignItems="center">
//                         {/* As On Date Dropdown */}
//                         <Grid size={{ xs: 12, md: 3 }}>
//                             <FormControl fullWidth size="small">
//                                 <InputLabel>As On Date</InputLabel>
//                                 <Select
//                                     value={selectedDate}
//                                     label="As On Date"
//                                     onChange={(e) => setSelectedDate(e.target.value)}
//                                 >
//                                     {datesLoading ? (
//                                         <MenuItem disabled>Loading dates...</MenuItem>
//                                     ) : availableDates?.map((date) => (
//                                         <MenuItem key={date} value={date}>
//                                             {formatDateToDDMMYYYY(date)}
//                                         </MenuItem>
//                                     ))}
//                                 </Select>
//                             </FormControl>
//                         </Grid>
//                     </Grid>
//                 </Paper>

//                 {/* KPI Cards - Using data from stored procedure */}
//                 <Grid container spacing={2} sx={{ mb: 3 }}>
//                     <Grid size={{ xs: 12, sm: 6, md: 3 }}>
//                         <StyledCard
//                             title="Total Balance"
//                             value={formatCurrency(portfolioOverview?.total_Balance)}
//                             icon={<AccountBalance />}
//                             colorIndex={2}
//                         />
//                     </Grid>
//                     <Grid size={{ xs: 12, sm: 6, md: 3 }}>
//                         <StyledCard
//                             title="Total Accounts"
//                             value={formatNumber(portfolioOverview?.total_Accounts)}
//                             icon={<People />}
//                             colorIndex={0}
//                         />
//                     </Grid>
//                     <Grid size={{ xs: 12, sm: 6, md: 3 }}>
//                         <StyledCard
//                             title="Average Balance"
//                             value={formatCurrency(portfolioOverview?.avg_Balance)}
//                             icon={<AttachMoney />}
//                             colorIndex={4}
//                         />
//                     </Grid>
//                     <Grid size={{ xs: 12, sm: 6, md: 3 }}>
//                         <StyledCard
//                             title="Average Interest Rate"
//                             value={formatPercentage(portfolioOverview?.avg_Interest_Rate)}
//                             icon={<TrendingUp />}
//                             colorIndex={4}
//                         />
//                     </Grid>
//                 </Grid>

//                 {/* Second Row of KPI Cards */}
//                 <Grid container spacing={2} sx={{ mb: 3 }}>
//                     <Grid size={{ xs: 12, sm: 6, md: 3 }}>
//                         <StyledCard
//                             title="Active Accounts"
//                             value={formatNumber(portfolioOverview?.active_Accounts)}
//                             subtitle={`${activePercentage.toFixed(1)}% of total`}
//                             icon={<CheckCircle />}
//                             colorIndex={3}
//                         />
//                     </Grid>
//                     <Grid size={{ xs: 12, sm: 6, md: 3 }}>
//                         <StyledCard
//                             title="Dormant Accounts"
//                             value={formatNumber(portfolioOverview?.dormant_Accounts)}
//                             icon={<Warning />}
//                             colorIndex={1}
//                         />
//                     </Grid>
//                     <Grid size={{ xs: 12, sm: 6, md: 3 }}>
//                         <StyledCard
//                             title="Closed Accounts"
//                             value={formatNumber(portfolioOverview?.closed_Accounts)}
//                             icon={<Cancel />}
//                             colorIndex={1}
//                         />
//                     </Grid>
//                     <Grid size={{ xs: 12, sm: 6, md: 3 }}>
//                         <StyledCard
//                             title="Avg Account Size"
//                             value={formatCurrency(portfolioOverview?.avg_Account_Size)}
//                             icon={<AttachMoney />}
//                             colorIndex={5}
//                         />
//                     </Grid>
//                 </Grid>
                   
//                    {/* Deposit Trend - Last 6 Months */}
// <Typography variant="h6" sx={{ mt: 4, mb: 2, fontWeight: 600, color: 'primary.main', display: 'flex', alignItems: 'center', gap: 1 }}>
//     📈 Deposit Trend Analysis
//     <Chip label="Last 6 Months" size="small" color="primary" />
// </Typography>

// <Grid container spacing={3} sx={{ mb: 4 }}>
//     <Grid size={{ xs: 12, md: 6 }}>
//         <TrendChart
//             title="Total Balance Trend"
//             data={depositTrend?.map(item => ({
//                 monthName: item.monthName,
//                 totalBalance: item.totalBalance
//             })) || []}
//             type="area"
//             dataKeys={[
//                 { key: 'totalBalance', name: 'Total Balance', color: '#2563EB', type: 'currency' }
//             ]}
//             showTrend={true}
//             showAverage={true}
//             gradient={true}
//         />
//     </Grid>
//     <Grid size={{ xs: 12, md: 6 }}>
//         <TrendChart
//             title="Account Growth Trend"
//             data={depositTrend?.map(item => ({
//                 monthName: item.monthName,
//                 accountCount: item.accountCount
//             })) || []}
//             type="bar"
//             dataKeys={[
//                 { key: 'accountCount', name: 'Account Count', color: '#059669', type: 'number' }
//             ]}
//             showTrend={true}
//             showAverage={true}
//             gradient={false}
//         />
//     </Grid>
//     <Grid size={{ xs: 12 }}>
//         <TrendChart
//             title="Average Balance Trend"
//             data={depositTrend?.map(item => ({
//                 monthName: item.monthName,
//                 averageBalance: item.averageBalance
//             })) || []}
//             type="line"
//             dataKeys={[
//                 { key: 'averageBalance', name: 'Average Balance', color: 'secondary.main', type: 'currency' }
//             ]}
//             showTrend={true}
//             showAverage={true}
//             gradient={true}
//         />
//     </Grid>
// </Grid>

              
//                 {/* Detailed Data Table */}
//                 <Paper sx={{ width: '100%', overflow: 'hidden' }}>
//                     <Typography variant="h6" sx={{ p: 2, pb: 0, fontWeight: 600, color: 'primary.main' }}>
//                         Detailed Deposit Analysis
//                     </Typography>
//                     <TableContainer sx={{ maxHeight: 500 }}>
//                         <Table stickyHeader size="small">
//                             <TableHead>
//                                 <TableRow>
//                                     <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5' }}>Branch</TableCell>
//                                     <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5' }}>Product</TableCell>
//                                     <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5' }}>Scheme</TableCell>
//                                     <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5' }}>Category</TableCell>
//                                     <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5' }} align="right">Accounts</TableCell>
//                                     <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5' }} align="right">Balance</TableCell>
//                                     <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5' }} align="right">Avg Rate</TableCell>
//                                     <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5' }} align="center">Status</TableCell>
//                                 </TableRow>
//                             </TableHead>
//                             <TableBody>
//                                 {filteredData.length === 0 ? (
//                                     <TableRow>
//                                         <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
//                                             <Typography color="textSecondary">{t('common.no_data_available', 'No data available')}</Typography>
//                                         </TableCell>
//                                     </TableRow>
//                                 ) : (
//                                     filteredData.map((row, idx) => (
//                                         <TableRow key={idx} hover>
//                                             <TableCell>{row.branchCode || '-'}</TableCell>
//                                             <TableCell>{row.productCode || '-'}</TableCell>
//                                             <TableCell>{row.schemeCode || '-'}</TableCell>
//                                             <TableCell>{row.customerCategory || '-'}</TableCell>
//                                             <TableCell align="right">{row.accountCount?.toLocaleString()}</TableCell>
//                                             <TableCell align="right" sx={{ fontWeight: 500, color: '#2563EB' }}>
//                                                 {formatCurrency(row.totalBalance)}
//                                             </TableCell>
//                                             <TableCell align="right">{formatPercentage(row.avgInterestRate)}</TableCell>
//                                             <TableCell align="center">
//                                                 <Chip 
//                                                     label={row.accountStatus || 'Unknown'} 
//                                                     color={getStatusColor(row.accountStatus)} 
//                                                     size="small"
//                                                 />
//                                             </TableCell>
//                                         </TableRow>
//                                     ))
//                                 )}
//                             </TableBody>
//                         </Table>
//                     </TableContainer>
//                 </Paper>
//             </Container>
//         </Box>
//     );
// };

// export default Deposit;





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
import { useDepositAnalysis, useDepositPortfolioOverview } from '../hooks/useDashboardData';
import { formatCurrency, formatPercentage, formatNumber, formatDateToDDMMYYYY } from '../utils/formatters';
import StyledCard from '../components/common/StyledCard';
import { useCurrency } from '../contexts/CurrencyContext';
import { useSharedData } from '../contexts/DataContext';
import { useDepositTrend } from '../hooks/useTrendData';
import TrendChart from '../components/dashboard/TrendChart';
import { useTranslation } from '../hooks/useTranslation';

const Deposit: React.FC = () => {
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        branchCode: '',
        productCode: '',
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
    } = useDepositPortfolioOverview(selectedDate !== 'all' ? selectedDate : '');

    // Fetch detailed deposit analysis data
    const { data: detailedData, isLoading: detailedLoading, refetch } = useDepositAnalysis(filters);
    const { data: depositTrend, isLoading: trendLoading } = useDepositTrend(selectedDate !== 'all' ? selectedDate : '');

    const { formatCurrency, formatNumber } = useCurrency();

    // Filter detailed data
    const filteredData = useMemo(() => {
        if (!detailedData) return [];
        
        return detailedData.filter(item => {
            if (filters.branchCode && item.branchCode !== filters.branchCode) return false;
            if (filters.productCode && !item.productCode?.includes(filters.productCode)) return false;
            if (filters.accountStatus && item.accountStatus !== filters.accountStatus) return false;
            if (filters.year && item.openYear !== filters.year) return false;
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
            case 'DORMANT': return 'warning';
            case 'CLOSED': return 'error';
            default: return 'default';
        }
    };



    // Calculate active percentage
    const activePercentage = portfolioOverview?.total_Accounts 
        ? (portfolioOverview.active_Accounts / portfolioOverview.total_Accounts) * 100 
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
                       
                    </Grid>

                   
                </Paper>

                {/* KPI Cards - Row 1 */}
                <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <StyledCard
                            title={t('deposit.total_balance')}
                            value={formatCurrency(portfolioOverview?.total_Balance)}
                            icon={<AccountBalance />}
                            colorIndex={2}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <StyledCard
                            title={t('deposit.total_accounts')}
                            value={formatNumber(portfolioOverview?.total_Accounts)}
                            icon={<People />}
                            colorIndex={0}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <StyledCard
                            title={t('deposit.average_balance')}
                            value={formatCurrency(portfolioOverview?.avg_Balance)}
                            icon={<AttachMoney />}
                            colorIndex={4}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <StyledCard
                            title={t('deposit.average_interest_rate')}
                            value={formatPercentage(portfolioOverview?.avg_Interest_Rate)}
                            icon={<TrendingUp />}
                            colorIndex={4}
                        />
                    </Grid>
                </Grid>

                {/* Second Row of KPI Cards */}
                <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <StyledCard
                            title={t('deposit.active_accounts')}
                            value={formatNumber(portfolioOverview?.active_Accounts)}
                            subtitle={`${activePercentage.toFixed(1)}% of total`}
                            icon={<CheckCircle />}
                            colorIndex={3}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <StyledCard
                            title={t('deposit.dormant_accounts')}
                            value={formatNumber(portfolioOverview?.dormant_Accounts)}
                            icon={<Warning />}
                            colorIndex={1}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <StyledCard
                            title={t('deposit.closed_accounts')}
                            value={formatNumber(portfolioOverview?.closed_Accounts)}
                            icon={<Cancel />}
                            colorIndex={1}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <StyledCard
                            title={t('deposit.avg_account_size')}
                            value={formatCurrency(portfolioOverview?.avg_Account_Size)}
                            icon={<AttachMoney />}
                            colorIndex={5}
                        />
                    </Grid>
                </Grid>
                   
                {/* Deposit Trend - Last 6 Months */}
                <Typography variant="h6" sx={{ mt: 4, mb: 2, fontWeight: 600, color: 'primary.main', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TrendingUp sx={{ color: '#2563EB' }} /> {t('deposit.deposit_trend_analysis')}
                    <Chip label={t('deposit.last_6_months')} size="small" color="primary" />
                </Typography>

                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <TrendChart
                            title={t('deposit.total_balance_trend')}
                            data={depositTrend?.map(item => ({
                                monthName: item.monthName,
                                totalBalance: item.totalBalance
                            })) || []}
                            type="area"
                            dataKeys={[
                                { key: 'totalBalance', name: t('deposit.total_balance'), color: '#2563EB', type: 'currency' }
                            ]}
                            showTrend={true}
                            showAverage={true}
                            gradient={true}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <TrendChart
                            title={t('deposit.account_growth_trend')}
                            data={depositTrend?.map(item => ({
                                monthName: item.monthName,
                                accountCount: item.accountCount
                            })) || []}
                            type="bar"
                            dataKeys={[
                                { key: 'accountCount', name: t('deposit.account_count'), color: '#059669', type: 'number' }
                            ]}
                            showTrend={true}
                            showAverage={true}
                            gradient={false}
                        />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                        <TrendChart
                            title={t('deposit.average_balance_trend')}
                            data={depositTrend?.map(item => ({
                                monthName: item.monthName,
                                averageBalance: item.averageBalance
                            })) || []}
                            type="line"
                            dataKeys={[
                                { key: 'averageBalance', name: t('deposit.average_balance'), color: 'secondary.main', type: 'currency' }
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
                        {t('deposit.detailed_deposit_analysis')}
                    </Typography>
                    <TableContainer sx={{ maxHeight: 500 }}>
                        <Table stickyHeader size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5' }}>{t('deposit.branch')}</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5' }}>{t('deposit.product')}</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5' }}>{t('deposit.scheme')}</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5' }}>{t('deposit.category')}</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5' }} align="right">{t('deposit.accounts')}</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5' }} align="right">{t('deposit.balance')}</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5' }} align="right">{t('deposit.avg_rate')}</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5' }} align="center">{t('deposit.status')}</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredData.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                                            <Typography color="textSecondary">{t('common.no_data')}</Typography>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, idx) => (
                                        <TableRow key={idx} hover>
                                            <TableCell>{row.branchCode || '-'}</TableCell>
                                            <TableCell>{row.productCode || '-'}</TableCell>
                                            <TableCell>{row.schemeCode || '-'}</TableCell>
                                            <TableCell>{row.customerCategory || '-'}</TableCell>
                                            <TableCell align="right">{row.accountCount?.toLocaleString()}</TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 500, color: '#2563EB' }}>
                                                {formatCurrency(row.totalBalance)}
                                            </TableCell>
                                            <TableCell align="right">{formatPercentage(row.avgInterestRate)}</TableCell>
                                            <TableCell align="center">
                                                <Chip 
                                                    label={row.accountStatus || t('common.unknown')} 
                                                    color={getStatusColor(row.accountStatus)} 
                                                    size="small"
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

export default Deposit;
