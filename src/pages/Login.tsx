// import React, { useState } from 'react';
// import {
//     Box, Container, Paper, Typography,
//     TextField, Button, InputAdornment,
//     IconButton, Alert, CircularProgress,
//     useTheme
// } from '@mui/material';

// import {
//     AccountBalance, Lock, Visibility,
//     VisibilityOff, Login as LoginIcon
// } from '@mui/icons-material';

// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../hooks/useAuth';
// import { getDefaultRoute, getUserRole } from '../utils/roleAccess';
// import { useTranslation } from '../hooks/useTranslation';

// const Login: React.FC = () => {
//     const theme = useTheme();
//     const navigate = useNavigate();
//     const { login, isLoading } = useAuth();
//      const { t } = useTranslation();

//     const [showPassword, setShowPassword] = useState(false);
//     const [error, setError] = useState<string | null>(null);

//     const [formData, setFormData] = useState({
//         userLoginID: '',
//         password: ''
//     });

//     const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         setFormData({
//             ...formData,
//             [e.target.name]: e.target.value
//         });
//         setError(null);
//     };

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         setError(null);

//         if (!formData.userLoginID || !formData.password) {
//             setError('Please enter both username and password');
//             return;
//         }

//         try {
//             const response = await login(
//                 formData.userLoginID,
//                 formData.password
//             );

//             if (response && response.success) {
//                 // Get user from response
//                 const userData = response.user;
//                 console.log("User:", userData);
                
//                 // Get role from user data
//                 const role = getUserRole(userData);
//                 console.log("Role:", role);

//                 // Get default route
//                 const defaultRoute = getDefaultRoute(role);

//                 // Navigate
//                 navigate(defaultRoute);

//             } else {
//                 setError(response?.message || 'Login failed. Please check your credentials.');
//             }

//         } catch (err: any) {
//             console.error('Login error:', err);
//             setError(err.message || 'An error occurred during login');
//         }
//     };

//     return (
//         <Box
//             sx={{
//                 minHeight: '100vh',
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
//             }}
//         >
//             <Container maxWidth="sm">
//                 <Paper
//                     elevation={24}
//                     sx={{
//                         p: 4,
//                         borderRadius: 2,
//                         backgroundColor: 'rgba(255, 255, 255, 0.95)',
//                     }}
//                 >
//                     {/* Header */}
//                     <Box sx={{ textAlign: 'center', mb: 4 }}>
//                         <Box
//                             sx={{
//                                 display: 'inline-flex',
//                                 p: 2,
//                                 borderRadius: '50%',
//                                 bgcolor: theme.palette.primary.main,
//                                 color: 'white',
//                                 mb: 2
//                             }}
//                         >
//                             <AccountBalance sx={{ fontSize: 40 }} />
//                         </Box>

//                         <Typography variant="h4" fontWeight="bold">
//                             Banking Dashboard
//                         </Typography>

//                         <Typography variant="body2" color="textSecondary">
//                             Secure Banking System
//                         </Typography>
//                     </Box>

//                     {/* Error */}
//                     {error && (
//                         <Alert severity="error" sx={{ mb: 2 }}>
//                             {error}
//                         </Alert>
//                     )}

//                     {/* Form */}
//                     <form onSubmit={handleSubmit}>
//                         <TextField
//                             fullWidth
//                             label="Username"
//                             name="userLoginID"
//                             value={formData.userLoginID}
//                             onChange={handleChange}
//                             margin="normal"
//                             required
//                             InputProps={{
//                                 startAdornment: (
//                                     <InputAdornment position="start">
//                                         <AccountBalance />
//                                     </InputAdornment>
//                                 ),
//                             }}
//                             disabled={isLoading}
//                         />

//                         <TextField
//                             fullWidth
//                             label="Password"
//                             name="password"
//                             type={showPassword ? 'text' : 'password'}
//                             value={formData.password}
//                             onChange={handleChange}
//                             margin="normal"
//                             required
//                             InputProps={{
//                                 startAdornment: (
//                                     <InputAdornment position="start">
//                                         <Lock />
//                                     </InputAdornment>
//                                 ),
//                                 endAdornment: (
//                                     <InputAdornment position="end">
//                                         <IconButton
//                                             onClick={() => setShowPassword(!showPassword)}
//                                             disabled={isLoading}
//                                         >
//                                             {showPassword ? <VisibilityOff /> : <Visibility />}
//                                         </IconButton>
//                                     </InputAdornment>
//                                 ),
//                             }}
//                             disabled={isLoading}
//                         />

//                         <Button
//                             type="submit"
//                             fullWidth
//                             variant="contained"
//                             sx={{ mt: 3, py: 1.5 }}
//                             disabled={isLoading}
//                         >
//                             {isLoading ? (
//                                 <CircularProgress size={24} />
//                             ) : (
//                                 <>
//                                     <LoginIcon sx={{ mr: 1 }} />
//                                     Login
//                                 </>
//                             )}
//                         </Button>
//                     </form>

//                     {/* Footer */}
//                     <Box sx={{ mt: 3, textAlign: 'center' }}>
//                         <Typography variant="caption">
//                             © {new Date().getFullYear()} Banking Dashboard
//                         </Typography>
//                     </Box>
//                 </Paper>
//             </Container>
//         </Box>
//     );
// };

