// // import React, { useState } from 'react';
// // import {
// //     Box, Container, Grid, Paper, Typography, FormControl, InputLabel,
// //     Select, MenuItem, Chip, CircularProgress, Table,
// //     TableBody, TableCell, TableContainer, TableHead, TableRow,
// //     Button, IconButton, Tooltip,
// //     useTheme, useMediaQuery
// // } from '@mui/material';
// // import {
// //     TrendingUp, TrendingDown, AccountBalance, People,
// //     AttachMoney, Assessment, Warning, Download as DownloadIcon,
// //     Refresh as RefreshIcon, FilterList as FilterIcon,
// //     Star, LocationOn, Business, MobileFriendly, Savings,
// //     Map as MapIcon
// // } from '@mui/icons-material';
// // import {
// //     LineChart, Line, Area, XAxis, YAxis, CartesianGrid,
// //     Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
// //     ComposedChart
// // } from 'recharts';
// // import { useBankKPI } from '../hooks/useBankKPI';
// // import { formatCurrency, formatNumber, formatPercentage } from '../utils/formatters';
// // import StyledCard from '../components/common/StyledCard';

// // const BankKPI: React.FC = () => {
// //     const theme = useTheme();
// //     const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    
// //     const [finYear, setFinYear] = useState<string>('');
// //     const [yearType, setYearType] = useState<string>('');
// //     const [regionName, setRegionName] = useState<string>('');
    
// //     const { data, isLoading, refetch } = useBankKPI(
// //         finYear || undefined,
// //         yearType || undefined,
// //         regionName || undefined,
// //         undefined,
// //         10
// //     );
    
// //     // Use exact property names from API response
// //     const summary = data?.summary || {
// //         totaL_BRANCHES: 0,
// //         totaL_CUSTOMERS: 0,
// //         activE_CUSTOMERS: 0,
// //         neW_CUSTOMERS: 0,
// //         totaL_DEPOSIT_CR: 0,
// //         totaL_LOAN_CR: 0,
// //         totaL_RECOVERY_CR: 0,
// //         avG_GROSS_NPA: 0,
// //         avG_NET_NPA: 0,
// //         avG_CASA_RATIO: 0,
// //         digitaL_PERCENT: 0,
// //         avG_PERFORMANCE: 0,
// //         totaL_UPI_TRANSACTION_CR: 0
// //     };
    
// //     const yearlySummary = data?.yearlySummary || [];
// //     const regionSummary = data?.regionSummary || [];
// //     const topBranches = data?.topBranches || [];
// //     const bottomBranches = data?.bottomBranches || [];
// //     const branchGrid = data?.branchGrid || [];
// //     const trendAnalysis = data?.trendAnalysis || [];
// //     const mapData = data?.mapData || [];
// //     const actualVsProjection = data?.actualVsProjection || [];

// //     // Get unique regions from map data
// //     const branchLocations = [...new Set(mapData.map((b: any) => b.regioN_NAME).filter(Boolean))];

// //     // Calculate YoY growth
// //     const getYoYGrowth = () => {
// //         if (yearlySummary.length < 2) return { deposit: 0, loan: 0, npa: 0, digital: 0 };
// //         const latest = yearlySummary[yearlySummary.length - 1];
// //         const previous = yearlySummary[yearlySummary.length - 2];
// //         return {
// //             deposit: ((latest.totaL_DEPOSIT_CR - previous.totaL_DEPOSIT_CR) / previous.totaL_DEPOSIT_CR) * 100,
// //             loan: ((latest.totaL_LOAN_CR - previous.totaL_LOAN_CR) / previous.totaL_LOAN_CR) * 100,
// //             npa: ((latest.avG_NPA - previous.avG_NPA) / previous.avG_NPA) * 100,
// //             digital: ((latest.digitaL_PERCENT - previous.digitaL_PERCENT) / previous.digitaL_PERCENT) * 100,
// //         };
// //     };

// //     const yoyGrowth = getYoYGrowth();

// //     const getStatusColor = (status: string) => {
// //         if (!status) return '#757575';
// //         switch (status.toUpperCase()) {
// //             case 'EXCELLENT': return '#059669';
// //             case 'GOOD': return '#2563EB';
// //             case 'AVERAGE': return 'secondary.main';
// //             case 'POOR': return '#DC2626';
// //             default: return '#757575';
// //         }
// //     };

// //     const getPerformanceColor = (performance: number) => {
// //         if (performance >= 90) return '#059669';
// //         if (performance >= 75) return '#2563EB';
// //         if (performance >= 60) return 'secondary.main';
// //         return '#DC2626';
// //     };

// //     if (isLoading) {
// //         return (
// //             <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
// //                 <CircularProgress />
// //             </Box>
// //         );
// //     }

// //     return (
// //         <Box sx={{ width: '100%', minHeight: '100vh', bgcolor: '#f5f5f5', overflow: 'auto', pb: 4 }}>
// //             <Container maxWidth={false} sx={{ py: { xs: 2, md: 3 }, px: { xs: 2, md: 3 } }}>
// //                 {/* Header */}
// //                 <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
// //                     <Box>
// //                         <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
// //                             BANK PERFORMANCE DASHBOARD
// //                         </Typography>
// //                         <Typography variant="body1" color="textSecondary">
// //                             Branchwise KRA / KPI (Last 5 Years Actuals + Next 5 Years Projection)
// //                         </Typography>
// //                     </Box>
// //                     <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
// //                         <FormControl size="small" sx={{ minWidth: 150 }}>
// //                             <InputLabel>Financial Year</InputLabel>
// //                             <Select value={finYear} label="Financial Year" onChange={(e) => setFinYear(e.target.value)}>
// //                                 <MenuItem value="">All</MenuItem>
// //                                 {yearlySummary.map((item: any) => (
// //                                     <MenuItem key={item.fiN_YEAR} value={item.fiN_YEAR}>{item.fiN_YEAR}</MenuItem>
// //                                 ))}
// //                             </Select>
// //                         </FormControl>
// //                         <FormControl size="small" sx={{ minWidth: 120 }}>
// //                             <InputLabel>Year Type</InputLabel>
// //                             <Select value={yearType} label="Year Type" onChange={(e) => setYearType(e.target.value)}>
// //                                 <MenuItem value="">All</MenuItem>
// //                                 <MenuItem value="ACTUAL">Actual</MenuItem>
// //                                 <MenuItem value="PROJECTED">Projected</MenuItem>
// //                             </Select>
// //                         </FormControl>
// //                         <FormControl size="small" sx={{ minWidth: 150 }}>
// //                             <InputLabel>Region</InputLabel>
// //                             <Select value={regionName} label="Region" onChange={(e) => setRegionName(e.target.value)}>
// //                                 <MenuItem value="">All Regions</MenuItem>
// //                                 {regionSummary.map((region: any) => (
// //                                     <MenuItem key={region.regioN_NAME} value={region.regioN_NAME}>{region.regioN_NAME}</MenuItem>
// //                                 ))}
// //                             </Select>
// //                         </FormControl>
// //                         <Tooltip title="Refresh">
// //                             <IconButton onClick={() => refetch()} sx={{ bgcolor: '#f5f5f5' }}><RefreshIcon /></IconButton>
// //                         </Tooltip>
// //                     </Box>
// //                 </Box>

// //                 {/* KPI Cards Row 1 */}
// //                 <Grid container spacing={2} sx={{ mb: 3 }}>
// //                     <Grid size={{ xs: 12, sm: 6, md: 3 }}>
// //                         <StyledCard title="TOTAL DEPOSITS" value={`${(summary.totaL_DEPOSIT_CR || 0).toLocaleString('en-IN')} Cr`} icon={<Savings />} colorIndex={2} />
// //                     </Grid>
// //                     <Grid size={{ xs: 12, sm: 6, md: 3 }}>
// //                         <StyledCard title="TOTAL LOANS" value={`${(summary.totaL_LOAN_CR || 0).toLocaleString('en-IN')} Cr`} icon={<AccountBalance />} colorIndex={0} />
// //                     </Grid>
// //                     <Grid size={{ xs: 12, sm: 6, md: 3 }}>
// //                         <StyledCard title="TOTAL RECOVERY" value={`${(summary.totaL_RECOVERY_CR || 0).toLocaleString('en-IN')} Cr`} icon={<AttachMoney />} colorIndex={3} />
// //                     </Grid>
// //                     <Grid size={{ xs: 12, sm: 6, md: 3 }}>
// //                         <StyledCard title="GROSS NPA %" value={formatPercentage(summary.avG_GROSS_NPA)} icon={<Warning />} colorIndex={1} />
// //                     </Grid>
// //                 </Grid>

// //                 {/* KPI Cards Row 2 */}
// //                 <Grid container spacing={2} sx={{ mb: 3 }}>
// //                     <Grid size={{ xs: 12, sm: 6, md: 3 }}>
// //                         <StyledCard title="CASA RATIO %" value={formatPercentage(summary.avG_CASA_RATIO)} icon={<Assessment />} colorIndex={4} />
// //                     </Grid>
// //                     <Grid size={{ xs: 12, sm: 6, md: 3 }}>
// //                         <StyledCard title="DIGITAL TXN %" value={formatPercentage(summary.digitaL_PERCENT)} icon={<MobileFriendly />} colorIndex={5} />
// //                     </Grid>
// //                     <Grid size={{ xs: 12, sm: 6, md: 3 }}>
// //                         <StyledCard title="TOTAL CUSTOMERS" value={formatNumber(summary.totaL_CUSTOMERS)} icon={<People />} colorIndex={0} />
// //                     </Grid>
// //                     <Grid size={{ xs: 12, sm: 6, md: 3 }}>
// //                         <StyledCard title="AVG PERFORMANCE" value={formatPercentage(summary.avG_PERFORMANCE)} icon={<TrendingUp />} colorIndex={2} />
// //                     </Grid>
// //                 </Grid>

