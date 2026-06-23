// import React, { useState, useEffect } from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
// import { ThemeProvider, createTheme } from '@mui/material/styles';
// import CssBaseline from '@mui/material/CssBaseline';
// import { Box } from '@mui/material';

// import { CurrencyProvider } from './contexts/CurrencyContext';
// import { DataProvider } from './contexts/DataContext';
// import { useAuth } from './hooks/useAuth';
// import { useDashboardData } from './hooks/useDashboardData';
// import Header from './components/common/Header';
// import Sidebar from './components/common/Sidebar';
// import ProtectedRoute from './components/common/ProtectedRoute';
// import Login from './pages/Login';
// import Home from './pages/Home';
// import Deposit from './pages/Deposit';
// import Loan from './pages/Loan';
// import Summary from './pages/Summary';
// import CASASummary from './pages/CASASummary';
// import GLDashboard from './pages/GLDashboard';
// import AdminDashboard from './pages/AdminDashboard';

// import { CalculatedDataProvider } from './contexts/CalculatedDataContext';

// const drawerWidth = 160;

// const queryClient = new QueryClient({
//     defaultOptions: {
//         queries: {
//             refetchOnWindowFocus: false,
//             retry: 1,
//             staleTime: 5 * 60 * 1000,
//         },
//     },
// });

// const theme = createTheme({
//     palette: {
//         primary: { main: 'primary.main', light: '#534bae', dark: '#000051' },
//         secondary: { main: 'secondary.main', light: '#ffc947', dark: '#c66900' },
//         background: { default: '#f5f5f5' },
//     },
// });

// function AppContent() {
//     const [mobileOpen, setMobileOpen] = useState(false);
//     const { isAuthenticated } = useAuth();
//     const location = useLocation();
    
//     // Fetch all data (this will be shared across all pages)
//     const {
//         branchCode, setBranchCode,
//         year, setYear,
//         selectedDate, setSelectedDate,
//         availableDates, datesLoading,
//         summary, summaryLoading,
//         depositData, depositLoading,
//         loanData, loanLoading,
//         customerSummary, customerSummaryLoading,
//         depositOpening, depositOpeningLoading,
//         npaSummary, npaLoading,
//         hcData, hcLoading,
//         monthlyTrend, trendLoading,
//         homeKpi, homeKpiLoading,
//     } = useDashboardData();

//     const isLoginPage = location.pathname === '/login';

//     const handleDrawerToggle = () => {
//         setMobileOpen(!mobileOpen);
//     };

//     // Shared data to be passed to all pages
//     const sharedData = {
//         // Summary Data
//         summary,
//         summaryLoading,
        
//         // Deposit Data
//         depositData,
//         depositLoading,
        
//         // Loan Data
//         loanData,
//         loanLoading,
        
//         // Home Page Data
//         customerSummary,
//         depositOpening,
//         npaSummary,
//         hcData,
//         monthlyTrend,
//         homeKpi,
        
//         // Filters
//         branchCode,
//         setBranchCode,
//         year,
//         setYear,
//         selectedDate,
//         setSelectedDate,
//         availableDates,
//         datesLoading,
//     };

//     if (isLoginPage) {
//         return (
//             <Box sx={{ display: 'flex', height: '100vh' }}>
//                 <Box component="main" sx={{ flexGrow: 1, width: '100%', height: '100vh', overflow: 'auto', bgcolor: '#f5f5f5' }}>
//                     <Routes>
//                         <Route path="/login" element={<Login />} />
//                     </Routes>
//                 </Box>
//             </Box>
//         );
//     }

//     if (!isAuthenticated) {
//         return <Navigate to="/login" replace />;
//     }