// export default Login;




import React, { useState } from 'react';
import {
    Box, Container, Paper, Typography,
    TextField, Button, InputAdornment,
    IconButton, Alert, CircularProgress,
    useTheme
} from '@mui/material';

import {
    AccountBalance, Lock, Visibility,
    VisibilityOff, Login as LoginIcon
} from '@mui/icons-material';

import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getDefaultRoute, getUserRole } from '../utils/roleAccess';
import { useTranslation } from '../hooks/useTranslation';

const Login: React.FC = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const { login, isLoading } = useAuth();
    const { t } = useTranslation();

    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        userLoginID: '',
        password: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!formData.userLoginID || !formData.password) {
            setError(t('login.enter_credentials'));
            return;
        }

        try {
            const response = await login(
                formData.userLoginID,
                formData.password
            );

            if (response && response.success) {
                // Get user from response
                const userData = response.user;
                console.log("User:", userData);
                
                // Get role from user data
                const role = getUserRole(userData);
                console.log("Role:", role);

                // Get default route
                const defaultRoute = getDefaultRoute(role);

                // Navigate
                navigate(defaultRoute);

            } else {
                setError(response?.message || t('login.invalid_credentials'));
            }

        } catch (err: any) {
            console.error('Login error:', err);
            setError(err.message || t('login.invalid_credentials'));
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: '-20%',
                    left: '-10%',
                    width: '600px',
                    height: '600px',
                    background: 'radial-gradient(circle, rgba(14,165,233,0.15) 0%, rgba(14,165,233,0) 70%)',
                    borderRadius: '50%',
                },
                '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: '-20%',
                    right: '-10%',
                    width: '600px',
                    height: '600px',
                    background: 'radial-gradient(circle, rgba(16,185,129,0.1) 0%, rgba(16,185,129,0) 70%)',
                    borderRadius: '50%',
                }
            }}
        >
            <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
                <Paper
                    elevation={0}
                    sx={{
                        p: { xs: 4, sm: 6 },
                        borderRadius: 4,
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(20px)',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                    }}
                >
                    {/* Header */}
                    <Box sx={{ textAlign: 'center', mb: 5 }}>
                        <Box
                            sx={{
                                display: 'inline-flex',
                                p: 2,
                                borderRadius: '16px',
                                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
                                color: 'white',
                                mb: 3,
                                boxShadow: '0 10px 15px -3px rgba(15, 23, 42, 0.3)'
                            }}
                        >
                            <AccountBalance sx={{ fontSize: 40 }} />
                        </Box>

                        <Typography variant="h4" fontWeight="800" sx={{ mb: 1, color: theme.palette.text.primary, letterSpacing: '-0.5px' }}>
                            {t('login.title')}
                        </Typography>

                        <Typography variant="body1" sx={{ color: theme.palette.text.secondary, fontWeight: 500 }}>
                            {t('login.subtitle')}
                        </Typography>
                    </Box>

                    {/* Error */}
                    {error && (
                        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                            {error}
                        </Alert>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            label={t('login.username')}
                            name="userLoginID"
                            value={formData.userLoginID}
                            onChange={handleChange}
                            margin="normal"
                            required
                            variant="outlined"
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                    bgcolor: 'rgba(248, 250, 252, 0.5)',
                                }
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <AccountBalance sx={{ color: theme.palette.text.secondary }} />
                                    </InputAdornment>
                                ),
                            }}
                            disabled={isLoading}
                        />

                        <TextField
                            fullWidth
                            label={t('login.password')}
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            value={formData.password}
                            onChange={handleChange}
                            margin="normal"
                            required
                            variant="outlined"
                            sx={{
                                mt: 2,
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                    bgcolor: 'rgba(248, 250, 252, 0.5)',
                                }
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Lock sx={{ color: theme.palette.text.secondary }} />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowPassword(!showPassword)}
                                            disabled={isLoading}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            disabled={isLoading}
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ 
                                mt: 4, 
                                py: 1.8, 
                                borderRadius: 2,
                                fontSize: '1.05rem',
                                fontWeight: 600,
                                textTransform: 'none',
                                background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.dark} 100%)`,
                                boxShadow: '0 10px 15px -3px rgba(14, 165, 233, 0.3)',
                                '&:hover': {
                                    background: `linear-gradient(135deg, ${theme.palette.secondary.light} 0%, ${theme.palette.secondary.main} 100%)`,
                                    boxShadow: '0 20px 25px -5px rgba(14, 165, 233, 0.4)',
                                    transform: 'translateY(-2px)',
                                },
                                transition: 'all 0.3s ease'
                            }}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <CircularProgress size={24} color="inherit" />
                            ) : (
                                <>
                                    <LoginIcon sx={{ mr: 1 }} />
                                    {t('login.login_button')}
                                </>
                            )}
                        </Button>
                    </form>

                    {/* Footer */}
                    <Box sx={{ mt: 5, textAlign: 'center' }}>
                        <Typography variant="body2" sx={{ color: theme.palette.text.secondary, fontWeight: 500 }}>
                            © {new Date().getFullYear()} {t('login.title')}
                        </Typography>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

export default Login;
