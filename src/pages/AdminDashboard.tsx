// import React, { useState } from 'react';
// import {
//     Box, Container, Grid, Paper,
//     Typography, Card, CardContent,
//     Avatar, Stack, Tabs, Tab,
//     Table, TableBody, TableCell,
//     TableContainer, TableHead, TableRow,
//     Chip, IconButton, Button,
//     Dialog, DialogTitle, DialogContent,
//     DialogActions, TextField, MenuItem,
//     FormControlLabel, Switch, Alert,
//     CircularProgress, Divider, useTheme,
//     TablePagination, TableSortLabel,
//     Tooltip, Fade, Zoom
// } from '@mui/material';
// import {
//     People, Security, Pages, Login,
//     Warning, CheckCircle, Cancel,
//     Edit, Delete, Add, Visibility,
//     Download, Refresh, AdminPanelSettings,
//     Today, ErrorOutline, Session,
//     Search, FilterList, MoreVert,
//     KeyboardArrowUp, KeyboardArrowDown,
//     ContentCopy, Print, CloudDownload
// } from '@mui/icons-material';
// import { useCurrency } from '../contexts/CurrencyContext';
// import {
//     useDashboardStats,
//     useUsers, useRoles, usePages,
//     useRecentLogins, useFailedLogins,
//     useActiveUsers, useCreateUser,
//     useUpdateUser, useDeleteUser,
//     useToggleUserStatus
// } from '../hooks/useAdminData';
// import { formatDistanceToNow } from 'date-fns';
// import StyledCard from '../components/common/StyledCard';

// // Tab Panel Component
// interface TabPanelProps {
//     children?: React.ReactNode;
//     index: number;
//     value: number;
// }

// function TabPanel(props: TabPanelProps) {
//     const { children, value, index, ...other } = props;
//     return (
//         <div
//             role="tabpanel"
//             hidden={value !== index}
//             id={`admin-tabpanel-${index}`}
//             aria-labelledby={`admin-tab-${index}`}
//             {...other}
//         >
//             {value === index && (
//                 <Fade in={value === index}>
//                     <Box sx={{ pt: 2 }}>
//                         {children}
//                     </Box>
//                 </Fade>
//             )}
//         </div>
//     );
// }

// // Table wrapper with gradient background
// const StyledTableContainer = ({ children, bgColor, ...props }: any) => (
//     <Paper 
//         sx={{ 
//             borderRadius: 3, 
//             overflow: 'hidden', 
//             boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
//             background: `linear-gradient(135deg, ${bgColor} 0%, #ffffff 100%)`,
//             position: 'relative',
//             '&::before': {
//                 content: '""',
//                 position: 'absolute',
//                 top: 0,
//                 left: 0,
//                 right: 0,
//                 height: '4px',
//                 background: 'linear-gradient(90deg, #1a237e, #D97706, #059669)',
//             }
//         }}
//         {...props}
//     >
//         {children}
//     </Paper>
// );

// const AdminDashboard: React.FC = () => {
//     const theme = useTheme();
//     const [tabValue, setTabValue] = useState(0);
//     const [openUserDialog, setOpenUserDialog] = useState(false);
//     const [selectedUser, setSelectedUser] = useState<any>(null);
//     const [formData, setFormData] = useState({
//         userLoginID: '',
//         employeeID: '',
//         userName: '',
//         emailID: '',
//         mobileNumber: '',
//         roleID: '',
//         department: '',
//         branchID: '',
//         regionID: '',
//         isActive: true,
//         passwordHash: ''
//     });

//     // Pagination state
//     const [page, setPage] = useState(0);
//     const [rowsPerPage, setRowsPerPage] = useState(10);
//     const [orderBy, setOrderBy] = useState('userID');
//     const [order, setOrder] = useState<'asc' | 'desc'>('asc');

//     // Fetch data
//     const { data: stats, isLoading: statsLoading } = useDashboardStats();
//     const { data: users, isLoading: usersLoading, refetch: refetchUsers } = useUsers();
//     const { data: roles, isLoading: rolesLoading } = useRoles();
//     const { data: pages, isLoading: pagesLoading } = usePages();
//     const { data: recentLogins, isLoading: loginsLoading } = useRecentLogins(50);
//     const { data: activeUsers, isLoading: activeLoading } = useActiveUsers();

//     // Mutations
//     const createUser = useCreateUser();
//     const updateUser = useUpdateUser();
//     const deleteUser = useDeleteUser();
//     const toggleStatus = useToggleUserStatus();

//     const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
//         setTabValue(newValue);
//         setPage(0);
//     };

//     const handleOpenUserDialog = (user?: any) => {
//         if (user) {
//             setSelectedUser(user);
//             setFormData({
//                 userLoginID: user.userLoginID || '',
//                 employeeID: user.employeeID || '',
//                 userName: user.userName || '',
//                 emailID: user.emailID || '',
//                 mobileNumber: user.mobileNumber || '',
//                 roleID: user.roleID?.toString() || '',
//                 department: user.department || '',
//                 branchID: user.branchID?.toString() || '',
//                 regionID: user.regionID?.toString() || '',
//                 isActive: user.isActive ?? true,
//                 passwordHash: ''
//             });
//         } else {
//             setSelectedUser(null);
//             setFormData({
//                 userLoginID: '',
//                 employeeID: '',
//                 userName: '',
//                 emailID: '',
//                 mobileNumber: '',
//                 roleID: '',
//                 department: '',
//                 branchID: '',
//                 regionID: '',
//                 isActive: true,
//                 passwordHash: ''
//             });
//         }
//         setOpenUserDialog(true);
//     };

//     const handleCloseUserDialog = () => {
//         setOpenUserDialog(false);
//         setSelectedUser(null);
//     };

//     const handleFormChange = (field: string, value: any) => {
//         setFormData(prev => ({ ...prev, [field]: value }));
//     };

//     const handleSaveUser = async () => {
//         if (!formData.userLoginID || !formData.userName || !formData.roleID) {
//             alert('Please fill all required fields (Login ID, Name, Role)');
//             return;
//         }

//         const userData: any = {
//             userLoginID: formData.userLoginID,
//             employeeID: formData.employeeID || '',
//             userName: formData.userName,
//             emailID: formData.emailID || '',
//             mobileNumber: formData.mobileNumber || '',
//             roleID: parseInt(formData.roleID),
//             department: formData.department || '',
//             branchID: formData.branchID ? parseInt(formData.branchID) : null,
//             regionID: formData.regionID ? parseInt(formData.regionID) : null,
//             isActive: formData.isActive,
//         };

//         if (!selectedUser) {
//             userData.passwordHash = formData.passwordHash || 'Bank@123';
//         }

//         try {
//             if (selectedUser) {
//                 const updateData = { ...userData, userID: selectedUser.userID };
//                 await updateUser.mutateAsync({ id: selectedUser.userID, user: updateData });
//                 alert('User updated successfully!');
//             } else {
//                 await createUser.mutateAsync(userData);
//                 alert('User created successfully!');
//             }
//             handleCloseUserDialog();
//             refetchUsers();
//         } catch (error: any) {
//             console.error('Error saving user:', error);
//             alert(error?.response?.data?.error || 'Failed to save user. Please try again.');
//         }
//     };

//     const handleToggleStatus = async (userId: number) => {
//         try {
//             await toggleStatus.mutateAsync(userId);
//             refetchUsers();
//         } catch (error) {
//             console.error('Error toggling user status:', error);
//             alert('Failed to update user status');
//         }
//     };

//     const handleDeleteUser = async (userId: number) => {
//         if (window.confirm('Are you sure you want to delete this user?')) {
//             try {
//                 await deleteUser.mutateAsync(userId);
//                 refetchUsers();
//                 alert('User deleted successfully!');
//             } catch (error) {
//                 console.error('Error deleting user:', error);
//                 alert('Failed to delete user');
//             }
//         }
//     };

//     const handleSort = (property: string) => {
//         const isAsc = orderBy === property && order === 'asc';
//         setOrder(isAsc ? 'desc' : 'asc');
//         setOrderBy(property);
//     };

//     const handleChangePage = (event: unknown, newPage: number) => {
//         setPage(newPage);
//     };

//     const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
//         setRowsPerPage(parseInt(event.target.value, 10));
//         setPage(0);
//     };

//     const statsCards = [
//         { title: 'Total Users', value: stats?.totalUsers || 0, icon: <People />, color: '#2563EB' },
//         { title: 'Active Users', value: stats?.activeUsers || 0, icon: <CheckCircle />, color: '#059669' },
//         { title: 'Total Roles', value: stats?.totalRoles || 0, icon: <Security />, color: 'secondary.main' },
//         { title: 'Total Pages', value: stats?.totalPages || 0, icon: <Pages />, color: '#7C3AED' },
//         { title: "Today's Logins", value: stats?.todayLogins || 0, icon: <Login />, color: '#2563EB' },
//         { title: 'Failed Logins', value: stats?.failedLogins || 0, icon: <Warning />, color: '#DC2626' },
//         { title: 'Active Sessions', value: stats?.activeSessions || 0, icon: <Visibility />, color: '#009688' },
//     ];

