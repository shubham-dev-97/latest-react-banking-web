import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';

import { CurrencyProvider } from './contexts/CurrencyContext';
import { DataProvider } from './contexts/DataContext';
import { useAuth } from './hooks/useAuth';
import { useDashboardData } from './hooks/useDashboardData';
import Header from './components/common/Header';
import Sidebar from './components/common/Sidebar';
import ProtectedRoute from './components/common/ProtectedRoute';
import Login from './pages/Login';
import Home from './pages/Home';
import Deposit from './pages/Deposit';
import Loan from './pages/Loan';
import Summary from './pages/Summary';
import CASASummary from './pages/CASASummary';
import GLDashboard from './pages/GLDashboard';
import AdminDashboard from './pages/AdminDashboard';

import { CalculatedDataProvider } from './contexts/CalculatedDataContext';

const drawerWidth = 160;

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: 1,
            staleTime: 5 * 60 * 1000,
        },
    },
});

const theme = createTheme({
    palette: {
        primary: { main: '#1a237e', light: '#534bae', dark: '#000051' },
        secondary: { main: '#ff9800', light: '#ffc947', dark: '#c66900' },
        background: { default: '#f5f5f5' },
    },
});

function AppContent() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const { isAuthenticated } = useAuth();
    const location = useLocation();
    
    // Fetch all data (this will be shared across all pages)
    const {
        branchCode, setBranchCode,
        year, setYear,
        selectedDate, setSelectedDate,
        availableDates, datesLoading,
        summary, summaryLoading,
        depositData, depositLoading,
        loanData, loanLoading,
        customerSummary, customerSummaryLoading,
        depositOpening, depositOpeningLoading,
        npaSummary, npaLoading,
        hcData, hcLoading,
        monthlyTrend, trendLoading,
        homeKpi, homeKpiLoading,
    } = useDashboardData();

    const isLoginPage = location.pathname === '/login';

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    // Shared data to be passed to all pages
    const sharedData = {
        // Summary Data
        summary,
        summaryLoading,
        
        // Deposit Data
        depositData,
        depositLoading,
        
        // Loan Data
        loanData,
        loanLoading,
        
        // Home Page Data
        customerSummary,
        depositOpening,
        npaSummary,
        hcData,
        monthlyTrend,
        homeKpi,
        
        // Filters
        branchCode,
        setBranchCode,
        year,
        setYear,
        selectedDate,
        setSelectedDate,
        availableDates,
        datesLoading,
    };

    if (isLoginPage) {
        return (
            <Box sx={{ display: 'flex', height: '100vh' }}>
                <Box component="main" sx={{ flexGrow: 1, width: '100%', height: '100vh', overflow: 'auto', bgcolor: '#f5f5f5' }}>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                    </Routes>
                </Box>
            </Box>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // IMPORTANT: Wrap the entire authenticated content with DataProvider
    return (
        <DataProvider value={sharedData}>
            <Box sx={{ display: 'flex', height: '100vh' }}>
                <Header toggleSidebar={handleDrawerToggle} />
                <Sidebar mobileOpen={mobileOpen} onClose={handleDrawerToggle} />
                <Box component="main" sx={{
                    flexGrow: 1,
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                    mt: '64px',
                    height: 'calc(100vh - 64px)',
                    overflow: 'auto',
                    bgcolor: '#f5f5f5',
                }}>
                    <Routes>
                        {/* Default route - goes to AdminDashboard */}
                        <Route path="/" element={
                            <ProtectedRoute requiredPage="/admin">
                                <AdminDashboard />
                            </ProtectedRoute>
                        } />
                        
                        {/* Admin route - explicitly defined */}
                        <Route path="/admin" element={
                            <ProtectedRoute requiredPage="/admin">
                                <AdminDashboard />
                            </ProtectedRoute>
                        } />
                        
                        {/* Home route */}
                        <Route path="/home" element={
                            <ProtectedRoute requiredPage="/home">
                                <Home />
                            </ProtectedRoute>
                        } />
                        
                        {/* Deposit route */}
                        <Route path="/deposit" element={
                            <ProtectedRoute requiredPage="/deposit">
                                <Deposit />
                            </ProtectedRoute>
                        } />
                        
                        {/* Loan route */}
                        <Route path="/loan" element={
                            <ProtectedRoute requiredPage="/loan">
                                <Loan />
                            </ProtectedRoute>
                        } />
                        
                        {/* Summary route */}
                        <Route path="/summary" element={
                            <ProtectedRoute requiredPage="/summary">
                                <Summary />
                            </ProtectedRoute>
                        } />
                        
                        {/* CASA route */}
                        <Route path="/casa" element={
                            <ProtectedRoute requiredPage="/casa">
                                <CASASummary />
                            </ProtectedRoute>
                        } />
                        
                        {/* GL Dashboard route */}
                        <Route path="/gl-dashboard" element={
                            <ProtectedRoute requiredPage="/gl-dashboard">
                                <GLDashboard />
                            </ProtectedRoute>
                        } />
                        
                        {/* Catch all - redirect to home */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </Box>
            </Box>
        </DataProvider>
    );
}

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <CurrencyProvider>
                    
                    <Router>
                        <AppContent />
                    </Router>
                </CurrencyProvider>
            </ThemeProvider>
            {/* <ReactQueryDevtools initialIsOpen={false} /> */}
        </QueryClientProvider>
    );
}

export default App;