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
    ShowChart as GLIcon,
     AccountTree as BranchIcon,
     Analytics as KpiIcon 
} from '@mui/icons-material';

import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { getAllowedPages, PAGES, getUserRole } from '../../utils/roleAccess';
import { bankColors } from '../../styles/bankColors';

import { useTranslation } from '../../hooks/useTranslation';

const drawerWidth = {
    xs: 200,
    sm: 200,
    md: 240,
    lg: 260
};

const Sidebar = ({ mobileOpen, onClose }: any) => {
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const { user } = useAuth();
     const { t } = useTranslation();

    const menuItems = React.useMemo(() => {
        if (!user) return [];

        const role = getUserRole(user);
        const allowedPages = getAllowedPages(role);

        const items: any[] = [];

        if (allowedPages.includes(PAGES.ADMIN)) {
            items.push({ text: t('sidebar.admin', 'Admin'), icon: <AdminIcon />, path: PAGES.ADMIN });
        }

        if (allowedPages.includes(PAGES.HOME)) {
            items.push({ text: t('sidebar.ceo_dashboard', 'CEO Dashboard'), icon: <HomeIcon />, path: PAGES.HOME });
        }

        if (allowedPages.includes(PAGES.DEPOSIT)) {
            items.push({ text: t('sidebar.deposit', 'Deposit'), icon: <DepositIcon />, path: PAGES.DEPOSIT });
        }

        if (allowedPages.includes(PAGES.LOAN)) {
            items.push({ text: t('sidebar.loan', 'Loan'), icon: <LoanIcon />, path: PAGES.LOAN });
        }

        if (allowedPages.includes(PAGES.SUMMARY)) {
            items.push({ text: t('sidebar.summary', 'Summary'), icon: <SummaryIcon />, path: PAGES.SUMMARY });
        }

        if (allowedPages.includes(PAGES.CASA)) {
            items.push({ text: t('sidebar.casa_summary', 'CASA Summary'), icon: <SavingsIcon />, path: PAGES.CASA });
        }

        if (allowedPages.includes(PAGES.GL)) {
            items.push({ text: t('sidebar.gl_dashboard', 'GL Dashboard'), icon: <GLIcon />, path: PAGES.GL });
        }

        if (allowedPages.includes(PAGES.BRANCH_PERFORMANCE)) {
            items.push({ text: t('sidebar.branch_performance', 'Branch Performance'), icon: <BranchIcon />, path: PAGES.BRANCH_PERFORMANCE });
        }

        if (allowedPages.includes(PAGES.BANK_KPI)) {
            items.push({ text: t('sidebar.bank_kpi', 'Bank KPI'), icon: <KpiIcon/>, path: PAGES.BANK_KPI });
        }

        return items;
    }, [user, t]);

    const handleNavigation = (path: string) => {
        navigate(path);
        if (isMobile) onClose();
    };

    // Show loading if no menu items
    if (!user || menuItems.length === 0) {
        return (
            <Box sx={{ width: drawerWidth, bgcolor: bankColors.sidebar.bg, height: '100%', p: 2 }}>
                <Typography>{t('sidebar.loading_menu', 'Loading menu...')}</Typography>
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
                        boxSizing: 'border-box',
                        bgcolor: bankColors.sidebar.bg,
                        borderRight: '1px solid #E2E8F0'
                    },
                }}
            >
                <Toolbar sx={{ justifyContent: 'center', py: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: '700', color: bankColors.header.bg }}>
                        Bank<span style={{ color: bankColors.header.accent }}>Dash</span>
                    </Typography>
                </Toolbar>

                <Divider sx={{ borderColor: '#E2E8F0' }} />

                <List sx={{ px: 2, pt: 2 }}>
                    {menuItems.map((item) => {
                        const isSelected = location.pathname === item.path;
                        return (
                            <ListItem
                                button
                                key={item.text}
                                onClick={() => handleNavigation(item.path)}
                                selected={isSelected}
                                sx={{
                                    mb: 1,
                                    borderRadius: 2,
                                    '&.Mui-selected': {
                                        backgroundColor: bankColors.sidebar.selected,
                                        '&:hover': {
                                            backgroundColor: bankColors.sidebar.selected,
                                        },
                                        '& .MuiListItemIcon-root': {
                                            color: bankColors.sidebar.selectedText,
                                        },
                                        '& .MuiListItemText-primary': {
                                            color: bankColors.sidebar.selectedText,
                                            fontWeight: '600',
                                        },
                                    },
                                    '&:hover': {
                                        backgroundColor: bankColors.sidebar.hover,
                                    }
                                }}
                            >
                                <ListItemIcon sx={{ 
                                    color: isSelected ? bankColors.sidebar.selectedText : bankColors.sidebar.icon,
                                    minWidth: 40,
                                }}>
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText 
                                    primary={item.text} 
                                    primaryTypographyProps={{ 
                                        fontWeight: isSelected ? '600' : '500',
                                        color: isSelected ? bankColors.sidebar.selectedText : 'text.primary',
                                        fontSize: '0.9rem'
                                    }} 
                                />
                            </ListItem>
                        );
                    })}
                </List>

                {user && (
                    <Box sx={{ position: 'absolute', bottom: 16, left: 16, right: 16 }}>
                        <Divider sx={{ mb: 2, borderColor: '#E2E8F0' }} />
                        <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', color: 'text.secondary', fontWeight: '500' }}>
                            Logged in as: {user.roleName}
                        </Typography>
                        <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', color: 'text.secondary', opacity: 0.8 }}>
                            {user.userName}
                        </Typography>
                    </Box>
                )}
            </Drawer>
        </Box>
    );
};

export default Sidebar;
