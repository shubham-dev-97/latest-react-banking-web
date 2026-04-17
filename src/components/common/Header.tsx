import React from 'react';
import { AppBar, Toolbar, Typography, Box, IconButton, Badge, Avatar, Menu, MenuItem, Tooltip } from '@mui/material';
import { 
    Notifications, 
    Menu as MenuIcon, 
    Logout, 
    AccountCircle,
    Settings,
    Dashboard
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import CurrencySelector from './CurrencySelector';
import { useAuth } from '../../hooks/useAuth';

interface HeaderProps {
    toggleSidebar?: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    
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
                return 'Admin Dashboard';
            case '/ceo-dashboard':
                return 'CEO Dashboard';
            case '/deposit':
                return 'Deposit Analysis';
            case '/loan':
                return 'Loan Analysis';
            case '/summary':
                return 'Banking Summary';
            case '/casa':
                return 'CASA Summary';
            case '/gl-dashboard':
                return 'GL Dashboard';
            default:
                return 'Banking Dashboard';
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
                bgcolor: '#1a237e',
                boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
            }}
        >
            <Toolbar>
                {/* Menu Icon for Mobile */}
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="start"
                    onClick={toggleSidebar}
                    sx={{ mr: 2, display: { sm: 'none' } }}
                >
                    <MenuIcon />
                </IconButton>
                
                {/* Page Title */}
                <Typography 
                    variant="h6" 
                    component="div" 
                    sx={{ 
                        flexGrow: 1, 
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                    }}
                >
                    <Dashboard sx={{ display: { xs: 'none', sm: 'block' } }} />
                    {getPageTitle()}
                </Typography>
                
                {/* Currency Selector */}
                <Box sx={{ mr: 2,
                bgcolor: '#f5f5f5',

                }}>
                    <CurrencySelector />
                </Box>
                
                {/* Notifications */}
                <Tooltip title="Notifications">
                    <IconButton color="inherit" sx={{ mr: 1 }}>
                        <Badge badgeContent={3} color="error">
                            <Notifications />
                        </Badge>
                    </IconButton>
                </Tooltip>
                
                {/* User Menu */}
                {user ? (
                    <>
                        <Tooltip title="Account settings">
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
                                        width: 35, 
                                        height: 35, 
                                        bgcolor: '#ff9800',
                                        fontSize: '0.9rem',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    {getUserInitials()}
                                </Avatar>
                            </IconButton>
                        </Tooltip>
                        
                        {/* User Info - Visible on larger screens */}
                        <Box sx={{ display: { xs: 'none', md: 'block' }, ml: 1 }}>
                            <Typography variant="body2" sx={{ lineHeight: 1.2 }}>
                                {getDisplayName()}
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
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
                                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                    mt: 1.5,
                                    minWidth: 200,
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
                                    },
                                },
                            }}
                            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                        >
                            {/* User Info in Menu (Mobile) */}
                            <Box sx={{ display: { xs: 'block', md: 'none' }, px: 2, py: 1 }}>
                                <Typography variant="subtitle2">{user.userName}</Typography>
                                <Typography variant="caption" color="textSecondary">
                                    {user.roleName}
                                </Typography>
                                <Typography variant="caption" color="textSecondary" display="block">
                                    {user.emailID}
                                </Typography>
                            </Box>
                            <MenuItem onClick={handleProfile}>
                                <AccountCircle fontSize="small" sx={{ mr: 1 }} />
                                Profile
                            </MenuItem>
                            <MenuItem onClick={handleLogout}>
                                <Logout fontSize="small" sx={{ mr: 1 }} />
                                Logout
                            </MenuItem>
                        </Menu>
                    </>
                ) : (
                    // Fallback when no user
                    <IconButton color="inherit">
                        <AccountCircle />
                    </IconButton>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Header;