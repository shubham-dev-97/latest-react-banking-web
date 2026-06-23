import React from 'react';
import { AppBar, Toolbar, Typography, Box, IconButton, Badge, Avatar, Menu, MenuItem, Tooltip } from '@mui/material';
import { 
    Notifications, 
    Menu as MenuIcon, 
    Logout, 
    AccountCircle,
    Dashboard
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import CurrencySelector from './CurrencySelector';
import { useAuth } from '../../hooks/useAuth';
import LanguageSelector from './LanguageSelector';
import { bankColors } from '../../styles/bankColors';

import { useTranslation } from '../../hooks/useTranslation';


interface HeaderProps {
    toggleSidebar?: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const { t } = useTranslation();
    
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        handleClose();
        logout();
        navigate('/login');
    };

    const handleProfile = () => {
        handleClose();
        // Navigate to profile page (if you have one)
        // navigate('/profile');
    };

    const getPageTitle = () => {
        const path = location.pathname;
        switch(path) {
            case '/':
            case '/admin':
                return t('admin.admin_dashboard') || 'Admin Dashboard';
            case '/ceo-dashboard':
                return t('home.ceo_dashboard') || 'CEO Dashboard';
            case '/deposit':
                return t('deposit.deposit_analysis') || 'Deposit Analysis';
            case '/loan':
                return t('loan.loan_analysis') || 'Loan Analysis';
            case '/summary':
                return t('summary.banking_summary') || 'Banking Summary';
            case '/casa':
                return t('sidebar.casa_summary') || 'CASA Summary';
            case '/gl-dashboard':
                return t('sidebar.gl_dashboard') || 'GL Dashboard';
            default:
                return t('header.banking_dashboard') || 'Banking Dashboard';
        }
    };

    // Get user initials for avatar
    const getUserInitials = () => {
        if (!user?.userName) return 'U';
        return user.userName
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    };

    // Get user display name (first name or full name)
    const getDisplayName = () => {
        if (!user?.userName) return 'User';
        const names = user.userName.split(' ');
        return names[0]; // Return first name
    };

    return (
        <AppBar 
            position="fixed" 
            sx={{ 
                zIndex: (theme) => theme.zIndex.drawer + 1,
            }}
        >
            <Toolbar>
                {/* Menu Icon for Mobile */}
                <IconButton
                    aria-label="open drawer"
                    edge="start"
                    onClick={toggleSidebar}
                    sx={{ mr: 2, display: { sm: 'none' }, color: 'text.primary' }}
                >
                    <MenuIcon />
                </IconButton>
                
                {/* Page Title */}
                <Typography 
                    variant="h6" 
                    component="div" 
                    color="text.primary"
                    sx={{ 
                        flexGrow: 1, 
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                    }}
                >
                    <Dashboard sx={{ display: { xs: 'none', sm: 'block' }, color: bankColors.header.accent }} />
                    {getPageTitle()}
                </Typography>

                  {/* Language Selector */}
                <LanguageSelector />
                
                {/* Currency Selector */}
                <Box sx={{ mr: 2, bgcolor: 'transparent' }}>
                    <CurrencySelector />
                </Box>
                
                {/* Notifications */}
                <Tooltip title={t('header.notifications', 'Notifications')}>
                    <IconButton sx={{ mr: 1, color: 'text.secondary' }}>
                        <Badge badgeContent={3} color="error">
                            <Notifications />
                        </Badge>
                    </IconButton>
                </Tooltip>
                
                {/* User Menu */}
                {user ? (
                    <>
                        <Tooltip title={t('header.account_settings', 'Account settings')}>
                            <IconButton
                                onClick={handleClick}
                                size="small"
                                sx={{ ml: 1 }}
                                aria-controls={open ? 'account-menu' : undefined}
                                aria-haspopup="true"
                                aria-expanded={open ? 'true' : undefined}
                            >
                                <Avatar 
                                    sx={{ 
                                        width: 36, 
                                        height: 36, 
                                        bgcolor: bankColors.header.accent,
                                        fontSize: '0.9rem',
                                        fontWeight: '600'
                                    }}
                                >
                                    {getUserInitials()}
                                </Avatar>
                            </IconButton>
                        </Tooltip>
                        
                        {/* User Info - Visible on larger screens */}
                        <Box sx={{ display: { xs: 'none', md: 'block' }, ml: 1.5 }}>
                            <Typography variant="body2" color="text.primary" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
                                {getDisplayName()}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                {user.roleName || 'User'}
                            </Typography>
                        </Box>

                        {/* User Menu Dropdown */}
                        <Menu
                            anchorEl={anchorEl}
                            id="account-menu"
                            open={open}
                            onClose={handleClose}
                            onClick={handleClose}
                            PaperProps={{
                                elevation: 0,
                                sx: {
                                    overflow: 'visible',
                                    filter: 'drop-shadow(0px 4px 20px rgba(0,0,0,0.1))',
                                    mt: 1.5,
                                    minWidth: 200,
                                    borderRadius: 2,
                                    '& .MuiAvatar-root': {
                                        width: 32,
                                        height: 32,
                                        ml: -0.5,
                                        mr: 1,
                                    },
                                    '&:before': {
                                        content: '""',
                                        display: 'block',
                                        position: 'absolute',
                                        top: 0,
                                        right: 14,
                                        width: 10,
                                        height: 10,
                                        bgcolor: 'background.paper',
                                        transform: 'translateY(-50%) rotate(45deg)',
                                        zIndex: 0,
                                        borderLeft: '1px solid #E2E8F0',
                                        borderTop: '1px solid #E2E8F0',
                                    },
                                },
                            }}
                            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                        >
                            {/* User Info in Menu (Mobile) */}
                            <Box sx={{ display: { xs: 'block', md: 'none' }, px: 2, py: 1 }}>
                                <Typography variant="subtitle2">{user.userName}</Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {user.roleName}
                                </Typography>
                                <Typography variant="caption" color="text.secondary" display="block">
                                    {user.emailID}
                                </Typography>
                            </Box>
                            <MenuItem onClick={handleProfile}>
                                <AccountCircle fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                                {t('header.profile', 'Profile')}
                            </MenuItem>
                            <MenuItem onClick={handleLogout}>
                                <Logout fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                                {t('header.logout', 'Logout')}
                            </MenuItem>
                        </Menu>
                    </>
                ) : (
                    // Fallback when no user
                    <IconButton sx={{ color: 'text.secondary' }}>
                        <AccountCircle />
                    </IconButton>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Header;