//     const tabs = [
//         { label: 'User Management', index: 0, icon: <People sx={{ fontSize: 18, mr: 1 }} /> },
//         { label: 'Role Management', index: 1, icon: <Security sx={{ fontSize: 18, mr: 1 }} /> },
//         { label: 'Page Access', index: 2, icon: <Pages sx={{ fontSize: 18, mr: 1 }} /> },
//         { label: 'Audit Logs', index: 3, icon: <Login sx={{ fontSize: 18, mr: 1 }} /> },
//         { label: 'Active Users', index: 4, icon: <Visibility sx={{ fontSize: 18, mr: 1 }} /> },
//     ];

//     const tabButtonStyle = (isActive: boolean) => ({
//         px: 3,
//         py: 1,
//         borderRadius: 2,
//         textTransform: 'none',
//         fontWeight: 600,
//         fontSize: '0.875rem',
//         backgroundColor: isActive ? 'primary.main' : 'transparent',
//         color: isActive ? 'white' : 'primary.main',
//         border: `1px solid ${isActive ? 'primary.main' : '#e0e0e0'}`,
//         '&:hover': {
//             backgroundColor: isActive ? '#0f155e' : '#f5f5f5',
//             borderColor: 'primary.main',
//         },
//         transition: 'all 0.2s ease',
//     });

//     return (
//         <Box sx={{ width: '100%', height: '100%', overflow: 'auto', bgcolor: '#f5f5f5' }}>
//             <Container maxWidth={false} sx={{ py: 2, px: { xs: 2, md: 3 } }}>
//                 {/* Tabs as Buttons */}
//                 <Box sx={{ mb: 3 }}>
//                     <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
//                         {tabs.map((tab) => (
//                             <Button
//                                 key={tab.index}
//                                 onClick={() => handleTabChange(null as any, tab.index)}
//                                 sx={tabButtonStyle(tabValue === tab.index)}
//                                 startIcon={tab.icon}
//                                 variant={tabValue === tab.index ? 'contained' : 'outlined'}
//                             >
//                                 {tab.label}
//                             </Button>
//                         ))}
//                     </Stack>
//                 </Box>

//                 {/* TAB CONTENT - ABOVE KPI CARDS */}
//                 <Box sx={{ mb: 4 }}>
//                     {/* User Management Tab - Purple/Blue Gradient */}
//                     <TabPanel value={tabValue} index={0}>
//                         <StyledTableContainer bgColor="rgba(106, 27, 154, 0.05)">
//                             <Box sx={{ 
//                                 p: 2, 
//                                 background: 'linear-gradient(135deg, #6a1b9a 0%, #1a237e 100%)',
//                                 color: 'white'
//                             }}>
//                                 <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
//                                     <Box>
//                                         <Typography variant="h6" sx={{ fontWeight: 600 }}>
//                                             User Management
//                                         </Typography>
//                                         <Typography variant="caption" sx={{ opacity: 0.9 }}>
//                                             Manage all system users and their permissions
//                                         </Typography>
//                                     </Box>
//                                     <Box sx={{ display: 'flex', gap: 1 }}>
//                                         <Tooltip title="Search">
//                                             <IconButton size="small" sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.1)', '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}>
//                                                 <Search />
//                                             </IconButton>
//                                         </Tooltip>
//                                         <Tooltip title="Filter">
//                                             <IconButton size="small" sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.1)', '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}>
//                                                 <FilterList />
//                                             </IconButton>
//                                         </Tooltip>
//                                         <Button
//                                             variant="contained"
//                                             startIcon={<Add />}
//                                             onClick={() => handleOpenUserDialog()}
//                                             size="small"
//                                             sx={{ 
//                                                 textTransform: 'none', 
//                                                 borderRadius: 2,
//                                                 bgcolor: 'secondary.main',
//                                                 '&:hover': { bgcolor: '#f57c00' }
//                                             }}
//                                         >
//                                             Add User
//                                         </Button>
//                                     </Box>
//                                 </Box>
//                             </Box>

//                             <TableContainer sx={{ maxHeight: 450, bgcolor: 'white' }}>
//                                 <Table stickyHeader size="small">
//                                     <TableHead>
//                                         <TableRow sx={{ 
//                                             bgcolor: '#f3e5f5',
//                                             '& th': { 
//                                                 fontWeight: 600, 
//                                                 py: 1.5,
//                                                 color: '#4a148c',
//                                                 borderBottom: '2px solid #ce93d8'
//                                             }
//                                         }}>
//                                             <TableCell>
//                                                 <TableSortLabel
//                                                     active={orderBy === 'userID'}
//                                                     direction={orderBy === 'userID' ? order : 'asc'}
//                                                     onClick={() => handleSort('userID')}
//                                                 >
//                                                     ID
//                                                 </TableSortLabel>
//                                             </TableCell>
//                                             <TableCell>
//                                                 <TableSortLabel
//                                                     active={orderBy === 'userLoginID'}
//                                                     direction={orderBy === 'userLoginID' ? order : 'asc'}
//                                                     onClick={() => handleSort('userLoginID')}
//                                                 >
//                                                     Login ID
//                                                 </TableSortLabel>
//                                             </TableCell>
//                                             <TableCell>
//                                                 <TableSortLabel
//                                                     active={orderBy === 'userName'}
//                                                     direction={orderBy === 'userName' ? order : 'asc'}
//                                                     onClick={() => handleSort('userName')}
//                                                 >
//                                                     Name
//                                                 </TableSortLabel>
//                                             </TableCell>
//                                             <TableCell>Email</TableCell>
//                                             <TableCell>Role</TableCell>
//                                             <TableCell>Department</TableCell>
//                                             <TableCell>Status</TableCell>
//                                             <TableCell>Last Login</TableCell>
//                                             <TableCell align="center">Actions</TableCell>
//                                         </TableRow>
//                                     </TableHead>
//                                     <TableBody>
//                                         {usersLoading ? (
//                                             <TableRow>
//                                                 <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
//                                                     <CircularProgress size={40} />
//                                                 </TableCell>
//                                             </TableRow>
//                                         ) : users?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user, index) => (
//                                             <TableRow 
//                                                 key={user.userID} 
//                                                 hover
//                                                 sx={{ 
//                                                     '&:hover': { bgcolor: '#f3e5f5' },
//                                                     transition: 'all 0.2s ease'
//                                                 }}
//                                             >
//                                                 <TableCell sx={{ fontWeight: 500 }}>{user.userID}</TableCell>
//                                                 <TableCell>
//                                                     <Chip 
//                                                         label={user.userLoginID} 
//                                                         size="small"
//                                                         variant="outlined"
//                                                         sx={{ fontWeight: 500, borderColor: '#7C3AED', color: '#7C3AED' }}
//                                                     />
//                                                 </TableCell>
//                                                 <TableCell sx={{ fontWeight: 500 }}>{user.userName}</TableCell>
//                                                 <TableCell>{user.emailID}</TableCell>
//                                                 <TableCell>
//                                                     <Chip 
//                                                         label={user.roleName} 
//                                                         size="small"
//                                                         sx={{ 
//                                                             bgcolor: getRoleColor(user.roleName),
//                                                             color: 'white',
//                                                             fontWeight: 500,
//                                                             px: 1
//                                                         }}
//                                                     />
//                                                 </TableCell>
//                                                 <TableCell>{user.department}</TableCell>
//                                                 <TableCell>
//                                                     <Chip
//                                                         label={user.isActive ? 'Active' : 'Inactive'}
//                                                         color={user.isActive ? 'success' : 'error'}
//                                                         size="small"
//                                                         sx={{ fontWeight: 500, minWidth: 70 }}
//                                                     />
//                                                 </TableCell>
//                                                 <TableCell>
//                                                     <Typography variant="body2" color="textSecondary" sx={{ fontSize: '0.75rem' }}>
//                                                         {user.lastLoginDate
//                                                             ? formatDistanceToNow(new Date(user.lastLoginDate), { addSuffix: true })
//                                                             : 'Never'}
//                                                     </Typography>
//                                                 </TableCell>
//                                                 <TableCell align="center">
//                                                     <Stack direction="row" spacing={0.5} justifyContent="center">
//                                                         <Tooltip title="Edit User">
//                                                             <IconButton size="small" onClick={() => handleOpenUserDialog(user)} sx={{ color: '#7C3AED' }}>
//                                                                 <Edit fontSize="small" />
//                                                             </IconButton>
//                                                         </Tooltip>
//                                                         <Tooltip title={user.isActive ? 'Deactivate User' : 'Activate User'}>
//                                                             <IconButton size="small" onClick={() => handleToggleStatus(user.userID)}>
//                                                                 {user.isActive ? 
//                                                                     <Cancel fontSize="small" sx={{ color: '#DC2626' }} /> : 
//                                                                     <CheckCircle fontSize="small" sx={{ color: '#059669' }} />
//                                                                 }
//                                                             </IconButton>
//                                                         </Tooltip>
//                                                         <Tooltip title="Delete User">
//                                                             <IconButton size="small" onClick={() => handleDeleteUser(user.userID)}>
//                                                                 <Delete fontSize="small" sx={{ color: '#DC2626' }} />
//                                                             </IconButton>
//                                                         </Tooltip>
//                                                     </Stack>
//                                                 </TableCell>
//                                             </TableRow>
//                                         ))}
//                                     </TableBody>
//                                 </Table>
//                             </TableContainer>
                            