// //                 {/* YoY Growth Section */}
// //                 {yearlySummary.length >= 2 && (
// //                     <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
// //                         <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'primary.main', mb: 2 }}>{t('bank_kpi.year_over_year_growth', 'Year-over-Year Growth')}</Typography>
// //                         <Grid container spacing={2}>
// //                             <Grid size={{ xs: 6, sm: 3 }}>
// //                                 <Box sx={{ textAlign: 'center', p: 1, bgcolor: yoyGrowth.deposit >= 0 ? '#e8f5e9' : '#ffebee', borderRadius: 2 }}>
// //                                     <Typography variant="caption" color="textSecondary">{t('bank_kpi.deposit_growth', 'Deposit Growth')}</Typography>
// //                                     <Typography variant="h6" sx={{ color: yoyGrowth.deposit >= 0 ? '#059669' : '#DC2626', fontWeight: 'bold' }}>
// //                                         {yoyGrowth.deposit >= 0 ? '+' : ''}{yoyGrowth.deposit.toFixed(2)}%
// //                                     </Typography>
// //                                     {yoyGrowth.deposit >= 0 ? <TrendingUp sx={{ fontSize: 16, color: '#059669' }} /> : <TrendingDown sx={{ fontSize: 16, color: '#DC2626' }} />}
// //                                 </Box>
// //                             </Grid>
// //                             <Grid size={{ xs: 6, sm: 3 }}>
// //                                 <Box sx={{ textAlign: 'center', p: 1, bgcolor: yoyGrowth.loan >= 0 ? '#e8f5e9' : '#ffebee', borderRadius: 2 }}>
// //                                     <Typography variant="caption" color="textSecondary">{t('bank_kpi.loan_growth', 'Loan Growth')}</Typography>
// //                                     <Typography variant="h6" sx={{ color: yoyGrowth.loan >= 0 ? '#059669' : '#DC2626', fontWeight: 'bold' }}>
// //                                         {yoyGrowth.loan >= 0 ? '+' : ''}{yoyGrowth.loan.toFixed(2)}%
// //                                     </Typography>
// //                                     {yoyGrowth.loan >= 0 ? <TrendingUp sx={{ fontSize: 16, color: '#059669' }} /> : <TrendingDown sx={{ fontSize: 16, color: '#DC2626' }} />}
// //                                 </Box>
// //                             </Grid>
// //                             <Grid size={{ xs: 6, sm: 3 }}>
// //                                 <Box sx={{ textAlign: 'center', p: 1, bgcolor: yoyGrowth.npa <= 0 ? '#e8f5e9' : '#ffebee', borderRadius: 2 }}>
// //                                     <Typography variant="caption" color="textSecondary">{t('bank_kpi.npa_change', 'NPA Change')}</Typography>
// //                                     <Typography variant="h6" sx={{ color: yoyGrowth.npa <= 0 ? '#059669' : '#DC2626', fontWeight: 'bold' }}>
// //                                         {yoyGrowth.npa >= 0 ? '+' : ''}{yoyGrowth.npa.toFixed(2)}%
// //                                     </Typography>
// //                                     {yoyGrowth.npa <= 0 ? <TrendingDown sx={{ fontSize: 16, color: '#059669' }} /> : <TrendingUp sx={{ fontSize: 16, color: '#DC2626' }} />}
// //                                 </Box>
// //                             </Grid>
// //                             <Grid size={{ xs: 6, sm: 3 }}>
// //                                 <Box sx={{ textAlign: 'center', p: 1, bgcolor: yoyGrowth.digital >= 0 ? '#e8f5e9' : '#ffebee', borderRadius: 2 }}>
// //                                     <Typography variant="caption" color="textSecondary">{t('bank_kpi.digital_growth', 'Digital Growth')}</Typography>
// //                                     <Typography variant="h6" sx={{ color: yoyGrowth.digital >= 0 ? '#059669' : '#DC2626', fontWeight: 'bold' }}>
// //                                         {yoyGrowth.digital >= 0 ? '+' : ''}{yoyGrowth.digital.toFixed(2)}%
// //                                     </Typography>
// //                                     {yoyGrowth.digital >= 0 ? <TrendingUp sx={{ fontSize: 16, color: '#059669' }} /> : <TrendingDown sx={{ fontSize: 16, color: '#DC2626' }} />}
// //                                 </Box>
// //                             </Grid>
// //                         </Grid>
// //                     </Paper>
// //                 )}

// //                 {/* Deposit & Loan Trends */}
// //                 <Grid container spacing={3} sx={{ mb: 3 }}>
// //                     <Grid size={{ xs: 12, md: 6 }}>
// //                         <Paper sx={{ p: 2, borderRadius: 2 }}>
// //                             <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main', mb: 2 }}>{t('bank_kpi.deposit_achievement_trend', 'DEPOSIT ACHIEVEMENT TREND (Cr)')}</Typography>
// //                             <ResponsiveContainer width="100%" height={300}>
// //                                 <ComposedChart data={trendAnalysis}>
// //                                     <CartesianGrid strokeDasharray="3 3" />
// //                                     <XAxis dataKey="fiN_YEAR" />
// //                                     <YAxis />
// //                                     <RechartsTooltip />
// //                                     <Legend />
// //                                     <Area type="monotone" dataKey="totaL_DEPOSIT_CR" name="DEPOSIT" fill="#2563EB" stroke="#2563EB" fillOpacity={0.3} />
// //                                 </ComposedChart>
// //                             </ResponsiveContainer>
// //                         </Paper>
// //                     </Grid>
// //                     <Grid size={{ xs: 12, md: 6 }}>
// //                         <Paper sx={{ p: 2, borderRadius: 2 }}>
// //                             <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main', mb: 2 }}>{t('bank_kpi.loan_achievement_trend', 'LOAN ACHIEVEMENT TREND (Cr)')}</Typography>
// //                             <ResponsiveContainer width="100%" height={300}>
// //                                 <ComposedChart data={trendAnalysis}>
// //                                     <CartesianGrid strokeDasharray="3 3" />
// //                                     <XAxis dataKey="fiN_YEAR" />
// //                                     <YAxis />
// //                                     <RechartsTooltip />
// //                                     <Legend />
// //                                     <Area type="monotone" dataKey="totaL_LOAN_CR" name="LOAN" fill="#DC2626" stroke="#DC2626" fillOpacity={0.3} />
// //                                 </ComposedChart>
// //                             </ResponsiveContainer>
// //                         </Paper>
// //                     </Grid>
// //                 </Grid>

// //                 {/* Recovery & NPA Trends */}
// //                 <Grid container spacing={3} sx={{ mb: 3 }}>
// //                     <Grid size={{ xs: 12, md: 6 }}>
// //                         <Paper sx={{ p: 2, borderRadius: 2 }}>
// //                             <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main', mb: 2 }}>{t('bank_kpi.recovery_achievement_trend', 'RECOVERY ACHIEVEMENT TREND (Cr)')}</Typography>
// //                             <ResponsiveContainer width="100%" height={300}>
// //                                 <ComposedChart data={trendAnalysis}>
// //                                     <CartesianGrid strokeDasharray="3 3" />
// //                                     <XAxis dataKey="fiN_YEAR" />
// //                                     <YAxis />
// //                                     <RechartsTooltip />
// //                                     <Legend />
// //                                     <Area type="monotone" dataKey="totaL_RECOVERY_CR" name="RECOVERY" fill="#059669" stroke="#059669" fillOpacity={0.3} />
// //                                 </ComposedChart>
// //                             </ResponsiveContainer>
// //                         </Paper>
// //                     </Grid>
// //                     <Grid size={{ xs: 12, md: 6 }}>
// //                         <Paper sx={{ p: 2, borderRadius: 2 }}>
// //                             <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main', mb: 2 }}>{t('bank_kpi.gross_npa_trend', 'GROSS NPA % TREND')}</Typography>
// //                             <ResponsiveContainer width="100%" height={300}>
// //                                 <ComposedChart data={trendAnalysis}>
// //                                     <CartesianGrid strokeDasharray="3 3" />
// //                                     <XAxis dataKey="fiN_YEAR" />
// //                                     <YAxis />
// //                                     <RechartsTooltip />
// //                                     <Legend />
// //                                     <Area type="monotone" dataKey="avG_NPA" name="NPA %" fill="#DC2626" stroke="#DC2626" fillOpacity={0.3} />
// //                                 </ComposedChart>
// //                             </ResponsiveContainer>
// //                         </Paper>
// //                     </Grid>
// //                 </Grid>

// //                 {/* Digital Transaction % Trend */}
// //                 <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
// //                     <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main', mb: 2 }}>{t('bank_kpi.digital_transaction_trend', 'DIGITAL TRANSACTION % TREND')}</Typography>
// //                     <ResponsiveContainer width="100%" height={300}>
// //                         <ComposedChart data={trendAnalysis}>
// //                             <CartesianGrid strokeDasharray="3 3" />
// //                             <XAxis dataKey="fiN_YEAR" />
// //                             <YAxis />
// //                             <RechartsTooltip />
// //                             <Legend />
// //                             <Area type="monotone" dataKey="digitaL_PERCENT" name="DIGITAL %" fill="#7C3AED" stroke="#7C3AED" fillOpacity={0.3} />
// //                         </ComposedChart>
// //                     </ResponsiveContainer>
// //                 </Paper>

// //                 {/* Branch Location Map */}
// //                 {mapData.length > 0 && (
// //                     <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
// //                         <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
// //                             <MapIcon /> BRANCH LOCATION MAP
// //                         </Typography>
// //                         <Typography variant="subtitle2" sx={{ mb: 1, color: '#666' }}>Branch Locations ({branchLocations.length} regions)</Typography>
// //                         <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
// //                             {branchLocations.map((location, idx) => (
// //                                 <Chip key={idx} label={location} variant="outlined" sx={{ m: 0.5, fontWeight: 500 }} />
// //                             ))}
// //                         </Box>
// //                         <Typography variant="subtitle2" sx={{ mb: 2, color: '#666' }}>{t('bank_kpi.branch_wise_performance_map', 'Branch-wise Performance Map')}</Typography>
// //                         <Grid container spacing={2}>
// //                             {mapData.map((branch: any, idx: number) => (
// //                                 <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={idx}>
// //                                     <Paper sx={{ p: 1.5, borderRadius: 2, borderLeft: `4px solid ${getPerformanceColor(branch.overalL_ACHIEVEMENT_PERCENT || 0)}`, bgcolor: '#fafafa' }}>
// //                                         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
// //                                             <Box>
// //                                                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{branch.brancH_NAME}</Typography>
// //                                                 <Typography variant="caption" color="textSecondary">{branch.regioN_NAME} | Code: {branch.pbrcode}</Typography>
// //                                             </Box>
// //                                             <Chip label={`${(branch.overalL_ACHIEVEMENT_PERCENT || 0).toFixed(1)}%`} size="small" sx={{ bgcolor: getPerformanceColor(branch.overalL_ACHIEVEMENT_PERCENT || 0), color: 'white', fontWeight: 'bold' }} />
// //                                         </Box>
// //                                         <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
// //                                             <Typography variant="caption" color="textSecondary">Deposit: {(branch.totaL_DEPOSIT_ACHIEVED_CR || 0).toFixed(0)}Cr</Typography>
// //                                             <Typography variant="caption" color="textSecondary">NPA: {(branch.grosS_NPA_PERCENT || 0).toFixed(1)}%</Typography>
// //                                         </Box>
// //                                         {branch.googlE_MAP_LOCATION && (
// //                                             <Tooltip title="View on Google Maps">
// //                                                 <IconButton size="small" sx={{ mt: 0.5, p: 0 }} onClick={() => window.open(branch.googlE_MAP_LOCATION, '_blank')}>
// //                                                     <LocationOn sx={{ fontSize: 14, color: '#2563EB' }} />
// //                                                     <Typography variant="caption" sx={{ ml: 0.5, color: '#2563EB' }}>{t('bank_kpi.view_map', 'View Map')}</Typography>
// //                                                 </IconButton>
// //                                             </Tooltip>
// //                                         )}
// //                                     </Paper>
// //                                 </Grid>
// //                             ))}
// //                         </Grid>
// //                     </Paper>
// //                 )}