//     // IMPORTANT: Wrap the entire authenticated content with DataProvider
//     return (
//         <DataProvider value={sharedData}>
//             <Box sx={{ display: 'flex', height: '100vh' }}>
//                 <Header toggleSidebar={handleDrawerToggle} />
//                 <Sidebar mobileOpen={mobileOpen} onClose={handleDrawerToggle} />
//                 <Box component="main" sx={{
//                     flexGrow: 1,
//                         p: 0,
//                     width: { sm: `calc(100% - ${drawerWidth}px)` },
//                     // ml: { sm: `${drawerWidth}px` },
//                     mt: '64px',
//                     height: 'calc(100vh - 64px)',
//                     overflow: 'auto',
//                     bgcolor: '#f5f5f5',
//                 }}>
//                     <Routes>
//                         {/* Default route - goes to AdminDashboard */}
//                         <Route path="/" element={
//                             <ProtectedRoute requiredPage="/admin">
//                                 <AdminDashboard />
//                             </ProtectedRoute>
//                         } />
                        
//                         {/* Admin route - explicitly defined */}
//                         <Route path="/admin" element={
//                             <ProtectedRoute requiredPage="/admin">
//                                 <AdminDashboard />
//                             </ProtectedRoute>
//                         } />
                        
//                         {/* Home route */}
//                         <Route path="/ceo-dashboard" element={
//                             <ProtectedRoute requiredPage="/ceo-dashboard">
//                                 <Home />
//                             </ProtectedRoute>
//                         } />
                        
//                         {/* Deposit route */}
//                         <Route path="/deposit" element={
//                             <ProtectedRoute requiredPage="/deposit">
//                                 <Deposit />
//                             </ProtectedRoute>
//                         } />
                        
//                         {/* Loan route */}
//                         <Route path="/loan" element={
//                             <ProtectedRoute requiredPage="/loan">
//                                 <Loan />
//                             </ProtectedRoute>
//                         } />
                        
//                         {/* Summary route */}
//                         <Route path="/summary" element={
//                             <ProtectedRoute requiredPage="/summary">
//                                 <Summary />
//                             </ProtectedRoute>
//                         } />
                        
//                         {/* CASA route */}
//                         <Route path="/casa" element={
//                             <ProtectedRoute requiredPage="/casa">
//                                 <CASASummary />
//                             </ProtectedRoute>
//                         } />
                        
//                         {/* GL Dashboard route */}
//                         <Route path="/gl-dashboard" element={
//                             <ProtectedRoute requiredPage="/gl-dashboard">
//                                 <GLDashboard />
//                             </ProtectedRoute>
//                         } />
                        
//                         {/* Catch all - redirect to home */}
//                         <Route path="*" element={<Navigate to="/" replace />} />
//                     </Routes>
//                 </Box>
//             </Box>
//         </DataProvider>
//     );
// }

// function App() {
//     return (
//         <QueryClientProvider client={queryClient}>
//             <ThemeProvider theme={theme}>
//                 <CssBaseline />
//                 <CurrencyProvider>
                    
//                     <Router>
//                         <AppContent />
//                     </Router>
//                 </CurrencyProvider>
//             </ThemeProvider>
//             {/* <ReactQueryDevtools initialIsOpen={false} /> */}
//         </QueryClientProvider>
//     );
// }

// export default App;





import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, useMediaQuery, CircularProgress } from '@mui/material';

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

const BranchPerformance = lazy(() => import('./pages/BranchPerformance'));
const BankKPI = lazy(() => import('./pages/BankKPI'));


// Responsive drawer widths
const drawerWidth = {
    xs: 200,   // mobile
    sm: 200,   // small tablet
    md: 240,   // desktop
    lg: 260    // large desktop
};