//                             <TablePagination
//                                 rowsPerPageOptions={[5, 10, 25, 50]}
//                                 component="div"
//                                 count={users?.length || 0}
//                                 rowsPerPage={rowsPerPage}
//                                 page={page}
//                                 onPageChange={handleChangePage}
//                                 onRowsPerPageChange={handleChangeRowsPerPage}
//                                 sx={{ borderTop: '1px solid #e0e0e0', bgcolor: 'white' }}
//                             />
//                         </StyledTableContainer>
//                     </TabPanel>

//                     {/* Role Management Tab - Orange/Gold Gradient */}
//                     <TabPanel value={tabValue} index={1}>
//                         <StyledTableContainer bgColor="rgba(255, 152, 0, 0.05)">
//                             <Box sx={{ 
//                                 p: 2, 
//                                 background: 'linear-gradient(135deg, #f57c00 0%, #D97706 100%)',
//                                 color: 'white'
//                             }}>
//                                 <Typography variant="h6" sx={{ fontWeight: 600 }}>
//                                     Role Management
//                                 </Typography>
//                                 <Typography variant="caption" sx={{ opacity: 0.9 }}>
//                                     Define and manage user roles and permissions
//                                 </Typography>
//                             </Box>
//                             <TableContainer sx={{ maxHeight: 450, bgcolor: 'white' }}>
//                                 <Table stickyHeader size="small">
//                                     <TableHead>
//                                         <TableRow sx={{ 
//                                             bgcolor: '#fff3e0',
//                                             '& th': { 
//                                                 fontWeight: 600, 
//                                                 py: 1.5,
//                                                 color: '#e65100',
//                                                 borderBottom: '2px solid #ffe0b2'
//                                             }
//                                         }}>
//                                             <TableCell>ID</TableCell>
//                                             <TableCell>Role Name</TableCell>
//                                             <TableCell>Level</TableCell>
//                                             <TableCell>Description</TableCell>
//                                             <TableCell align="center">Users</TableCell>
//                                             <TableCell>Created Date</TableCell>
//                                         </TableRow>
//                                     </TableHead>
//                                     <TableBody>
//                                         {rolesLoading ? (
//                                             <TableRow>
//                                                 <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
//                                                     <CircularProgress size={40} />
//                                                 </TableCell>
//                                             </TableRow>
//                                         ) : roles?.map((role) => (
//                                             <TableRow key={role.roleID} hover sx={{ '&:hover': { bgcolor: '#fff3e0' } }}>
//                                                 <TableCell>{role.roleID}</TableCell>
//                                                 <TableCell>
//                                                     <Chip 
//                                                         label={role.roleName} 
//                                                         size="medium"
//                                                         sx={{ 
//                                                             bgcolor: getRoleColor(role.roleName),
//                                                             color: 'white',
//                                                             fontWeight: 600,
//                                                             px: 1
//                                                         }}
//                                                     />
//                                                 </TableCell>
//                                                 <TableCell>
//                                                     <Chip 
//                                                         label={`Level ${role.roleLevel}`} 
//                                                         size="small"
//                                                         variant="outlined"
//                                                         sx={{ borderColor: 'secondary.main', color: 'secondary.main' }}
//                                                     />
//                                                 </TableCell>
//                                                 <TableCell>{role.roleDescription}</TableCell>
//                                                 <TableCell align="center">
//                                                     <Chip 
//                                                         label={role.userCount} 
//                                                         size="small"
//                                                         sx={{ bgcolor: 'secondary.main', color: 'white', fontWeight: 600 }}
//                                                     />
//                                                 </TableCell>
//                                                 <TableCell>
//                                                     <Typography variant="body2" color="textSecondary">
//                                                         {new Date(role.createdDate).toLocaleDateString()}
//                                                     </Typography>
//                                                 </TableCell>
//                                             </TableRow>
//                                         ))}
//                                     </TableBody>
//                                 </Table>
//                             </TableContainer>
//                         </StyledTableContainer>
//                     </TabPanel>

//                     {/* Page Access Tab - Green/Turquoise Gradient */}
//                     <TabPanel value={tabValue} index={2}>
//                         <StyledTableContainer bgColor="rgba(76, 175, 80, 0.05)">
//                             <Box sx={{ 
//                                 p: 2, 
//                                 background: 'linear-gradient(135deg, #2e7d32 0%, #059669 100%)',
//                                 color: 'white'
//                             }}>
//                                 <Typography variant="h6" sx={{ fontWeight: 600 }}>
//                                     Page Access Management
//                                 </Typography>
//                                 <Typography variant="caption" sx={{ opacity: 0.9 }}>
//                                     Configure page access permissions by role
//                                 </Typography>
//                             </Box>
//                             <TableContainer sx={{ maxHeight: 450, bgcolor: 'white' }}>
//                                 <Table stickyHeader size="small">
//                                     <TableHead>
//                                         <TableRow sx={{ 
//                                             bgcolor: '#e8f5e9',
//                                             '& th': { 
//                                                 fontWeight: 600, 
//                                                 py: 1.5,
//                                                 color: '#1b5e20',
//                                                 borderBottom: '2px solid #c8e6c9'
//                                             }
//                                         }}>
//                                             <TableCell>ID</TableCell>
//                                             <TableCell>Page Name</TableCell>
//                                             <TableCell>Code</TableCell>
//                                             <TableCell>Category</TableCell>
//                                             <TableCell>URL</TableCell>
//                                             <TableCell align="center">Order</TableCell>
//                                             <TableCell align="center">Status</TableCell>
//                                         </TableRow>
//                                     </TableHead>
//                                     <TableBody>
//                                         {pagesLoading ? (
//                                             <TableRow>
//                                                 <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
//                                                     <CircularProgress size={40} />
//                                                 </TableCell>
//                                             </TableRow>
//                                         ) : pages?.map((page) => (
//                                             <TableRow key={page.pageID} hover sx={{ '&:hover': { bgcolor: '#e8f5e9' } }}>
//                                                 <TableCell>{page.pageID}</TableCell>
//                                                 <TableCell sx={{ fontWeight: 500 }}>{page.pageName}</TableCell>
//                                                 <TableCell>
//                                                     <Chip 
//                                                         label={page.pageCode} 
//                                                         size="small"
//                                                         variant="outlined"
//                                                         sx={{ borderColor: '#059669', color: '#059669' }}
//                                                     />
//                                                 </TableCell>
//                                                 <TableCell>{page.pageCategory}</TableCell>
//                                                 <TableCell>
//                                                     <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
//                                                         {page.pageURL}
//                                                     </Typography>
//                                                 </TableCell>
//                                                 <TableCell align="center">
//                                                     <Chip 
//                                                         label={page.displayOrder} 
//                                                         size="small"
//                                                         variant="outlined"
//                                                     />
//                                                 </TableCell>
//                                                 <TableCell align="center">
//                                                     <Chip
//                                                         label={page.isActive ? 'Active' : 'Inactive'}
//                                                         color={page.isActive ? 'success' : 'error'}
//                                                         size="small"
//                                                         sx={{ minWidth: 70 }}
//                                                     />
//                                                 </TableCell>
//                                             </TableRow>
//                                         ))}
//                                     </TableBody>
//                                 </Table>
//                             </TableContainer>
//                         </StyledTableContainer>
//                     </TabPanel>

