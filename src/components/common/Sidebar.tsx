import React, { useState, useEffect } from 'react';
import {
    Drawer, List, ListItem, ListItemIcon, ListItemText,
    Toolbar, Box, Divider, Typography,
    useTheme, useMediaQuery
} from '@mui/material';

import {
    Home as HomeIcon,
    AccountBalance as DepositIcon,
    TrendingUp as LoanIcon,
    Assessment as SummaryIcon,
    Savings as SavingsIcon,
    AdminPanelSettings as AdminIcon,
    ShowChart as GLIcon
} from '@mui/icons-material';

import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { getAllowedPages, PAGES, getUserRole } from '../../utils/roleAccess';

const drawerWidth = 200;

const Sidebar = ({ mobileOpen, onClose }: any) => {
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const { user } = useAuth();

    const [menuItems, setMenuItems] = useState<any[]>([]);

    useEffect(() => {
        if (!user) return;

        const role = getUserRole(user);
        const allowedPages = getAllowedPages(role);

        console.log("👤 User:", user);
        console.log("👤 Role extracted:", role);
        console.log("📋 Allowed Pages:", allowedPages);

        const items: any[] = [];

        // Add Admin for Chairman and ITAdmin
        if (allowedPages.includes(PAGES.ADMIN)) {
            items.push({ text: 'Admin', icon: <AdminIcon />, path: PAGES.ADMIN });
        }

        // Add other pages based on allowedPages
        if (allowedPages.includes(PAGES.HOME)) {
            items.push({ text: 'Home', icon: <HomeIcon />, path: PAGES.HOME });
        }

        if (allowedPages.includes(PAGES.DEPOSIT)) {
            items.push({ text: 'Deposit', icon: <DepositIcon />, path: PAGES.DEPOSIT });
        }

        if (allowedPages.includes(PAGES.LOAN)) {
            items.push({ text: 'Loan', icon: <LoanIcon />, path: PAGES.LOAN });
        }

        if (allowedPages.includes(PAGES.SUMMARY)) {
            items.push({ text: 'Summary', icon: <SummaryIcon />, path: PAGES.SUMMARY });
        }

        if (allowedPages.includes(PAGES.CASA)) {
            items.push({ text: 'CASA Summary', icon: <SavingsIcon />, path: PAGES.CASA });
        }

        if (allowedPages.includes(PAGES.GL)) {
            items.push({ text: 'GL Dashboard', icon: <GLIcon />, path: PAGES.GL });
        }

        console.log("📋 Final menu items:", items);
        setMenuItems(items);

    }, [user]);

    const handleNavigation = (path: string) => {
        navigate(path);
        if (isMobile) onClose();
    };

    // Show loading if no menu items
    if (!user || menuItems.length === 0) {
        return (
            <Box sx={{ width: drawerWidth, bgcolor: '#f5f5f5', height: '100%', p: 2 }}>
                <Typography>Loading menu...</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
            <Drawer
                variant={isMobile ? "temporary" : "permanent"}
                open={isMobile ? mobileOpen : true}
                onClose={onClose}
                sx={{
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        bgcolor: '#f5f5f5',
                        borderRight: '1px solid #e0e0e0'
                    }
                }}
            >
                <Toolbar>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1a237e' }}>
                        Bank<span style={{ color: '#ff9800' }}>Dash</span>
                    </Typography>
                </Toolbar>

                <Divider />

                <List>
                    {menuItems.map((item) => (
                        <ListItem
                            button
                            key={item.text}
                            onClick={() => handleNavigation(item.path)}
                            selected={location.pathname === item.path}
                            sx={{
                                '&.Mui-selected': {
                                    backgroundColor: '#e3f2fd',
                                    '& .MuiListItemIcon-root': {
                                        color: '#1976d2',
                                    },
                                    '& .MuiListItemText-primary': {
                                        color: '#1976d2',
                                        fontWeight: 'bold',
                                    },
                                },
                            }}
                        >
                            <ListItemIcon sx={{ 
                                color: location.pathname === item.path ? '#1976d2' : '#757575',
                                minWidth: 40,
                            }}>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItem>
                    ))}
                </List>

                {user && (
                    <Box sx={{ position: 'absolute', bottom: 16, left: 16, right: 16 }}>
                        <Divider sx={{ mb: 2 }} />
                        <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', color: '#666' }}>
                            Logged in as: {user.roleName}
                        </Typography>
                        <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', color: '#999' }}>
                            {user.userName}
                        </Typography>
                    </Box>
                )}
            </Drawer>
        </Box>
    );
};

export default Sidebar;