// //                 {/* Branchwise Performance Summary Table */}
// //                 {branchGrid.length > 0 && (
// //                     <>
// //                         <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'primary.main' }}>{t('bank_kpi.branchwise_performance_summary', 'BRANCHWISE PERFORMANCE SUMMARY')}</Typography>
// //                         <TableContainer component={Paper} sx={{ mb: 3, borderRadius: 2, overflowX: 'auto' }}>
// //                             <Table stickyHeader size="small">
// //                                 <TableHead>
// //                                     <TableRow sx={{ bgcolor: 'primary.main' }}>
// //                                         <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Rank</TableCell>
// //                                         <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Branch Name</TableCell>
// //                                         <TableCell align="right" sx={{ color: 'white', fontWeight: 'bold' }}>Deposit (Cr)</TableCell>
// //                                         <TableCell align="right" sx={{ color: 'white', fontWeight: 'bold' }}>Loan (Cr)</TableCell>
// //                                         <TableCell align="right" sx={{ color: 'white', fontWeight: 'bold' }}>Recovery (Cr)</TableCell>
// //                                         <TableCell align="right" sx={{ color: 'white', fontWeight: 'bold' }}>Gross NPA %</TableCell>
// //                                         <TableCell align="right" sx={{ color: 'white', fontWeight: 'bold' }}>Digital %</TableCell>
// //                                         <TableCell align="right" sx={{ color: 'white', fontWeight: 'bold' }}>Overall %</TableCell>
// //                                         <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Performance</TableCell>
// //                                     </TableRow>
// //                                 </TableHead>
// //                                 <TableBody>
// //                                     {branchGrid.map((row: any, idx: number) => (
// //                                         <TableRow key={row.pbrcode} hover>
// //                                             <TableCell>{idx + 1}</TableCell>
// //                                             <TableCell sx={{ fontWeight: 500 }}>{row.brancH_NAME}</TableCell>
// //                                             <TableCell align="right">{(row.totaL_DEPOSIT_ACHIEVED_CR || 0).toFixed(2)}</TableCell>
// //                                             <TableCell align="right">{(row.totaL_LOAN_ACHIEVED_CR || 0).toFixed(2)}</TableCell>
// //                                             <TableCell align="right">{(row.recoverY_ACHIEVED_CR || 0).toFixed(2)}</TableCell>
// //                                             <TableCell align="right" sx={{ color: (row.grosS_NPA_PERCENT || 0) > 5 ? '#DC2626' : '#059669' }}>
// //                                                 {(row.grosS_NPA_PERCENT || 0).toFixed(2)}%
// //                                             </TableCell>
// //                                             <TableCell align="right">{(row.digitaL_TRANSACTION_PERCENT || 0).toFixed(1)}%</TableCell>
// //                                             <TableCell align="right">
// //                                                 <Typography sx={{ fontWeight: 'bold', color: getStatusColor(row.performancE_STATUS) }}>
// //                                                     {(row.overalL_ACHIEVEMENT_PERCENT || 0).toFixed(1)}%
// //                                                 </Typography>
// //                                             </TableCell>
// //                                             <TableCell><Chip label={row.performancE_STATUS || 'N/A'} size="small" sx={{ bgcolor: getStatusColor(row.performancE_STATUS), color: 'white' }} /></TableCell>
// //                                         </TableRow>
// //                                     ))}
// //                                 </TableBody>
// //                             </Table>
// //                         </TableContainer>
// //                     </>
// //                 )}

// //                 {/* Top and Bottom Branches */}
// //                 <Grid container spacing={3}>
// //                     {topBranches.length > 0 && (
// //                         <Grid size={{ xs: 12, md: 6 }}>
// //                             <Paper sx={{ p: 2, borderRadius: 2 }}>
// //                                 <Typography variant="h6" sx={{ fontWeight: 600, color: '#059669', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
// //                                     <Star /> TOP BRANCHES (Overall Achievement %)
// //                                 </Typography>
// //                                 {topBranches.map((branch: any, idx: number) => (
// //                                     <Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1, borderBottom: '1px solid #eee' }}>
// //                                         <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
// //                                             <Chip label={idx + 1} size="small" color="success" />
// //                                             <Typography variant="body2">{branch.brancH_NAME}</Typography>
// //                                         </Box>
// //                                         <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#059669' }}>{(branch.overalL_ACHIEVEMENT_PERCENT || 0).toFixed(1)}%</Typography>
// //                                     </Box>
// //                                 ))}
// //                             </Paper>
// //                         </Grid>
// //                     )}
// //                     {bottomBranches.length > 0 && (
// //                         <Grid size={{ xs: 12, md: 6 }}>
// //                             <Paper sx={{ p: 2, borderRadius: 2 }}>
// //                                 <Typography variant="h6" sx={{ fontWeight: 600, color: '#DC2626', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
// //                                     <Warning /> LOW PERFORMING BRANCHES
// //                                 </Typography>
// //                                 {bottomBranches.map((branch: any, idx: number) => (
// //                                     <Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1, borderBottom: '1px solid #eee' }}>
// //                                         <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
// //                                             <Chip label={idx + 1} size="small" color="error" />
// //                                             <Typography variant="body2">{branch.brancH_NAME}</Typography>
// //                                         </Box>
// //                                         <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#DC2626' }}>{(branch.overalL_ACHIEVEMENT_PERCENT || 0).toFixed(1)}%</Typography>
// //                                     </Box>
// //                                 ))}
// //                             </Paper>
// //                         </Grid>
// //                     )}
// //                 </Grid>
// //             </Container>
// //         </Box>
// //     );
// // };

// // export default BankKPI;





// import React, { useState } from 'react';
// import {
//     Box, Container, Grid, Paper, Typography, FormControl, InputLabel,
//     Select, MenuItem, Chip, CircularProgress, Table,
//     TableBody, TableCell, TableContainer, TableHead, TableRow,
//     Button, IconButton, Tooltip,
//     useTheme, useMediaQuery
// } from '@mui/material';
// import {
//     TrendingUp, TrendingDown, AccountBalance, People,
//     AttachMoney, Assessment, Warning, Download as DownloadIcon,
//     Refresh as RefreshIcon, FilterList as FilterIcon,
//     Star, LocationOn, Business, MobileFriendly, Savings,
//     Map as MapIcon
// } from '@mui/icons-material';
// import {
//     LineChart, Line, Area, XAxis, YAxis, CartesianGrid,
//     Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
//     ComposedChart
// } from 'recharts';
// import { useBankKPI } from '../hooks/useBankKPI';
// import { formatCurrency, formatNumber, formatPercentage } from '../utils/formatters';
// import StyledCard from '../components/common/StyledCard';
// import { useTranslation } from '../hooks/useTranslation';

// const BankKPI: React.FC = () => {
//     const theme = useTheme();
//     const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    
//     const [finYear, setFinYear] = useState<string>('');
//     const [yearType, setYearType] = useState<string>('');
//     const [regionName, setRegionName] = useState<string>('');
    
//     const { data, isLoading, refetch } = useBankKPI(
//         finYear || undefined,
//         yearType || undefined,
//         regionName || undefined,
//         undefined,
//         10
//     );
    
//     // Use exact property names from API response
//     const summary = data?.summary || {
//         totaL_BRANCHES: 0,
//         totaL_CUSTOMERS: 0,
//         activE_CUSTOMERS: 0,
//         neW_CUSTOMERS: 0,
//         totaL_DEPOSIT_CR: 0,
//         totaL_LOAN_CR: 0,
//         totaL_RECOVERY_CR: 0,
//         avG_GROSS_NPA: 0,
//         avG_NET_NPA: 0,
//         avG_CASA_RATIO: 0,
//         digitaL_PERCENT: 0,
//         avG_PERFORMANCE: 0,
//         totaL_UPI_TRANSACTION_CR: 0
//     };
    
//     const yearlySummary = data?.yearlySummary || [];
//     const regionSummary = data?.regionSummary || [];
//     const topBranches = data?.topBranches || [];
//     const bottomBranches = data?.bottomBranches || [];
//     const branchGrid = data?.branchGrid || [];
//     const trendAnalysis = data?.trendAnalysis || [];
//     const mapData = data?.mapData || [];
//     const actualVsProjection = data?.actualVsProjection || [];

//     // Calculate top and bottom branches from branchGrid (since API returns all with ranks)
//     const sortedBranches = [...branchGrid].sort((a, b) => 
//         (b.overalL_ACHIEVEMENT_PERCENT || 0) - (a.overalL_ACHIEVEMENT_PERCENT || 0)
//     );
//     const derivedTopBranches = sortedBranches.slice(0, 10);
//     const derivedBottomBranches = sortedBranches.slice(-10).reverse();

//     // Use API data if available, otherwise use derived data
//     const displayTopBranches = topBranches.length > 0 ? topBranches : derivedTopBranches;
//     const displayBottomBranches = bottomBranches.length > 0 ? bottomBranches : derivedBottomBranches;

//     // Get unique regions from map data
//     const branchLocations = [...new Set(mapData.map((b: any) => b.regioN_NAME).filter(Boolean))];

