import React, { useState, useMemo } from 'react';
import {
    Box, Container, Grid, Paper,
    Typography, FormControl, InputLabel,
    Select, MenuItem, Card, CardContent,
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Chip
} from '@mui/material';
import {
    AccountBalance, Savings, TrendingUp, TrendingDown,
    AttachMoney, Assessment, AccountBalanceWallet, 
    PieChart as PieChartIcon
} from '@mui/icons-material';
import { useSharedData } from '../contexts/DataContext';
import { formatCurrency, formatPercentage } from '../utils/formatters';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import StyledCard from '../components/common/StyledCard';
import { useCurrency } from '../contexts/CurrencyContext';
import { useTranslation } from '../hooks/useTranslation';

// Define types for the pie chart data
interface PieDataItem {
    name: string;
    value: number;
}

// Define types for the bar chart data
interface BarDataItem {
    name: string;
    Loans: number;
    Deposits: number;
}

const Summary: React.FC = () => {
    const [branchCode, setBranchCode] = useState<string>('');
    const [year, setYear] = useState<number>(new Date().getFullYear());

    // Get shared data from context
    const { 
        summary, 
        summaryLoading,
        selectedDate,
        setSelectedDate,
        availableDates,
        datesLoading
    } = useSharedData();
    
    const { formatCurrency, formatNumber } = useCurrency();
    const { t } = useTranslation();

    // Filter summary data by branch
    const filteredSummary = useMemo(() => {
        if (!summary) return [];
        if (!branchCode) return summary;
        return summary.filter(item => item.branchCode === branchCode);
    }, [summary, branchCode]);

    // Calculate totals from filtered data
    const totals = useMemo(() => {
        if (!filteredSummary || filteredSummary.length === 0) {
            return {
                totalLoanAccounts: 0,
                totalLoanAmount: 0,
                totalDepositAccounts: 0,
                totalDepositAmount: 0,
                netPosition: 0,
            };
        }

        return filteredSummary.reduce((acc, curr) => ({
            totalLoanAccounts: (acc.totalLoanAccounts || 0) + (curr.totalLoanAccounts || 0),
            totalLoanAmount: (acc.totalLoanAmount || 0) + (curr.totalLoanAmount || 0),
            totalDepositAccounts: (acc.totalDepositAccounts || 0) + (curr.totalDepositAccounts || 0),
            totalDepositAmount: (acc.totalDepositAmount || 0) + (curr.totalDepositAmount || 0),
            netPosition: (acc.netPosition || 0) + (curr.netPosition || 0),
        }), {
            totalLoanAccounts: 0,
            totalLoanAmount: 0,
            totalDepositAccounts: 0,
            totalDepositAmount: 0,
            netPosition: 0
        });
    }, [filteredSummary]);

    // Calculate additional metrics
    const totalAccounts = (totals.totalLoanAccounts || 0) + (totals.totalDepositAccounts || 0);
    const avgLoanSize = totals.totalLoanAccounts ? (totals.totalLoanAmount || 0) / totals.totalLoanAccounts : 0;
    const avgDepositSize = totals.totalDepositAccounts ? (totals.totalDepositAmount || 0) / totals.totalDepositAccounts : 0;
    const loanDepositRatio = totals.totalDepositAmount ? ((totals.totalLoanAmount || 0) / totals.totalDepositAmount) * 100 : 0;

    // Prepare data for bar chart
    const barData: BarDataItem[] = filteredSummary.map(item => ({
        name: item.branchCode || t('summary.all', 'All'),
        Loans: item.totalLoanAmount || 0,
        Deposits: item.totalDepositAmount || 0,
    }));

    // Prepare data for pie chart
    const pieData: PieDataItem[] = [
        { name: t('summary.total_loans', 'Total Loans'), value: totals.totalLoanAmount || 0 },
        { name: t('summary.total_deposits', 'Total Deposits'), value: totals.totalDepositAmount || 0 },
    ];

    const COLORS = ['#DC2626', '#059669', 'secondary.main', '#2563EB'];

    // Custom label for pie chart
    const renderCustomizedLabel = (props: any) => {
        const { name, percent } = props;
        const percentage = percent ? (percent * 100).toFixed(0) : '0';
        return `${name}: ${percentage}%`;
    };

    // Custom tooltip formatter
    const formatTooltipValue = (value: any) => {
        if (typeof value === 'number') {
            return formatCurrency(value);
        }
        return String(value);
    };

    // Custom Y-axis formatter
    const formatYAxis = (value: any) => {
        if (typeof value === 'number') {
            if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)}Cr`;
            if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
            if (value >= 1000) return `₹${(value / 1000).toFixed(1)}K`;
            return `₹${value}`;
        }
        return String(value);
    };

    if (summaryLoading || datesLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Typography>{t('common.loading', 'Loading...')}</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ width: '100%', height: '100%', overflow: 'auto', p: 2 }}>
            <Container maxWidth={false}>
                {/* Filters with As On Date */}
                <Paper sx={{ p: 2, mb: 3 }}>
                    <Grid container spacing={2} alignItems="center">
                        {/* As On Date Dropdown */}
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
                                            {date}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                       
                    </Grid>
                </Paper>

                {/* Summary Cards - Row 1 */}
                <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <StyledCard
                            title={t('dashboard.total_loan_accounts', 'Total Loan Accounts')}
                            value={totals.totalLoanAccounts?.toLocaleString() || '0'}
                            icon={<AccountBalance />}
                            colorIndex={4}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <StyledCard
                            title={t('dashboard.total_loan_amount', 'Total Loan Amount')}
                            value={formatCurrency(totals.totalLoanAmount)}
                            icon={<AttachMoney />}
                            colorIndex={1}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <StyledCard
                            title={t('dashboard.total_deposit_accounts', 'Total Deposit Accounts')}
                            value={totals.totalDepositAccounts?.toLocaleString() || '0'}
                            icon={<Savings />}
                            colorIndex={2}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <StyledCard
                            title={t('dashboard.total_deposit_amount', 'Total Deposit Amount')}
                            value={formatCurrency(totals.totalDepositAmount)}
                            icon={<AttachMoney />}
                            colorIndex={3}
                        />
                    </Grid>
                </Grid>

                {/* Summary Cards - Row 2 */}
                <Grid container spacing={2} sx={{ mb: 4 }}>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <StyledCard
                            title={t('dashboard.total_accounts', 'Total Accounts')}
                            value={totalAccounts.toLocaleString()}
                            subtitle={t('summary.all_accounts_combined', 'All accounts combined')}
                            icon={<Assessment />}
                            colorIndex={0}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <StyledCard
                            title={t('dashboard.avg_loan_size', 'Avg Loan Size')}
                            value={formatCurrency(avgLoanSize)}
                            icon={<TrendingUp />}
                            colorIndex={4}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <StyledCard
                            title={t('dashboard.avg_deposit_size', 'Avg Deposit Size')}
                            value={formatCurrency(avgDepositSize)}
                            icon={<TrendingDown />}
                            colorIndex={2}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <StyledCard
                            title={t('dashboard.ld_ratio', 'L/D Ratio')}
                            value={`${loanDepositRatio.toFixed(1)}%`}
                            subtitle={t('summary.loans_vs_deposits', 'Loans vs Deposits')}
                            icon={<PieChartIcon />}
                            colorIndex={5}
                        />
                    </Grid>
                </Grid>

                {/* Charts */}
                <Grid container spacing={2} sx={{ mb: 4 }}>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Paper sx={{ p: 2, height: '100%', minHeight: 350 }}>
                            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'primary.main' }}>
                                {t('summary.loan_vs_deposit_distribution', 'Loan vs Deposit Distribution')}
                            </Typography>
                            <Box sx={{ height: 280, display: 'flex', justifyContent: 'center' }}>
                                {pieData[0].value === 0 && pieData[1].value === 0 ? (
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Typography color="textSecondary">{t('common.no_data', 'No data available')}</Typography>
                                    </Box>
                                ) : (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={pieData}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                label={renderCustomizedLabel}
                                                outerRadius="80%"
                                                fill="#8884d8"
                                                dataKey="value"
                                            >
                                                {pieData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip formatter={formatTooltipValue} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                )}
                            </Box>
                        </Paper>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Paper sx={{ p: 2, height: '100%', minHeight: 350 }}>
                            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'primary.main' }}>
                                {t('summary.branch_comparison', 'Branch Comparison')}
                            </Typography>
                            <Box sx={{ height: 280 }}>
                                {barData.length === 0 ? (
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                                        <Typography color="textSecondary">{t('common.no_data', 'No data available')}</Typography>
                                    </Box>
                                ) : (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={barData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis tickFormatter={formatYAxis} />
                                            <Tooltip formatter={formatTooltipValue} />
                                            <Legend />
                                            <Bar dataKey="Deposits" fill="#059669" />
                                            <Bar dataKey="Loans" fill="#DC2626" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                )}
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>

                {/* Summary Table */}
                <Paper sx={{ width: '100%', overflow: 'hidden', mb: 3 }}>
                    <Typography variant="h6" sx={{ p: 2, pb: 0, fontWeight: 600, color: 'primary.main' }}>
                        {t('summary.detailed_branch_summary', 'Detailed Branch Summary')}
                    </Typography>
                    <TableContainer sx={{ maxHeight: 400 }}>
                        <Table stickyHeader size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5' }}>{t('summary.branch_code', 'Branch Code')}</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5' }}>{t('summary.loan_accounts', 'Loan Accounts')}</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5' }}>{t('summary.loan_amount', 'Loan Amount')}</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5' }}>{t('summary.deposit_accounts', 'Deposit Accounts')}</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5' }}>{t('summary.deposit_amount', 'Deposit Amount')}</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5' }}>{t('gl.net_position', 'Net Position')}</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5' }}>{t('dashboard.ld_ratio', 'L/D Ratio')}</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredSummary.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                                            <Typography color="textSecondary">{t('common.no_data', 'No data available')}</Typography>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredSummary.map((row, index) => (
                                        <TableRow key={index} hover>
                                            <TableCell>{row.branchCode || t('summary.all_branches', 'All Branches')}</TableCell>
                                            <TableCell align="right">{row.totalLoanAccounts?.toLocaleString() || '0'}</TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 500, color: '#DC2626' }}>
                                                {formatCurrency(row.totalLoanAmount)}
                                            </TableCell>
                                            <TableCell align="right">{row.totalDepositAccounts?.toLocaleString() || '0'}</TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 500, color: '#059669' }}>
                                                {formatCurrency(row.totalDepositAmount)}
                                            </TableCell>
                                            <TableCell 
                                                align="right" 
                                                sx={{ 
                                                    color: (row.netPosition || 0) >= 0 ? '#059669' : '#DC2626',
                                                    fontWeight: 600
                                                }}
                                            >
                                                {formatCurrency(row.netPosition)}
                                            </TableCell>
                                            <TableCell align="right">
                                                <Chip
                                                    label={formatPercentage(row.loanDepositRatio)}
                                                    color={row.loanDepositRatio && row.loanDepositRatio > 100 ? 'error' : 'success'}
                                                    size="small"
                                                    variant="outlined"
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>

                {/* Net Position Summary */}
                <Paper sx={{ p: 2 }}>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'primary.main' }}>
                        {t('summary.overall_net_position', 'Overall Net Position')}
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <Card sx={{ bgcolor: '#ffebee' }}>
                                <CardContent>
                                    <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                                        {t('summary.total_loans', 'Total Loans')}
                                    </Typography>
                                    <Typography variant="h6" sx={{ color: '#DC2626', fontWeight: 'bold' }}>
                                        {formatCurrency(totals.totalLoanAmount)}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <Card sx={{ bgcolor: '#e8f5e8' }}>
                                <CardContent>
                                    <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                                        {t('summary.total_deposits', 'Total Deposits')}
                                    </Typography>
                                    <Typography variant="h6" sx={{ color: '#059669', fontWeight: 'bold' }}>
                                        {formatCurrency(totals.totalDepositAmount)}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <Card sx={{ 
                                bgcolor: (totals.netPosition || 0) >= 0 ? '#e8f5e8' : '#ffebee'
                            }}>
                                <CardContent>
                                    <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                                        {t('gl.net_position', 'Net Position')}
                                    </Typography>
                                    <Typography 
                                        variant="h6" 
                                        sx={{ 
                                            color: (totals.netPosition || 0) >= 0 ? '#059669' : '#DC2626',
                                            fontWeight: 'bold'
                                        }}
                                    >
                                        {formatCurrency(totals.netPosition)}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Paper>
            </Container>
        </Box>
    );
};

export default Summary;
    