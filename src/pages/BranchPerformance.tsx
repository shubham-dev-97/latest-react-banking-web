import React, { useState } from 'react';
import {
    Box, Container, Grid, Paper, Typography, FormControl, InputLabel,
    Select, MenuItem, TextField, Chip, CircularProgress, Table,
    TableBody, TableCell, TableContainer, TableHead, TableRow,
    Card, CardContent, Button, IconButton, Tooltip, Divider,
    useTheme, useMediaQuery
} from '@mui/material';
import {
    TrendingUp, AccountBalance, People,
    AttachMoney, Assessment, Warning, Download as DownloadIcon,
    Refresh as RefreshIcon, FilterList as FilterIcon,
    Star, StarBorder, LocationOn, Person, Savings, Dashboard
} from '@mui/icons-material';
import { useBranchPerformance } from '../hooks/useBranchPerformance';
import { formatCurrency, formatNumber, formatPercentage, formatDateToDDMMYYYY } from '../utils/formatters';
import StyledCard from '../components/common/StyledCard';
import { useTranslation } from '../hooks/useTranslation';

const BranchPerformance: React.FC = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const { t } = useTranslation();
    
    // Filter states
    const [targetDate, setTargetDate] = useState<string>('2026-03-31');
    const [regionName, setRegionName] = useState<string>('');
    const [performanceStatus, setPerformanceStatus] = useState<string>('');
    
    // Fetch data
    const { data, isLoading, refetch } = useBranchPerformance(
        targetDate,
        regionName || undefined,
        performanceStatus || undefined
    );
    
    const summary = data?.summary;
    const branchGrid = data?.branchGrid || [];
    const regionSummary = data?.regionSummary || [];
    const topBranches = data?.topBranches || [];

    const handleExport = () => {
        if (!branchGrid.length) return;
        
        const headers = ['Rank', 'Branch Code', 'Branch Name', 'Manager', 'Daily Recovery %', 'CASA %', 'Term Deposit %', 'New Customers', 'Mobile Banking', 'NPA %', 'Overall %', 'Status'];
        const csvData = branchGrid.map(item => [
            item.brancH_RANK,
            item.pbrcode,
            item.brancH_NAME,
            item.brancH_MANAGER,
            item.dailY_RECOVERY_PERCENT?.toFixed(2) || '0',
            item.casA_PERCENT?.toFixed(2) || '0',
            item.terM_DEPOSIT_PERCENT?.toFixed(2) || '0',
            item.neW_CUSTOMERS,
            item.mobilE_BANKING_CUSTOMERS,
            item.npA_PERCENT?.toFixed(2) || '0',
            item.overalL_ACHIEVEMENT_PERCENT?.toFixed(2) || '0',
            item.performancE_STATUS
        ]);
        
        const csvContent = [headers, ...csvData].map(row => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Branch_Performance_${targetDate}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const getStatusColor = (status: string) => {
        switch (status?.toUpperCase()) {
            case 'EXCELLENT': return '#4caf50';
            case 'GOOD': return '#2196f3';
            case 'AVERAGE': return '#ff9800';
            case 'POOR': return '#f44336';
            default: return '#757575';
        }
    };

    const getStatusBgColor = (status: string) => {
        switch (status?.toUpperCase()) {
            case 'EXCELLENT': return '#e8f5e9';
            case 'GOOD': return '#e3f2fd';
            case 'AVERAGE': return '#fff3e0';
            case 'POOR': return '#ffebee';
            default: return '#f5f5f5';
        }
    };

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!data || !summary) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="h6" color="textSecondary">
                        No data available for the selected filters
                    </Typography>
                    <Button 
                        variant="outlined" 
                        sx={{ mt: 2 }}
                        onClick={() => {
                            setRegionName('');
                            setPerformanceStatus('');
                            refetch();
                        }}
                    >
                        Clear Filters
                    </Button>
                </Paper>
            </Box>
        );
    }

    return (
        <Box sx={{ width: '100%', minHeight: '100vh', bgcolor: '#f5f5f5', overflow: 'auto', pb: 4 }}>
            <Container maxWidth={false} sx={{ py: { xs: 2, md: 3 }, px: { xs: 2, md: 3 } }}>
                {/* Header */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
                    <Box>

                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="Export to CSV">
                            <Button 
                                variant="outlined" 
                                startIcon={<DownloadIcon />}
                                onClick={handleExport}
                                size="small"
                            >
                                Export
                            </Button>
                        </Tooltip>
                        <Tooltip title="Refresh Data">
                            <IconButton onClick={() => refetch()} sx={{ bgcolor: '#f5f5f5' }}>
                                <RefreshIcon />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Box>

                {/* Filters */}
                <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
                    <Grid container spacing={2} alignItems="center">
                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                            <TextField
                                fullWidth
                                size="small"
                                label="Target Date"
                                type="date"
                                value={targetDate}
                                onChange={(e) => setTargetDate(e.target.value)}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Region</InputLabel>
                                <Select
                                    value={regionName}
                                    label="Region"
                                    onChange={(e) => setRegionName(e.target.value)}
                                >
                                    <MenuItem value="">All Regions</MenuItem>
                                    {regionSummary.map((region) => (
                                        <MenuItem key={region.regioN_NAME} value={region.regioN_NAME}>
                                            {region.regioN_NAME}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Performance Status</InputLabel>
                                <Select
                                    value={performanceStatus}
                                    label="Performance Status"
                                    onChange={(e) => setPerformanceStatus(e.target.value)}
                                >
                                    <MenuItem value="">All Status</MenuItem>
                                    <MenuItem value="EXCELLENT">Excellent</MenuItem>
                                    <MenuItem value="GOOD">Good</MenuItem>
                                    <MenuItem value="AVERAGE">Average</MenuItem>
                                    <MenuItem value="POOR">Poor</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                            <Button
                                fullWidth
                                variant="outlined"
                                startIcon={<FilterIcon />}
                                onClick={() => {
                                    setRegionName('');
                                    setPerformanceStatus('');
                                    refetch();
                                }}
                            >
                                Clear Filters
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>

                {/* Summary Cards - Row 1 */}
                <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <StyledCard
                            title={t('branch_performance.total_branches', 'Total Branches')}
                            value={formatNumber(summary.totaL_BRANCHES)}
                            icon={<Dashboard />}
                            colorIndex={0}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <StyledCard
                            title={t('branch_performance.daily_recovery', 'Daily Recovery')}
                            value={formatPercentage(summary.dailY_RECOVERY_PERCENT)}
                            subtitle={`${formatCurrency(summary.totaL_DAILY_RECOVERY_ACHIEVED)} / ${formatCurrency(summary.totaL_DAILY_RECOVERY_TARGET)}`}
                            icon={<AttachMoney />}
                            colorIndex={2}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <StyledCard
                            title={t('branch_performance.casa_achievement', 'CASA Achievement')}
                            value={formatPercentage(summary.casA_PERCENT)}
                            subtitle={`${formatCurrency(summary.totaL_CASA_ACHIEVED)} / ${formatCurrency(summary.totaL_CASA_TARGET)}`}
                            icon={<AccountBalance />}
                            colorIndex={3}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <StyledCard
                            title={t('branch_performance.term_deposit_achievement', 'Term Deposit Achievement')}
                            value={formatPercentage(summary.terM_DEPOSIT_PERCENT)}
                            subtitle={`${formatCurrency(summary.totaL_TERM_DEPOSIT_ACHIEVED)} / ${formatCurrency(summary.totaL_TERM_DEPOSIT_TARGET)}`}
                            icon={<Savings />}
                            colorIndex={4}
                        />
                    </Grid>
                </Grid>

                {/* Summary Cards - Row 2 */}
                <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <StyledCard
                            title={t('branch_performance.new_customers', 'New Customers')}
                            value={formatNumber(summary.totaL_NEW_CUSTOMERS)}
                            icon={<People />}
                            colorIndex={5}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <StyledCard
                            title={t('branch_performance.mobile_banking_users', 'Mobile Banking Users')}
                            value={formatNumber(summary.totaL_MOBILE_BANKING_CUSTOMERS)}
                            icon={<Assessment />}
                            colorIndex={2}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <StyledCard
                            title={t('branch_performance.avg_npa_percent', 'Avg NPA %')}
                            value={formatPercentage(summary.avG_NPA_PERCENT)}
                            subtitle={t('branch_performance.non_performing_assets', 'Non-Performing Assets')}
                            icon={<Warning />}
                            colorIndex={1}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <StyledCard
                            title={t('branch_performance.overall_achievement', 'Overall Achievement')}
                            value={formatPercentage(summary.avG_OVERALL_ACHIEVEMENT)}
                            subtitle={t('branch_performance.average_across_branches', 'Average across all branches')}
                            icon={<TrendingUp />}
                            colorIndex={4}
                        />
                    </Grid>
                </Grid>

                {/* Top Branches Section */}
                {topBranches.length > 0 && (
                    <>
                        <Typography variant="h6" sx={{ mt: 2, mb: 2, fontWeight: 600, color: '#1a237e', display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Star sx={{ color: '#ffc107' }} /> {t('branch_performance.top_performing_branches', 'Top Performing Branches')}
                        </Typography>
                        
                        <Grid container spacing={2} sx={{ mb: 4 }}>
                            {topBranches.slice(0, 5).map((branch) => (
                                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }} key={branch.brancH_RANK}>
                                    <Card sx={{ 
                                        borderRadius: 2,
                                        bgcolor: getStatusBgColor(branch.performancE_STATUS),
                                        borderLeft: `4px solid ${getStatusColor(branch.performancE_STATUS)}`,
                                        transition: 'transform 0.2s',
                                        '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 }
                                    }}>
                                        <CardContent>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                <Chip 
                                                    label={`${t('branch.rank', 'Rank')} #${branch.brancH_RANK}`}
                                                    size="small"
                                                    sx={{ bgcolor: getStatusColor(branch.performancE_STATUS), color: 'white', fontWeight: 'bold' }}
                                                />
                                                {branch.brancH_RANK <= 3 ? (
                                                    <Star sx={{ color: '#ffc107', fontSize: 20 }} />
                                                ) : (
                                                    <StarBorder sx={{ color: '#ffc107', fontSize: 20 }} />
                                                )}
                                            </Box>
                                            <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 1.5 }}>
                                                {branch.brancH_NAME}
                                            </Typography>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                                                <Person sx={{ fontSize: 14, color: '#666' }} />
                                                <Typography variant="caption" color="textSecondary">
                                                    {branch.brancH_MANAGER}
                                                </Typography>
                                            </Box>
                                            <Divider sx={{ my: 1.5 }} />
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Typography variant="body2" color="textSecondary">{t('branch_performance.achievement', 'Achievement')}</Typography>
                                                <Typography variant="h6" sx={{ fontWeight: 'bold', color: getStatusColor(branch.performancE_STATUS) }}>
                                                    {branch.overalL_ACHIEVEMENT_PERCENT?.toFixed(1)}%
                                                </Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 0.5 }}>
                                                <Typography variant="body2" color="textSecondary">{t('branch_performance.npa_percent', 'NPA %')}</Typography>
                                                <Typography variant="body2" sx={{ fontWeight: 'bold', color: branch.npA_PERCENT > 5 ? '#f44336' : '#4caf50' }}>
                                                    {branch.npA_PERCENT?.toFixed(2)}%
                                                </Typography>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </>
                )}

                {/* Region Summary Table */}
                {regionSummary.length > 0 && (
                    <>
                        <Typography variant="h6" sx={{ mt: 2, mb: 2, fontWeight: 600, color: '#1a237e', display: 'flex', alignItems: 'center', gap: 1 }}>
                            <LocationOn /> {t('branch_performance.region_wise_performance', 'Region-wise Performance')}
                        </Typography>
                        
                        <TableContainer component={Paper} sx={{ mb: 4, borderRadius: 2, overflowX: 'auto' }}>
                            <Table stickyHeader>
                                <TableHead>
                                    <TableRow sx={{ bgcolor: '#1a237e' }}>
                                        <TableCell sx={{ color: 'white', fontWeight: 'bold', bgcolor: '#1a237e' }}>Region</TableCell>
                                        <TableCell align="right" sx={{ color: 'white', fontWeight: 'bold', bgcolor: '#1a237e' }}>Branches</TableCell>
                                        <TableCell align="right" sx={{ color: 'white', fontWeight: 'bold', bgcolor: '#1a237e' }}>Total Deposit</TableCell>
                                        <TableCell align="right" sx={{ color: 'white', fontWeight: 'bold', bgcolor: '#1a237e' }}>Total Loan</TableCell>
                                        <TableCell align="right" sx={{ color: 'white', fontWeight: 'bold', bgcolor: '#1a237e' }}>Total Recovery</TableCell>
                                        <TableCell align="right" sx={{ color: 'white', fontWeight: 'bold', bgcolor: '#1a237e' }}>Avg Performance</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {regionSummary.map((region) => (
                                        <TableRow key={region.regioN_NAME} hover>
                                            <TableCell><Typography fontWeight={500}>{region.regioN_NAME}</Typography></TableCell>
                                            <TableCell align="right">{region.totaL_BRANCHES}</TableCell>
                                            <TableCell align="right">{formatCurrency(region.totaL_DEPOSIT)}</TableCell>
                                            <TableCell align="right">{formatCurrency(region.totaL_LOAN)}</TableCell>
                                            <TableCell align="right">{formatCurrency(region.totaL_RECOVERY)}</TableCell>
                                            <TableCell align="right">
                                                <Chip
                                                    label={`${region.avG_PERFORMANCE_PERCENT?.toFixed(1)}%`}
                                                    size="small"
                                                    sx={{ 
                                                        bgcolor: region.avG_PERFORMANCE_PERCENT >= 80 ? '#4caf50' : 
                                                                region.avG_PERFORMANCE_PERCENT >= 60 ? '#ff9800' : '#f44336',
                                                        color: 'white',
                                                        fontWeight: 'bold'
                                                    }}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </>
                )}

                {/* Branch Performance Grid Table */}
                <Typography variant="h6" sx={{ mt: 2, mb: 2, fontWeight: 600, color: '#1a237e' }}>
                    Branch-wise Detailed Performance
                </Typography>
                
                <TableContainer component={Paper} sx={{ borderRadius: 2, overflowX: 'auto' }}>
                    <Table stickyHeader size="medium">
                        <TableHead>
                            <TableRow sx={{ bgcolor: '#1a237e' }}>
                                <TableCell sx={{ color: 'white', fontWeight: 'bold', bgcolor: '#1a237e' }}>Rank</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 'bold', bgcolor: '#1a237e' }}>Branch Code</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 'bold', bgcolor: '#1a237e' }}>Branch Name</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 'bold', bgcolor: '#1a237e' }}>Manager</TableCell>
                                <TableCell align="right" sx={{ color: 'white', fontWeight: 'bold', bgcolor: '#1a237e' }}>Daily Recovery</TableCell>
                                <TableCell align="right" sx={{ color: 'white', fontWeight: 'bold', bgcolor: '#1a237e' }}>CASA %</TableCell>
                                <TableCell align="right" sx={{ color: 'white', fontWeight: 'bold', bgcolor: '#1a237e' }}>Term Deposit %</TableCell>
                                <TableCell align="right" sx={{ color: 'white', fontWeight: 'bold', bgcolor: '#1a237e' }}>New Customers</TableCell>
                                <TableCell align="right" sx={{ color: 'white', fontWeight: 'bold', bgcolor: '#1a237e' }}>Mobile Banking</TableCell>
                                <TableCell align="right" sx={{ color: 'white', fontWeight: 'bold', bgcolor: '#1a237e' }}>{t('branch_performance.npa_percent', 'NPA %')}</TableCell>
                                <TableCell align="right" sx={{ color: 'white', fontWeight: 'bold', bgcolor: '#1a237e' }}>Overall %</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 'bold', bgcolor: '#1a237e' }}>Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {branchGrid.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={12} align="center" sx={{ py: 4 }}>
                                        <Typography color="textSecondary">{t('branch_performance.no_data_available', 'No data available')}</Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                branchGrid.map((row, index) => (
                                    <TableRow key={row.pbrcode} hover sx={{ bgcolor: index % 2 === 0 ? '#fafafa' : 'white' }}>
                                        <TableCell>
                                            <Chip 
                                                label={row.brancH_RANK}
                                                size="small"
                                                sx={{ bgcolor: '#1a237e', color: 'white', fontWeight: 'bold', minWidth: 40 }}
                                            />
                                        </TableCell>
                                        <TableCell><Typography fontWeight={500}>{row.pbrcode}</Typography></TableCell>
                                        <TableCell>{row.brancH_NAME}</TableCell>
                                        <TableCell>{row.brancH_MANAGER}</TableCell>
                                        <TableCell align="right">
                                            <Typography fontWeight={500} color={row.dailY_RECOVERY_PERCENT >= 80 ? '#4caf50' : '#f44336'}>
                                                {row.dailY_RECOVERY_PERCENT?.toFixed(1)}%
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="right">{row.casA_PERCENT?.toFixed(1)}%</TableCell>
                                        <TableCell align="right">{row.terM_DEPOSIT_PERCENT?.toFixed(1)}%</TableCell>
                                        <TableCell align="right">{row.neW_CUSTOMERS}</TableCell>
                                        <TableCell align="right">{row.mobilE_BANKING_CUSTOMERS}</TableCell>
                                        <TableCell align="right" sx={{ color: row.npA_PERCENT > 5 ? '#f44336' : '#4caf50', fontWeight: 500 }}>
                                            {row.npA_PERCENT?.toFixed(2)}%
                                        </TableCell>
                                        <TableCell align="right">
                                            <Typography sx={{ fontWeight: 'bold', color: getStatusColor(row.performancE_STATUS) }}>
                                                {row.overalL_ACHIEVEMENT_PERCENT?.toFixed(1)}%
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={row.performancE_STATUS}
                                                size="small"
                                                sx={{ bgcolor: getStatusColor(row.performancE_STATUS), color: 'white', fontWeight: 'bold', minWidth: 80 }}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Last Updated */}
                {summary.lasT_UPDATED && (
                    <Box sx={{ mt: 2, textAlign: 'right' }}>
                        <Typography variant="caption" color="textSecondary">
                            {t('branch_performance.last_updated', 'Last Updated')}: {new Date(summary.lasT_UPDATED).toLocaleString()}
                        </Typography>
                    </Box>
                )}
            </Container>
        </Box>
    );
};

export default BranchPerformance;