//     // Calculate YoY growth
//     const getYoYGrowth = () => {
//         if (yearlySummary.length < 2) return { deposit: 0, loan: 0, npa: 0, digital: 0 };
//         const latest = yearlySummary[yearlySummary.length - 1];
//         const previous = yearlySummary[yearlySummary.length - 2];
//         return {
//             deposit: ((latest.totaL_DEPOSIT_CR - previous.totaL_DEPOSIT_CR) / previous.totaL_DEPOSIT_CR) * 100,
//             loan: ((latest.totaL_LOAN_CR - previous.totaL_LOAN_CR) / previous.totaL_LOAN_CR) * 100,
//             npa: ((latest.avG_NPA - previous.avG_NPA) / previous.avG_NPA) * 100,
//             digital: ((latest.digitaL_PERCENT - previous.digitaL_PERCENT) / previous.digitaL_PERCENT) * 100,
//         };
//     };

//     const yoyGrowth = getYoYGrowth();

//     const getStatusColor = (status: string) => {
//         if (!status) return '#757575';
//         switch (status.toUpperCase()) {
//             case 'EXCELLENT': return '#059669';
//             case 'GOOD': return '#2563EB';
//             case 'AVERAGE': return 'secondary.main';
//             case 'POOR': return '#DC2626';
//             default: return '#757575';
//         }
//     };

//     const getPerformanceColor = (performance: number) => {
//         if (performance >= 90) return '#059669';
//         if (performance >= 75) return '#2563EB';
//         if (performance >= 60) return 'secondary.main';
//         return '#DC2626';
//     };

//     if (isLoading) {
//         return (
//             <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
//                 <CircularProgress />
//             </Box>
//         );
//     }

//     return (
//         <Box sx={{ width: '100%', minHeight: '100vh', bgcolor: '#f5f5f5', overflow: 'auto', pb: 4 }}>
//             <Container maxWidth={false} sx={{ py: { xs: 2, md: 3 }, px: { xs: 2, md: 3 } }}>
//                 {/* Header */}
//                 <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
//                     <Box>
//                         <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
//                             BANK PERFORMANCE DASHBOARD
//                         </Typography>
//                         <Typography variant="body1" color="textSecondary">
//                             Branchwise KRA / KPI (Last 5 Years Actuals + Next 5 Years Projection)
//                         </Typography>
//                     </Box>
//                     <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
//                         <FormControl size="small" sx={{ minWidth: 150 }}>
//                             <InputLabel>Financial Year</InputLabel>
//                             <Select value={finYear} label="Financial Year" onChange={(e) => setFinYear(e.target.value)}>
//                                 <MenuItem value="">All</MenuItem>
//                                 {yearlySummary.map((item: any) => (
//                                     <MenuItem key={item.fiN_YEAR} value={item.fiN_YEAR}>{item.fiN_YEAR}</MenuItem>
//                                 ))}
//                             </Select>
//                         </FormControl>
//                         <FormControl size="small" sx={{ minWidth: 120 }}>
//                             <InputLabel>Year Type</InputLabel>
//                             <Select value={yearType} label="Year Type" onChange={(e) => setYearType(e.target.value)}>
//                                 <MenuItem value="">All</MenuItem>
//                                 <MenuItem value="ACTUAL">Actual</MenuItem>
//                                 <MenuItem value="PROJECTED">Projected</MenuItem>
//                             </Select>
//                         </FormControl>
//                         <FormControl size="small" sx={{ minWidth: 150 }}>
//                             <InputLabel>Region</InputLabel>
//                             <Select value={regionName} label="Region" onChange={(e) => setRegionName(e.target.value)}>
//                                 <MenuItem value="">All Regions</MenuItem>
//                                 {regionSummary.map((region: any) => (
//                                     <MenuItem key={region.regioN_NAME} value={region.regioN_NAME}>{region.regioN_NAME}</MenuItem>
//                                 ))}
//                             </Select>
//                         </FormControl>
//                         <Tooltip title="Refresh">
//                             <IconButton onClick={() => refetch()} sx={{ bgcolor: '#f5f5f5' }}><RefreshIcon /></IconButton>
//                         </Tooltip>
//                     </Box>
//                 </Box>

//                 {/* KPI Cards Row 1 */}
//                 <Grid container spacing={2} sx={{ mb: 3 }}>
//                     <Grid size={{ xs: 12, sm: 6, md: 3 }}>
//                         <StyledCard 
//                             title="TOTAL DEPOSITS" 
//                             value={`₹${(summary.totaL_DEPOSIT_CR || 0).toLocaleString('en-IN')} Cr`} 
//                             icon={<Savings />} 
//                             colorIndex={2} 
//                         />
//                     </Grid>
//                     <Grid size={{ xs: 12, sm: 6, md: 3 }}>
//                         <StyledCard 
//                             title="TOTAL LOANS" 
//                             value={`₹${(summary.totaL_LOAN_CR || 0).toLocaleString('en-IN')} Cr`} 
//                             icon={<AccountBalance />} 
//                             colorIndex={0} 
//                         />
//                     </Grid>
//                     <Grid size={{ xs: 12, sm: 6, md: 3 }}>
//                         <StyledCard 
//                             title="TOTAL RECOVERY" 
//                             value={`₹${(summary.totaL_RECOVERY_CR || 0).toLocaleString('en-IN')} Cr`} 
//                             icon={<AttachMoney />} 
//                             colorIndex={3} 
//                         />
//                     </Grid>
//                     <Grid size={{ xs: 12, sm: 6, md: 3 }}>
//                         <StyledCard 
//                             title="GROSS NPA %" 
//                             value={formatPercentage(summary.avG_GROSS_NPA)} 
//                             icon={<Warning />} 
//                             colorIndex={1} 
//                         />
//                     </Grid>
//                 </Grid>

//                 {/* KPI Cards Row 2 */}
//                 <Grid container spacing={2} sx={{ mb: 3 }}>
//                     <Grid size={{ xs: 12, sm: 6, md: 3 }}>
//                         <StyledCard 
//                             title="CASA RATIO %" 
//                             value={formatPercentage(summary.avG_CASA_RATIO)} 
//                             icon={<Assessment />} 
//                             colorIndex={4} 
//                         />
//                     </Grid>
//                     <Grid size={{ xs: 12, sm: 6, md: 3 }}>
//                         <StyledCard 
//                             title="DIGITAL TXN %" 
//                             value={formatPercentage(summary.digitaL_PERCENT)} 
//                             icon={<MobileFriendly />} 
//                             colorIndex={5} 
//                         />
//                     </Grid>
//                     <Grid size={{ xs: 12, sm: 6, md: 3 }}>
//                         <StyledCard 
//                             title="TOTAL CUSTOMERS" 
//                             value={formatNumber(summary.totaL_CUSTOMERS)} 
//                             icon={<People />} 
//                             colorIndex={0} 
//                         />
//                     </Grid>
//                     <Grid size={{ xs: 12, sm: 6, md: 3 }}>
//                         <StyledCard 
//                             title="AVG PERFORMANCE" 
//                             value={formatPercentage(summary.avG_PERFORMANCE)} 
//                             icon={<TrendingUp />} 
//                             colorIndex={2} 
//                         />
//                     </Grid>
//                 </Grid>

//                 {/* YoY Growth Section */}
//                 {yearlySummary.length >= 2 && (
//                     <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
//                         <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'primary.main', mb: 2 }}>{t('bank_kpi.year_over_year_growth', 'Year-over-Year Growth')}</Typography>
//                         <Grid container spacing={2}>
//                             <Grid size={{ xs: 6, sm: 3 }}>
//                                 <Box sx={{ textAlign: 'center', p: 1, bgcolor: yoyGrowth.deposit >= 0 ? '#e8f5e9' : '#ffebee', borderRadius: 2 }}>
//                                     <Typography variant="caption" color="textSecondary">{t('bank_kpi.deposit_growth', 'Deposit Growth')}</Typography>
//                                     <Typography variant="h6" sx={{ color: yoyGrowth.deposit >= 0 ? '#059669' : '#DC2626', fontWeight: 'bold' }}>
//                                         {yoyGrowth.deposit >= 0 ? '+' : ''}{yoyGrowth.deposit.toFixed(2)}%
//                                     </Typography>
//                                     {yoyGrowth.deposit >= 0 ? <TrendingUp sx={{ fontSize: 16, color: '#059669' }} /> : <TrendingDown sx={{ fontSize: 16, color: '#DC2626' }} />}
//                                 </Box>
//                             </Grid>
//                             <Grid size={{ xs: 6, sm: 3 }}>
//                                 <Box sx={{ textAlign: 'center', p: 1, bgcolor: yoyGrowth.loan >= 0 ? '#e8f5e9' : '#ffebee', borderRadius: 2 }}>
//                                     <Typography variant="caption" color="textSecondary">{t('bank_kpi.loan_growth', 'Loan Growth')}</Typography>
//                                     <Typography variant="h6" sx={{ color: yoyGrowth.loan >= 0 ? '#059669' : '#DC2626', fontWeight: 'bold' }}>
//                                         {yoyGrowth.loan >= 0 ? '+' : ''}{yoyGrowth.loan.toFixed(2)}%
//                                     </Typography>
//                                     {yoyGrowth.loan >= 0 ? <TrendingUp sx={{ fontSize: 16, color: '#059669' }} /> : <TrendingDown sx={{ fontSize: 16, color: '#DC2626' }} />}
//                                 </Box>
//                             </Grid>
//                             <Grid size={{ xs: 6, sm: 3 }}>
//                                 <Box sx={{ textAlign: 'center', p: 1, bgcolor: yoyGrowth.npa <= 0 ? '#e8f5e9' : '#ffebee', borderRadius: 2 }}>
//                                     <Typography variant="caption" color="textSecondary">{t('bank_kpi.npa_change', 'NPA Change')}</Typography>
//                                     <Typography variant="h6" sx={{ color: yoyGrowth.npa <= 0 ? '#059669' : '#DC2626', fontWeight: 'bold' }}>
//                                         {yoyGrowth.npa >= 0 ? '+' : ''}{yoyGrowth.npa.toFixed(2)}%
//                                     </Typography>
//                                     {yoyGrowth.npa <= 0 ? <TrendingDown sx={{ fontSize: 16, color: '#059669' }} /> : <TrendingUp sx={{ fontSize: 16, color: '#DC2626' }} />}
//                                 </Box>
//                             </Grid>
//                             <Grid size={{ xs: 6, sm: 3 }}>
//                                 <Box sx={{ textAlign: 'center', p: 1, bgcolor: yoyGrowth.digital >= 0 ? '#e8f5e9' : '#ffebee', borderRadius: 2 }}>
//                                     <Typography variant="caption" color="textSecondary">{t('bank_kpi.digital_growth', 'Digital Growth')}</Typography>
//                                     <Typography variant="h6" sx={{ color: yoyGrowth.digital >= 0 ? '#059669' : '#DC2626', fontWeight: 'bold' }}>
//                                         {yoyGrowth.digital >= 0 ? '+' : ''}{yoyGrowth.digital.toFixed(2)}%
//                                     </Typography>
//                                     {yoyGrowth.digital >= 0 ? <TrendingUp sx={{ fontSize: 16, color: '#059669' }} /> : <TrendingDown sx={{ fontSize: 16, color: '#DC2626' }} />}
//                                 </Box>
//                             </Grid>
//                         </Grid>
//                     </Paper>
//                 )}