//                     {/* Audit Logs Tab - Blue/Teal Gradient */}
//                     <TabPanel value={tabValue} index={3}>
//                         <Grid container spacing={3}>
//                             <Grid item xs={12} md={6}>
//                                 <StyledTableContainer bgColor="rgba(33, 150, 243, 0.05)">
//                                     <Box sx={{ 
//                                         p: 2, 
//                                         background: 'linear-gradient(135deg, #2563EB 0%, #2563EB 100%)',
//                                         color: 'white'
//                                     }}>
//                                         <Typography variant="h6" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
//                                             <CheckCircle fontSize="small" /> Recent Successful Logins
//                                         </Typography>
//                                         <Typography variant="caption" sx={{ opacity: 0.9 }}>
//                                             Track successful authentication attempts
//                                         </Typography>
//                                     </Box>
//                                     <TableContainer sx={{ maxHeight: 400, bgcolor: 'white' }}>
//                                         <Table stickyHeader size="small">
//                                             <TableHead>
//                                                 <TableRow sx={{ 
//                                                     bgcolor: '#e3f2fd',
//                                                     '& th': { 
//                                                         fontWeight: 600, 
//                                                         py: 1.5,
//                                                         color: '#0d47a1',
//                                                         borderBottom: '2px solid #bbdef5'
//                                                     }
//                                                 }}>
//                                                     <TableCell>User</TableCell>
//                                                     <TableCell>Time</TableCell>
//                                                     <TableCell>IP Address</TableCell>
//                                                     <TableCell>Device</TableCell>
//                                                 </TableRow>
//                                             </TableHead>
//                                             <TableBody>
//                                                 {loginsLoading ? (
//                                                     <TableRow>
//                                                         <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
//                                                             <CircularProgress size={30} />
//                                                         </TableCell>
//                                                     </TableRow>
//                                                 ) : recentLogins?.filter(l => l.loginStatus === 'SUCCESS').slice(0, 10).map((login) => (
//                                                     <TableRow key={login.loginID} hover sx={{ '&:hover': { bgcolor: '#e3f2fd' } }}>
//                                                         <TableCell sx={{ fontWeight: 500 }}>{login.userName}</TableCell>
//                                                         <TableCell>
//                                                             <Typography variant="body2" sx={{ fontWeight: 500, color: '#2563EB' }}>
//                                                                 {formatDistanceToNow(new Date(login.loginTime), { addSuffix: true })}
//                                                             </Typography>
//                                                         </TableCell>
//                                                         <TableCell>
//                                                             <Chip label={login.ipAddress} size="small" variant="outlined" />
//                                                         </TableCell>
//                                                         <TableCell>{login.deviceType}</TableCell>
//                                                     </TableRow>
//                                                 ))}
//                                             </TableBody>
//                                         </Table>
//                                     </TableContainer>
//                                 </StyledTableContainer>
//                             </Grid>
//                             <Grid item xs={12} md={6}>
//                                 <StyledTableContainer bgColor="rgba(244, 67, 54, 0.05)">
//                                     <Box sx={{ 
//                                         p: 2, 
//                                         background: 'linear-gradient(135deg, #d32f2f 0%, #DC2626 100%)',
//                                         color: 'white'
//                                     }}>
//                                         <Typography variant="h6" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
//                                             <Warning fontSize="small" /> Failed Login Attempts
//                                         </Typography>
//                                         <Typography variant="caption" sx={{ opacity: 0.9 }}>
//                                             Monitor failed authentication attempts
//                                         </Typography>
//                                     </Box>
//                                     <TableContainer sx={{ maxHeight: 400, bgcolor: 'white' }}>
//                                         <Table stickyHeader size="small">
//                                             <TableHead>
//                                                 <TableRow sx={{ 
//                                                     bgcolor: '#ffebee',
//                                                     '& th': { 
//                                                         fontWeight: 600, 
//                                                         py: 1.5,
//                                                         color: '#b71c1c',
//                                                         borderBottom: '2px solid #ffcdd2'
//                                                     }
//                                                 }}>
//                                                     <TableCell>User</TableCell>
//                                                     <TableCell>Time</TableCell>
//                                                     <TableCell>IP Address</TableCell>
//                                                     <TableCell align="center">Attempts</TableCell>
//                                                 </TableRow>
//                                             </TableHead>
//                                             <TableBody>
//                                                 {loginsLoading ? (
//                                                     <TableRow>
//                                                         <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
//                                                             <CircularProgress size={30} />
//                                                         </TableCell>
//                                                     </TableRow>
//                                                 ) : recentLogins?.filter(l => l.loginStatus === 'FAILED').slice(0, 10).map((login) => (
//                                                     <TableRow key={login.loginID} hover sx={{ '&:hover': { bgcolor: '#ffebee' } }}>
//                                                         <TableCell>{login.userName}</TableCell>
//                                                         <TableCell>
//                                                             <Typography variant="body2" sx={{ fontWeight: 500, color: '#d32f2f' }}>
//                                                                 {formatDistanceToNow(new Date(login.loginTime), { addSuffix: true })}
//                                                             </Typography>
//                                                         </TableCell>
//                                                         <TableCell>
//                                                             <Chip label={login.ipAddress} size="small" variant="outlined" />
//                                                         </TableCell>
//                                                         <TableCell align="center">
//                                                             <Chip 
//                                                                 label={login.failedAttemptCount} 
//                                                                 color="error" 
//                                                                 size="small" 
//                                                                 sx={{ fontWeight: 600, minWidth: 40 }}
//                                                             />
//                                                         </TableCell>
//                                                     </TableRow>
//                                                 ))}
//                                             </TableBody>
//                                         </Table>
//                                     </TableContainer>
//                                 </StyledTableContainer>
//                             </Grid>
//                         </Grid>
//                     </TabPanel>

//                     {/* Active Users Tab - Purple/Indigo Gradient */}
//                     <TabPanel value={tabValue} index={4}>
//                         <StyledTableContainer bgColor="rgba(103, 58, 183, 0.05)">
//                             <Box sx={{ 
//                                 p: 2, 
//                                 background: 'linear-gradient(135deg, #512da8 0%, #673ab7 100%)',
//                                 color: 'white'
//                             }}>
//                                 <Typography variant="h6" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
//                                     <Visibility fontSize="small" /> Users Active Today
//                                 </Typography>
//                                 <Typography variant="caption" sx={{ opacity: 0.9 }}>
//                                     Currently active users in the system
//                                 </Typography>
//                             </Box>
//                             <TableContainer sx={{ maxHeight: 450, bgcolor: 'white' }}>
//                                 <Table stickyHeader size="small">
//                                     <TableHead>
//                                         <TableRow sx={{ 
//                                             bgcolor: '#ede7f6',
//                                             '& th': { 
//                                                 fontWeight: 600, 
//                                                 py: 1.5,
//                                                 color: '#311b92',
//                                                 borderBottom: '2px solid #d1c4e9'
//                                             }
//                                         }}>
//                                             <TableCell>User</TableCell>
//                                             <TableCell>Login ID</TableCell>
//                                             <TableCell>Email</TableCell>
//                                             <TableCell>Role</TableCell>
//                                             <TableCell>Last Login</TableCell>
//                                         </TableRow>
//                                     </TableHead>
//                                     <TableBody>
//                                         {activeLoading ? (
//                                             <TableRow>
//                                                 <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
//                                                     <CircularProgress size={40} />
//                                                 </TableCell>
//                                             </TableRow>
//                                         ) : activeUsers?.map((user) => (
//                                             <TableRow key={user.userID} hover sx={{ '&:hover': { bgcolor: '#ede7f6' } }}>
//                                                 <TableCell sx={{ fontWeight: 500 }}>{user.userName}</TableCell>
//                                                 <TableCell>{user.userLoginID}</TableCell>
//                                                 <TableCell>{user.emailID}</TableCell>
//                                                 <TableCell>
//                                                     <Chip 
//                                                         label={user.roleName} 
//                                                         size="small"
//                                                         sx={{ 
//                                                             bgcolor: getRoleColor(user.roleName),
//                                                             color: 'white',
//                                                             fontWeight: 500
//                                                         }}
//                                                     />
//                                                 </TableCell>
//                                                 <TableCell>
//                                                     {user.lastLoginDate
//                                                         ? formatDistanceToNow(new Date(user.lastLoginDate), { addSuffix: true })
//                                                         : 'N/A'}
//                                                 </TableCell>
//                                             </TableRow>
//                                         ))}
//                                     </TableBody>
//                                 </Table>
//                             </TableContainer>
//                         </StyledTableContainer>
//                     </TabPanel>
//                 </Box>

//                 {/* KPI CARDS - BELOW THE TAB CONTENT */}
//                 <Grid container spacing={3}>
//                     {statsCards.map((card, index) => (
//                         <Grid item xs={12} sm={6} md={3} key={index}>
//                             <StyledCard
//                                 title={card.title}
//                                 value={card.value}
//                                 icon={card.icon}
//                                 colorIndex={index % 6}
//                             />
//                         </Grid>
//                     ))}
//                 </Grid>

