import React from 'react';
import { Box, Paper, Typography, useTheme, Chip, Stack } from '@mui/material';
import {
    AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid,
    Tooltip, Legend, ResponsiveContainer, BarChart, Bar, ComposedChart,
    ReferenceLine
} from 'recharts';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import { formatCurrency, formatNumber } from '../../utils/formatters';

interface TrendChartProps {
    title: string;
    data: any[];
    type?: 'area' | 'line' | 'bar' | 'composed';
    dataKeys: {
        key: string;
        name: string;
        color?: string;
        type?: 'currency' | 'number';
        strokeDasharray?: string;
        isReference?: boolean;
    }[];
    xAxisKey?: string;
    height?: number;
    showTrend?: boolean;
    showAverage?: boolean;
    gradient?: boolean;
}

const CustomTooltip = ({ active, payload, label, dataKeys }: any) => {
    if (active && payload && payload.length) {
        return (
            <Paper sx={{ p: 2, bgcolor: 'rgba(26, 35, 126, 0.95)', color: 'white', borderRadius: 2, minWidth: 200 }}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold', borderBottom: '1px solid rgba(255,255,255,0.3)', pb: 0.5 }}>
                    {label}
                </Typography>
                {payload.map((entry: any, index: number) => (
                    <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 0.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: entry.color }} />
                            <Typography variant="body2">{entry.name}:</Typography>
                        </Box>
                        <Typography variant="body2" fontWeight="bold">
                            {entry.name === 'Total Balance' || entry.name === 'Average Balance' || entry.name === 'Total Outstanding'
                                ? formatCurrency(entry.value)
                                : entry.name === 'Account Count'
                                ? formatNumber(entry.value)
                                : entry.value.toLocaleString()}
                        </Typography>
                    </Box>
                ))}
            </Paper>
        );
    }
    return null;
};

const CustomLegend = ({ payload }: any) => {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 2, flexWrap: 'wrap' }}>
            {payload.map((entry: any, index: number) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: entry.color }} />
                    <Typography variant="caption" sx={{ color: '#666' }}>{entry.value}</Typography>
                </Box>
            ))}
        </Box>
    );
};