//                 {/* Deposit & Loan Trends */}
//                 <Grid container spacing={3} sx={{ mb: 3 }}>
//                     <Grid size={{ xs: 12, md: 6 }}>
//                         <Paper sx={{ p: 2, borderRadius: 2 }}>
//                             <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main', mb: 2 }}>{t('bank_kpi.deposit_achievement_trend', 'DEPOSIT ACHIEVEMENT TREND (Cr)')}</Typography>
//                             <ResponsiveContainer width="100%" height={300}>
//                                 <ComposedChart data={trendAnalysis}>
//                                     <CartesianGrid strokeDasharray="3 3" />
//                                     <XAxis dataKey="fiN_YEAR" />
//                                     <YAxis />
//                                     <RechartsTooltip />
//                                     <Legend />
//                                     <Area type="monotone" dataKey="totaL_DEPOSIT_CR" name="DEPOSIT" fill="#2563EB" stroke="#2563EB" fillOpacity={0.3} />
//                                 </ComposedChart>
//                             </ResponsiveContainer>
//                         </Paper>
//                     </Grid>
//                     <Grid size={{ xs: 12, md: 6 }}>
//                         <Paper sx={{ p: 2, borderRadius: 2 }}>
//                             <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main', mb: 2 }}>{t('bank_kpi.loan_achievement_trend', 'LOAN ACHIEVEMENT TREND (Cr)')}</Typography>
//                             <ResponsiveContainer width="100%" height={300}>
//                                 <ComposedChart data={trendAnalysis}>
//                                     <CartesianGrid strokeDasharray="3 3" />
//                                     <XAxis dataKey="fiN_YEAR" />
//                                     <YAxis />
//                                     <RechartsTooltip />
//                                     <Legend />
//                                     <Area type="monotone" dataKey="totaL_LOAN_CR" name="LOAN" fill="#DC2626" stroke="#DC2626" fillOpacity={0.3} />
//                                 </ComposedChart>
//                             </ResponsiveContainer>
//                         </Paper>
//                     </Grid>
//                 </Grid>

//                 {/* Recovery & NPA Trends */}
//                 <Grid container spacing={3} sx={{ mb: 3 }}>
//                     <Grid size={{ xs: 12, md: 6 }}>
//                         <Paper sx={{ p: 2, borderRadius: 2 }}>
//                             <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main', mb: 2 }}>{t('bank_kpi.recovery_achievement_trend', 'RECOVERY ACHIEVEMENT TREND (Cr)')}</Typography>
//                             <ResponsiveContainer width="100%" height={300}>
//                                 <ComposedChart data={trendAnalysis}>
//                                     <CartesianGrid strokeDasharray="3 3" />
//                                     <XAxis dataKey="fiN_YEAR" />
//                                     <YAxis />
//                                     <RechartsTooltip />
//                                     <Legend />
//                                     <Area type="monotone" dataKey="totaL_RECOVERY_CR" name="RECOVERY" fill="#059669" stroke="#059669" fillOpacity={0.3} />
//                                 </ComposedChart>
//                             </ResponsiveContainer>
//                         </Paper>
//                     </Grid>
//                     <Grid size={{ xs: 12, md: 6 }}>
//                         <Paper sx={{ p: 2, borderRadius: 2 }}>
//                             <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main', mb: 2 }}>{t('bank_kpi.gross_npa_trend', 'GROSS NPA % TREND')}</Typography>
//                             <ResponsiveContainer width="100%" height={300}>
//                                 <ComposedChart data={trendAnalysis}>
//                                     <CartesianGrid strokeDasharray="3 3" />
//                                     <XAxis dataKey="fiN_YEAR" />
//                                     <YAxis tickFormatter={(v) => `${v}%`} />
//                                     <RechartsTooltip />
//                                     <Legend />
//                                     <Area type="monotone" dataKey="avG_NPA" name="NPA %" fill="#DC2626" stroke="#DC2626" fillOpacity={0.3} />
//                                 </ComposedChart>
//                             </ResponsiveContainer>
//                         </Paper>
//                     </Grid>
//                 </Grid>

//                 {/* Digital Transaction % Trend */}
//                 <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
//                     <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main', mb: 2 }}>{t('bank_kpi.digital_transaction_trend', 'DIGITAL TRANSACTION % TREND')}</Typography>
//                     <ResponsiveContainer width="100%" height={300}>
//                         <ComposedChart data={trendAnalysis}>
//                             <CartesianGrid strokeDasharray="3 3" />
//                             <XAxis dataKey="fiN_YEAR" />
//                             <YAxis tickFormatter={(v) => `${v}%`} />
//                             <RechartsTooltip />
//                             <Legend />
//                             <Area type="monotone" dataKey="digitaL_PERCENT" name="DIGITAL %" fill="#7C3AED" stroke="#7C3AED" fillOpacity={0.3} />
//                         </ComposedChart>
//                     </ResponsiveContainer>
//                 </Paper>

//                 {/* Branch Location Map */}
//                 {mapData.length > 0 && (
//                     <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
//                         <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
//                             <MapIcon /> BRANCH LOCATION MAP
//                         </Typography>
//                         <Typography variant="subtitle2" sx={{ mb: 1, color: '#666' }}>Branch Locations ({branchLocations.length} regions)</Typography>
//                         <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
//                             {branchLocations.map((location, idx) => (
//                                 <Chip key={idx} label={location} variant="outlined" sx={{ m: 0.5, fontWeight: 500 }} />
//                             ))}
//                         </Box>
//                         <Typography variant="subtitle2" sx={{ mb: 2, color: '#666' }}>{t('bank_kpi.branch_wise_performance_map', 'Branch-wise Performance Map')}</Typography>
//                         <Grid container spacing={2}>
//                             {mapData.map((branch: any, idx: number) => (
//                                 <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={idx}>
//                                     <Paper sx={{ 
//                                         p: 1.5, 
//                                         borderRadius: 2, 
//                                         borderLeft: `4px solid ${getPerformanceColor(branch.overalL_ACHIEVEMENT_PERCENT || 0)}`, 
//                                         bgcolor: '#fafafa',
//                                         transition: 'transform 0.2s',
//                                         '&:hover': { transform: 'translateY(-2px)', boxShadow: 2 }
//                                     }}>
//                                         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
//                                             <Box>
//                                                 <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{branch.brancH_NAME}</Typography>
//                                                 <Typography variant="caption" color="textSecondary">{branch.regioN_NAME} | Code: {branch.pbrcode}</Typography>
//                                             </Box>
//                                             <Chip 
//                                                 label={`${(branch.overalL_ACHIEVEMENT_PERCENT || 0).toFixed(1)}%`} 
//                                                 size="small" 
//                                                 sx={{ bgcolor: getPerformanceColor(branch.overalL_ACHIEVEMENT_PERCENT || 0), color: 'white', fontWeight: 'bold' }} 
//                                             />
//                                         </Box>
//                                         <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
//                                             <Typography variant="caption" color="textSecondary">
//                                                 Deposit: {(branch.totaL_DEPOSIT_ACHIEVED_CR || 0).toFixed(0)}Cr
//                                             </Typography>
//                                             <Typography variant="caption" color="textSecondary">
//                                                 NPA: {(branch.grosS_NPA_PERCENT || 0).toFixed(1)}%
//                                             </Typography>
//                                         </Box>
//                                         {branch.googlE_MAP_LOCATION && (
//                                             <Tooltip title="View on Google Maps">
//                                                 <IconButton 
//                                                     size="small" 
//                                                     sx={{ mt: 0.5, p: 0 }} 
//                                                     onClick={() => window.open(branch.googlE_MAP_LOCATION, '_blank')}
//                                                 >
//                                                     <LocationOn sx={{ fontSize: 14, color: '#2563EB' }} />
//                                                     <Typography variant="caption" sx={{ ml: 0.5, color: '#2563EB' }}>{t('bank_kpi.view_map', 'View Map')}</Typography>
//                                                 </IconButton>
//                                             </Tooltip>
//                                         )}
//                                     </Paper>
//                                 </Grid>
//                             ))}
//                         </Grid>
//                         {/* Legend */}
//                         <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 3, pt: 2, borderTop: '1px solid #e0e0e0', flexWrap: 'wrap' }}>
//                             <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                                 <Box sx={{ width: 16, height: 16, bgcolor: '#059669', borderRadius: 1 }} />
//                                 <Typography variant="caption">Excellent (≥90%)</Typography>
//                             </Box>
//                             <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                                 <Box sx={{ width: 16, height: 16, bgcolor: '#2563EB', borderRadius: 1 }} />
//                                 <Typography variant="caption">Good (75-89%)</Typography>
//                             </Box>
//                             <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                                 <Box sx={{ width: 16, height: 16, bgcolor: 'secondary.main', borderRadius: 1 }} />
//                                 <Typography variant="caption">Average (60-74%)</Typography>
//                             </Box>
//                             <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                                 <Box sx={{ width: 16, height: 16, bgcolor: '#DC2626', borderRadius: 1 }} />
//                                 <Typography variant="caption">Poor (&lt;60%)</Typography>
//                             </Box>
//                         </Box>
//                     </Paper>
//                 )}