//                 {/* User Dialog */}
//                 <Dialog open={openUserDialog} onClose={handleCloseUserDialog} maxWidth="md" fullWidth>
//                     <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white' }}>
//                         {selectedUser ? 'Edit User' : 'Add New User'}
//                     </DialogTitle>
//                     <DialogContent sx={{ mt: 2 }}>
//                         <Grid container spacing={2}>
//                             <Grid item xs={6}>
//                                 <TextField
//                                     fullWidth
//                                     label="Login ID *"
//                                     value={formData.userLoginID}
//                                     onChange={(e) => handleFormChange('userLoginID', e.target.value)}
//                                     size="small"
//                                     required
//                                 />
//                             </Grid>
//                             <Grid item xs={6}>
//                                 <TextField
//                                     fullWidth
//                                     label="Employee ID"
//                                     value={formData.employeeID}
//                                     onChange={(e) => handleFormChange('employeeID', e.target.value)}
//                                     size="small"
//                                 />
//                             </Grid>
//                             <Grid item xs={6}>
//                                 <TextField
//                                     fullWidth
//                                     label="Full Name *"
//                                     value={formData.userName}
//                                     onChange={(e) => handleFormChange('userName', e.target.value)}
//                                     size="small"
//                                     required
//                                 />
//                             </Grid>
//                             <Grid item xs={6}>
//                                 <TextField
//                                     fullWidth
//                                     label="Email"
//                                     value={formData.emailID}
//                                     onChange={(e) => handleFormChange('emailID', e.target.value)}
//                                     size="small"
//                                     type="email"
//                                 />
//                             </Grid>
//                             <Grid item xs={6}>
//                                 <TextField
//                                     fullWidth
//                                     label="Mobile Number"
//                                     value={formData.mobileNumber}
//                                     onChange={(e) => handleFormChange('mobileNumber', e.target.value)}
//                                     size="small"
//                                 />
//                             </Grid>
//                             <Grid item xs={6}>
//                                 <TextField
//                                     fullWidth
//                                     select
//                                     label="Role *"
//                                     value={formData.roleID}
//                                     onChange={(e) => handleFormChange('roleID', e.target.value)}
//                                     size="small"
//                                     required
//                                 >
//                                     <MenuItem value="">Select Role</MenuItem>
//                                     {roles?.map((role) => (
//                                         <MenuItem key={role.roleID} value={role.roleID}>
//                                             {role.roleName}
//                                         </MenuItem>
//                                     ))}
//                                 </TextField>
//                             </Grid>
//                             <Grid item xs={6}>
//                                 <TextField
//                                     fullWidth
//                                     label="Department"
//                                     value={formData.department}
//                                     onChange={(e) => handleFormChange('department', e.target.value)}
//                                     size="small"
//                                 />
//                             </Grid>
//                             <Grid item xs={6}>
//                                 <TextField
//                                     fullWidth
//                                     label="Branch ID"
//                                     value={formData.branchID}
//                                     onChange={(e) => handleFormChange('branchID', e.target.value)}
//                                     size="small"
//                                     type="number"
//                                 />
//                             </Grid>
//                             <Grid item xs={6}>
//                                 <TextField
//                                     fullWidth
//                                     label="Region ID"
//                                     value={formData.regionID}
//                                     onChange={(e) => handleFormChange('regionID', e.target.value)}
//                                     size="small"
//                                     type="number"
//                                 />
//                             </Grid>
//                             {!selectedUser && (
//                                 <Grid item xs={12}>
//                                     <TextField
//                                         fullWidth
//                                         label="Password"
//                                         value={formData.passwordHash}
//                                         onChange={(e) => handleFormChange('passwordHash', e.target.value)}
//                                         size="small"
//                                         type="password"
//                                         helperText="Leave empty to use default password: Bank@123"
//                                     />
//                                 </Grid>
//                             )}
//                             <Grid item xs={12}>
//                                 <FormControlLabel
//                                     control={
//                                         <Switch
//                                             checked={formData.isActive}
//                                             onChange={(e) => handleFormChange('isActive', e.target.checked)}
//                                             color="primary"
//                                         />
//                                     }
//                                     label="Active User"
//                                 />
//                             </Grid>
//                         </Grid>
//                     </DialogContent>
//                     <DialogActions sx={{ p: 2 }}>
//                         <Button onClick={handleCloseUserDialog}>Cancel</Button>
//                         <Button variant="contained" onClick={handleSaveUser}>
//                             {selectedUser ? 'Update' : 'Create'}
//                         </Button>
//                     </DialogActions>
//                 </Dialog>
//             </Container>
//         </Box>
//     );
// };

// // Helper function for role colors
// const getRoleColor = (roleName: string): string => {
//     switch(roleName) {
//         case 'Chairman': return '#6B46C1';
//         case 'CEO': return '#3182CE';
//         case 'GM': return '#2C7A7B';
//         case 'AGM': return '#2C7A7B';
//         case 'Manager': return '#38A169';
//         case 'Officer': return '#DD6B20';
//         case 'Clerk': return '#718096';
//         case 'ITAdmin': return '#7C3AED';
//         case 'ComplianceOfficer': return '#D53F8C';
//         default: return '#2563EB';
//     }
// };

// export default AdminDashboard;







import React, { useState } from 'react';
import {
    Box, Container, Grid, Paper,
    Typography, Card, CardContent,
    Avatar, Stack, Tabs, Tab,
    Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow,
    Chip, IconButton, Button,
    Dialog, DialogTitle, DialogContent,
    DialogActions, TextField, MenuItem,
    FormControlLabel, Switch, Alert,
    CircularProgress, Divider, useTheme,
    TablePagination, TableSortLabel,
    Tooltip, Fade, Zoom
} from '@mui/material';
import {
    People, Security, Pages, Login,
    Warning, CheckCircle, Cancel,
    Edit, Delete, Add, Visibility,
    Download, Refresh, AdminPanelSettings,
    Today, ErrorOutline, Session,
    Search, FilterList, MoreVert,
    KeyboardArrowUp, KeyboardArrowDown,
    ContentCopy, Print, CloudDownload
} from '@mui/icons-material';
import { useCurrency } from '../contexts/CurrencyContext';
import {
    useDashboardStats,
    useUsers, useRoles, usePages,
    useRecentLogins, useFailedLogins,
    useActiveUsers, useCreateUser,
    useUpdateUser, useDeleteUser,
    useToggleUserStatus
} from '../hooks/useAdminData';
import { formatDistanceToNow } from 'date-fns';
import StyledCard from '../components/common/StyledCard';
import { useTranslation } from '../hooks/useTranslation';

// Tab Panel Component
interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`admin-tabpanel-${index}`}
            aria-labelledby={`admin-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Fade in={value === index}>
                    <Box sx={{ pt: 2 }}>
                        {children}
                    </Box>
                </Fade>
            )}
        </div>
    );
}

// Table wrapper with gradient background
const StyledTableContainer = ({ children, bgColor, ...props }: any) => (
    <Paper 
        sx={{ 
            borderRadius: 3, 
            overflow: 'hidden', 
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            background: `linear-gradient(135deg, ${bgColor} 0%, #ffffff 100%)`,
            position: 'relative',
            '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: 'linear-gradient(90deg, #1a237e, #D97706, #059669)',
            }
        }}
        {...props}
    >
        {children}
    </Paper>
);