const SuspenseLoader = () => (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', minHeight: '50vh' }}>
        <CircularProgress />
    </Box>
);

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
        primary: { main: '#0F172A', light: '#334155', dark: '#020617' }, // Deep Navy
        secondary: { main: '#0EA5E9', light: '#38BDF8', dark: '#0369A1' }, // Sky Blue
        background: { default: '#F8FAFC', paper: '#FFFFFF' },
        success: { main: '#10B981' },
        warning: { main: '#F59E0B' },
        error: { main: '#EF4444' },
        info: { main: '#3B82F6' },
        text: { primary: '#1E293B', secondary: '#64748B' }
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h1: { fontWeight: 600, fontSize: '2.5rem' },
        h2: { fontWeight: 600, fontSize: '2rem' },
        h3: { fontWeight: 600, fontSize: '1.75rem' },
        h4: { fontWeight: 600, fontSize: '1.5rem' },
        h5: { fontWeight: 600, fontSize: '1.25rem' },
        h6: { fontWeight: 600, fontSize: '1rem' },
        subtitle1: { fontWeight: 500 },
        button: { textTransform: 'none', fontWeight: 500 },
    },
    shape: {
        borderRadius: 8,
    },
    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 900,
            lg: 1200,
            xl: 1536,
        },
    },
    components: {
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    backgroundColor: '#FFFFFF',
                    borderRight: '1px solid #E2E8F0',
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    zIndex: 1200,
                    backgroundColor: '#FFFFFF',
                    color: '#0F172A',
                    boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 6,
                    padding: '8px 16px',
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                    }
                },
                containedPrimary: {
                    '&:hover': {
                        backgroundColor: '#1E293B',
                    }
                }
            }
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                    border: '1px solid #E2E8F0',
                }
            }
        },
        MuiTableCell: {
            styleOverrides: {
                root: {
                    borderBottom: '1px solid #E2E8F0',
                    padding: '12px 16px',
                },
                head: {
                    fontWeight: 600,
                    backgroundColor: '#F8FAFC',
                    color: '#334155',
                }
            }
        },
        MuiTableRow: {
            styleOverrides: {
                root: {
                    '&:last-child td, &:last-child th': { border: 0 },
                    '&:hover': {
                        backgroundColor: '#F1F5F9',
                    }
                }
            }
        }
    },
});

function AppContent() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const { isAuthenticated } = useAuth();
    const location = useLocation();
    const theme = useMediaQuery((theme: any) => theme.breakpoints.down('sm'));
    const isMobile = useMediaQuery('(max-width:600px)');
    
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

    // Get current drawer width based on screen size
    const getDrawerWidth = () => {
        if (isMobile) return drawerWidth.xs;
        return drawerWidth.md;
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
                <Box 
                    component="main" 
                    sx={{
                        flexGrow: 1,
                        p: { xs: 0, sm: 0, md: 0 },
                        width: { 
                            xs: '100%', 
                            sm: `calc(100% - ${drawerWidth.sm}px)`,
                            md: `calc(100% - ${drawerWidth.md}px)`,
                            lg: `calc(100% - ${drawerWidth.lg}px)`
                        },
                        ml: { 
                            xs: 0, 
                            sm: `${drawerWidth.sm}px`,
                            md: `${drawerWidth.md}px`,
                            lg: `${drawerWidth.lg}px`
                        },
                        mt: { xs: '56px', sm: '64px' },
                        height: { xs: 'calc(100vh - 56px)', sm: 'calc(100vh - 64px)' },
                        overflow: 'auto',
                        bgcolor: '#f5f5f5',
                        transition: 'margin 0.2s ease-in-out, width 0.2s ease-in-out',
                    }}
                >
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
                        <Route path="/ceo-dashboard" element={
                            <ProtectedRoute requiredPage="/ceo-dashboard">
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

                        // Add to your routes
                        <Route path="/branch-performance" element={
                            <ProtectedRoute requiredPage="/branch-performance">
                                <Suspense fallback={<SuspenseLoader />}>
                                    <BranchPerformance />
                                </Suspense>
                            </ProtectedRoute>
                        } />

                        <Route path="/bank-kpi" element={
                            <ProtectedRoute requiredPage="/bank-kpi">
                                <Suspense fallback={<SuspenseLoader />}>
                                    <BankKPI />
                                </Suspense>
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
