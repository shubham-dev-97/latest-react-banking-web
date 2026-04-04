import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { CircularProgress, Box, Typography } from '@mui/material';
import { useAuth } from '../../hooks/useAuth';
import { hasPageAccess, getDefaultRoute, getUserRole } from '../../utils/roleAccess';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requiredPage?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredPage }) => {
    const { isAuthenticated, user, checkAuth } = useAuth();
    const [isChecking, setIsChecking] = useState(true);
    const location = useLocation();

    useEffect(() => {
        const verifyAuth = async () => {
            await checkAuth();
            setIsChecking(false);
        };
        verifyAuth();
    }, []);

    if (isChecking) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Check if user has access to this page
    if (requiredPage && !hasPageAccess(user, requiredPage)) {
        console.log('⛔ Access denied to:', requiredPage, 'for role:', getUserRole(user));
        
        // Redirect to their default allowed page
        const defaultRoute = getDefaultRoute(getUserRole(user));
        return (
            <Navigate 
                to={defaultRoute} 
                state={{ 
                    from: location,
                    error: 'You do not have permission to access this page' 
                }} 
                replace 
            />
        );
    }

    // User is authenticated and has access, render children
    return <>{children}</>;
};

export default ProtectedRoute;