const AdminDashboard: React.FC = () => {
    const theme = useTheme();
    const { t } = useTranslation();
    const [tabValue, setTabValue] = useState(0);
    const [openUserDialog, setOpenUserDialog] = useState(false);
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [formData, setFormData] = useState({
        userLoginID: '',
        employeeID: '',
        userName: '',
        emailID: '',
        mobileNumber: '',
        roleID: '',
        department: '',
        branchID: '',
        regionID: '',
        isActive: true,
        passwordHash: ''
    });

    // Pagination state
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [orderBy, setOrderBy] = useState('userID');
    const [order, setOrder] = useState<'asc' | 'desc'>('asc');

    // Fetch data
    const { data: stats, isLoading: statsLoading } = useDashboardStats();
    const { data: users, isLoading: usersLoading, refetch: refetchUsers } = useUsers();
    const { data: roles, isLoading: rolesLoading } = useRoles();
    const { data: pages, isLoading: pagesLoading } = usePages();
    const { data: recentLogins, isLoading: loginsLoading } = useRecentLogins(50);
    const { data: activeUsers, isLoading: activeLoading } = useActiveUsers();

    // Mutations
    const createUser = useCreateUser();
    const updateUser = useUpdateUser();
    const deleteUser = useDeleteUser();
    const toggleStatus = useToggleUserStatus();

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
        setPage(0);
    };

    const handleOpenUserDialog = (user?: any) => {
        if (user) {
            setSelectedUser(user);
            setFormData({
                userLoginID: user.userLoginID || '',
                employeeID: user.employeeID || '',
                userName: user.userName || '',
                emailID: user.emailID || '',
                mobileNumber: user.mobileNumber || '',
                roleID: user.roleID?.toString() || '',
                department: user.department || '',
                branchID: user.branchID?.toString() || '',
                regionID: user.regionID?.toString() || '',
                isActive: user.isActive ?? true,
                passwordHash: ''
            });
        } else {
            setSelectedUser(null);
            setFormData({
                userLoginID: '',
                employeeID: '',
                userName: '',
                emailID: '',
                mobileNumber: '',
                roleID: '',
                department: '',
                branchID: '',
                regionID: '',
                isActive: true,
                passwordHash: ''
            });
        }
        setOpenUserDialog(true);
    };

    const handleCloseUserDialog = () => {
        setOpenUserDialog(false);
        setSelectedUser(null);
    };

    const handleFormChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSaveUser = async () => {
        if (!formData.userLoginID || !formData.userName || !formData.roleID) {
            alert(t('admin.fill_required_fields'));
            return;
        }

        const userData: any = {
            userLoginID: formData.userLoginID,
            employeeID: formData.employeeID || '',
            userName: formData.userName,
            emailID: formData.emailID || '',
            mobileNumber: formData.mobileNumber || '',
            roleID: parseInt(formData.roleID),
            department: formData.department || '',
            branchID: formData.branchID ? parseInt(formData.branchID) : null,
            regionID: formData.regionID ? parseInt(formData.regionID) : null,
            isActive: formData.isActive,
        };

        if (!selectedUser) {
            userData.passwordHash = formData.passwordHash || 'Bank@123';
        }

        try {
            if (selectedUser) {
                const updateData = { ...userData, userID: selectedUser.userID };
                await updateUser.mutateAsync({ id: selectedUser.userID, user: updateData });
                alert(t('admin.user_updated'));
            } else {
                await createUser.mutateAsync(userData);
                alert(t('admin.user_created'));
            }
            handleCloseUserDialog();
            refetchUsers();
        } catch (error: any) {
            console.error('Error saving user:', error);
            alert(error?.response?.data?.error || t('admin.save_failed'));
        }
    };

    const handleToggleStatus = async (userId: number) => {
        try {
            await toggleStatus.mutateAsync(userId);
            refetchUsers();
        } catch (error) {
            console.error('Error toggling user status:', error);
            alert(t('admin.status_update_failed'));
        }
    };

    const handleDeleteUser = async (userId: number) => {
        if (window.confirm(t('admin.confirm_delete'))) {
            try {
                await deleteUser.mutateAsync(userId);
                refetchUsers();
                alert(t('admin.user_deleted'));
            } catch (error) {
                console.error('Error deleting user:', error);
                alert(t('admin.delete_failed'));
            }
        }
    };

    const handleSort = (property: string) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const statsCards = [
        { title: t('admin.total_users'), value: stats?.totalUsers || 0, icon: <People />, color: '#2563EB' },
        { title: t('admin.active_users'), value: stats?.activeUsers || 0, icon: <CheckCircle />, color: '#059669' },
        { title: t('admin.total_roles'), value: stats?.totalRoles || 0, icon: <Security />, color: 'secondary.main' },
        { title: t('admin.total_pages'), value: stats?.totalPages || 0, icon: <Pages />, color: '#7C3AED' },
        { title: t('admin.todays_logins'), value: stats?.todayLogins || 0, icon: <Login />, color: '#2563EB' },
        { title: t('admin.failed_logins'), value: stats?.failedLogins || 0, icon: <Warning />, color: '#DC2626' },
        { title: t('admin.active_sessions'), value: stats?.activeSessions || 0, icon: <Visibility />, color: '#009688' },
    ];

    const tabs = [
        { label: t('admin.user_management'), index: 0, icon: <People sx={{ fontSize: 18, mr: 1 }} /> },
        { label: t('admin.role_management'), index: 1, icon: <Security sx={{ fontSize: 18, mr: 1 }} /> },
        { label: t('admin.page_access'), index: 2, icon: <Pages sx={{ fontSize: 18, mr: 1 }} /> },
        { label: t('admin.audit_logs'), index: 3, icon: <Login sx={{ fontSize: 18, mr: 1 }} /> },
        { label: t('admin.active_users_tab'), index: 4, icon: <Visibility sx={{ fontSize: 18, mr: 1 }} /> },
    ];

    const tabButtonStyle = (isActive: boolean) => ({
        px: 3,
        py: 1,
        borderRadius: 2,
        textTransform: 'none',
        fontWeight: 600,
        fontSize: '0.875rem',
        backgroundColor: isActive ? 'primary.main' : 'transparent',
        color: isActive ? 'white' : 'primary.main',
        border: `1px solid ${isActive ? 'primary.main' : '#e0e0e0'}`,
        '&:hover': {
            backgroundColor: isActive ? '#0f155e' : '#f5f5f5',
            borderColor: 'primary.main',
        },
        transition: 'all 0.2s ease',
    });

    return (
        <Box sx={{ width: '100%', height: '100%', overflow: 'auto', bgcolor: '#f5f5f5' }}>
            <Container maxWidth={false} sx={{ py: 2, px: { xs: 2, md: 3 } }}>
                {/* Header */}
                
                {/* Tabs as Buttons */}
                <Box sx={{ mb: 3 }}>
                    <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                        {tabs.map((tab) => (
                            <Button
                                key={tab.index}
                                onClick={() => handleTabChange(null as any, tab.index)}
                                sx={tabButtonStyle(tabValue === tab.index)}
                                startIcon={tab.icon}
                                variant={tabValue === tab.index ? 'contained' : 'outlined'}
                            >
                                {tab.label}
                            </Button>
                        ))}
                    </Stack>
                </Box>

                {/* TAB CONTENT - ABOVE KPI CARDS */}
                <Box sx={{ mb: 4 }}>
                    {/* User Management Tab - Purple/Blue Gradient */}
                    <TabPanel value={tabValue} index={0}>
                        <StyledTableContainer bgColor="rgba(106, 27, 154, 0.05)">
                            <Box sx={{ 
                                p: 2, 
                                background: 'linear-gradient(135deg, #6a1b9a 0%, #1a237e 100%)',
                                color: 'white'
                            }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                                    <Box>
                                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                            {t('admin.user_management')}
                                        </Typography>
                                        <Typography variant="caption" sx={{ opacity: 0.9 }}>
                                            {t('admin.user_management_desc')}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        <Tooltip title={t('admin.search')}>
                                            <IconButton size="small" sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.1)', '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}>
                                                <Search />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title={t('admin.filter')}>
                                            <IconButton size="small" sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.1)', '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}>
                                                <FilterList />
                                            </IconButton>
                                        </Tooltip>
                                        <Button
                                            variant="contained"
                                            startIcon={<Add />}
                                            onClick={() => handleOpenUserDialog()}
                                            size="small"
                                            sx={{ 
                                                textTransform: 'none', 
                                                borderRadius: 2,
                                                bgcolor: 'secondary.main',
                                                '&:hover': { bgcolor: '#f57c00' }
                                            }}
                                        >
                                            {t('admin.add_user')}
                                        </Button>
                                    </Box>
                                </Box>
                            </Box>

                            <TableContainer sx={{ maxHeight: 450, bgcolor: 'white' }}>
                                <Table stickyHeader size="small">
                                    <TableHead>
                                        <TableRow sx={{ 
                                            bgcolor: '#f3e5f5',
                                            '& th': { 
                                                fontWeight: 600, 
                                                py: 1.5,
                                                color: '#4a148c',
                                                borderBottom: '2px solid #ce93d8'
                                            }
                                        }}>
                                            <TableCell>
                                                <TableSortLabel
                                                    active={orderBy === 'userID'}
                                                    direction={orderBy === 'userID' ? order : 'asc'}
                                                    onClick={() => handleSort('userID')}
                                                >
                                                    {t('admin.id')}
                                                </TableSortLabel>
                                            </TableCell>
                                            <TableCell>
                                                <TableSortLabel
                                                    active={orderBy === 'userLoginID'}
                                                    direction={orderBy === 'userLoginID' ? order : 'asc'}
                                                    onClick={() => handleSort('userLoginID')}
                                                >
                                                    {t('admin.login_id')}
                                                </TableSortLabel>
                                            </TableCell>
                                            <TableCell>
                                                <TableSortLabel
                                                    active={orderBy === 'userName'}
                                                    direction={orderBy === 'userName' ? order : 'asc'}
                                                    onClick={() => handleSort('userName')}
                                                >
                                                    {t('admin.name')}
                                                </TableSortLabel>
                                            </TableCell>
                                            <TableCell>{t('admin.email')}</TableCell>
                                            <TableCell>{t('admin.role')}</TableCell>
                                            <TableCell>{t('admin.department')}</TableCell>
                                            <TableCell>{t('admin.status')}</TableCell>
                                            <TableCell>{t('admin.last_login')}</TableCell>
                                            <TableCell align="center">{t('admin.actions')}</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {usersLoading ? (
                                            <TableRow>
                                                <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                                                    <CircularProgress size={40} />
                                                </TableCell>
                                            </TableRow>
                                        ) : users?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user, index) => (
                                            <TableRow 
                                                key={user.userID} 
                                                hover
                                                sx={{ 
                                                    '&:hover': { bgcolor: '#f3e5f5' },
                                                    transition: 'all 0.2s ease'
                                                }}
                                            >
                                                <TableCell sx={{ fontWeight: 500 }}>{user.userID}</TableCell>
                                                <TableCell>
                                                    <Chip 
                                                        label={user.userLoginID} 
                                                        size="small"
                                                        variant="outlined"
                                                        sx={{ fontWeight: 500, borderColor: '#7C3AED', color: '#7C3AED' }}
                                                    />
                                                </TableCell>
                                                <TableCell sx={{ fontWeight: 500 }}>{user.userName}</TableCell>
                                                <TableCell>{user.emailID}</TableCell>
                                                <TableCell>
                                                    <Chip 
                                                        label={user.roleName} 
                                                        size="small"
                                                        sx={{ 
                                                            bgcolor: getRoleColor(user.roleName),
                                                            color: 'white',
                                                            fontWeight: 500,
                                                            px: 1
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell>{user.department}</TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={user.isActive ? t('admin.active') : t('admin.inactive')}
                                                        color={user.isActive ? 'success' : 'error'}
                                                        size="small"
                                                        sx={{ fontWeight: 500, minWidth: 70 }}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2" color="textSecondary" sx={{ fontSize: '0.75rem' }}>
                                                        {user.lastLoginDate
                                                            ? formatDistanceToNow(new Date(user.lastLoginDate), { addSuffix: true })
                                                            : t('admin.never')}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Stack direction="row" spacing={0.5} justifyContent="center">
                                                        <Tooltip title={t('admin.edit_user')}>
                                                            <IconButton size="small" onClick={() => handleOpenUserDialog(user)} sx={{ color: '#7C3AED' }}>
                                                                <Edit fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title={user.isActive ? t('admin.deactivate_user') : t('admin.activate_user')}>
                                                            <IconButton size="small" onClick={() => handleToggleStatus(user.userID)}>
                                                                {user.isActive ? 
                                                                    <Cancel fontSize="small" sx={{ color: '#DC2626' }} /> : 
                                                                    <CheckCircle fontSize="small" sx={{ color: '#059669' }} />
                                                                }
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title={t('admin.delete_user')}>
                                                            <IconButton size="small" onClick={() => handleDeleteUser(user.userID)}>
                                                                <Delete fontSize="small" sx={{ color: '#DC2626' }} />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </Stack>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25, 50]}
                                component="div"
                                count={users?.length || 0}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                                sx={{ borderTop: '1px solid #e0e0e0', bgcolor: 'white' }}
                            />
                        </StyledTableContainer>
                    </TabPanel>

                    {/* Role Management Tab - Orange/Gold Gradient */}
                    <TabPanel value={tabValue} index={1}>
                        <StyledTableContainer bgColor="rgba(255, 152, 0, 0.05)">
                            <Box sx={{ 
                                p: 2, 
                                background: 'linear-gradient(135deg, #f57c00 0%, #D97706 100%)',
                                color: 'white'
                            }}>
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                    {t('admin.role_management')}
                                </Typography>
                                <Typography variant="caption" sx={{ opacity: 0.9 }}>
                                    {t('admin.role_management_desc')}
                                </Typography>
                            </Box>
                            <TableContainer sx={{ maxHeight: 450, bgcolor: 'white' }}>
                                <Table stickyHeader size="small">
                                    <TableHead>
                                        <TableRow sx={{ 
                                            bgcolor: '#fff3e0',
                                            '& th': { 
                                                fontWeight: 600, 
                                                py: 1.5,
                                                color: '#e65100',
                                                borderBottom: '2px solid #ffe0b2'
                                            }
                                        }}>
                                            <TableCell>{t('admin.id')}</TableCell>
                                            <TableCell>{t('admin.role_name')}</TableCell>
                                            <TableCell>{t('admin.level')}</TableCell>
                                            <TableCell>{t('admin.description')}</TableCell>
                                            <TableCell align="center">{t('admin.users')}</TableCell>
                                            <TableCell>{t('admin.created_date')}</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {rolesLoading ? (
                                            <TableRow>
                                                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                                                    <CircularProgress size={40} />
                                                </TableCell>
                                            </TableRow>
                                        ) : roles?.map((role) => (
                                            <TableRow key={role.roleID} hover sx={{ '&:hover': { bgcolor: '#fff3e0' } }}>
                                                <TableCell>{role.roleID}</TableCell>
                                                <TableCell>
                                                    <Chip 
                                                        label={role.roleName} 
                                                        size="medium"
                                                        sx={{ 
                                                            bgcolor: getRoleColor(role.roleName),
                                                            color: 'white',
                                                            fontWeight: 600,
                                                            px: 1
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Chip 
                                                        label={`${t('admin.level')} ${role.roleLevel}`} 
                                                        size="small"
                                                        variant="outlined"
                                                        sx={{ borderColor: 'secondary.main', color: 'secondary.main' }}
                                                    />
                                                </TableCell>
                                                <TableCell>{role.roleDescription}</TableCell>
                                                <TableCell align="center">
                                                    <Chip 
                                                        label={role.userCount} 
                                                        size="small"
                                                        sx={{ bgcolor: 'secondary.main', color: 'white', fontWeight: 600 }}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2" color="textSecondary">
                                                        {new Date(role.createdDate).toLocaleDateString()}
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </StyledTableContainer>
                    </TabPanel>

                    {/* Page Access Tab - Green/Turquoise Gradient */}
                    <TabPanel value={tabValue} index={2}>
                        <StyledTableContainer bgColor="rgba(76, 175, 80, 0.05)">
                            <Box sx={{ 
                                p: 2, 
                                background: 'linear-gradient(135deg, #2e7d32 0%, #059669 100%)',
                                color: 'white'
                            }}>
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                    {t('admin.page_access')}
                                </Typography>
                                <Typography variant="caption" sx={{ opacity: 0.9 }}>
                                    {t('admin.page_access_desc')}
                                </Typography>
                            </Box>
                            <TableContainer sx={{ maxHeight: 450, bgcolor: 'white' }}>
                                <Table stickyHeader size="small">
                                    <TableHead>
                                        <TableRow sx={{ 
                                            bgcolor: '#e8f5e9',
                                            '& th': { 
                                                fontWeight: 600, 
                                                py: 1.5,
                                                color: '#1b5e20',
                                                borderBottom: '2px solid #c8e6c9'
                                            }
                                        }}>
                                            <TableCell>{t('admin.id')}</TableCell>
                                            <TableCell>{t('admin.page_name')}</TableCell>
                                            <TableCell>{t('admin.code')}</TableCell>
                                            <TableCell>{t('admin.category')}</TableCell>
                                            <TableCell>{t('admin.url')}</TableCell>
                                            <TableCell align="center">{t('admin.order')}</TableCell>
                                            <TableCell align="center">{t('admin.status')}</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {pagesLoading ? (
                                            <TableRow>
                                                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                                                    <CircularProgress size={40} />
                                                </TableCell>
                                            </TableRow>
                                        ) : pages?.map((page) => (
                                            <TableRow key={page.pageID} hover sx={{ '&:hover': { bgcolor: '#e8f5e9' } }}>
                                                <TableCell>{page.pageID}</TableCell>
                                                <TableCell sx={{ fontWeight: 500 }}>{page.pageName}</TableCell>
                                                <TableCell>
                                                    <Chip 
                                                        label={page.pageCode} 
                                                        size="small"
                                                        variant="outlined"
                                                        sx={{ borderColor: '#059669', color: '#059669' }}
                                                    />
                                                </TableCell>
                                                <TableCell>{page.pageCategory}</TableCell>
                                                <TableCell>
                                                    <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                                                        {page.pageURL}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Chip 
                                                        label={page.displayOrder} 
                                                        size="small"
                                                        variant="outlined"
                                                    />
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Chip
                                                        label={page.isActive ? t('admin.active') : t('admin.inactive')}
                                                        color={page.isActive ? 'success' : 'error'}
                                                        size="small"
                                                        sx={{ minWidth: 70 }}
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </StyledTableContainer>
                    </TabPanel>

                    {/* Audit Logs Tab - Blue/Teal Gradient */}
                    <TabPanel value={tabValue} index={3}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <StyledTableContainer bgColor="rgba(33, 150, 243, 0.05)">
                                    <Box sx={{ 
                                        p: 2, 
                                        background: 'linear-gradient(135deg, #2563EB 0%, #2563EB 100%)',
                                        color: 'white'
                                    }}>
                                        <Typography variant="h6" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <CheckCircle fontSize="small" /> {t('admin.recent_successful_logins')}
                                        </Typography>
                                        <Typography variant="caption" sx={{ opacity: 0.9 }}>
                                            {t('admin.recent_successful_logins_desc')}
                                        </Typography>
                                    </Box>
                                    <TableContainer sx={{ maxHeight: 400, bgcolor: 'white' }}>
                                        <Table stickyHeader size="small">
                                            <TableHead>
                                                <TableRow sx={{ 
                                                    bgcolor: '#e3f2fd',
                                                    '& th': { 
                                                        fontWeight: 600, 
                                                        py: 1.5,
                                                        color: '#0d47a1',
                                                        borderBottom: '2px solid #bbdef5'
                                                    }
                                                }}>
                                                    <TableCell>{t('admin.user')}</TableCell>
                                                    <TableCell>{t('admin.time')}</TableCell>
                                                    <TableCell>{t('admin.ip_address')}</TableCell>
                                                    <TableCell>{t('admin.device')}</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {loginsLoading ? (
                                                    <TableRow>
                                                        <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                                                            <CircularProgress size={30} />
                                                        </TableCell>
                                                    </TableRow>
                                                ) : recentLogins?.filter(l => l.loginStatus === 'SUCCESS').slice(0, 10).map((login) => (
                                                    <TableRow key={login.loginID} hover sx={{ '&:hover': { bgcolor: '#e3f2fd' } }}>
                                                        <TableCell sx={{ fontWeight: 500 }}>{login.userName}</TableCell>
                                                        <TableCell>
                                                            <Typography variant="body2" sx={{ fontWeight: 500, color: '#2563EB' }}>
                                                                {formatDistanceToNow(new Date(login.loginTime), { addSuffix: true })}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Chip label={login.ipAddress} size="small" variant="outlined" />
                                                        </TableCell>
                                                        <TableCell>{login.deviceType}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </StyledTableContainer>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <StyledTableContainer bgColor="rgba(244, 67, 54, 0.05)">
                                    <Box sx={{ 
                                        p: 2, 
                                        background: 'linear-gradient(135deg, #d32f2f 0%, #DC2626 100%)',
                                        color: 'white'
                                    }}>
                                        <Typography variant="h6" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Warning fontSize="small" /> {t('admin.failed_login_attempts')}
                                        </Typography>
                                        <Typography variant="caption" sx={{ opacity: 0.9 }}>
                                            {t('admin.failed_login_attempts_desc')}
                                        </Typography>
                                    </Box>
                                    <TableContainer sx={{ maxHeight: 400, bgcolor: 'white' }}>
                                        <Table stickyHeader size="small">
                                            <TableHead>
                                                <TableRow sx={{ 
                                                    bgcolor: '#ffebee',
                                                    '& th': { 
                                                        fontWeight: 600, 
                                                        py: 1.5,
                                                        color: '#b71c1c',
                                                        borderBottom: '2px solid #ffcdd2'
                                                    }
                                                }}>
                                                    <TableCell>{t('admin.user')}</TableCell>
                                                    <TableCell>{t('admin.time')}</TableCell>
                                                    <TableCell>{t('admin.ip_address')}</TableCell>
                                                    <TableCell align="center">{t('admin.attempts')}</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {loginsLoading ? (
                                                    <TableRow>
                                                        <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                                                            <CircularProgress size={30} />
                                                        </TableCell>
                                                    </TableRow>
                                                ) : recentLogins?.filter(l => l.loginStatus === 'FAILED').slice(0, 10).map((login) => (
                                                    <TableRow key={login.loginID} hover sx={{ '&:hover': { bgcolor: '#ffebee' } }}>
                                                        <TableCell>{login.userName}</TableCell>
                                                        <TableCell>
                                                            <Typography variant="body2" sx={{ fontWeight: 500, color: '#d32f2f' }}>
                                                                {formatDistanceToNow(new Date(login.loginTime), { addSuffix: true })}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Chip label={login.ipAddress} size="small" variant="outlined" />
                                                        </TableCell>
                                                        <TableCell align="center">
                                                            <Chip 
                                                                label={login.failedAttemptCount} 
                                                                color="error" 
                                                                size="small" 
                                                                sx={{ fontWeight: 600, minWidth: 40 }}
                                                            />
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </StyledTableContainer>
                            </Grid>
                        </Grid>
                    </TabPanel>

                    {/* Active Users Tab - Purple/Indigo Gradient */}
                    <TabPanel value={tabValue} index={4}>
                        <StyledTableContainer bgColor="rgba(103, 58, 183, 0.05)">
                            <Box sx={{ 
                                p: 2, 
                                background: 'linear-gradient(135deg, #512da8 0%, #673ab7 100%)',
                                color: 'white'
                            }}>
                                <Typography variant="h6" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Visibility fontSize="small" /> {t('admin.users_active_today')}
                                </Typography>
                                <Typography variant="caption" sx={{ opacity: 0.9 }}>
                                    {t('admin.users_active_today_desc')}
                                </Typography>
                            </Box>
                            <TableContainer sx={{ maxHeight: 450, bgcolor: 'white' }}>
                                <Table stickyHeader size="small">
                                    <TableHead>
                                        <TableRow sx={{ 
                                            bgcolor: '#ede7f6',
                                            '& th': { 
                                                fontWeight: 600, 
                                                py: 1.5,
                                                color: '#311b92',
                                                borderBottom: '2px solid #d1c4e9'
                                            }
                                        }}>
                                            <TableCell>{t('admin.user')}</TableCell>
                                            <TableCell>{t('admin.login_id')}</TableCell>
                                            <TableCell>{t('admin.email')}</TableCell>
                                            <TableCell>{t('admin.role')}</TableCell>
                                            <TableCell>{t('admin.last_login')}</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {activeLoading ? (
                                            <TableRow>
                                                <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                                                    <CircularProgress size={40} />
                                                </TableCell>
                                            </TableRow>
                                        ) : activeUsers?.map((user) => (
                                            <TableRow key={user.userID} hover sx={{ '&:hover': { bgcolor: '#ede7f6' } }}>
                                                <TableCell sx={{ fontWeight: 500 }}>{user.userName}</TableCell>
                                                <TableCell>{user.userLoginID}</TableCell>
                                                <TableCell>{user.emailID}</TableCell>
                                                <TableCell>
                                                    <Chip 
                                                        label={user.roleName} 
                                                        size="small"
                                                        sx={{ 
                                                            bgcolor: getRoleColor(user.roleName),
                                                            color: 'white',
                                                            fontWeight: 500
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    {user.lastLoginDate
                                                        ? formatDistanceToNow(new Date(user.lastLoginDate), { addSuffix: true })
                                                        : 'N/A'}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </StyledTableContainer>
                    </TabPanel>
                </Box>

                {/* KPI CARDS - BELOW THE TAB CONTENT */}
                <Grid container spacing={3}>
                    {statsCards.map((card, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index}>
                            <StyledCard
                                title={card.title}
                                value={card.value}
                                icon={card.icon}
                                colorIndex={index % 6}
                            />
                        </Grid>
                    ))}
                </Grid>

                {/* User Dialog */}
                <Dialog open={openUserDialog} onClose={handleCloseUserDialog} maxWidth="md" fullWidth>
                    <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white' }}>
                        {selectedUser ? t('admin.edit_user') : t('admin.add_new_user')}
                    </DialogTitle>
                    <DialogContent sx={{ mt: 2 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    label={`${t('admin.login_id')} *`}
                                    value={formData.userLoginID}
                                    onChange={(e) => handleFormChange('userLoginID', e.target.value)}
                                    size="small"
                                    required
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    label={t('admin.employee_id')}
                                    value={formData.employeeID}
                                    onChange={(e) => handleFormChange('employeeID', e.target.value)}
                                    size="small"
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    label={`${t('admin.full_name')} *`}
                                    value={formData.userName}
                                    onChange={(e) => handleFormChange('userName', e.target.value)}
                                    size="small"
                                    required
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    label={t('admin.email')}
                                    value={formData.emailID}
                                    onChange={(e) => handleFormChange('emailID', e.target.value)}
                                    size="small"
                                    type="email"
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    label={t('admin.mobile_number')}
                                    value={formData.mobileNumber}
                                    onChange={(e) => handleFormChange('mobileNumber', e.target.value)}
                                    size="small"
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    select
                                    label={`${t('admin.role')} *`}
                                    value={formData.roleID}
                                    onChange={(e) => handleFormChange('roleID', e.target.value)}
                                    size="small"
                                    required
                                >
                                    <MenuItem value="">{t('admin.select_role')}</MenuItem>
                                    {roles?.map((role) => (
                                        <MenuItem key={role.roleID} value={role.roleID}>
                                            {role.roleName}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    label={t('admin.department')}
                                    value={formData.department}
                                    onChange={(e) => handleFormChange('department', e.target.value)}
                                    size="small"
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    label={t('admin.branch_id')}
                                    value={formData.branchID}
                                    onChange={(e) => handleFormChange('branchID', e.target.value)}
                                    size="small"
                                    type="number"
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    label={t('admin.region_id')}
                                    value={formData.regionID}
                                    onChange={(e) => handleFormChange('regionID', e.target.value)}
                                    size="small"
                                    type="number"
                                />
                            </Grid>
                            {!selectedUser && (
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label={t('admin.password')}
                                        value={formData.passwordHash}
                                        onChange={(e) => handleFormChange('passwordHash', e.target.value)}
                                        size="small"
                                        type="password"
                                        helperText={t('admin.password_helper')}
                                    />
                                </Grid>
                            )}
                            <Grid item xs={12}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={formData.isActive}
                                            onChange={(e) => handleFormChange('isActive', e.target.checked)}
                                            color="primary"
                                        />
                                    }
                                    label={t('admin.active_user')}
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions sx={{ p: 2 }}>
                        <Button onClick={handleCloseUserDialog}>{t('admin.cancel')}</Button>
                        <Button variant="contained" onClick={handleSaveUser}>
                            {selectedUser ? t('admin.update') : t('admin.create')}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </Box>
    );
};

// Helper function for role colors
const getRoleColor = (roleName: string): string => {
    switch(roleName) {
        case 'Chairman': return '#6B46C1';
        case 'CEO': return '#3182CE';
        case 'GM': return '#2C7A7B';
        case 'AGM': return '#2C7A7B';
        case 'Manager': return '#38A169';
        case 'Officer': return '#DD6B20';
        case 'Clerk': return '#718096';
        case 'ITAdmin': return '#7C3AED';
        case 'ComplianceOfficer': return '#D53F8C';
        default: return '#2563EB';
    }
};

export default AdminDashboard;