const TrendChart: React.FC<TrendChartProps> = ({
    title,
    data,
    type = 'area',
    dataKeys,
    xAxisKey = 'monthName',
    height = 380,
    showTrend = true,
    showAverage = true,
    gradient = true
}) => {
    const theme = useTheme();

    if (!data || data.length === 0) {
        return (
            <Paper sx={{ 
                p: 3, 
                height: '100%', 
                minHeight: height, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%)',
                borderRadius: 3
            }}>
                <Box sx={{ textAlign: 'center' }}>
                    <TrendingUpIcon sx={{ fontSize: 48, color: '#9e9e9e', mb: 1 }} />
                    <Typography color="textSecondary">No data available</Typography>
                </Box>
            </Paper>
        );
    }

    // Calculate trend percentage
    const calculateTrend = () => {
        if (data.length < 2) return null;
        const firstValue = data[0][dataKeys[0].key];
        const lastValue = data[data.length - 1][dataKeys[0].key];
        if (firstValue === 0) return null;
        const change = ((lastValue - firstValue) / firstValue) * 100;
        return {
            value: Math.abs(change).toFixed(1),
            isPositive: change > 0,
            isNegative: change < 0
        };
    };

    // Calculate average
    const calculateAverage = () => {
        const sum = data.reduce((acc, item) => acc + (item[dataKeys[0].key] || 0), 0);
        return sum / data.length;
    };

    const trend = calculateTrend();
    const average = calculateAverage();

    // Create gradient definitions
    const getGradientId = (color: string) => `${color.replace('#', '')}Gradient`;

    const renderChart = () => {
        const commonProps = {
            data,
            margin: { top: 20, right: 30, left: 20, bottom: 10 }
        };

        switch (type) {
            case 'line':
                return (
                    <LineChart {...commonProps}>
                        <defs>
                            {gradient && dataKeys.map(dk => (
                                <linearGradient key={dk.key} id={getGradientId(dk.color || '#1976d2')} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={dk.color || '#1976d2'} stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor={dk.color || '#1976d2'} stopOpacity={0}/>
                                </linearGradient>
                            ))}
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                        <XAxis 
                            dataKey={xAxisKey} 
                            tick={{ fill: '#666', fontSize: 12 }}
                            axisLine={{ stroke: '#e0e0e0' }}
                            tickLine={{ stroke: '#e0e0e0' }}
                        />
                        <YAxis 
                            tick={{ fill: '#666', fontSize: 12 }}
                            axisLine={{ stroke: '#e0e0e0' }}
                            tickLine={{ stroke: '#e0e0e0' }}
                        />
                        <Tooltip content={<CustomTooltip dataKeys={dataKeys} />} />
                        <Legend content={<CustomLegend />} />
                        {showAverage && (
                            <ReferenceLine y={average} stroke="#ff9800" strokeDasharray="3 3" label={{ value: 'Avg', position: 'right', fill: '#ff9800' }} />
                        )}
                        {dataKeys.map((dk, idx) => (
                            <Line
                                key={dk.key}
                                type="monotone"
                                dataKey={dk.key}
                                name={dk.name}
                                stroke={dk.color || theme.palette.primary.main}
                                strokeWidth={3}
                                dot={{ r: 5, fill: dk.color || theme.palette.primary.main, strokeWidth: 2, stroke: '#fff' }}
                                activeDot={{ r: 7, stroke: dk.color || theme.palette.primary.main, strokeWidth: 2, fill: '#fff' }}
                                fill={gradient ? `url(#${getGradientId(dk.color || '#1976d2')})` : 'none'}
                            />
                        ))}
                    </LineChart>
                );

            case 'bar':
                return (
                    <BarChart {...commonProps}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                        <XAxis 
                            dataKey={xAxisKey} 
                            tick={{ fill: '#666', fontSize: 12 }}
                            axisLine={{ stroke: '#e0e0e0' }}
                            tickLine={{ stroke: '#e0e0e0' }}
                        />
                        <YAxis 
                            tick={{ fill: '#666', fontSize: 12 }}
                            axisLine={{ stroke: '#e0e0e0' }}
                            tickLine={{ stroke: '#e0e0e0' }}
                        />
                        <Tooltip content={<CustomTooltip dataKeys={dataKeys} />} />
                        <Legend content={<CustomLegend />} />
                        {showAverage && (
                            <ReferenceLine y={average} stroke="#ff9800" strokeDasharray="3 3" label={{ value: 'Avg', position: 'right', fill: '#ff9800' }} />
                        )}
                        {dataKeys.map((dk, idx) => (
                            <Bar
                                key={dk.key}
                                dataKey={dk.key}
                                name={dk.name}
                                fill={dk.color || theme.palette.primary.main}
                                radius={[8, 8, 0, 0]}
                                barSize={40}
                            />
                        ))}
                    </BarChart>
                );

            case 'composed':
                return (
                    <ComposedChart {...commonProps}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                        <XAxis 
                            dataKey={xAxisKey} 
                            tick={{ fill: '#666', fontSize: 12 }}
                            axisLine={{ stroke: '#e0e0e0' }}
                            tickLine={{ stroke: '#e0e0e0' }}
                        />
                        <YAxis 
                            yAxisId="left"
                            tick={{ fill: '#666', fontSize: 12 }}
                            axisLine={{ stroke: '#e0e0e0' }}
                            tickLine={{ stroke: '#e0e0e0' }}
                        />
                        <YAxis 
                            yAxisId="right" 
                            orientation="right"
                            tick={{ fill: '#666', fontSize: 12 }}
                            axisLine={{ stroke: '#e0e0e0' }}
                            tickLine={{ stroke: '#e0e0e0' }}
                        />
                        <Tooltip content={<CustomTooltip dataKeys={dataKeys} />} />
                        <Legend content={<CustomLegend />} />
                        {dataKeys.map((dk, idx) => {
                            if (dk.key === 'accountCount') {
                                return (
                                    <Bar
                                        key={dk.key}
                                        yAxisId="right"
                                        dataKey={dk.key}
                                        name={dk.name}
                                        fill={dk.color || '#4caf50'}
                                        radius={[8, 8, 0, 0]}
                                        barSize={30}
                                    />
                                );
                            }
                            return (
                                <Line
                                    key={dk.key}
                                    yAxisId="left"
                                    type="monotone"
                                    dataKey={dk.key}
                                    name={dk.name}
                                    stroke={dk.color || '#1976d2'}
                                    strokeWidth={3}
                                    dot={{ r: 5, fill: dk.color || '#1976d2', strokeWidth: 2, stroke: '#fff' }}
                                    activeDot={{ r: 7 }}
                                />
                            );
                        })}
                    </ComposedChart>
                );

            default: // area
                return (
                    <AreaChart {...commonProps}>
                        <defs>
                            {gradient && dataKeys.map(dk => (
                                <linearGradient key={dk.key} id={getGradientId(dk.color || '#1976d2')} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={dk.color || '#1976d2'} stopOpacity={0.4}/>
                                    <stop offset="95%" stopColor={dk.color || '#1976d2'} stopOpacity={0.05}/>
                                </linearGradient>
                            ))}
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                        <XAxis 
                            dataKey={xAxisKey} 
                            tick={{ fill: '#666', fontSize: 12 }}
                            axisLine={{ stroke: '#e0e0e0' }}
                            tickLine={{ stroke: '#e0e0e0' }}
                        />
                        <YAxis 
                            tick={{ fill: '#666', fontSize: 12 }}
                            axisLine={{ stroke: '#e0e0e0' }}
                            tickLine={{ stroke: '#e0e0e0' }}
                        />
                        <Tooltip content={<CustomTooltip dataKeys={dataKeys} />} />
                        <Legend content={<CustomLegend />} />
                        {showAverage && (
                            <ReferenceLine y={average} stroke="#ff9800" strokeDasharray="3 3" label={{ value: 'Avg', position: 'right', fill: '#ff9800' }} />
                        )}
                        {dataKeys.map((dk, idx) => (
                            <Area
                                key={dk.key}
                                type="monotone"
                                dataKey={dk.key}
                                name={dk.name}
                                stroke={dk.color || theme.palette.primary.main}
                                strokeWidth={2}
                                fill={gradient ? `url(#${getGradientId(dk.color || '#1976d2')})` : (dk.color || theme.palette.primary.main)}
                                fillOpacity={0.3}
                            />
                        ))}
                    </AreaChart>
                );
        }
    };

    return (
        <Paper sx={{ 
            p: 3, 
            height: '100%', 
            borderRadius: 3,
            background: 'linear-gradient(135deg, #ffffff 0%, #fafafa 100%)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
            transition: 'transform 0.2s, box-shadow 0.2s',
            '&:hover': {
                boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
            }
        }}>
            {/* Header with Trend Indicator */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3, flexWrap: 'wrap', gap: 2 }}>
                <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a237e', mb: 0.5 }}>
                        {title}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                        Last {data.length} months
                    </Typography>
                </Box>
                
                {showTrend && trend && (
                    <Chip
                        icon={trend.isPositive ? <TrendingUpIcon /> : <TrendingDownIcon />}
                        label={`${trend.isPositive ? '+' : '-'}${trend.value}% vs start`}
                        color={trend.isPositive ? 'success' : 'error'}
                        variant="outlined"
                        sx={{ fontWeight: 600 }}
                    />
                )}
            </Box>

            {/* Chart */}
            <Box sx={{ height, width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                    {renderChart()}
                </ResponsiveContainer>
            </Box>

            {/* Footer Stats */}
            {data.length > 0 && (
                <Stack direction="row" spacing={3} sx={{ mt: 2, pt: 2, borderTop: '1px solid #e0e0e0', justifyContent: 'center' }}>
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="caption" color="textSecondary">Highest Value</Typography>
                        <Typography variant="body2" fontWeight="bold" color="#1976d2">
                            {dataKeys[0].type === 'currency' 
                                ? formatCurrency(Math.max(...data.map(d => d[dataKeys[0].key])))
                                : dataKeys[0].type === 'number'
                                ? formatNumber(Math.max(...data.map(d => d[dataKeys[0].key])))
                                : Math.max(...data.map(d => d[dataKeys[0].key])).toLocaleString()
                            }
                        </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="caption" color="textSecondary">Lowest Value</Typography>
                        <Typography variant="body2" fontWeight="bold" color="#f44336">
                            {dataKeys[0].type === 'currency' 
                                ? formatCurrency(Math.min(...data.map(d => d[dataKeys[0].key])))
                                : dataKeys[0].type === 'number'
                                ? formatNumber(Math.min(...data.map(d => d[dataKeys[0].key])))
                                : Math.min(...data.map(d => d[dataKeys[0].key])).toLocaleString()
                            }
                        </Typography>
                    </Box>
                    {showAverage && (
                        <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="caption" color="textSecondary">Average</Typography>
                            <Typography variant="body2" fontWeight="bold" color="#ff9800">
                                {dataKeys[0].type === 'currency' 
                                    ? formatCurrency(average)
                                    : dataKeys[0].type === 'number'
                                    ? formatNumber(average)
                                    : average.toLocaleString()
                                }
                            </Typography>
                        </Box>
                    )}
                </Stack>
            )}
        </Paper>
    );
};

export default TrendChart;