//                 {/* Branchwise Performance Summary Table */}
//                 {branchGrid.length > 0 && (
//                     <>
//                         <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'primary.main' }}>{t('bank_kpi.branchwise_performance_summary', 'BRANCHWISE PERFORMANCE SUMMARY')}</Typography>
//                         <TableContainer component={Paper} sx={{ mb: 3, borderRadius: 2, overflowX: 'auto' }}>
//                             <Table stickyHeader size="small">
//                                 <TableHead>
//                                     <TableRow sx={{ bgcolor: 'primary.main' }}>
//                                         <TableCell sx={{ color: 'white', fontWeight: 'bold', bgcolor: 'primary.main' }}>Rank</TableCell>
//                                         <TableCell sx={{ color: 'white', fontWeight: 'bold', bgcolor: 'primary.main' }}>Branch Name</TableCell>
//                                         <TableCell align="right" sx={{ color: 'white', fontWeight: 'bold', bgcolor: 'primary.main' }}>Deposit (Cr)</TableCell>
//                                         <TableCell align="right" sx={{ color: 'white', fontWeight: 'bold', bgcolor: 'primary.main' }}>Loan (Cr)</TableCell>
//                                         <TableCell align="right" sx={{ color: 'white', fontWeight: 'bold', bgcolor: 'primary.main' }}>Recovery (Cr)</TableCell>
//                                         <TableCell align="right" sx={{ color: 'white', fontWeight: 'bold', bgcolor: 'primary.main' }}>Gross NPA %</TableCell>
//                                         <TableCell align="right" sx={{ color: 'white', fontWeight: 'bold', bgcolor: 'primary.main' }}>Digital %</TableCell>
//                                         <TableCell align="right" sx={{ color: 'white', fontWeight: 'bold', bgcolor: 'primary.main' }}>Overall %</TableCell>
//                                         <TableCell sx={{ color: 'white', fontWeight: 'bold', bgcolor: 'primary.main' }}>Performance</TableCell>
//                                     </TableRow>
//                                 </TableHead>
//                                 <TableBody>
//                                     {branchGrid.map((row: any, idx: number) => (
//                                         <TableRow key={row.pbrcode} hover>
//                                             <TableCell>{idx + 1}</TableCell>
//                                             <TableCell sx={{ fontWeight: 500 }}>{row.brancH_NAME}</TableCell>
//                                             <TableCell align="right">{(row.totaL_DEPOSIT_ACHIEVED_CR || 0).toFixed(2)}</TableCell>
//                                             <TableCell align="right">{(row.totaL_LOAN_ACHIEVED_CR || 0).toFixed(2)}</TableCell>
//                                             <TableCell align="right">{(row.recoverY_ACHIEVED_CR || 0).toFixed(2)}</TableCell>
//                                             <TableCell align="right" sx={{ color: (row.grosS_NPA_PERCENT || 0) > 5 ? '#DC2626' : '#059669' }}>
//                                                 {(row.grosS_NPA_PERCENT || 0).toFixed(2)}%
//                                             </TableCell>
//                                             <TableCell align="right">{(row.digitaL_TRANSACTION_PERCENT || 0).toFixed(1)}%</TableCell>
//                                             <TableCell align="right">
//                                                 <Typography sx={{ fontWeight: 'bold', color: getStatusColor(row.performancE_STATUS) }}>
//                                                     {(row.overalL_ACHIEVEMENT_PERCENT || 0).toFixed(1)}%
//                                                 </Typography>
//                                             </TableCell>
//                                             <TableCell>
//                                                 <Chip 
//                                                     label={row.performancE_STATUS || 'N/A'} 
//                                                     size="small" 
//                                                     sx={{ bgcolor: getStatusColor(row.performancE_STATUS), color: 'white', fontWeight: 'bold' }} 
//                                                 />
//                                             </TableCell>
//                                         </TableRow>
//                                     ))}
//                                 </TableBody>
//                             </Table>
//                         </TableContainer>
//                     </>
//                 )}

//                 {/* Top and Bottom Branches */}
//                 <Grid container spacing={3}>
//                     {displayTopBranches.length > 0 && (
//                         <Grid size={{ xs: 12, md: 6 }}>
//                             <Paper sx={{ p: 2, borderRadius: 2 }}>
//                                 <Typography variant="h6" sx={{ fontWeight: 600, color: '#059669', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
//                                     <Star /> TOP BRANCHES (Overall Achievement %)
//                                 </Typography>
//                                 {displayTopBranches.map((branch: any, idx: number) => (
//                                     <Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1, borderBottom: '1px solid #eee' }}>
//                                         <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                                             <Chip label={idx + 1} size="small" color="success" />
//                                             <Typography variant="body2" sx={{ fontWeight: 500 }}>{branch.brancH_NAME}</Typography>
//                                         </Box>
//                                         <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#059669' }}>
//                                             {(branch.overalL_ACHIEVEMENT_PERCENT || 0).toFixed(1)}%
//                                         </Typography>
//                                     </Box>
//                                 ))}
//                             </Paper>
//                         </Grid>
//                     )}
//                     {displayBottomBranches.length > 0 && (
//                         <Grid size={{ xs: 12, md: 6 }}>
//                             <Paper sx={{ p: 2, borderRadius: 2 }}>
//                                 <Typography variant="h6" sx={{ fontWeight: 600, color: '#DC2626', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
//                                     <Warning /> LOW PERFORMING BRANCHES
//                                 </Typography>
//                                 {displayBottomBranches.map((branch: any, idx: number) => (
//                                     <Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1, borderBottom: '1px solid #eee' }}>
//                                         <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                                             <Chip label={idx + 1} size="small" color="error" />
//                                             <Typography variant="body2" sx={{ fontWeight: 500 }}>{branch.brancH_NAME}</Typography>
//                                         </Box>
//                                         <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#DC2626' }}>
//                                             {(branch.overalL_ACHIEVEMENT_PERCENT || 0).toFixed(1)}%
//                                         </Typography>
//                                     </Box>
//                                 ))}
//                             </Paper>
//                         </Grid>
//                     )}
//                 </Grid>
//             </Container>
//         </Box>
//     );
// };

// export default BankKPI;





import React, { useState } from 'react';
import {
    Box, Container, Grid, Paper, Typography, FormControl, InputLabel,
    Select, MenuItem, Chip, CircularProgress, Table,
    TableBody, TableCell, TableContainer, TableHead, TableRow,
    Button, IconButton, Tooltip,
    useTheme, useMediaQuery
} from '@mui/material';
import {
    TrendingUp, TrendingDown, AccountBalance, People,
    AttachMoney, Assessment, Warning, Download as DownloadIcon,
    Refresh as RefreshIcon, FilterList as FilterIcon,
    Star, LocationOn, Business, MobileFriendly, Savings,
    Map as MapIcon
} from '@mui/icons-material';
import {
    LineChart, Line, Area, XAxis, YAxis, CartesianGrid,
    Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
    ComposedChart
} from 'recharts';
import { useBankKPI } from '../hooks/useBankKPI';
import { formatCurrency, formatNumber, formatPercentage } from '../utils/formatters';
import StyledCard from '../components/common/StyledCard';
import { useTranslation } from '../hooks/useTranslation';

const BankKPI: React.FC = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const { t } = useTranslation();
    
    const [finYear, setFinYear] = useState<string>('');
    const [yearType, setYearType] = useState<string>('');
    const [regionName, setRegionName] = useState<string>('');
    
    const { data, isLoading, refetch } = useBankKPI(
        finYear || undefined,
        yearType || undefined,
        regionName || undefined,
        undefined,
        10
    );
    
    // Use exact property names from API response
    const summary = data?.summary || {
        totaL_BRANCHES: 0,
        totaL_CUSTOMERS: 0,
        activE_CUSTOMERS: 0,
        neW_CUSTOMERS: 0,
        totaL_DEPOSIT_CR: 0,
        totaL_LOAN_CR: 0,
        totaL_RECOVERY_CR: 0,
        avG_GROSS_NPA: 0,
        avG_NET_NPA: 0,
        avG_CASA_RATIO: 0,
        digitaL_PERCENT: 0,
        avG_PERFORMANCE: 0,
        totaL_UPI_TRANSACTION_CR: 0
    };
    
    const yearlySummary = data?.yearlySummary || [];
    const regionSummary = data?.regionSummary || [];
    const topBranches = data?.topBranches || [];
    const bottomBranches = data?.bottomBranches || [];
    const branchGrid = data?.branchGrid || [];
    const trendAnalysis = data?.trendAnalysis || [];
    const mapData = data?.mapData || [];
    const actualVsProjection = data?.actualVsProjection || [];

    // Calculate top and bottom branches from branchGrid
    const sortedBranches = [...branchGrid].sort((a, b) => 
        (b.overalL_ACHIEVEMENT_PERCENT || 0) - (a.overalL_ACHIEVEMENT_PERCENT || 0)
    );
    const derivedTopBranches = sortedBranches.slice(0, 10);
    const derivedBottomBranches = sortedBranches.slice(-10).reverse();

    // Use API data if available, otherwise use derived data
    const displayTopBranches = topBranches.length > 0 ? topBranches : derivedTopBranches;
    const displayBottomBranches = bottomBranches.length > 0 ? bottomBranches : derivedBottomBranches;

    // Get unique regions from map data
    const branchLocations = [...new Set(mapData.map((b: any) => b.regioN_NAME).filter(Boolean))];

    // Calculate YoY growth
    const getYoYGrowth = () => {
        if (yearlySummary.length < 2) return { deposit: 0, loan: 0, npa: 0, digital: 0 };
        const latest = yearlySummary[yearlySummary.length - 1];
        const previous = yearlySummary[yearlySummary.length - 2];
        return {
            deposit: ((latest.totaL_DEPOSIT_CR - previous.totaL_DEPOSIT_CR) / previous.totaL_DEPOSIT_CR) * 100,
            loan: ((latest.totaL_LOAN_CR - previous.totaL_LOAN_CR) / previous.totaL_LOAN_CR) * 100,
            npa: ((latest.avG_NPA - previous.avG_NPA) / previous.avG_NPA) * 100,
            digital: ((latest.digitaL_PERCENT - previous.digitaL_PERCENT) / previous.digitaL_PERCENT) * 100,
        };
    };

    const yoyGrowth = getYoYGrowth();

    const getStatusColor = (status: string) => {
        if (!status) return '#757575';
        switch (status.toUpperCase()) {
            case 'EXCELLENT': return '#059669';
            case 'GOOD': return '#2563EB';
            case 'AVERAGE': return 'secondary.main';
            case 'POOR': return '#DC2626';
            default: return '#757575';
        }
    };

    const getPerformanceColor = (performance: number) => {
        if (performance >= 90) return '#059669';
        if (performance >= 75) return '#2563EB';
        if (performance >= 60) return 'secondary.main';
        return '#DC2626';
    };

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
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
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <FormControl size="small" sx={{ minWidth: 150 }}>
                            <InputLabel>{t('kpi.financial_year', 'Financial Year')}</InputLabel>
                            <Select value={finYear} label={t('kpi.financial_year', 'Financial Year')} onChange={(e) => setFinYear(e.target.value)}>
                                <MenuItem value="">{t('common.all', 'All')}</MenuItem>
                                {yearlySummary.map((item: any) => (
                                    <MenuItem key={item.fiN_YEAR} value={item.fiN_YEAR}>{item.fiN_YEAR}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl size="small" sx={{ minWidth: 120 }}>
                            <InputLabel>{t('kpi.year_type', 'Year Type')}</InputLabel>
                            <Select value={yearType} label={t('kpi.year_type', 'Year Type')} onChange={(e) => setYearType(e.target.value)}>
                                <MenuItem value="">{t('common.all', 'All')}</MenuItem>
                                <MenuItem value="ACTUAL">{t('kpi.actual', 'Actual')}</MenuItem>
                                <MenuItem value="PROJECTED">{t('kpi.projected', 'Projected')}</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl size="small" sx={{ minWidth: 150 }}>
                            <InputLabel>{t('common.region', 'Region')}</InputLabel>
                            <Select value={regionName} label={t('common.region', 'Region')} onChange={(e) => setRegionName(e.target.value)}>
                                <MenuItem value="">{t('common.all_regions', 'All Regions')}</MenuItem>
                                {regionSummary.map((region: any) => (
                                    <MenuItem key={region.regioN_NAME} value={region.regioN_NAME}>{region.regioN_NAME}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <Tooltip title={t('common.refresh', 'Refresh')}>
                            <IconButton onClick={() => refetch()} sx={{ bgcolor: '#f5f5f5' }}><RefreshIcon /></IconButton>
                        </Tooltip>
                    </Box>
                </Box>

                {/* KPI Cards Row 1 */}
                <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <StyledCard 
                            title={t('kpi.total_deposits', 'TOTAL DEPOSITS')} 
                            value={`₹${(summary.totaL_DEPOSIT_CR || 0).toLocaleString('en-IN')} Cr`} 
                            icon={<Savings />} 
                            colorIndex={2} 
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <StyledCard 
                            title={t('kpi.total_loans', 'TOTAL LOANS')} 
                            value={`₹${(summary.totaL_LOAN_CR || 0).toLocaleString('en-IN')} Cr`} 
                            icon={<AccountBalance />} 
                            colorIndex={0} 
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <StyledCard 
                            title={t('kpi.total_recovery', 'TOTAL RECOVERY')} 
                            value={`₹${(summary.totaL_RECOVERY_CR || 0).toLocaleString('en-IN')} Cr`} 
                            icon={<AttachMoney />} 
                            colorIndex={3} 
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <StyledCard 
                            title={t('kpi.gross_npa', 'GROSS NPA %')} 
                            value={formatPercentage(summary.avG_GROSS_NPA)} 
                            icon={<Warning />} 
                            colorIndex={1} 
                        />
                    </Grid>
                </Grid>

                {/* KPI Cards Row 2 */}
                <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <StyledCard 
                            title={t('kpi.casa_ratio', 'CASA RATIO %')} 
                            value={formatPercentage(summary.avG_CASA_RATIO)} 
                            icon={<Assessment />} 
                            colorIndex={4} 
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <StyledCard 
                            title={t('kpi.digital_txn', 'DIGITAL TXN %')} 
                            value={formatPercentage(summary.digitaL_PERCENT)} 
                            icon={<MobileFriendly />} 
                            colorIndex={5} 
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <StyledCard 
                            title={t('kpi.total_customers', 'TOTAL CUSTOMERS')} 
                            value={formatNumber(summary.totaL_CUSTOMERS)} 
                            icon={<People />} 
                            colorIndex={0} 
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <StyledCard 
                            title={t('kpi.avg_performance', 'AVG PERFORMANCE')} 
                            value={formatPercentage(summary.avG_PERFORMANCE)} 
                            icon={<TrendingUp />} 
                            colorIndex={2} 
                        />
                    </Grid>
                </Grid>

                {/* YoY Growth Section */}
                {yearlySummary.length >= 2 && (
                    <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'primary.main', mb: 2 }}>{t('kpi.yoy_growth', 'Year-over-Year Growth')}</Typography>
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 6, sm: 3 }}>
                                <Box sx={{ textAlign: 'center', p: 1, bgcolor: yoyGrowth.deposit >= 0 ? '#e8f5e9' : '#ffebee', borderRadius: 2 }}>
                                    <Typography variant="caption" color="textSecondary">{t('kpi.deposit_growth', 'Deposit Growth')}</Typography>
                                    <Typography variant="h6" sx={{ color: yoyGrowth.deposit >= 0 ? '#059669' : '#DC2626', fontWeight: 'bold' }}>
                                        {yoyGrowth.deposit >= 0 ? '+' : ''}{yoyGrowth.deposit.toFixed(2)}%
                                    </Typography>
                                    {yoyGrowth.deposit >= 0 ? <TrendingUp sx={{ fontSize: 16, color: '#059669' }} /> : <TrendingDown sx={{ fontSize: 16, color: '#DC2626' }} />}
                                </Box>
                            </Grid>
                            <Grid size={{ xs: 6, sm: 3 }}>
                                <Box sx={{ textAlign: 'center', p: 1, bgcolor: yoyGrowth.loan >= 0 ? '#e8f5e9' : '#ffebee', borderRadius: 2 }}>
                                    <Typography variant="caption" color="textSecondary">{t('kpi.loan_growth', 'Loan Growth')}</Typography>
                                    <Typography variant="h6" sx={{ color: yoyGrowth.loan >= 0 ? '#059669' : '#DC2626', fontWeight: 'bold' }}>
                                        {yoyGrowth.loan >= 0 ? '+' : ''}{yoyGrowth.loan.toFixed(2)}%
                                    </Typography>
                                    {yoyGrowth.loan >= 0 ? <TrendingUp sx={{ fontSize: 16, color: '#059669' }} /> : <TrendingDown sx={{ fontSize: 16, color: '#DC2626' }} />}
                                </Box>
                            </Grid>
                            <Grid size={{ xs: 6, sm: 3 }}>
                                <Box sx={{ textAlign: 'center', p: 1, bgcolor: yoyGrowth.npa <= 0 ? '#e8f5e9' : '#ffebee', borderRadius: 2 }}>
                                    <Typography variant="caption" color="textSecondary">{t('kpi.npa_change', 'NPA Change')}</Typography>
                                    <Typography variant="h6" sx={{ color: yoyGrowth.npa <= 0 ? '#059669' : '#DC2626', fontWeight: 'bold' }}>
                                        {yoyGrowth.npa >= 0 ? '+' : ''}{yoyGrowth.npa.toFixed(2)}%
                                    </Typography>
                                    {yoyGrowth.npa <= 0 ? <TrendingDown sx={{ fontSize: 16, color: '#059669' }} /> : <TrendingUp sx={{ fontSize: 16, color: '#DC2626' }} />}
                                </Box>
                            </Grid>
                            <Grid size={{ xs: 6, sm: 3 }}>
                                <Box sx={{ textAlign: 'center', p: 1, bgcolor: yoyGrowth.digital >= 0 ? '#e8f5e9' : '#ffebee', borderRadius: 2 }}>
                                    <Typography variant="caption" color="textSecondary">{t('kpi.digital_growth', 'Digital Growth')}</Typography>
                                    <Typography variant="h6" sx={{ color: yoyGrowth.digital >= 0 ? '#059669' : '#DC2626', fontWeight: 'bold' }}>
                                        {yoyGrowth.digital >= 0 ? '+' : ''}{yoyGrowth.digital.toFixed(2)}%
                                    </Typography>
                                    {yoyGrowth.digital >= 0 ? <TrendingUp sx={{ fontSize: 16, color: '#059669' }} /> : <TrendingDown sx={{ fontSize: 16, color: '#DC2626' }} />}
                                </Box>
                            </Grid>
                        </Grid>
                    </Paper>
                )}

                {/* Deposit & Loan Trends */}
                <Grid container spacing={3} sx={{ mb: 3 }}>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Paper sx={{ p: 2, borderRadius: 2 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main', mb: 2 }}>{t('kpi.deposit_achievement_trend', 'DEPOSIT ACHIEVEMENT TREND (Cr)')}</Typography>
                            <ResponsiveContainer width="100%" height={300}>
                                <ComposedChart data={trendAnalysis}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="fiN_YEAR" />
                                    <YAxis />
                                    <RechartsTooltip />
                                    <Legend />
                                    <Area type="monotone" dataKey="totaL_DEPOSIT_CR" name="DEPOSIT" fill="#2563EB" stroke="#2563EB" fillOpacity={0.3} />
                                </ComposedChart>
                            </ResponsiveContainer>
                        </Paper>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Paper sx={{ p: 2, borderRadius: 2 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main', mb: 2 }}>{t('kpi.loan_achievement_trend', 'LOAN ACHIEVEMENT TREND (Cr)')}</Typography>
                            <ResponsiveContainer width="100%" height={300}>
                                <ComposedChart data={trendAnalysis}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="fiN_YEAR" />
                                    <YAxis />
                                    <RechartsTooltip />
                                    <Legend />
                                    <Area type="monotone" dataKey="totaL_LOAN_CR" name="LOAN" fill="#DC2626" stroke="#DC2626" fillOpacity={0.3} />
                                </ComposedChart>
                            </ResponsiveContainer>
                        </Paper>
                    </Grid>
                </Grid>

                {/* Recovery & NPA Trends */}
                <Grid container spacing={3} sx={{ mb: 3 }}>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Paper sx={{ p: 2, borderRadius: 2 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main', mb: 2 }}>{t('kpi.recovery_achievement_trend', 'RECOVERY ACHIEVEMENT TREND (Cr)')}</Typography>
                            <ResponsiveContainer width="100%" height={300}>
                                <ComposedChart data={trendAnalysis}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="fiN_YEAR" />
                                    <YAxis />
                                    <RechartsTooltip />
                                    <Legend />
                                    <Area type="monotone" dataKey="totaL_RECOVERY_CR" name="RECOVERY" fill="#059669" stroke="#059669" fillOpacity={0.3} />
                                </ComposedChart>
                            </ResponsiveContainer>
                        </Paper>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Paper sx={{ p: 2, borderRadius: 2 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main', mb: 2 }}>{t('kpi.gross_npa_trend', 'GROSS NPA % TREND')}</Typography>
                            <ResponsiveContainer width="100%" height={300}>
                                <ComposedChart data={trendAnalysis}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="fiN_YEAR" />
                                    <YAxis tickFormatter={(v) => `${v}%`} />
                                    <RechartsTooltip />
                                    <Legend />
                                    <Area type="monotone" dataKey="avG_NPA" name="NPA %" fill="#DC2626" stroke="#DC2626" fillOpacity={0.3} />
                                </ComposedChart>
                            </ResponsiveContainer>
                        </Paper>
                    </Grid>
                </Grid>

                {/* Digital Transaction % Trend */}
                <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main', mb: 2 }}>{t('bank_kpi.digital_trend')}</Typography>
                    <ResponsiveContainer width="100%" height={300}>
                        <ComposedChart data={trendAnalysis}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="fiN_YEAR" />
                            <YAxis tickFormatter={(v) => `${v}%`} />
                            <RechartsTooltip />
                            <Legend />
                            <Area type="monotone" dataKey="digitaL_PERCENT" name="DIGITAL %" fill="#7C3AED" stroke="#7C3AED" fillOpacity={0.3} />
                        </ComposedChart>
                    </ResponsiveContainer>
                </Paper>

                {/* Branch Location Map */}
                {mapData.length > 0 && (
                    <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <MapIcon /> {t('bank_kpi.branch_location_map')}
                        </Typography>
                        <Typography variant="subtitle2" sx={{ mb: 1, color: '#666' }}>Branch Locations ({branchLocations.length} regions)</Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                            {branchLocations.map((location, idx) => (
                                <Chip key={idx} label={location} variant="outlined" sx={{ m: 0.5, fontWeight: 500 }} />
                            ))}
                        </Box>
                        <Typography variant="subtitle2" sx={{ mb: 2, color: '#666' }}>{t('bank_kpi.branch_wise_performance_map', 'Branch-wise Performance Map')}</Typography>
                        <Grid container spacing={2}>
                            {mapData.map((branch: any, idx: number) => (
                                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={idx}>
                                    <Paper sx={{ 
                                        p: 1.5, 
                                        borderRadius: 2, 
                                        borderLeft: `4px solid ${getPerformanceColor(branch.overalL_ACHIEVEMENT_PERCENT || 0)}`, 
                                        bgcolor: '#fafafa',
                                        transition: 'transform 0.2s',
                                        '&:hover': { transform: 'translateY(-2px)', boxShadow: 2 }
                                    }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <Box>
                                                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{branch.brancH_NAME}</Typography>
                                                <Typography variant="caption" color="textSecondary">{branch.regioN_NAME} | Code: {branch.pbrcode}</Typography>
                                            </Box>
                                            <Chip 
                                                label={`${(branch.overalL_ACHIEVEMENT_PERCENT || 0).toFixed(1)}%`} 
                                                size="small" 
                                                sx={{ bgcolor: getPerformanceColor(branch.overalL_ACHIEVEMENT_PERCENT || 0), color: 'white', fontWeight: 'bold' }} 
                                            />
                                        </Box>
                                        <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                                            <Typography variant="caption" color="textSecondary">
                                                Deposit: {(branch.totaL_DEPOSIT_ACHIEVED_CR || 0).toFixed(0)}Cr
                                            </Typography>
                                            <Typography variant="caption" color="textSecondary">
                                                NPA: {(branch.grosS_NPA_PERCENT || 0).toFixed(1)}%
                                            </Typography>
                                        </Box>
                                        {branch.googlE_MAP_LOCATION && (
                                            <Tooltip title={t('bank_kpi.view_map')}>
                                                <IconButton 
                                                    size="small" 
                                                    sx={{ mt: 0.5, p: 0 }} 
                                                    onClick={() => window.open(branch.googlE_MAP_LOCATION, '_blank')}
                                                >
                                                    <LocationOn sx={{ fontSize: 14, color: '#2563EB' }} />
                                                    <Typography variant="caption" sx={{ ml: 0.5, color: '#2563EB' }}>{t('bank_kpi.view_map')}</Typography>
                                                </IconButton>
                                            </Tooltip>
                                        )}
                                    </Paper>
                                </Grid>
                            ))}
                        </Grid>
                        {/* Legend */}
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 3, pt: 2, borderTop: '1px solid #e0e0e0', flexWrap: 'wrap' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Box sx={{ width: 16, height: 16, bgcolor: '#059669', borderRadius: 1 }} />
                                <Typography variant="caption">{t('common.excellent')} (≥90%)</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Box sx={{ width: 16, height: 16, bgcolor: '#2563EB', borderRadius: 1 }} />
                                <Typography variant="caption">{t('common.good')} (75-89%)</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Box sx={{ width: 16, height: 16, bgcolor: 'secondary.main', borderRadius: 1 }} />
                                <Typography variant="caption">{t('common.average')} (60-74%)</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Box sx={{ width: 16, height: 16, bgcolor: '#DC2626', borderRadius: 1 }} />
                                <Typography variant="caption">{t('common.poor')} (&lt;60%)</Typography>
                            </Box>
                        </Box>
                    </Paper>
                )}

                {/* Branchwise Performance Summary Table */}
                {branchGrid.length > 0 && (
                    <>
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'primary.main' }}>{t('bank_kpi.branch_details')}</Typography>
                        <TableContainer component={Paper} sx={{ mb: 3, borderRadius: 2, overflowX: 'auto' }}>
                            <Table stickyHeader size="small">
                                <TableHead>
                                    <TableRow sx={{ bgcolor: 'primary.main' }}>
                                        <TableCell sx={{ color: 'white', fontWeight: 'bold', bgcolor: 'primary.main' }}>{t('branch_performance.rank')}</TableCell>
                                        <TableCell sx={{ color: 'white', fontWeight: 'bold', bgcolor: 'primary.main' }}>{t('branch_performance.branch_name')}</TableCell>
                                        <TableCell align="right" sx={{ color: 'white', fontWeight: 'bold', bgcolor: 'primary.main' }}>{t('branch_performance.deposit')} (Cr)</TableCell>
                                        <TableCell align="right" sx={{ color: 'white', fontWeight: 'bold', bgcolor: 'primary.main' }}>{t('branch_performance.loan')} (Cr)</TableCell>
                                        <TableCell align="right" sx={{ color: 'white', fontWeight: 'bold', bgcolor: 'primary.main' }}>{t('branch_performance.recovery')} (Cr)</TableCell>
                                        <TableCell align="right" sx={{ color: 'white', fontWeight: 'bold', bgcolor: 'primary.main' }}>{t('branch_performance.gross_npa_percent')}</TableCell>
                                        <TableCell align="right" sx={{ color: 'white', fontWeight: 'bold', bgcolor: 'primary.main' }}>{t('branch_performance.digital_percent')}</TableCell>
                                        <TableCell align="right" sx={{ color: 'white', fontWeight: 'bold', bgcolor: 'primary.main' }}>{t('branch_performance.overall_percent')}</TableCell>
                                        <TableCell sx={{ color: 'white', fontWeight: 'bold', bgcolor: 'primary.main' }}>{t('branch_performance.status')}</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {branchGrid.map((row: any, idx: number) => (
                                        <TableRow key={row.pbrcode} hover>
                                            <TableCell>{idx + 1}</TableCell>
                                            <TableCell sx={{ fontWeight: 500 }}>{row.brancH_NAME}</TableCell>
                                            <TableCell align="right">{(row.totaL_DEPOSIT_ACHIEVED_CR || 0).toFixed(2)}</TableCell>
                                            <TableCell align="right">{(row.totaL_LOAN_ACHIEVED_CR || 0).toFixed(2)}</TableCell>
                                            <TableCell align="right">{(row.recoverY_ACHIEVED_CR || 0).toFixed(2)}</TableCell>
                                            <TableCell align="right" sx={{ color: (row.grosS_NPA_PERCENT || 0) > 5 ? '#DC2626' : '#059669' }}>
                                                {(row.grosS_NPA_PERCENT || 0).toFixed(2)}%
                                            </TableCell>
                                            <TableCell align="right">{(row.digitaL_TRANSACTION_PERCENT || 0).toFixed(1)}%</TableCell>
                                            <TableCell align="right">
                                                <Typography sx={{ fontWeight: 'bold', color: getStatusColor(row.performancE_STATUS) }}>
                                                    {(row.overalL_ACHIEVEMENT_PERCENT || 0).toFixed(1)}%
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Chip 
                                                    label={row.performancE_STATUS || 'N/A'} 
                                                    size="small" 
                                                    sx={{ bgcolor: getStatusColor(row.performancE_STATUS), color: 'white', fontWeight: 'bold' }} 
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </>
                )}

                {/* Top and Bottom Branches */}
                <Grid container spacing={3}>
                    {displayTopBranches.length > 0 && (
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Paper sx={{ p: 2, borderRadius: 2 }}>
                                <Typography variant="h6" sx={{ fontWeight: 600, color: '#059669', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Star /> {t('bank_kpi.top_branches')}
                                </Typography>
                                {displayTopBranches.map((branch: any, idx: number) => (
                                    <Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1, borderBottom: '1px solid #eee' }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Chip label={idx + 1} size="small" color="success" />
                                            <Typography variant="body2" sx={{ fontWeight: 500 }}>{branch.brancH_NAME}</Typography>
                                        </Box>
                                        <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#059669' }}>
                                            {(branch.overalL_ACHIEVEMENT_PERCENT || 0).toFixed(1)}%
                                        </Typography>
                                    </Box>
                                ))}
                            </Paper>
                        </Grid>
                    )}
                    {displayBottomBranches.length > 0 && (
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Paper sx={{ p: 2, borderRadius: 2 }}>
                                <Typography variant="h6" sx={{ fontWeight: 600, color: '#DC2626', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Warning /> {t('bank_kpi.low_performing_branches')}
                                </Typography>
                                {displayBottomBranches.map((branch: any, idx: number) => (
                                    <Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1, borderBottom: '1px solid #eee' }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Chip label={idx + 1} size="small" color="error" />
                                            <Typography variant="body2" sx={{ fontWeight: 500 }}>{branch.brancH_NAME}</Typography>
                                        </Box>
                                        <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#DC2626' }}>
                                            {(branch.overalL_ACHIEVEMENT_PERCENT || 0).toFixed(1)}%
                                        </Typography>
                                    </Box>
                                ))}
                            </Paper>
                        </Grid>
                    )}
                </Grid>
            </Container>
        </Box>
    );
};

export default BankKPI;
